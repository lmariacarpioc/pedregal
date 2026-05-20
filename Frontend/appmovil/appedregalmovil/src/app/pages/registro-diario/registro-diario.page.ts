import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
} from 'ionicons/icons';

@Component({
  selector: 'app-registro-diario',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonRippleEffect, FormsModule],
  templateUrl: './registro-diario.page.html',
  styleUrls: ['./registro-diario.page.css'],
})
export class RegistroDiarioPage implements OnInit {

  fechaRegistro = signal('');
  horaIngreso   = signal('');

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline, timeOutline, syncOutline, calendarOutline, refreshOutline });
  }

  ngOnInit() {
    // Fecha y hora actuales
    const now = new Date();

    // Fecha en español: "24 Octubre, 2023"
    const fecha = now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    // Capitalizar primer letra del mes
    this.fechaRegistro.set(
      fecha.charAt(0).toUpperCase() + fecha.slice(1)
    );

    // Hora en formato 12h: "06:45 AM"
    const hora = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    this.horaIngreso.set(hora);
  }

  continuar() {
    this.router.navigateByUrl('/tabs/dashboard');
  }

  verHistorial() {
    console.log('Ver historial de hoy');
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}
