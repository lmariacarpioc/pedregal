import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ReporteHistorico {
  id: string;
  fecha: string;
  cuadrilla: string;
  lote: string;
  produccion: number;
  calidad: 'EXCELENTE' | 'ESTÁNDAR' | 'REVISIÓN';
  personal: number;
  eficiencia: number;
  supervisor: string;
  labor: string;
  costoImprod: number;
  horas: number;
  meta: number;
}

interface EficienciaCuadrilla {
  nombre: string;
  porcentaje: number;
}

interface ProduccionSemanal {
  semana: string;
  real: number;
  meta: number;
}

interface LoteActivo {
  nombre: string;
  personas: number;
  riego: number;
}


@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule], 
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  // ─── Estado de UI ─────────────────────────────────────
  filtrosVisibles   = false;
  detalleVisible    = false;
  paginaNum         = 1;
  itemsPorPagina    = 4;
  ordenCampo        = 'fecha';
  ordenAsc          = false;

  // ─── Filtros ──────────────────────────────────────────
  periodoSeleccionado = '30';
  filtroCuadrilla     = '';
  filtroLote          = '';
  filtroCalidad       = '';

  // ─── Datos de cabecera ────────────────────────────────
  cumplimientoMeta = 94.2;
  variacionMeta    = 2.4;
  miniBarsCumplimiento = [45, 55, 60, 50, 70, 65, 80, 94];

  loteActivo: LoteActivo = {
    nombre: 'San José IV',
    personas: 14,
    riego: 100
  };

  // ─── Eficiencia por cuadrilla ─────────────────────────
  eficienciaCuadrillas: EficienciaCuadrilla[] = [
    { nombre: 'Cuadrilla A (Norte)', porcentaje: 98 },
    { nombre: 'Cuadrilla B (Sur)',   porcentaje: 82 },
    { nombre: 'Cuadrilla C (Oeste)', porcentaje: 75 }
  ];

  // ─── Producción semanal ───────────────────────────────
  produccionSemanal: ProduccionSemanal[] = [
    { semana: 'SEM 1', real: 980,  meta: 1200 },
    { semana: 'SEM 2', real: 1050, meta: 1200 },
    { semana: 'SEM 3', real: 1180, meta: 1200 },
    { semana: 'SEM 4', real: 1100, meta: 1200 }
  ];

  get maxProduccion(): number {
    return Math.max(...this.produccionSemanal.map(s => Math.max(s.real, s.meta)));
  }

  // ─── Catálogos de filtros ─────────────────────────────
  cuadrillas = ['Cuadrilla A', 'Cuadrilla B', 'Cuadrilla C'];
  lotes      = ['San José IV', 'Lote 72-B', 'San José II', 'Lote 08'];

  // ─── Datos históricos (mock) ──────────────────────────
  todosLosReportes: ReporteHistorico[] = [
    { id: '#RP-9821', fecha: '22 Oct, 2023', cuadrilla: 'Cuadrilla A', lote: 'San José IV', produccion: 1240.5, calidad: 'EXCELENTE', personal: 18, eficiencia: 98, supervisor: 'Elías Navarro',   labor: 'Cosecha de Uva',    costoImprod: 0,      horas: 8, meta: 1200 },
    { id: '#RP-9819', fecha: '21 Oct, 2023', cuadrilla: 'Cuadrilla B', lote: 'Lote 72-B',   produccion: 942.0,  calidad: 'ESTÁNDAR',  personal: 15, eficiencia: 82, supervisor: 'Brígida Torres',  labor: 'Cosecha de Uva',    costoImprod: 180,    horas: 8, meta: 1100 },
    { id: '#RP-9815', fecha: '21 Oct, 2023', cuadrilla: 'Cuadrilla A', lote: 'San José IV', produccion: 1105.2, calidad: 'REVISIÓN',  personal: 18, eficiencia: 88, supervisor: 'Elías Navarro',   labor: 'Poda',              costoImprod: 95,     horas: 7, meta: 1200 },
    { id: '#RP-9802', fecha: '20 Oct, 2023', cuadrilla: 'Cuadrilla C', lote: 'San José II', produccion: 822.4,  calidad: 'EXCELENTE', personal: 12, eficiencia: 91, supervisor: 'Jorge Ramírez',   labor: 'Cosecha de Uva',    costoImprod: 0,      horas: 8, meta: 900  },
    { id: '#RP-9798', fecha: '20 Oct, 2023', cuadrilla: 'Cuadrilla B', lote: 'Lote 08',     produccion: 760.0,  calidad: 'ESTÁNDAR',  personal: 14, eficiencia: 75, supervisor: 'Brígida Torres',  labor: 'Limpieza de Campo', costoImprod: 240,    horas: 8, meta: 1000 },
    { id: '#RP-9790', fecha: '19 Oct, 2023', cuadrilla: 'Cuadrilla A', lote: 'San José IV', produccion: 1315.0, calidad: 'EXCELENTE', personal: 18, eficiencia: 99, supervisor: 'Elías Navarro',   labor: 'Cosecha de Uva',    costoImprod: 0,      horas: 8, meta: 1200 },
    { id: '#RP-9785', fecha: '19 Oct, 2023', cuadrilla: 'Cuadrilla C', lote: 'San José II', produccion: 890.1,  calidad: 'ESTÁNDAR',  personal: 12, eficiencia: 79, supervisor: 'Jorge Ramírez',   labor: 'Riego Manual',      costoImprod: 120,    horas: 6, meta: 900  },
    { id: '#RP-9770', fecha: '18 Oct, 2023', cuadrilla: 'Cuadrilla A', lote: 'Lote 72-B',   produccion: 1002.8, calidad: 'EXCELENTE', personal: 16, eficiencia: 94, supervisor: 'Elías Navarro',   labor: 'Cosecha de Uva',    costoImprod: 0,      horas: 8, meta: 1050 },
    { id: '#RP-9755', fecha: '18 Oct, 2023', cuadrilla: 'Cuadrilla B', lote: 'San José IV', produccion: 678.3,  calidad: 'REVISIÓN',  personal: 15, eficiencia: 60, supervisor: 'Brígida Torres',  labor: 'Cosecha de Uva',    costoImprod: 350,    horas: 8, meta: 1100 },
    { id: '#RP-9740', fecha: '17 Oct, 2023', cuadrilla: 'Cuadrilla C', lote: 'Lote 08',     produccion: 945.0,  calidad: 'EXCELENTE', personal: 13, eficiencia: 93, supervisor: 'Jorge Ramírez',   labor: 'Poda',              costoImprod: 0,      horas: 8, meta: 950  },
    { id: '#RP-9730', fecha: '17 Oct, 2023', cuadrilla: 'Cuadrilla A', lote: 'San José II', produccion: 1180.0, calidad: 'EXCELENTE', personal: 18, eficiencia: 97, supervisor: 'Elías Navarro',   labor: 'Cosecha de Uva',    costoImprod: 0,      horas: 8, meta: 1200 },
    { id: '#RP-9715', fecha: '16 Oct, 2023', cuadrilla: 'Cuadrilla B', lote: 'Lote 72-B',   produccion: 850.0,  calidad: 'ESTÁNDAR',  personal: 15, eficiencia: 78, supervisor: 'Brígida Torres',  labor: 'Limpieza de Campo', costoImprod: 200,    horas: 7, meta: 1100 },
  ];

  reportesFiltrados: ReporteHistorico[] = [];
  reporteSeleccionado: ReporteHistorico | null = null;

  // ─── Lifecycle ────────────────────────────────────────
  ngOnInit(): void {
    this.cargarDatos();
  }

  // ─── Métodos de datos ─────────────────────────────────
  cargarDatos(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.reportesFiltrados = this.todosLosReportes.filter(r => {
      const matchCuadrilla = !this.filtroCuadrilla || r.cuadrilla.includes(this.filtroCuadrilla);
      const matchLote      = !this.filtroLote      || r.lote === this.filtroLote;
      const matchCalidad   = !this.filtroCalidad   || r.calidad === this.filtroCalidad;
      return matchCuadrilla && matchLote && matchCalidad;
    });
    this.ordenarPor(this.ordenCampo, true);
    this.paginaNum = 1;
  }

  limpiarFiltros(): void {
    this.filtroCuadrilla = '';
    this.filtroLote      = '';
    this.filtroCalidad   = '';
    this.aplicarFiltros();
  }

  // ─── Ordenamiento ─────────────────────────────────────
  ordenarPor(campo: string, mantenerDir = false): void {
    if (!mantenerDir) {
      this.ordenAsc = this.ordenCampo === campo ? !this.ordenAsc : false;
    }
    this.ordenCampo = campo;
    this.reportesFiltrados.sort((a, b) => {
      let va: any = (a as any)[campo];
      let vb: any = (b as any)[campo];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return this.ordenAsc ? -1 : 1;
      if (va > vb) return this.ordenAsc ? 1  : -1;
      return 0;
    });
  }

  // ─── Paginación ───────────────────────────────────────
  paginaActual(): ReporteHistorico[] {
    const inicio = (this.paginaNum - 1) * this.itemsPorPagina;
    return this.reportesFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.reportesFiltrados.length / this.itemsPorPagina);
  }

  paginas(): number[] {
    const total = this.totalPaginas();
    const pages: number[] = [];
    const rango = 2;
    for (let i = Math.max(1, this.paginaNum - rango); i <= Math.min(total, this.paginaNum + rango); i++) {
      pages.push(i);
    }
    return pages;
  }

  irPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas()) this.paginaNum = p;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  // ─── UI ───────────────────────────────────────────────
  toggleFiltros(): void {
    this.filtrosVisibles = !this.filtrosVisibles;
  }

  verDetalle(row: ReporteHistorico): void {
    this.reporteSeleccionado = row;
    this.detalleVisible      = true;
  }

  cerrarDetalle(): void {
    this.detalleVisible      = false;
    this.reporteSeleccionado = null;
  }

  // ─── Acciones de exportación ──────────────────────────
  exportarCSV(): void {
    const headers = ['ID', 'Fecha', 'Cuadrilla', 'Lote', 'Producción (kg)', 'Calidad', 'Eficiencia (%)', 'Personal'];
    const rows = this.reportesFiltrados.map(r =>
      [r.id, r.fecha, r.cuadrilla, r.lote, r.produccion, r.calidad, r.eficiencia, r.personal].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `reporte_pedregal_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportarPDF(): void {
    // Implementar con librería como jsPDF o pdfmake
    console.log('Exportando PDF del reporte:', this.reporteSeleccionado?.id);
    alert(`📄 PDF del reporte ${this.reporteSeleccionado?.id} generado correctamente.`);
  }

  compartirReporte(): void {
    const texto = `Reporte Pedregal – ${this.reporteSeleccionado?.id ?? 'General'}\nCuadrilla: ${this.reporteSeleccionado?.cuadrilla ?? 'Todas'}\nProducción: ${this.reporteSeleccionado?.produccion ?? '-'} kg`;
    if (navigator.share) {
      navigator.share({ title: 'Reporte Pedregal', text: texto });
    } else {
      navigator.clipboard.writeText(texto).then(() =>
        alert('✅ Enlace copiado al portapapeles.')
      );
    }
  }
}
