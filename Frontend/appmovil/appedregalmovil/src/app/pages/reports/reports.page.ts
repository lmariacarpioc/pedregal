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
  motivoModal = ''; // Motivo de adición extraordinaria de personal

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
    this.motivoModal = '';
  }

  guardarNuevoTrabajador() {
    if (!this.nuevoDniModal || !this.nuevoNombreModal) return;

    const dniStr = this.nuevoDniModal.toString();
    const motivo = this.motivoModal.trim() || 'Sin motivo especificado';

    if (this.wizardType === 'inversion') {
      this.trabajadores.push({
        dni: dniStr,
        nombre: this.nuevoNombreModal.toUpperCase(),
        horas: 8,
        rend: 'MED',
        tipo: 'Extra',
        motivo: motivo
      });
    } else {
      this.trabajadoresProd.push({
        dni: dniStr,
        nombre: this.nuevoNombreModal.toUpperCase(),
        cajas: 0,
        horas: 8.0
      });
    }

    // Encolar en sync_queue para que quede trazabilidad del agregado extraordinario
    const syncRaw = localStorage.getItem('sync_queue');
    const syncQueue = syncRaw ? JSON.parse(syncRaw) : [];
    syncQueue.push({
      type:    'personal_extra',
      title:   'Personal Añadido Manualmente',
      details: `${this.nuevoNombreModal.toUpperCase()} (DNI: ${dniStr}) — Motivo: ${motivo}`,
      date:    new Date().toISOString(),
    });
    localStorage.setItem('sync_queue', JSON.stringify(syncQueue));

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

    // ── 1. Construir lista de DNIs según tipo ─────────────────────────────
    const dnis = this.wizardType === 'inversion'
      ? this.trabajadores.map(t => t.dni)
      : this.trabajadoresProd.map(t => t.dni);

    // ── 2. Actualizar reporte completo para Staff ──────────────────────────
    const fullReportStr = localStorage.getItem('trabajadores_reporte_completo');
    let fullReportForStaff: any[] = fullReportStr ? JSON.parse(fullReportStr) : [];
    // Remover entradas anteriores del mismo DNI para actualizar
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
          expanded: false,
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
          expanded: false,
        });
      });
    }
    localStorage.setItem('trabajadores_reporte_completo', JSON.stringify(fullReportForStaff));

    // ── 3. Agregar resumen único al listado de Reportes ────────────────────
    if (!this.reportesList) this.reportesList = [];
    const uniqueId = `${this.lote || 'General'}-${this.wizardType === 'inversion' ? 'INV' : 'PROD'}-${Date.now()}`;

    if (this.wizardType === 'inversion') {
      const totalHoras = this.trabajadores.reduce((acc, curr) => acc + curr.horas, 0);
      this.reportesList.push({
        id: uniqueId,
        nombre: 'Resumen Inversión',
        rdtoCurrent: totalHoras,
        manualInput: 0,
        yield: 'Average',
        avatarType: 'text',
        avatar: 'IN',
        actividad: this.etapa,
        lote: this.lote,
        horas: totalHoras,
        cajas: 0,
        trabajadores: dnis.length,
        expanded: false,
      });
    } else {
      const totalCajas = this.getTotalCajas();
      const totalHoras = this.trabajadoresProd.reduce((acc, curr) => acc + curr.horas, 0);
      this.reportesList.push({
        id: uniqueId,
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
        trabajadores: dnis.length,
        expanded: false,
      });
    }
    localStorage.setItem('reportes_resumen', JSON.stringify(this.reportesList));

    // ── 4. Guardar DNIs presentes para Staff ──────────────────────────────
    const presentesStr = localStorage.getItem('trabajadores_presentes');
    let presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];
    dnis.forEach(d => { if (!presentes.includes(d)) presentes.push(d); });
    localStorage.setItem('trabajadores_presentes', JSON.stringify(presentes));

    // ── 5. Encolar en sync_queue ───────────────────────────────────────────
    const currentQueueStr = localStorage.getItem('sync_queue');
    let currentQueue = currentQueueStr ? JSON.parse(currentQueueStr) : [];
    currentQueue.push({
      type:    'report',
      title:   'Reporte Diario - ' + (this.wizardType === 'inversion' ? 'Inversión' : 'Producción'),
      details: `Lote: ${this.lote || 'General'} • ${dnis.length} trabajadores`,
      date:    new Date().toISOString(),
    });
    localStorage.setItem('sync_queue', JSON.stringify(currentQueue));

    // ── 6. Cambiar vista INMEDIATAMENTE (evita doble clic) ─────────────────
    this.currentStep = 1;
    this.activeTab = 'reportes';

    // ── 7. Toast informativo (ya no bloquea la navegación) ─────────────────
    const toast = await this.toastCtrl.create({
      message: 'Reporte guardado. Sincronización pendiente.',
      duration: 2500,
      position: 'bottom',
      color: 'warning',
      icon: 'sync-outline',
    });
    toast.present(); // No hacemos await para no bloquear UI

    setTimeout(() => { this.isSubmitting = false; }, 800);
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}