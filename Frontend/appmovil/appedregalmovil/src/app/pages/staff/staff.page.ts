import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRippleEffect, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { syncOutline, menuOutline } from 'ionicons/icons';

export interface Colaborador {
  id: string;
  dni: string;
  nombre: string;
  rendimiento: number;
  meta: number;
  avatarColor: string;
  avatarIcon: string;
  enObservacion?: boolean;
  motivoObservacion?: string;
  presente?: boolean;
  horas?: number;
  cajas?: number;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [IonContent, IonRippleEffect, FormsModule, CommonModule],
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.css'],
})
export class StaffPage {

  estadoVista: 'lista' | 'detalle' = 'lista';
  activeTab: 'rendimiento' | 'asistencia' = 'rendimiento';
  colaboradorSeleccionado: Colaborador | null = null;
  rendimientoSeleccionado: 'bajo' | 'alto' | 'ausente' = 'bajo';

  rendimientoPromedio = 0;
  atencionRequerida   = 0;

  todas: Colaborador[]                   = [];
  colaboradoresBajo: Colaborador[]       = [];
  colaboradoresAlto: Colaborador[]       = [];
  colaboradoresAusentes: Colaborador[]   = [];
  colaboradoresObservacion: Colaborador[] = [];

  motivoObservacionActual = '';

  constructor(private router: Router, private toastCtrl: ToastController) {
    addIcons({ syncOutline, menuOutline });
  }

  ionViewWillEnter() {
    this._cargarDatosDesdeReportes();
  }

  private _cargarDatosDesdeReportes() {
    const plantillaDefault: Colaborador[] = [
      { id: '#88294', dni: '45829301', nombre: 'Mendoza Torres, Juan',  rendimiento: 0, meta: 0, avatarColor: '#6b7280', avatarIcon: 'fa-hard-hat' },
      { id: '#88312', dni: '70192834', nombre: 'Quispe Huation, Elena',  rendimiento: 0, meta: 0, avatarColor: '#f97316', avatarIcon: 'fa-hard-hat' },
      { id: '#88102', dni: '41029384', nombre: 'Salazar Rojas, Roberto', rendimiento: 0, meta: 0, avatarColor: '#ef4444', avatarIcon: 'fa-hard-hat' },
      { id: '#88095', dni: '45678901', nombre: 'Perez Castillo, Juan',   rendimiento: 0, meta: 0, avatarColor: '#10b981', avatarIcon: 'fa-hard-hat' },
      { id: '#88111', dni: '72345678', nombre: 'Gonzales Ruiz, Maria',   rendimiento: 0, meta: 0, avatarColor: '#10b981', avatarIcon: 'fa-hard-hat' },
      { id: '#88123', dni: '12987654', nombre: 'Luna Diaz, Carlos',      rendimiento: 0, meta: 0, avatarColor: '#ef4444', avatarIcon: 'fa-hard-hat' },
    ];

    const plantillaStr = localStorage.getItem('staff_plantilla');
    this.todas = plantillaStr ? JSON.parse(plantillaStr) : plantillaDefault;

    const presentesStr = localStorage.getItem('trabajadores_presentes');
    const presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];

    const reportesStr = localStorage.getItem('trabajadores_reporte_completo');
    const reportes: any[] = reportesStr ? JSON.parse(reportesStr) : [];

    const META_CAJAS_HORA = 12;

    this.todas = this.todas.map(col => {
      col.presente = presentes.includes(col.dni);
      const rep = reportes.find(r => r.dni === col.dni);
      if (rep) {
        if (rep.cajas > 0) {
          col.rendimiento = rep.horas > 0 ? parseFloat((rep.cajas / rep.horas).toFixed(1)) : 0;
          col.horas = rep.horas;
          col.cajas = rep.cajas;
          const esperado = META_CAJAS_HORA * rep.horas;
          col.meta = esperado > 0 ? Math.round(((rep.cajas - esperado) / esperado) * 100) : 0;
        } else if (rep.horas > 0) {
          col.rendimiento = parseFloat((rep.horas * 1.4).toFixed(1));
          col.horas = rep.horas;
          col.cajas = 0;
          col.meta = rep.horas >= 8 ? 5 : Math.round(((rep.horas - 8) / 8) * 100);
        }
      } else if (!col.presente) {
        col.rendimiento = 0;
        col.meta = -100;
      }
      return col;
    });

    const presentesList = this.todas.filter(c => c.presente);
    this.colaboradoresAusentes    = this.todas.filter(c => !c.presente);
    this.colaboradoresObservacion = this.todas.filter(c => c.enObservacion);
    this.colaboradoresBajo        = presentesList.filter(c => !c.enObservacion && c.rendimiento < 10);
    this.colaboradoresAlto        = presentesList.filter(c => !c.enObservacion && c.rendimiento >= 10);

