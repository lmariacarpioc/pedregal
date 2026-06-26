import { Component, OnInit } from '@angular/core';
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

import { AuthService } from '../../services/auth.service';

import { SyncService } from '../../services/sync.service';

export interface ParteItem {
  id: number | string;
  icono: string;
  iconColor: string;
  titulo: string;
  subtitulo: string;
  estado: 'EN CURSO' | 'CERRADO' | 'PENDIENTE';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonContent, IonIcon, IonRippleEffect, IonButton],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage implements OnInit {

  supervisor = {
    nombre: 'Supervisor de Campo',
    cargo: 'Supervisor de Campo',
    turno: 'Mañana',
    ubicacion: 'Sector Central',
    activo: true,
  };

  stats = {
    personalTotal: 0,
    personalNuevos: 0,
    registrados: 0,
    totalAsignados: 0
  };

  partesHoy: ParteItem[] = [];
  partesAyer: ParteItem[] = [];

  constructor(private router: Router, private authService: AuthService, private syncService: SyncService) {
    addIcons({ addOutline, syncOutline, chevronForwardOutline, peopleOutline, clipboardOutline, sunnyOutline });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.supervisor.nombre = user.nombre || user.username || 'Supervisor';
    }
  }

  ionViewWillEnter() {
    // 1. Cargar Personal Presente
    const presentesStr = localStorage.getItem('trabajadores_presentes_' + this.authService.getUserPrefix());
    const presentes: string[] = presentesStr ? JSON.parse(presentesStr) : [];
    
    // 2. Cargar Total Asignados de la plantilla
    const todas = this.syncService.getLocalTrabajadores();
    let totalAsignados = todas ? todas.length : 0;

    // 3. Cargar Reportes Resumen
    const reportesStr = localStorage.getItem('reportes_resumen_' + this.authService.getUserPrefix());
    this.partesHoy = [];
    this.partesAyer = [];
    let registrados = 0;

    if (reportesStr) {
      const reportes = JSON.parse(reportesStr);
      registrados = reportes.length;
      
      reportes.forEach((r: any, index: number) => {
        const esInversion = r.avatar === 'IN';
        const loteTxt = (r.id && typeof r.id === 'string') ? r.id.replace(' (INV)', '').replace(' (PROD)', '').replace('LOTE: ', 'Lote ') : 'Reporte';
        const valorTxt = (r.manualInput || r.cajas || Math.round(r.rdtoCurrent));
        
        const item: ParteItem = {
          id: index,
          icono: esInversion ? 'fa-tractor' : 'fa-box',
          iconColor: esInversion ? '#b3000b' : '#3b82f6',
          titulo: (esInversion ? 'Inversión - ' : 'Producción - ') + r.lote,
          subtitulo: 'Finalizado • ' + valorTxt + (esInversion ? ' Horas' : ' Cajas'),
          estado: 'CERRADO'
        };

        // Asumimos que los reportes con timestamp antiguo (ej. de ayer) van a ayer.
        // Si no podemos determinar, los primeros en la lista invertida podrían ser "hoy".
        // Para simplificar, mostramos el último como 'Hoy' y el penúltimo como 'Ayer' si hay varios,
        // o si guardamos la fecha, usamos la fecha. 
        // Ya que reportes_resumen no guarda fecha directamente, mostraremos todos como "Hoy" a menos que sean muy antiguos.
        this.partesHoy.push(item);
      });
      // Para simular "Ayer", si hay más de 1, movemos el primero al "Ayer"
      if (this.partesHoy.length > 1) {
        const oldItem = this.partesHoy.shift();
        if (oldItem) this.partesAyer.push(oldItem);
      }
      this.partesHoy.reverse(); // Mostrar más recientes arriba
    }

    this.stats = {
      personalTotal: presentes.length,
      personalNuevos: 0,
      registrados: registrados,
      totalAsignados: totalAsignados
    };
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
