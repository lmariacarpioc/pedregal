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
 
  // Datos de reporte detallado
  partesFinalizados: any[] = [];
 
  constructor(private router: Router, private trabajador: Trabajador) {}
 
  ngOnInit(): void {
    this.cargarDatos();
  }
 
  cargarDatos(): void {
    this.personalActivo = this.trabajador.getTotalPersonalActivo();
    this.porcentajeAvance = this.trabajador.getPorcentajeAvanceCosecha();
this.grupos = this.trabajador.getRankingGrupos();
    this.partesFinalizados = this.trabajador.getPartesFinalizados();
  }
 
  get gruposFiltrados() {
    if (!this.textoBusqueda.trim()) return this.grupos;
    const q = this.textoBusqueda.toLowerCase();
    return this.grupos.filter(g =>
      g.nombre.toLowerCase().includes(q) || g.lider.toLowerCase().includes(q)
    );
  }
 
  get totalProduccion(): number {
    return this.trabajador.getTotalProduccion() || 1592;
  }
 
  get metaTotal(): number {
    return this.trabajador.getMetaTotalProduccion();
  }
 
  get totalAsistencias(): number {
    const partes = this.partesFinalizados;
    if (!partes.length) return this.personalActivo;
    const set = new Set<string>();
    partes.forEach(p => p.personal.filter((per: any) => per.asistencia === 'PRESENTE').forEach((per: any) => set.add(per.dni)));
    return set.size;
  }
 
  get totalInasistencias(): number {
    const partes = this.partesFinalizados;
    if (!partes.length) return 0;
    const set = new Set<string>();
    partes.forEach(p => p.personal.filter((per: any) => per.asistencia === 'FALTA').forEach((per: any) => set.add(per.dni)));
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
    this.router.navigate(['/dashboard/crear_parte']);
  }
}