    this.atencionRequerida = this.colaboradoresBajo.length + this.colaboradoresObservacion.length;
    const sum = presentesList.reduce((acc, c) => acc + c.rendimiento, 0);
    this.rendimientoPromedio = presentesList.length > 0
      ? parseFloat((sum / presentesList.length).toFixed(1)) : 0;
  }

  detalleRendimientoActual = 0;
  detalleHistorial: any[] = [];
  asistenciaDias: any[] = [];
  detalleConsistencia = 100;

  formatDate(date: Date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }

  verDetalle(colaborador: Colaborador, tipo: 'bajo' | 'alto' | 'ausente') {
    this.colaboradorSeleccionado = colaborador;
    this.rendimientoSeleccionado = tipo;
    this.motivoObservacionActual = '';
    this.detalleRendimientoActual = Math.max(0, 100 + colaborador.meta);

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

    const reportStr = localStorage.getItem('trabajadores_reporte_completo');
    let reportData: any = null;
    if (reportStr) {
      const reports = JSON.parse(reportStr);
      reportData = reports.find((r: any) => r.dni === colaborador.dni);
    }

    const prodHoy = reportData
      ? (reportData.cajas > 0
          ? `Produccion: ${reportData.cajas} cajas (${reportData.horas}h)`
          : `Horas trabajadas: ${reportData.horas}h`)
      : 'Sin actividad registrada hoy';

    this.detalleHistorial = [
      {
        fecha: this.formatDate(today),
        produccion: prodHoy,
        estado: tipo === 'bajo' ? 'CRITICO' : tipo === 'alto' ? 'ALTO' : 'FALTA',
        metaText: tipo === 'ausente' ? 'Ausencia' : (colaborador.meta > 0 ? `+${colaborador.meta}% vs Meta` : `${colaborador.meta}% vs Meta`),
      },
      {
        fecha: this.formatDate(yesterday),
        produccion: tipo === 'bajo' ? 'Produccion: 85% meta' : (tipo === 'ausente' ? 'Sin actividad' : 'Produccion: 105% meta'),
        estado: tipo === 'bajo' ? 'PROMEDIO' : (tipo === 'ausente' ? 'FALTA' : 'ALTO'),
        metaText: tipo === 'bajo' ? '-5% vs Meta' : (tipo === 'ausente' ? 'Ausencia' : '+5% vs Meta'),
      },
      {
        fecha: this.formatDate(dayBefore),
        produccion: tipo === 'bajo' ? 'Produccion: 80% meta' : 'Produccion: 110% meta',
        estado: tipo === 'bajo' ? 'BAJO' : 'ALTO',
        metaText: tipo === 'bajo' ? '-10% vs Meta' : '+10% vs Meta',
      },
    ];

    this.asistenciaDias = [];
    let presentesCount = 0;
    const daysShort = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const isToday = i === 0;
      let status = 'presente';
      if (tipo === 'ausente') {
        if (i === 1 || i === 3 || isToday) status = 'ausente';
      } else if (tipo === 'bajo') {
        if (i === 2) status = 'ausente';
      }
      if (status === 'presente') presentesCount++;
      this.asistenciaDias.push({ name: daysShort[d.getDay()], status });
    }
    this.detalleConsistencia = Math.round((presentesCount / 7) * 100);
    this.estadoVista = 'detalle';
  }

  volver() {
    this.estadoVista = 'lista';
    this.colaboradorSeleccionado = null;
    this.motivoObservacionActual = '';
  }

  setTab(tab: 'rendimiento' | 'asistencia') {
    this.activeTab = tab;
  }

  async ponerEnObservacion() {
    if (!this.colaboradorSeleccionado) return;
    if (!this.motivoObservacionActual.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor ingrese el motivo de observacion.',
        duration: 2500,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const motivo = this.motivoObservacionActual.trim();
    this.colaboradorSeleccionado.enObservacion = true;
    this.colaboradorSeleccionado.motivoObservacion = motivo;

    const idx = this.todas.findIndex(c => c.dni === this.colaboradorSeleccionado!.dni);
    if (idx !== -1) {
      this.todas[idx].enObservacion = true;
      this.todas[idx].motivoObservacion = motivo;
    }
    localStorage.setItem('staff_plantilla', JSON.stringify(this.todas));

    const queueStr = localStorage.getItem('sync_queue');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push({
      type:    'observacion',
      title:   'Observacion de Rendimiento',
      details: `${this.colaboradorSeleccionado.nombre} (${this.colaboradorSeleccionado.id}) - Motivo: ${motivo}`,
      date:    new Date().toISOString(),
    });
    localStorage.setItem('sync_queue', JSON.stringify(queue));

    const toast = await this.toastCtrl.create({
      message: 'Trabajador puesto en observacion. Sincronizacion pendiente.',
      duration: 2500,
      position: 'bottom',
      color: 'warning',
      icon: 'sync-outline',
    });
    await toast.present();
    this.volver();
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}
