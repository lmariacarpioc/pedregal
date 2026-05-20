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
    personalTotal: 42,
    personalNuevos: 2,
    registrados: 3,
  };

  partesHoy: ParteItem[] = [
    {
      id: 1,
      icono: 'fa-tractor',
      iconColor: '#b3000b',
      titulo: 'Cosecha - Lote 12',
      subtitulo: 'Iniciado: 07:15 AM',
      estado: 'EN CURSO',
    },
    {
      id: 2,
      icono: 'fa-droplet',
      iconColor: '#3b82f6',
      titulo: 'Riego - Sector Norte',
      subtitulo: 'Finalizado: 11:30 AM',
      estado: 'CERRADO',
    },
  ];

  partesAyer: ParteItem[] = [
    {
      id: 3,
      icono: 'fa-clipboard-list',
      iconColor: '#6b7280',
      titulo: 'Inventario - Almacén 4',
      subtitulo: '18:00 PM • 24 items registrados',
      estado: 'CERRADO',
    },
  ];

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