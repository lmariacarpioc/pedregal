import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonRippleEffect,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  syncOutline,
  chevronForwardOutline,
  peopleOutline,
  clipboardOutline,
  sunnyOutline,
} from 'ionicons/icons';

export interface ParteItem {
  id: number;
  icono: string;
  iconColor: string;
  titulo: string;
  subtitulo: string;
  estado: 'EN CURSO' | 'CERRADO' | 'PENDIENTE';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonContent, IonIcon, IonRippleEffect, DecimalPipe, IonButton],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage {

  supervisor = {
    nombre: 'Natali Rosibelt Alejo Rodriguez',
    cargo: 'Supervisor de Campo',
    turno: 'Mañana',
    ubicacion: 'Sector Central',
    activo: true,
  };

  stats = {
    personalTotal: 0,
    personalNuevos: 0,
    registrados: 0,
  };

  partesHoy: ParteItem[] = [];

  partesAyer: ParteItem[] = [
    {
      id: 999,
      icono: 'fa-clipboard-list',
      iconColor: '#6b7280',
      titulo: 'Inventario - Almacén 4',
      subtitulo: '18:00 PM • 24 items registrados',
      estado: 'CERRADO',
    },
  ];

  ionViewWillEnter() {
    // 1. Cargar Personal Presente
    const presentesStr = localStorage.getItem('trabajadores_presentes');
    if (presentesStr) {
      const presentes = JSON.parse(presentesStr);
      this.stats.personalTotal = presentes.length;
    } else {
      this.stats.personalTotal = 0;
    }

    // 2. Cargar Reportes Resumen
    const reportesStr = localStorage.getItem('reportes_resumen');
    if (reportesStr) {
      const reportes = JSON.parse(reportesStr);
      this.stats.registrados = reportes.length;
      
      this.partesHoy = reportes.map((r: any, index: number) => {
        const esInversion = r.avatar === 'IN';
        const loteTxt = r.id.replace(' (INV)', '').replace(' (PROD)', '').replace('LOTE: ', 'Lote ');
        const valorTxt = (r.manualInput || r.cajas || Math.round(r.rdtoCurrent));
        return {
          id: index,
          icono: esInversion ? 'fa-tractor' : 'fa-box',
          iconColor: esInversion ? '#b3000b' : '#3b82f6',
          titulo: (esInversion ? 'Inversión - ' : 'Producción - ') + loteTxt,
          subtitulo: 'Finalizado • ' + valorTxt + (esInversion ? ' Horas' : ' Cajas'),
          estado: 'CERRADO'
        };
      });
    } else {
      this.stats.registrados = 0;
      this.partesHoy = [];
    }
  }

  constructor(private router: Router) {
    addIcons({ addOutline, syncOutline, chevronForwardOutline, peopleOutline, clipboardOutline, sunnyOutline });
  }

  crearParte() {
    this.router.navigateByUrl('/tabs/reports');
  }

  verTodos() {
    this.router.navigateByUrl('/tabs/reports');
  }

  irSync() {
    this.router.navigateByUrl('/tabs/sync');
  }
}