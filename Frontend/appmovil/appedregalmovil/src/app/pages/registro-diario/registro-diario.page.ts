import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  timeOutline,
  syncOutline,
  calendarOutline,
  refreshOutline,
  arrowBackOutline,
  listOutline,
} from 'ionicons/icons';

export interface RegistroAsistencia {
  usuarioId: string;
  nombreUsuario: string;
  fecha: string;       // YYYY-MM-DD
  hora: string;        // "HH:MM AM/PM"
  timestamp: number;   // epoch ms para filtrar
}

@Component({
  selector: 'app-registro-diario',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonRippleEffect, FormsModule, CommonModule],
  templateUrl: './registro-diario.page.html',
  styleUrls: ['./registro-diario.page.css'],
})
export class RegistroDiarioPage implements OnInit {

  fechaRegistro = signal('');
  horaIngreso   = signal('');

  /** Controla si se muestra la vista de historial o la de registro */
  mostrarHistorial = false;

  /** Lista filtrada de últimos 3 días del usuario actual */
  historialFiltrado: RegistroAsistencia[] = [];

  /** Usuario activo (guardado por el login en localStorage) */
  private usuarioActivo: { id: string; nombre: string } = { id: 'guest', nombre: 'Usuario' };

  constructor(private router: Router) {
    addIcons({
      arrowForwardOutline, timeOutline, syncOutline,
      calendarOutline, refreshOutline, arrowBackOutline, listOutline,
    });
  }

  ngOnInit() {
    // Cargar usuario activo desde localStorage
    const userStr = localStorage.getItem('usuario_activo');
    if (userStr) {
      try { this.usuarioActivo = JSON.parse(userStr); } catch {}
    }
    this._actualizarFechaHora();
  }

  private _actualizarFechaHora() {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    this.fechaRegistro.set(fecha.charAt(0).toUpperCase() + fecha.slice(1));
    const hora = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    this.horaIngreso.set(hora);
  }

  /**
   * Completa el registro de asistencia:
   * 1. Guarda en historial local (max 3 días)
   * 2. Encola en sync_queue
   * 3. Navega al dashboard
   */
  continuar() {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];

    const clave = 'asistencia_historial';
    const raw = localStorage.getItem(clave);
    const lista: RegistroAsistencia[] = raw ? JSON.parse(raw) : [];

    const yaRegistrado = lista.some(r => r.usuarioId === this.usuarioActivo.id && r.fecha === fechaActual);

    if (!yaRegistrado) {
      const registro: RegistroAsistencia = {
        usuarioId:    this.usuarioActivo.id,
        nombreUsuario: this.usuarioActivo.nombre,
        fecha: fechaActual,
        hora:  this.horaIngreso(),
        timestamp: now.getTime(),
      };
      this._guardarEnHistorial(registro);
      this._encolarEnSync(registro);
    }

    this.router.navigateByUrl('/tabs/dashboard');
  }

  /** Muestra la vista del historial de los últimos 3 días */
  verHistorial() {
    this._cargarHistorial();
    this.mostrarHistorial = true;
  }

  /** Regresa a la vista principal de registro */
  regresarAlRegistro() {
    this.mostrarHistorial = false;
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private _guardarEnHistorial(registro: RegistroAsistencia) {
    const clave = 'asistencia_historial';
    const raw = localStorage.getItem(clave);
    let lista: RegistroAsistencia[] = raw ? JSON.parse(raw) : [];

    const tresDiasMs = 3 * 24 * 60 * 60 * 1000;
    const ahora = Date.now();

    // Eliminar registros más viejos de 3 días
    lista = lista.filter(r => (ahora - r.timestamp) <= tresDiasMs);

    // Evitar duplicado del mismo usuario en el mismo día
    lista = lista.filter(
      r => !(r.usuarioId === registro.usuarioId && r.fecha === registro.fecha)
    );

    lista.push(registro);
    localStorage.setItem(clave, JSON.stringify(lista));
  }

  private _cargarHistorial() {
    const clave = 'asistencia_historial';
    const raw = localStorage.getItem(clave);
    if (!raw) { this.historialFiltrado = []; return; }

    const lista: RegistroAsistencia[] = JSON.parse(raw);
    const tresDiasMs = 3 * 24 * 60 * 60 * 1000;
    const ahora = Date.now();

    this.historialFiltrado = lista
      .filter(r => r.usuarioId === this.usuarioActivo.id && (ahora - r.timestamp) <= tresDiasMs)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  }

  private _encolarEnSync(registro: RegistroAsistencia) {
    const clave = 'sync_queue';
    const raw = localStorage.getItem(clave);
    let cola = raw ? JSON.parse(raw) : [];

    cola.push({
      type:    'asistencia',
      title:   'Registro de Asistencia',
      details: `${registro.nombreUsuario} — ${registro.fecha} a las ${registro.hora}`,
      date:    new Date().toISOString(),
    });

    localStorage.setItem(clave, JSON.stringify(cola));
  }

  /** Solo permite navegar al sync desde el header (ícono de arriba) */
  irA(tab: string) {
    if (tab === 'sync') {
      this.router.navigateByUrl('/tabs/sync');
    }
    // Las demás pestañas quedan bloqueadas hasta presionar "Continuar"
  }
}
