import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonBadge, IonList, IonItem, IonLabel, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-sincronizacion',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonBadge, IonList, IonItem, IonLabel, IonNote
  ],
  templateUrl: './sincronizacion.page.html',
  styleUrls: ['./sincronizacion.page.css'],
})
export class SincronizacionPage {
  pendingRecords = [
    {
      title: 'Cosecha - Lote 12',
      details: '24 Oct, 09:15 AM • 150kg',
      icon: 'fas fa-box',
      iconColor: '#b91c1c',
      iconBg: '#fee2e2'
    },
    {
      title: 'Asistencia - 24 Oct',
      details: 'Turno Mañana • 12 Staff',
      icon: 'fas fa-map-marker-alt',
      iconColor: '#b91c1c',
      iconBg: '#fee2e2'
    },
    {
      title: 'Riego - Sector Sur',
      details: 'Finalizado • 2.5 hrs',
      icon: 'fas fa-tint',
      iconColor: '#b91c1c',
      iconBg: '#fee2e2'
    },
    {
      title: 'Reporte Diario Semanal',
      details: 'Generado automáticamente',
      icon: 'far fa-file-alt',
      iconColor: '#6b7280',
      iconBg: '#f3f4f6'
    }
  ];
}