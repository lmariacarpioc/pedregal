import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRippleEffect, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
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
  tipoSangre?: string;
  telefono?: string;
  area?: string;
  estado?: string;
}

import { AuthService } from '../../services/auth.service';

import { SyncService } from '../../services/sync.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [IonContent, IonRippleEffect, IonButton, IonIcon, FormsModule, CommonModule],
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.css'],
})
export class StaffPage {

  estadoVista: 'lista' | 'detalle' = 'lista';
  activeTab: 'rendimiento' | 'asistencia' = 'asistencia';
  colaboradorSeleccionado: Colaborador | null = null;
  rendimientoSeleccionado: 'bajo' | 'alto' | 'ausente' | 'observacion' = 'bajo';

  rendimientoPromedio = 0;
  atencionRequerida   = 0;

  todas: Colaborador[]                   = [];
  colaboradoresBajo: Colaborador[]       = [];
  colaboradoresAlto: Colaborador[]       = [];
  colaboradoresAusentes: Colaborador[]   = [];
  colaboradoresObservacion: Colaborador[] = [];

  motivoObservacionActual = '';

  // Attendance date reset
  asistenciaCompletada = false;

  // Attendance header card
  supervisorNombre = 'Supervisor';
  fechaHoy = '';

  // Tardanza state
  tardanzas: string[] = [];

  constructor(
    private router: Router, 
    private toastCtrl: ToastController, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private syncService: SyncService
  ) {
    addIcons({ syncOutline, menuOutline });
  }

  ionViewWillEnter() {
    // Attendance date reset logic
    const todayStr = new Date().toISOString().split('T')[0];
    const storedFecha = localStorage.getItem(('asistencia_fecha_' + this.authService.getUserPrefix()));

    if (storedFecha !== todayStr) {
      localStorage.removeItem(('trabajadores_presentes_' + this.authService.getUserPrefix()));
      localStorage.setItem(('asistencia_fecha_' + this.authService.getUserPrefix()), todayStr);
      this.asistenciaCompletada = false;
    } else {
      this.asistenciaCompletada = true;
    }

    // Load supervisor name
    const currentUser = this.authService.getCurrentUser();
    this.supervisorNombre = currentUser?.nombre || 'Supervisor';

    // Format fechaHoy like 'Domingo, 22 Jun 2025'
    const now = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.fechaHoy = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    this._cargarDatosDesdeReportes();
  }

  private _cargarDatosDesdeReportes() {
    const rawTrabajadores = this.syncService.getLocalTrabajadores();
    this.todas = rawTrabajadores.map((t: any) => ({
      id: t.syncId || ('#' + Math.floor(Math.random()*100000)),
      dni: t.dni,
      nombre: t.apellido ? `${t.apellido}, ${t.nombre}` : t.nombre,
      rendimiento: 0,
      meta: 0,
      avatarColor: '#10b981', // green for everyone locally
      avatarIcon: 'fa-hard-hat'
    }));

    const presentesStr = localStorage.getItem(('trabajadores_presentes_' + this.authService.getUserPrefix()));
    const presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];

    // Load tardanzas
    const tardanzaStr = localStorage.getItem(('trabajadores_tardanza_' + this.authService.getUserPrefix()));
    this.tardanzas = tardanzaStr ? JSON.parse(tardanzaStr) : [];

    const reportesStr = localStorage.getItem(('trabajadores_reporte_completo_' + this.authService.getUserPrefix()));
    const reportes: any[] = reportesStr ? JSON.parse(reportesStr) : [];
    
    const todayStr = new Date().toISOString().split('T')[0];

    const META_CAJAS_HORA = 12;

