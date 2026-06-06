import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  syncOutline,
  peopleOutline,
  statsChartOutline,
  starOutline,
  star,
} from 'ionicons/icons';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, FormsModule],
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.css'],
})
export class ReportsPage {

  currentStep = 1;
  wizardType: 'inversion' | 'produccion' = 'inversion';

  activeTab: 'inversion' | 'produccion' | 'reportes' = 'inversion';

  // ── Inversión fields ────────────────────────────────
  campania    = '2023-2024';
  cultivo     = 'Uva de Mesa';
  fundo       = 'Fundo Los Olivos';
  lote        = 'Lote 01-A';
  etapa       = 'Cosecha';
  proceso     = 'Selección y Empaque';

  // ── Producción fields ───────────────────────────────
  cajas       = 0;
  tipoEmpaque = '';
  calidadFruta: 'CAT1' | 'CAT2' = 'CAT1';

  // ── Personal fields (Inversión) ───────────────────────────────
  nuevoDni = '';
  trabajadores = [
    { dni: '45829301', nombre: 'Mendoza Torres, Juan Carlos', horas: 8, rend: 'ALTO', tipo: 'Normal', motivo: 'Normal' },
    { dni: '70192834', nombre: 'Quispe Huamán, Elena Luz', horas: 8, rend: 'MED', tipo: 'Normal', motivo: 'Normal' },
    { dni: '41029384', nombre: 'Salazar Rojas, Roberto', horas: 6, rend: 'BAJO', tipo: 'Extra', motivo: 'Falta de Material' }
  ];

  // ── Producción Wizard fields ───────────────────────────────
  nuevoDniProd = '';
  trabajadoresProd = [
    { dni: '45678901', nombre: 'JUAN PEREZ CASTILLO', cajas: 12, horas: 8.5 },
    { dni: '72345678', nombre: 'MARIA GONZALES RUIZ', cajas: 15, horas: 8.0 },
    { dni: '12987654', nombre: 'CARLOS LUNA DIAZ', cajas: 0, horas: 8.0 }
  ];

  // ── Reportes fields ───────────────────────────────
  reportesList: any[] = [];

  // ── Modal fields ───────────────────────────────
  mostrarModalTrabajador = false;
  nuevoDniModal = '';
  nuevoNombreModal = '';

  constructor(private router: Router, private toastCtrl: ToastController) {
    addIcons({ arrowForwardOutline, syncOutline, peopleOutline, statsChartOutline, starOutline, star });
  }

  setTab(tab: 'inversion' | 'produccion' | 'reportes') {
    this.activeTab = tab;
  }

  setCalidad(cat: 'CAT1' | 'CAT2') {
    this.calidadFruta = cat;
  }

  continuar() {
    this.wizardType = this.activeTab === 'produccion' ? 'produccion' : 'inversion';
    this.currentStep = 2;
  }

  regresarPaso1() {
    this.currentStep = 1;
  }

  continuarResumen() {
    this.currentStep = 3;
  }

  regresarPaso2() {
    this.currentStep = 2;
  }

  eliminarTrabajador(dni: string) {
    this.trabajadores = this.trabajadores.filter(t => t.dni !== dni);
  }

  eliminarTrabajadorProd(dni: string) {
    this.trabajadoresProd = this.trabajadoresProd.filter(t => t.dni !== dni);
  }

  getTotalCajas() {
    return this.trabajadoresProd.reduce((acc, curr) => acc + curr.cajas, 0);
  }

  abrirModalTrabajador() {
    this.mostrarModalTrabajador = true;
  }

  cerrarModalTrabajador() {
    this.mostrarModalTrabajador = false;
    this.nuevoDniModal = '';
    this.nuevoNombreModal = '';
  }

  guardarNuevoTrabajador() {
    if (!this.nuevoDniModal || !this.nuevoNombreModal) return;
    
    const dniStr = this.nuevoDniModal.toString();

    if (this.wizardType === 'inversion') {
      this.trabajadores.push({
        dni: dniStr,
        nombre: this.nuevoNombreModal.toUpperCase(),
        horas: 8,
        rend: 'MED',
        tipo: 'Normal',
        motivo: 'Normal'
      });
    } else {
      this.trabajadoresProd.push({
        dni: dniStr,
        nombre: this.nuevoNombreModal.toUpperCase(),
        cajas: 0,
        horas: 8.0
      });
    }
    this.cerrarModalTrabajador();
  }

  toggleExpand(rep: any) {
    rep.expanded = !rep.expanded;
  }

  deleteReporte(rep: any, event: Event) {
    event.stopPropagation();
    this.reportesList = this.reportesList.filter((r: any) => r.id !== rep.id);
    localStorage.setItem('reportes_resumen', JSON.stringify(this.reportesList));
  }

  ionViewWillEnter() {
    const list = localStorage.getItem('reportes_resumen');
    if (list) {
      this.reportesList = JSON.parse(list);
    }
  }

  isSubmitting = false;

  async finalizarRegistro() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // 1. Guardar reporte completo para Staff (Individual)
    const fullReportStr = localStorage.getItem('trabajadores_reporte_completo');
    let fullReportForStaff: any[] = fullReportStr ? JSON.parse(fullReportStr) : [];
    
