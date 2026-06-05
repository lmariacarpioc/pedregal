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

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonButton, IonIcon, FormsModule],
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
    { dni: '45829301', nombre: 'Mendoza Torres, Juan Carlos', horas: 8, rend: 'ALTO', tipo: 'Normal' },
    { dni: '70192834', nombre: 'Quispe Huamán, Elena Luz', horas: 8, rend: 'MED', tipo: 'Normal' },
    { dni: '41029384', nombre: 'Salazar Rojas, Roberto', horas: 6, rend: 'BAJO', tipo: 'Extra' }
  ];

  // ── Producción Wizard fields ───────────────────────────────
  nuevoDniProd = '';
  trabajadoresProd = [
    { dni: '45678901', nombre: 'JUAN PEREZ CASTILLO', cajas: 12, horas: 8.5 },
    { dni: '72345678', nombre: 'MARIA GONZALES RUIZ', cajas: 15, horas: 8.0 },
    { dni: '12987654', nombre: 'CARLOS LUNA DIAZ', cajas: 0, horas: 8.0 }
  ];

  // ── Reportes fields ───────────────────────────────
  reportesList = [
    { id: 'PR-4492', nombre: 'Ricardo Mendoza', rdtoCurrent: 42.5, manualInput: 0.0, yield: 'High', avatarType: 'img', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'PR-8821', nombre: 'Elena Vasquez', rdtoCurrent: 38.2, manualInput: 38.2, yield: 'Average', avatarType: 'img', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'PR-1102', nombre: 'Jorge Pineda', rdtoCurrent: 33.9, manualInput: 0.0, yield: 'Low', avatarType: 'text', avatar: 'JP' }
  ];

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

  async finalizarRegistro() {
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
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}