    this.todas = this.todas.map(col => {
      col.presente = presentes.includes(col.dni);
      
      // Obtener todos los reportes del trabajador en los últimos 7 días
      const today = new Date();
      const reportesCol = reportes.filter(r => {
        if (r.dni !== col.dni) return false;
        const rDate = new Date(r.fecha);
        const diffTime = Math.abs(today.getTime() - rDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });

      if (reportesCol.length > 0) {
        let sumRendimiento = 0;
        let sumMeta = 0;
        let validDays = 0;

        reportesCol.forEach(rep => {
          if (rep.cajas > 0) {
            const rend = rep.horas > 0 ? (rep.cajas / rep.horas) : 0;
            const esperado = META_CAJAS_HORA * rep.horas;
            const meta = esperado > 0 ? ((rep.cajas - esperado) / esperado) * 100 : 0;
            sumRendimiento += rend;
            sumMeta += meta;
            validDays++;
          } else if (rep.horas > 0) {
            const rend = rep.horas * 1.4;
            const meta = rep.horas >= 8 ? 5 : ((rep.horas - 8) / 8) * 100;
            sumRendimiento += rend;
            sumMeta += meta;
            validDays++;
          }
        });

        if (validDays > 0) {
          col.rendimiento = parseFloat((sumRendimiento / validDays).toFixed(1));
          col.meta = Math.round(sumMeta / validDays);
        } else {
          col.rendimiento = 0;
          col.meta = -100;
        }
      } else {
        col.rendimiento = 0;
        col.meta = -100;
      }
      return col;
    });

    const presentesList = this.todas.filter(c => c.presente);
    this.colaboradoresAusentes    = this.todas.filter(c => !c.presente);
    this.colaboradoresObservacion = this.todas.filter(c => c.enObservacion);
    // Mostrar a TODOS (presentes o no) en las listas de rendimiento
    this.colaboradoresBajo        = this.todas.filter(c => !c.enObservacion && c.rendimiento < 10);
    this.colaboradoresAlto        = this.todas.filter(c => !c.enObservacion && c.rendimiento >= 10);

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

  async toggleAsistencia(colaborador: Colaborador) {
    const presentesStr = localStorage.getItem(('trabajadores_presentes_' + this.authService.getUserPrefix()));
    let presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];
    
    let toastMessage = '';
    let toastColor = '';

    if (colaborador.presente) {
      // Marcar como ausente
      presentes = presentes.filter(dni => dni !== colaborador.dni);

      // Also remove from tardanzas if present
      let tardanzaList = [...this.tardanzas];
      tardanzaList = tardanzaList.filter(dni => dni !== colaborador.dni);
      localStorage.setItem(('trabajadores_tardanza_' + this.authService.getUserPrefix()), JSON.stringify(tardanzaList));

      toastMessage = `${colaborador.nombre} marcado como Ausente.`;
      toastColor = 'medium';
    } else {
      // Marcar como presente
      if (!presentes.includes(colaborador.dni)) {
        presentes.push(colaborador.dni);
      }
      toastMessage = `${colaborador.nombre} marcado como Presente.`;
      toastColor = 'success';
    }
    
    // Actualizar UI inmediatamente sin esperar la animación del Toast
    localStorage.setItem(('trabajadores_presentes_' + this.authService.getUserPrefix()), JSON.stringify(presentes));
    this._cargarDatosDesdeReportes();
    this.cdr.detectChanges(); 

    const toast = await this.toastCtrl.create({
      message: toastMessage,
      duration: 2000,
      position: 'bottom',
      color: toastColor
    });
    toast.present(); // No usamos await aquí para no bloquear
  }