    // Remover duplicados (si el trabajador ya estaba, lo actualizamos)
    const dnis = this.wizardType === 'inversion' 
                 ? this.trabajadores.map(t => t.dni) 
                 : this.trabajadoresProd.map(t => t.dni);
                 
    fullReportForStaff = fullReportForStaff.filter(r => !dnis.includes(r.dni));

    if (this.wizardType === 'inversion') {
      this.trabajadores.forEach(t => {
        fullReportForStaff.push({
          id: 'IN-' + t.dni.toString().substring(0, 4),
          dni: t.dni,
          nombre: t.nombre,
          rdtoCurrent: t.horas,
          manualInput: 0,
          yield: t.rend === 'ALTO' ? 'High' : t.rend === 'BAJO' ? 'Low' : 'Average',
          avatarType: 'text',
          avatar: t.nombre.substring(0, 2).toUpperCase(),
          actividad: this.etapa,
          lote: this.lote,
          horas: t.horas,
          cajas: 0,
          expanded: false
        });
      });
    } else {
      this.trabajadoresProd.forEach(t => {
        const yieldVal = t.cajas >= 15 ? 'High' : t.cajas < 8 ? 'Low' : 'Average';
        fullReportForStaff.push({
          id: 'PR-' + t.dni.toString().substring(0, 4),
          dni: t.dni,
          nombre: t.nombre,
          rdtoCurrent: t.cajas,
          manualInput: t.cajas,
          yield: yieldVal,
          avatarType: 'text',
          avatar: t.nombre.substring(0, 2).toUpperCase(),
          actividad: 'Cosecha ' + this.calidadFruta,
          lote: this.lote,
          horas: t.horas,
          cajas: t.cajas,
          expanded: false
        });
      });
    }
    localStorage.setItem('trabajadores_reporte_completo', JSON.stringify(fullReportForStaff));

    // 2. Poblar tab de reportes con un Resumen General (Agrupado por Lote)
    if (!this.reportesList) this.reportesList = [];
    
    // Generar ID único usando timestamp para evitar sobreescribir reportes del mismo lote
    const uniqueId = 'LOTE: ' + (this.lote || 'General') + (this.wizardType === 'inversion' ? ' (INV)' : ' (PROD)') + ' - ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Ya no filtramos por ID, permitimos múltiples reportes
    if (this.wizardType === 'inversion') {
      const totalHoras = this.trabajadores.reduce((acc, curr) => acc + curr.horas, 0);
      this.reportesList.push({
        id: uniqueId,
        dni: '',
        nombre: 'Resumen Inversión',
        rdtoCurrent: totalHoras, // No se usa en la UI actualizada, pero por si acaso
        manualInput: 0,
        yield: 'Average',
        avatarType: 'text',
        avatar: 'IN',
        actividad: this.etapa,
        lote: this.lote,
        horas: totalHoras,
        cajas: 0,
        expanded: false
      });
    } else {
      const totalCajas = this.getTotalCajas();
      const totalHoras = this.trabajadoresProd.reduce((acc, curr) => acc + curr.horas, 0);
      this.reportesList.push({
        id: uniqueId,
        dni: '',
        nombre: 'Resumen Producción',
        rdtoCurrent: totalCajas,
        manualInput: totalCajas,
        yield: 'High',
        avatarType: 'text',
        avatar: 'PR',
        actividad: 'Cosecha ' + this.calidadFruta,
        lote: this.lote,
        horas: totalHoras,
        cajas: totalCajas,
        expanded: false
      });
    }
    localStorage.setItem('reportes_resumen', JSON.stringify(this.reportesList));

    // 3. Guardar trabajadores presentes en localStorage para que la vista Staff los lea
    const presentesStr = localStorage.getItem('trabajadores_presentes');
    let presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];
    dnis.forEach(d => { if (!presentes.includes(d)) presentes.push(d); });
    localStorage.setItem('trabajadores_presentes', JSON.stringify(presentes));

    // 4. Agregar a la cola de sincronización
    const currentQueueStr = localStorage.getItem('sync_queue');
    let currentQueue = currentQueueStr ? JSON.parse(currentQueueStr) : [];
    
    const syncTitle = 'Reporte Diario - ' + (this.wizardType === 'inversion' ? 'Inversión' : 'Producción');

    currentQueue.push({
      type: 'report',
      title: syncTitle,
      details: 'Lote: ' + (this.lote || 'General') + ' • ' + dnis.length + ' trabajadores',
      date: new Date().toISOString()
    });
    localStorage.setItem('sync_queue', JSON.stringify(currentQueue));

    const toast = await this.toastCtrl.create({
      message: 'Registro guardado. Sincronización pendiente...',
      duration: 3000,
      position: 'bottom',
      color: 'warning',
      icon: 'sync-outline'
    });
    await toast.present();
    this.currentStep = 1; // Devolver a la vista principal
    this.activeTab = 'reportes'; // Ir a la pestaña de reportes
    setTimeout(() => {
      this.isSubmitting = false;
    }, 1000);
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}