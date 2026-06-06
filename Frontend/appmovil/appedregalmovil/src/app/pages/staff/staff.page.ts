import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonRippleEffect, ToastController } from '@ionic/angular/standalone';
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
  presente?: boolean;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [IonContent, IonRippleEffect],
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.css'],
})
export class StaffPage {

  estadoVista: 'lista' | 'detalle' = 'lista';
  activeTab: 'rendimiento' | 'asistencia' = 'rendimiento';
  colaboradorSeleccionado: Colaborador | null = null;
  rendimientoSeleccionado: 'bajo' | 'alto' | 'ausente' = 'bajo';

  rendimientoPromedio = 14.2;
  atencionRequerida   = 8;

  todas: Colaborador[] = [
    { id: '#88294', dni: '45829301', nombre: 'Mendoza Torres, Juan', rendimiento: 14.2, meta: 10, avatarColor: '#6b7280', avatarIcon: 'fa-hard-hat' },
    { id: '#88312', dni: '70192834', nombre: 'Quispe Huamán, Elena',  rendimiento: 9.5,  meta: -12, avatarColor: '#f97316', avatarIcon: 'fa-hard-hat' },
    { id: '#88102', dni: '41029384', nombre: 'Salazar Rojas, Roberto',   rendimiento: 8.2,  meta: -24, avatarColor: '#ef4444', avatarIcon: 'fa-hard-hat' },
    { id: '#88095', dni: '45678901', nombre: 'Perez Castillo, Juan',   rendimiento: 16.8, meta: 32, avatarColor: '#10b981', avatarIcon: 'fa-hard-hat' },
    { id: '#88111', dni: '72345678', nombre: 'Gonzales Ruiz, Maria',   rendimiento: 18.4, meta: 45, avatarColor: '#10b981', avatarIcon: 'fa-hard-hat' },
    { id: '#88123', dni: '12987654', nombre: 'Luna Diaz, Carlos',   rendimiento: 0.0, meta: -100, avatarColor: '#ef4444', avatarIcon: 'fa-hard-hat' }
  ];

  colaboradoresBajo: Colaborador[] = [];
  colaboradoresAlto: Colaborador[] = [];
  colaboradoresAusentes: Colaborador[] = [];

  constructor(private router: Router, private toastCtrl: ToastController) {
    addIcons({ syncOutline, menuOutline });
  }

  ionViewWillEnter() {
    const presentStr = localStorage.getItem('trabajadores_presentes');
    let presentes: string[] = [];
    if (presentStr) {
      presentes = JSON.parse(presentStr);
    }
    
    this.todas.forEach(c => c.presente = presentes.includes(c.dni));
    
    this.colaboradoresAusentes = this.todas.filter(c => !c.presente);
    const presentesList = this.todas.filter(c => c.presente);
    
    this.colaboradoresBajo = presentesList.filter(c => c.rendimiento < 10);
    this.colaboradoresAlto = presentesList.filter(c => c.rendimiento >= 10);
    
    this.atencionRequerida = this.colaboradoresBajo.length;
    
    const sum = presentesList.reduce((acc, curr) => acc + curr.rendimiento, 0);
    this.rendimientoPromedio = presentesList.length > 0 ? parseFloat((sum / presentesList.length).toFixed(1)) : 0;
  }

  detalleRendimientoActual = 0;
  detalleMeta = 100;
  detalleHistorial: any[] = [];
  asistenciaDias: any[] = [];
  detalleConsistencia = 100;

  formatDate(date: Date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }

  verDetalle(colaborador: Colaborador, tipo: 'bajo' | 'alto' | 'ausente') {
    this.colaboradorSeleccionado = colaborador;
    this.rendimientoSeleccionado = tipo;
    
    // Set Rendimiento Actual based on the worker's meta performance
    this.detalleRendimientoActual = Math.max(0, 100 + colaborador.meta);

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

    const reportStr = localStorage.getItem('trabajadores_reporte_completo');
    let reportData = null;
    if (reportStr) {
      const reports = JSON.parse(reportStr);
      reportData = reports.find((r: any) => r.dni === colaborador.dni);
    }

    this.detalleHistorial = [
      {
        fecha: this.formatDate(today),
        produccion: reportData ? (reportData.cajas > 0 ? `Producción: ${reportData.cajas} cajas` : `Horas: ${reportData.horas} h`) : 'Sin actividad registrada',
        estado: tipo === 'bajo' ? 'CRÍTICO' : tipo === 'alto' ? 'ALTO' : 'FALTA',
        metaText: tipo === 'ausente' ? 'Ausencia' : (colaborador.meta > 0 ? `+${colaborador.meta}% vs Meta` : `${colaborador.meta}% vs Meta`)
      },
      {
        fecha: this.formatDate(yesterday),
        produccion: tipo === 'bajo' ? 'Producción: 85% meta' : (tipo === 'ausente' ? 'Sin actividad' : 'Producción: 105% meta'),
        estado: tipo === 'bajo' ? 'PROMEDIO' : (tipo === 'ausente' ? 'FALTA' : 'ALTO'),
        metaText: tipo === 'bajo' ? '-5% vs Meta' : (tipo === 'ausente' ? 'Ausencia' : '+5% vs Meta')
      },
      {
        fecha: this.formatDate(dayBefore),
        produccion: tipo === 'bajo' ? 'Producción: 80% meta' : 'Producción: 110% meta',
        estado: tipo === 'bajo' ? 'BAJO' : 'ALTO',
        metaText: tipo === 'bajo' ? '-10% vs Meta' : '+10% vs Meta'
      }
    ];

    // Generate last 7 days for Asistencia
    this.asistenciaDias = [];
    let presentesCount = 0;
    const daysShort = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isToday = i === 0;
      
      let status = 'presente';
      
      if (tipo === 'ausente') {
        if (i === 1 || i === 3) status = 'ausente'; 
        if (isToday) status = 'ausente';
      } else if (tipo === 'bajo') {
        if (i === 2) status = 'ausente'; // Falta un día en el historial para justificar inconsistencia
      }
      
      if (status === 'presente') presentesCount++;
      
      this.asistenciaDias.push({
        name: daysShort[d.getDay()],
        status: status
      });
    }
    
    this.detalleConsistencia = Math.round((presentesCount / 7) * 100);

    this.estadoVista = 'detalle';
  }

  volver() {
    this.estadoVista = 'lista';
    this.colaboradorSeleccionado = null;
  }

  setTab(tab: 'rendimiento' | 'asistencia') {
    this.activeTab = tab;
  }

  async ponerEnObservacion() {
    if (this.colaboradorSeleccionado) {
      this.colaboradorSeleccionado.enObservacion = true;

      // Agregar a la cola de sincronización
      const currentQueueStr = localStorage.getItem('sync_queue');
      let currentQueue = currentQueueStr ? JSON.parse(currentQueueStr) : [];
      currentQueue.push({
        type: 'observacion',
        title: 'Observación de Rendimiento',
        details: this.colaboradorSeleccionado.nombre + ' (' + this.colaboradorSeleccionado.id + ')',
        date: new Date().toISOString()
      });
      localStorage.setItem('sync_queue', JSON.stringify(currentQueue));
    }

    const toast = await this.toastCtrl.create({
      message: 'Registro guardado. Sincronización pendiente...',
      duration: 3000,
      position: 'bottom',
      color: 'warning',
      icon: 'sync-outline'
    });
    await toast.present();

    this.volver();
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}