  async marcarTardanza(colaborador: Colaborador) {
    const tardanzaStr = localStorage.getItem(('trabajadores_tardanza_' + this.authService.getUserPrefix()));
    let tardanzaList: string[] = tardanzaStr ? JSON.parse(tardanzaStr) : [];

    if (!tardanzaList.includes(colaborador.dni)) {
      tardanzaList.push(colaborador.dni);
    }

    localStorage.setItem(('trabajadores_tardanza_' + this.authService.getUserPrefix()), JSON.stringify(tardanzaList));
    this._cargarDatosDesdeReportes();
    this.cdr.detectChanges();

    const toast = await this.toastCtrl.create({
      message: `${colaborador.nombre} marcado como Llegó Tarde.`,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  verDetalle(colaborador: Colaborador, tipo: 'bajo' | 'alto' | 'ausente' | 'observacion') {
    this.colaboradorSeleccionado = colaborador;
    this.rendimientoSeleccionado = tipo;
    this.motivoObservacionActual = '';
    this.detalleRendimientoActual = Math.max(0, 100 + colaborador.meta);

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

    const reportStr = localStorage.getItem(('trabajadores_reporte_completo_' + this.authService.getUserPrefix()));
    let allReports: any[] = [];
    if (reportStr) {
      const reports = JSON.parse(reportStr);
      allReports = reports.filter((r: any) => r.dni === colaborador.dni);
    }

    // Sort descending by date
    allReports.sort((a, b) => {
      const d1 = a.fecha ? new Date(a.fecha).getTime() : 0;
      const d2 = b.fecha ? new Date(b.fecha).getTime() : 0;
      return d2 - d1;
    });

    this.detalleHistorial = [];
    const maxItems = Math.min(3, allReports.length);
    for (let i = 0; i < maxItems; i++) {
        const rep = allReports[i];
        if (!rep.fecha) continue; // Skip legacy data without date
        
        let prodStr = '';
        let estado = 'FALTA';
        let metaText = '';
        if (rep.cajas > 0) {
            prodStr = `Produccion: ${rep.cajas} cajas (${rep.horas}h)`;
            const esperado = 12 * rep.horas;
            const metaPct = Math.round(((rep.cajas - esperado) / esperado) * 100);
            estado = rep.yield === 'High' ? 'ALTO' : (rep.yield === 'Low' ? 'BAJO' : 'PROMEDIO');
            metaText = metaPct >= 0 ? `+${metaPct}% vs Meta` : `${metaPct}% vs Meta`;
        } else {
            prodStr = `Horas trabajadas: ${rep.horas}h`;
            estado = rep.yield === 'High' ? 'ALTO' : (rep.yield === 'Low' ? 'BAJO' : 'PROMEDIO');
            const metaPct = rep.horas >= 8 ? 5 : Math.round(((rep.horas - 8) / 8) * 100);
            metaText = metaPct >= 0 ? `+${metaPct}% vs Meta` : `${metaPct}% vs Meta`;
        }
        
        this.detalleHistorial.push({
            fecha: this.formatDate(new Date(rep.fecha + 'T12:00:00')),
            produccion: prodStr,
            estado: estado,
            metaText: metaText
        });
    }

    if (this.detalleHistorial.length === 0) {
       this.detalleHistorial = [{
         fecha: this.formatDate(today),
         produccion: 'Sin actividad registrada',
         estado: tipo === 'ausente' ? 'FALTA' : 'PROMEDIO',
         metaText: tipo === 'ausente' ? 'Ausencia' : 'Sin datos'
       }];
    }

    this.asistenciaDias = [];
    const daysShort = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
    
    // Generar la semana actual (Lunes a Domingo)
    const todayAtNoon = new Date(today.toISOString().split('T')[0] + 'T12:00:00');
    const dayOfWeek = todayAtNoon.getDay(); // 0 is Sunday
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    const monday = new Date(todayAtNoon);
    monday.setDate(monday.getDate() - diffToMonday);

    let presentesCount = 0;
    let pastDaysCount = 0;

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        const dayName = daysShort[d.getDay()];

        let status = 'futuro';
        
        if (d.getTime() <= todayAtNoon.getTime()) {
            pastDaysCount++;
            status = 'ausente';
            
            // Validar si tiene reporte ese día
            const tieneReporte = allReports.some(r => r.fecha === dStr);
            const esHoyPresente = dStr === today.toISOString().split('T')[0] && colaborador.presente;

            if (tieneReporte || esHoyPresente) {
                status = 'presente';
                presentesCount++;
            }
        }

        this.asistenciaDias.push({
            name: dayName,
            status: status
        });
    }

    this.detalleConsistencia = pastDaysCount > 0 ? Math.round((presentesCount / pastDaysCount) * 100) : 100;

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

    const globalTrabajadores = localStorage.getItem('agro_sync_trabajadores');
    if (globalTrabajadores) {
      const parsed = JSON.parse(globalTrabajadores);
      const workerIdx = parsed.findIndex((w: any) => w.dni === this.colaboradorSeleccionado!.dni);
      if (workerIdx !== -1) {
        parsed[workerIdx].enObservacion = this.colaboradorSeleccionado!.enObservacion;
        parsed[workerIdx].motivoObservacion = this.colaboradorSeleccionado!.motivoObservacion;
        localStorage.setItem('agro_sync_trabajadores', JSON.stringify(parsed));
      }
    }
    this._cargarDatosDesdeReportes();

    const queueStr = localStorage.getItem(('sync_queue_' + this.authService.getUserPrefix()));
    const queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push({
      type:    'observacion',
      title:   'Observacion de Rendimiento',
      details: `${this.colaboradorSeleccionado.nombre} (${this.colaboradorSeleccionado.id}) - Motivo: ${motivo}`,
      date:    new Date().toISOString(),
    });
    localStorage.setItem(('sync_queue_' + this.authService.getUserPrefix()), JSON.stringify(queue));

    const toast = await this.toastCtrl.create({
      message: 'Trabajador puesto en observacion. Sincronizacion pendiente.',
      duration: 2500,
      position: 'bottom',
      color: 'warning',
      icon: 'sync-outline',
    });
    await toast.present();
    this.cdr.detectChanges();
    this.volver();
  }

  async quitarObservacion() {
    if (!this.colaboradorSeleccionado) return;

    this.colaboradorSeleccionado.enObservacion = false;
    this.colaboradorSeleccionado.motivoObservacion = '';

    const globalTrabajadores = localStorage.getItem('agro_sync_trabajadores');
    if (globalTrabajadores) {
      const parsed = JSON.parse(globalTrabajadores);
      const workerIdx = parsed.findIndex((w: any) => w.dni === this.colaboradorSeleccionado!.dni);
      if (workerIdx !== -1) {
        parsed[workerIdx].enObservacion = this.colaboradorSeleccionado!.enObservacion;
        parsed[workerIdx].motivoObservacion = this.colaboradorSeleccionado!.motivoObservacion;
        localStorage.setItem('agro_sync_trabajadores', JSON.stringify(parsed));
      }
    }
    this._cargarDatosDesdeReportes();

    const queueStr = localStorage.getItem(('sync_queue_' + this.authService.getUserPrefix()));
    if (queueStr) {
      let queue = JSON.parse(queueStr);
      const searchStr = `${this.colaboradorSeleccionado.nombre} (${this.colaboradorSeleccionado.id})`;
      queue = queue.filter((item: any) => !(item.type === 'observacion' && item.details.startsWith(searchStr)));
      localStorage.setItem(('sync_queue_' + this.authService.getUserPrefix()), JSON.stringify(queue));
    }

    const toast = await this.toastCtrl.create({
      message: 'Observación retirada correctamente.',
      duration: 2500,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
    this.cdr.detectChanges();
    this.volver();
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}
