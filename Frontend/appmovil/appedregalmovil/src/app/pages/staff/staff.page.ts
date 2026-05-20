import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { syncOutline, menuOutline } from 'ionicons/icons';

export interface Colaborador {
  id: string;
  nombre: string;
  rendimiento: number;
  meta: number;
  avatarColor: string;
  avatarIcon: string;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [IonContent, IonRippleEffect],
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.css'],
})
export class StaffPage {

  rendimientoPromedio = 14.2;
  atencionRequerida   = 8;

  colaboradoresBajo: Colaborador[] = [
    { id: '#88294', nombre: 'Juan Pérez',   rendimiento: 8.2,  meta: -24, avatarColor: '#ef4444', avatarIcon: 'fa-hard-hat' },
    { id: '#88312', nombre: 'Elena Rivas',  rendimiento: 9.5,  meta: -12, avatarColor: '#f97316', avatarIcon: 'fa-hard-hat' },
  ];

  colaboradoresAlto: Colaborador[] = [
    { id: '#88102', nombre: 'Marcos Solís',   rendimiento: 18.4, meta: 45, avatarColor: '#6b7280', avatarIcon: 'fa-hard-hat' },
    { id: '#88095', nombre: 'Lucia Mendez',   rendimiento: 16.8, meta: 32, avatarColor: '#6b7280', avatarIcon: 'fa-hard-hat' },
  ];

  constructor(private router: Router) {
    addIcons({ syncOutline, menuOutline });
  }

  intervenir(colaborador: Colaborador) {
    console.log('Intervenir:', colaborador.nombre);
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}