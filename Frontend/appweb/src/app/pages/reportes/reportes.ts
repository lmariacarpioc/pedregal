import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Trabajador } from '../staff/trabajador';

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
  // Data loading
  // ----------------------------------------------------------------
  cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<any>(`${environment.apiUrl}/sync/download`).subscribe({
      next: (resp) => {
        this.partesDiarios = resp.partesDiarios ?? [];
        this.trabajadores = resp.trabajadores ?? [];
        this.produccion = resp.produccion ?? [];
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

  // ----------------------------------------------------------------
  // Computed: datosHistoricos
  //   Flattened list of parte diario entries with date, cuadrilla/jefe,
  //   lote, producción and calidad.
  // ----------------------------------------------------------------
  get datosHistoricos(): any[] {
    const datos: any[] = [];

    for (const parte of this.partesDiarios) {
      const fecha = parte.fecha ?? '';
      const cuadrilla = parte.cuadrilla ?? parte.jefe ?? 'Sin cuadrilla';
      const jefe = parte.jefe ?? 'Sin jefe';

      const actividades: any[] = parte.actividades ?? parte.detalles ?? [parte];

      for (const act of actividades) {
        datos.push({
          fecha,
          cuadrilla,
          jefe,
          lote: act.lote ?? parte.lote ?? '',
          produccion: act.cantidadEjecutada ?? act.produccion ?? act.cantidad ?? 0,
          calidad: act.calidad ?? act.observacion ?? 'N/A',
        });
      }
    }

    return this.aplicarFiltroFechas(datos);
  }

  // ----------------------------------------------------------------
  // Computed: cumplimientoMetas
  //   Percentage of total cantidadEjecutada / cantidadProgramada
  // ----------------------------------------------------------------
  get cumplimientoMetas(): number {
    let totalEjecutada = 0;
    let totalProgramada = 0;

    for (const p of this.produccion) {
      totalEjecutada += Number(p.cantidadEjecutada ?? 0);
      totalProgramada += Number(p.cantidadProgramada ?? 0);
    }

    if (totalProgramada === 0) return 0;
    return Math.round((totalEjecutada / totalProgramada) * 10000) / 100;
  }

  // ----------------------------------------------------------------
  // Computed: produccionPorSemana
  //   Groups datosHistoricos by ISO week and sums production.
  // ----------------------------------------------------------------
  get produccionPorSemana(): any[] {
    const mapa: Record<string, { semana: string; total: number; registros: number }> = {};

    for (const d of this.datosHistoricos) {
      const semana = this.obtenerSemana(d.fecha);
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
    if (data.length === 0) return 150; // default
    return Math.max(...data.map(d => d.total));
  }

  // ----------------------------------------------------------------
  // Computed: eficienciaCuadrillas
  //   Groups by jefe/cuadrilla and averages rendimiento.
  // ----------------------------------------------------------------
  get eficienciaCuadrillas(): any[] {
    // We want a percentage 0-100. We can get it directly from the worker service ranking.
    const grupos = this.trabajador.getRankingGrupos();
    return grupos.map((g: any) => ({
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
    const encabezados = ['Fecha', 'Cuadrilla', 'Jefe', 'Lote', 'Producción', 'Calidad'];
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
    link.download = `reporte_${new Date().toISOString().slice(0, 10)}.csv`;
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
