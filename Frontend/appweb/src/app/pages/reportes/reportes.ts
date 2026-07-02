import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Trabajador } from '../staff/trabajador';

export interface IAsesor {
  id: string;
  nombre: string;
  zona?: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  // --- Raw data from API ---
  partesDiarios: any[] = [];
  trabajadores: any[] = [];
  produccion: any[] = [];

  // --- Estado de Selección de Asesores ---
  asesores: IAsesor[] = [];
  asesorSeleccionado: IAsesor | null = null;

  // --- Pagination ---
  paginaActual: number = 1;
  registrosPorPagina: number = 10;

  // --- Date filter ---
  filtroFechas: { inicio: string; fin: string } = { inicio: '', fin: '' };

  // --- State ---
  cargando: boolean = false;
  error: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private trabajador: Trabajador) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // ----------------------------------------------------------------
  // Data loading & Sincronización
  // ----------------------------------------------------------------
  cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    // Cargar solo la lista de usuarios para el Master List
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (usuarios) => {
        const jefes = usuarios.filter(u => u.rol === 'JEFE_CAMPO' && u.activo !== false);
        this.asesores = jefes.map(j => ({
          id: j.syncId, // IMPORTANTE: usar syncId
          nombre: j.nombreCompleto,
          zona: 'Asignación General'
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar supervisores:', err);
        this.error = 'No se pudieron cargar los supervisores. Intente nuevamente.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Extrae la lista de asesores/jefes únicos basados en los trabajadores y grupos
   */
  extraerAsesores(): void {
    // Ya no se extraen asesores de los partes diarios locales porque ahora fetchamos de /usuarios
  }

  /**
   * Se ejecuta al hacer clic sobre un asesor en el panel lateral izquierdo
   */
  seleccionarAsesor(asesor: IAsesor): void {
    if (this.asesorSeleccionado?.id === asesor.id) return;
    
    // Invalidate state to avoid flickering and orphan data
    this.asesorSeleccionado = asesor;
    this.partesDiarios = [];
    this.trabajadores = [];
    this.produccion = [];
    this.paginaActual = 1;
    this.cargando = true;
    this.cdr.detectChanges();

    // Lazy load the specific details
    this.http.get<any>(`${environment.apiUrl}/sync/download/${asesor.id}`).subscribe({
      next: (resp) => {
        this.partesDiarios = resp.partesDiarios ?? [];
        this.trabajadores = resp.trabajadores ?? [];
        this.produccion = resp.produccion ?? [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos del supervisor:', err);
        this.error = 'No se pudieron cargar los reportes de este supervisor.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ----------------------------------------------------------------
  // Computed: datosHistoricos (Filtrados por asesor y ordenados por fecha)
  // ----------------------------------------------------------------
  get datosHistoricos(): any[] {
    if (!this.asesorSeleccionado) return [];

    const datos: any[] = [];
    const nombreAsesor = this.asesorSeleccionado.nombre.toLowerCase();

    const partesDelAsesor = this.partesDiarios;

    for (const parte of partesDelAsesor) {
      const fecha = parte.fecha ?? '';
      
      const detalles: any[] = parte.detalles ?? [];
      
      const prodMatch = this.produccion.find(p => p.parteDiarioSyncId === parte.syncId);
      const lote = prodMatch ? (prodMatch.actividad ?? 'San José') : 'San José';

      // Omitir si el parte indica explícitamente Inversión
      if (parte.turno?.toLowerCase().includes('inversión') || parte.turno?.toLowerCase().includes('inversion')) {
        continue;
      }

      // Si no hay detalles, agregar el parte al menos
      if (detalles.length === 0) {
        datos.push({
          fecha,
          fechaObj: fecha ? new Date(fecha) : new Date(0),
          trabajador: 'Sin operarios',
          lote: (parte.turno || 'Día') + ' / ' + lote,
          horas: 0,
          produccion: 0,
          calidad: parte.estado ?? 'REGISTRADO'
        });
      }

      for (const det of detalles) {
        const trab = this.trabajadores.find(t => t.syncId === det.trabajadorSyncId);
        const trabajadorNombre = trab ? `${trab.nombre} ${trab.apellido}` : 'Desconocido';
        let produccionCantidad = det.cantidad || 0;

        // Omitir si es Inversión
        if (det.tipoActividad?.toLowerCase().includes('inversión') || det.tipoActividad?.toLowerCase().includes('inversion')) {
          continue;
        }

        let horasTrabajadas = 0;
        if (det.horaEntrada && det.horaSalida) {
          const [hE, mE] = det.horaEntrada.split(':').map(Number);
          const [hS, mS] = det.horaSalida.split(':').map(Number);
          horasTrabajadas = (hS + (mS/60)) - (hE + (mE/60));
          if (horasTrabajadas < 0) horasTrabajadas += 24;
        }

        // Heurística de Inversión: Si la cantidad coincide con las horas trabajadas (ej. 8)
        // se asume que es el reporte de horas de inversión. Como el usuario pidió omitirlo, hacemos continue.
        if (produccionCantidad === horasTrabajadas && produccionCantidad <= 16) {
          continue; 
        }

        datos.push({
          fecha,
          fechaObj: fecha ? new Date(fecha) : new Date(0),
          trabajador: trabajadorNombre,
          lote: (parte.turno || 'Día') + ' / ' + lote,
          horas: horasTrabajadas,
          produccion: produccionCantidad,
          calidad: det.estadoAsistencia ?? 'ASISTIÓ'
        });
      }
    }

    // 3. Aplicar Filtro de rango de fechas ingresado por los inputs
    const datosFiltradosPorFecha = this.aplicarFiltroFechas(datos);

    // 4. ORDENAR POR FECHA (Año/Mes/Día) de forma descendente (El día más reciente primero)
    return datosFiltradosPorFecha.sort((a, b) => b.fechaObj.getTime() - a.fechaObj.getTime());
  }

  // ----------------------------------------------------------------
  // Computed: cumplimientoMetas (Calculado dinámicamente)
  // ----------------------------------------------------------------
  get cumplimientoMetas(): number {
    if (!this.asesorSeleccionado || this.datosHistoricos.length === 0) return 0;
    
    // Sumamos la producción real acumulada del asesor seleccionado
    const totalEjecutada = this.datosHistoricos.reduce((sum, item) => sum + Number(item.produccion), 0);
    
    if (totalEjecutada === 0) return 0;
    // Meta diaria promedio estimada por hectárea o lote (ejemplo base de 5000 kg)
    return Math.min(100, Math.round((totalEjecutada / 5000) * 100));
  }

  // ----------------------------------------------------------------
  // Computed: produccionPorSemana
  // ----------------------------------------------------------------
  get produccionPorSemana(): any[] {
    const mapa: Record<string, { semana: string; total: number; registros: number }> = {};

    for (const d of this.datosHistoricos) {
      const sampleFecha = d.fecha.includes('T') ? d.fecha.split('T')[0] : d.fecha;
      const semana = this.obtenerSemana(sampleFecha);
      if (!mapa[semana]) {
        mapa[semana] = { semana, total: 0, registros: 0 };
      }
      mapa[semana].total += Number(d.produccion ?? 0);
      mapa[semana].registros += 1;
    }

    return Object.values(mapa).sort((a, b) => a.semana.localeCompare(b.semana));
  }

  get maxProduccion(): number {
    const data = this.produccionPorSemana;
    if (data.length === 0) return 150;
    return Math.max(...data.map(d => d.total));
  }

  // ----------------------------------------------------------------
  // Computed: eficienciaCuadrillas
  // ----------------------------------------------------------------
  get eficienciaCuadrillas(): any[] {
    if (!this.asesorSeleccionado) return [];
    
    // Calcular la eficiencia conectada a la base de datos a partir de "this.produccion" (datos asíncronos reales)
    if (this.produccion.length === 0) {
      return [{ nombre: this.asesorSeleccionado.nombre, rendimiento: 0 }];
    }

    const sumaRendimiento = this.produccion.reduce((acc, p) => acc + (p.rendimiento || 0), 0);
    const avgRendimiento = Math.round(sumaRendimiento / this.produccion.length);

    return [
      {
        nombre: this.asesorSeleccionado.nombre,
        rendimiento: avgRendimiento
      }
    ];
  }

  // ----------------------------------------------------------------
  // Pagination
  // ----------------------------------------------------------------
  get datosHistoricosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.datosHistoricos.slice(inicio, inicio + this.registrosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.datosHistoricos.length / this.registrosPorPagina) || 1;
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  // ----------------------------------------------------------------
  // CSV Export
  // ----------------------------------------------------------------
  exportarCSV(): void {
    if (this.datosHistoricos.length === 0) return;

    const encabezados = ['Fecha', 'Trabajador', 'Turno/Lote', 'Horas Trab.', 'Produccion (KG)', 'Estado'];
    const filas = this.datosHistoricos.map((d) =>
      [d.fecha, d.trabajador, d.lote, d.horas, d.produccion > 0 ? d.produccion : 0, d.calidad]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csv = [encabezados.join(','), ...filas].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    const nombreArchivo = this.asesorSeleccionado ? this.asesorSeleccionado.nombre.replace(/\s+/g, '_') : 'general';
    link.download = `reporte_${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  private aplicarFiltroFechas(datos: any[]): any[] {
    const { inicio, fin } = this.filtroFechas;
    if (!inicio && !fin) return datos;

    return datos.filter((d) => {
      const fecha = d.fecha ?? '';
      if (inicio && fecha < inicio) return false;
      if (fin && fecha > fin) return false;
      return true;
    });
  }

  private obtenerSemana(fechaStr: string): string {
    if (!fechaStr) return 'Sin fecha';
    try {
      const date = new Date(fechaStr);
      if (isNaN(date.getTime())) return 'Sin fecha';

      const yearStart = new Date(date.getFullYear(), 0, 1);
      const diff = date.getTime() - yearStart.getTime();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const weekNum = Math.ceil((diff / oneWeek) + 1);

      return `${date.getFullYear()}-S${String(weekNum).padStart(2, '0')}`;
    } catch {
      return 'Sin fecha';
    }
  }

  limpiarFiltros(): void {
    this.filtroFechas = { inicio: '', fin: '' };
    this.paginaActual = 1;
  }
}