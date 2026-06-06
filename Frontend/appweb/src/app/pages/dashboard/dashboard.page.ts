import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trabajador } from '../staff/trabajador';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countAsistencia',
  standalone: true
})
export class CountAsistenciaPipe implements PipeTransform {
  transform(personal: any[], tipo: string): number {
    if (!personal) return 0;
    return personal.filter(p => p.asistencia === tipo).length;
  }
}

export interface IAlerta {
  tipo: 'critico' | 'bajo' | 'info';
  tipoLabel: string;
  jefeNombre: string;
  zona: string;
  rendimiento: number;
  tiempo: string;
  mensaje: string;
  descartada: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CountAsistenciaPipe],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPage implements OnInit {

  textoBusqueda: string = '';
  alertasVisible: boolean = false;
  reporteVisible: boolean = false;

  // KPIs dinámicos
  personalActivo: number = 0;
  porcentajeAvance: number = 0;
  costoImproductividad: number = 0;
  grupos: { nombre: string; lider: string; rendimiento: number }[] = [];

  // Alertas dinámicas
  alertas: IAlerta[] = [];

  // Reporte
  partesFinalizados: any[] = [];

  constructor(private router: Router, private trabajador: Trabajador) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.personalActivo        = this.trabajador.getTotalPersonalActivo();
    this.porcentajeAvance      = this.trabajador.getPorcentajeAvanceCosecha();
    this.costoImproductividad  = this.trabajador.getCostoImproductividad();
    this.grupos                = this.trabajador.getRankingGrupos();
    this.partesFinalizados     = this.trabajador.getPartesFinalizados();
    this._generarAlertas();
  }

  // ── ALERTAS DINÁMICAS ────────────────────────────────────────

  private _generarAlertas(): void {
    const jefesDeCampo = this.trabajador.getJefesDeCampo();
    const nuevas: IAlerta[] = [];

    for (const jefe of jefesDeCampo) {
      const ts = jefe.trabajadores;
      if (!ts.length) continue;

      const rendProm = Math.round(ts.reduce((s, t) => s + t.rendimiento, 0) / ts.length);
      const criticos = ts.filter(t => t.estado === 'Crítico').length;
      const regulares = ts.filter(t => t.estado === 'Regular').length;

      if (rendProm < 60) {
        nuevas.push({
          tipo: 'critico',
          tipoLabel: 'RENDIMIENTO CRÍTICO',
          jefeNombre: jefe.nombre,
          zona: jefe.zona,
          rendimiento: rendProm,
          tiempo: 'AHORA',
          mensaje: `${criticos} trabajador(es) en estado crítico. Rendimiento promedio ${rendProm}% — por debajo del umbral mínimo. Se requiere intervención inmediata.`,
          descartada: false
        });
      } else if (rendProm < 80) {
        nuevas.push({
          tipo: 'bajo',
          tipoLabel: 'RENDIMIENTO BAJO',
          jefeNombre: jefe.nombre,
          zona: jefe.zona,
          rendimiento: rendProm,
          tiempo: 'HOY',
          mensaje: `${regulares} trabajador(es) en estado regular. Rendimiento promedio ${rendProm}%. Revisar condiciones de labor y asignación.`,
          descartada: false
        });
      }

      // Alerta de trabajadores con restricciones médicas activos en campo
      const conRestricciones = ts.filter(t => t.restricciones && t.restricciones !== 'Ninguna');
      if (conRestricciones.length > 0) {
        nuevas.push({
          tipo: 'info',
          tipoLabel: 'ALERTA SST',
          jefeNombre: jefe.nombre,
          zona: jefe.zona,
          rendimiento: rendProm,
          tiempo: 'HOY',
          mensaje: `${conRestricciones.length} trabajador(es) con restricciones médicas activos en ${jefe.zona}. Verificar EPPs y condiciones.`,
          descartada: false
        });
      }
    }

    // Si no hay alertas reales, mantener una informativa de turno
    if (nuevas.length === 0) {
      nuevas.push({
        tipo: 'info',
        tipoLabel: 'SIN ALERTAS',
        jefeNombre: 'Todos los grupos',
        zona: 'Fundo Yaurilla',
        rendimiento: 100,
        tiempo: 'HOY',
        mensaje: 'Todos los grupos operan dentro de los parámetros normales.',
        descartada: false
      });
    }

    // Conservar estado descartado de alertas previas
    this.alertas = nuevas.map(n => {
      const previa = this.alertas.find(
        a => a.jefeNombre === n.jefeNombre && a.tipo === n.tipo
      );
      return previa ? { ...n, descartada: previa.descartada } : n;
    });
  }

  get alertasActivas(): IAlerta[] {
    return this.alertas.filter(a => !a.descartada);
  }

  get totalAlertas(): number {
    return this.alertasActivas.length;
  }

  descartarAlerta(alerta: IAlerta): void {
    alerta.descartada = true;
  }

  intervenir(alerta: IAlerta): void {
    this.router.navigate(['/staff']);
  }

  // ── RESTO ────────────────────────────────────────────────────

  get gruposFiltrados() {
    if (!this.textoBusqueda.trim()) return this.grupos;
    const q = this.textoBusqueda.toLowerCase();
    return this.grupos.filter(g =>
      g.nombre.toLowerCase().includes(q) || g.lider.toLowerCase().includes(q)
    );
  }

  get totalProduccion(): number {
    return this.trabajador.getTotalProduccion() || 0;
  }

  get metaTotal(): number {
    return this.trabajador.getMetaTotalProduccion();
  }

  get totalAsistencias(): number {
    const partes = this.partesFinalizados;
    if (!partes.length) return this.personalActivo;
    const set = new Set<string>();
    partes.forEach(p =>
      p.personal
        .filter((per: any) => per.asistencia === 'PRESENTE')
        .forEach((per: any) => set.add(per.dni))
    );
    return set.size;
  }

  get totalInasistencias(): number {
    const partes = this.partesFinalizados;
    if (!partes.length) return 0;
    const set = new Set<string>();
    partes.forEach(p =>
      p.personal
        .filter((per: any) => per.asistencia === 'FALTA')
        .forEach((per: any) => set.add(per.dni))
    );
    return set.size;
  }

  toggleAlertas(): void {
    this.alertasVisible = !this.alertasVisible;
    if (this.alertasVisible) this.reporteVisible = false;
  }

  toggleReporte(): void {
    this.reporteVisible = !this.reporteVisible;
    if (this.reporteVisible) this.alertasVisible = false;
  }

  abrirCrearParte(): void {
    this.router.navigate(['/dashboard/crear-parte']);
  }
}