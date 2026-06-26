import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  Math = Math;

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

  constructor(private router: Router, private trabajador: Trabajador, private cdr: ChangeDetectorRef) {}

  cargando = true;

  async ngOnInit(): Promise<void> {
    try {
      await this.trabajador.sincronizarConBackend();
    } finally {
      this.cargarDatos();
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  // Rendimiento global para la campana de Gauss
  rendimientoGlobal: number = 0;
  varianzaGlobal: number = 5000;
  
  // Variables para la interacción con la Campana de Gauss
  gaussHover: boolean = false;
  hoverX: number = 0;
  hoverY: number = 0;
  hoverPct: number = 0;

  get gapRendimiento(): number {
    return this.rendimientoGlobal - 100;
  }

  get gaussPathReal(): string {
    // Si el rendimiento global es 0, la curva está en el fondo
    if (this.rendimientoGlobal === 0) {
      return "M 10,150 C 150,150 200,150 310,150 C 420,150 470,150 610,150";
    }
    
    // Mapeamos el rendimiento (0-100) a un centro X (10-610) y una altura Y (150-6)
    const pct = Math.min(Math.max(this.rendimientoGlobal, 10), 120) / 100;
    const peakX = 10 + (600 * pct);
    const peakY = Math.max(6, 150 - (144 * pct));
    
    // Ancho de la campana (Desviación estándar escalada al SVG)
    const desvSVG = 6 * Math.sqrt(this.varianzaGlobal);
    const spreadWidth = Math.max(desvSVG * 2.5, 40);
    
    return `M 10,150 C ${peakX - spreadWidth},150 ${peakX - (spreadWidth / 1.5)},${peakY} ${peakX},${peakY} C ${peakX + (spreadWidth / 1.5)},${peakY} ${peakX + spreadWidth},150 610,150`;
  }
  
  get gaussLabelX(): number {
    const pct = Math.min(Math.max(this.rendimientoGlobal, 10), 120) / 100;
    return 10 + (600 * pct);
  }

  onGaussHover(event: MouseEvent): void {
    this.gaussHover = true;
    
    // Obtener coordenadas relativas al SVG
    const svg = event.currentTarget as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    this.hoverX = svgP.x;
    
    // Calcular porcentaje basado en la coordenada X (10 a 610 = 0% a 120%)
    let pct = ((this.hoverX - 10) / 600) * 120;
    this.hoverPct = Math.max(0, Math.min(120, Math.round(pct)));
    
    // Calcular Y aproximado en la campana (distribución normal real mapeada al SVG)
    const mediaX = this.gaussLabelX;
    // Factor de conversión (el eje X del SVG es ~6x el valor de rendimiento porcentual)
    const varianzaSVG = 36 * this.varianzaGlobal;

    const alturaMaxima = Math.max(6, 150 - (144 * (this.rendimientoGlobal / 100)));
    const altura = 150 - alturaMaxima;
    
    const exp = -Math.pow(this.hoverX - mediaX, 2) / (2 * varianzaSVG);
    this.hoverY = 150 - (altura * Math.exp(exp));
  }

  cargarDatos(): void {
    this.personalActivo        = this.trabajador.getTotalPersonalActivo();
    this.porcentajeAvance      = this.trabajador.getPorcentajeAvanceCosecha();
    this.costoImproductividad  = this.trabajador.getCostoImproductividad();
    this.partesFinalizados     = this.trabajador.getPartesFinalizados();
    
    // Filtramos los grupos para que solo se muestren aquellos que tengan un rendimiento > 0 o que tengan partes asignados
    this.grupos                = this.trabajador.getRankingGrupos().filter(g => g.rendimiento > 0 || this.partesFinalizados.length > 0);
    
    // Extraer rendimientos individuales reales de los Partes Finalizados más recientes
    const rendimientosIndividuales: number[] = [];
    const trabajadorUltimoRend: { [dni: string]: number } = {};

    this.partesFinalizados.forEach(parte => {
      parte.personal.forEach((p: any) => {
        if (p.asistencia === 'PRESENTE' && p.rendimiento != null) {
          trabajadorUltimoRend[p.dni] = p.rendimiento;
        }
      });
    });

    const rendimientosValidos = Object.values(trabajadorUltimoRend);
    
    if (rendimientosValidos.length > 0) {
      // Media Global real
      this.rendimientoGlobal = Math.round(rendimientosValidos.reduce((a, b) => a + b, 0) / rendimientosValidos.length);
      
      // Varianza real
      const sumSq = rendimientosValidos.reduce((a, b) => a + Math.pow(b - this.rendimientoGlobal, 2), 0);
      this.varianzaGlobal = sumSq / rendimientosValidos.length;
      
      // Evitar varianza 0 para que la campana no sea una línea infinita
      if (this.varianzaGlobal < 100) this.varianzaGlobal = 100;
      
    } else {
      this.rendimientoGlobal = 0;
      this.varianzaGlobal = 5000;
    }
    
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

      // Solo alertar si el rendimiento es mayor a 0 (para no alertar al inicio del día)
      // O si hay trabajadores explícitamente marcados como 'Crítico'
      if ((rendProm > 0 && rendProm < 60) || criticos > 0) {
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
      } else if (rendProm >= 60 && rendProm < 80) {
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
    if (!partes.length) return 0;
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