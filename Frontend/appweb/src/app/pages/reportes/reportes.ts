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

    this.http.get<any>(`${environment.apiUrl}/sync/download`).subscribe({
      next: (resp) => {
        this.partesDiarios = resp.partesDiarios ?? [];
        this.trabajadores = resp.trabajadores ?? [];
        this.produccion = resp.produccion ?? [];
        
        // Al recibir los datos de Supabase, generamos la lista de asesores únicos
        this.extraerAsesores();

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos de reportes:', err);
        this.error = 'No se pudieron cargar los datos. Intente nuevamente.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Extrae la lista de asesores/jefes únicos basados en los trabajadores y grupos
   */
  extraerAsesores(): void {
    const jefesDeCampo = this.trabajador.getJefesDeCampo();
    if (jefesDeCampo && jefesDeCampo.length > 0) {
      this.asesores = jefesDeCampo.map((jefe: any, index: number) => ({
        id: jefe.id || index.toString(),
        nombre: jefe.nombre,
        zona: jefe.zona
      }));
    } else {
      // Alternativa si el servicio viene vacío: extraerlos de los propios partes diarios
      const nombresUnicos = new Set<string>();
      this.partesDiarios.forEach(p => {
        if (p.jefe) nombresUnicos.add(p.jefe);
        else if (p.cuadrilla) nombresUnicos.add(p.cuadrilla);
      });
      
      this.asesores = Array.from(nombresUnicos).map((nombre, idx) => ({
        id: idx.toString(),
        nombre: nombre,
        zona: 'Campo General'
      }));
    }
  }

  /**
   * Se ejecuta al hacer clic sobre un asesor en el panel lateral izquierdo
   */
  seleccionarAsesor(asesor: IAsesor): void {
    this.asesorSeleccionado = asesor;
    this.paginaActual = 1; // Reseteamos la página
    this.cdr.detectChanges();
  }

  // ----------------------------------------------------------------
  // Computed: datosHistoricos (Filtrados por asesor y ordenados por fecha)
  // ----------------------------------------------------------------
  get datosHistoricos(): any[] {
    if (!this.asesorSeleccionado) return [];

    const datos: any[] = [];
    const nombreAsesor = this.asesorSeleccionado.nombre.toLowerCase();

    // 1. Filtrar partes que pertenezcan al asesor seleccionado
    const partesDelAsesor = this.partesDiarios.filter(parte => {
      const jefe = (parte.jefe ?? '').toLowerCase();
      const cuadrilla = (parte.cuadrilla ?? '').toLowerCase();
      return jefe === nombreAsesor || cuadrilla === nombreAsesor;
    });

    // 2. Aplanar los partes diarios
    for (const parte of partesDelAsesor) {
      const fecha = parte.fecha ?? '';
      const cuadrilla = parte.cuadrilla ?? parte.jefe ?? 'Sin cuadrilla';
      const jefe = parte.jefe ?? 'Sin jefe';

      const actividades: any[] = parte.actividades ?? parte.detalles ?? [parte];

      for (const act of actividades) {
        datos.push({
          fecha,
          // Creamos una propiedad Date nativa para poder ordenar correctamente
          fechaObj: fecha ? new Date(fecha) : new Date(0),
          cuadrilla,
          jefe,
          lote: act.lote ?? parte.lote ?? '',
          produccion: act.cantidadEjecutada ?? act.produccion ?? act.cantidad ?? 0,
          calidad: act.calidad ?? act.observacion ?? 'N/A',
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
    
    const grupos = this.trabajador.getRankingGrupos();
    // Filtramos para que solo muestre el rendimiento de la cuadrilla bajo el mando del asesor actual
    return grupos
      .filter((g: any) => g.nombre.toLowerCase() === this.asesorSeleccionado!.nombre.toLowerCase())
      .map((g: any) => ({
        nombre: g.nombre,
        rendimiento: g.rendimiento
      }));
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

    const encabezados = ['Fecha', 'Cuadrilla', 'Jefe', 'Lote', 'Produccion', 'Calidad'];
    const filas = this.datosHistoricos.map((d) =>
      [d.fecha, d.cuadrilla, d.jefe, d.lote, d.produccion, d.calidad]
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