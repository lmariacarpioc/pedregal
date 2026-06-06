import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonCard, IonCardContent, IonBadge, IonItem, IonLabel, ToastController
} from '@ionic/angular/standalone';

export interface SyncItem {
  type: string;
  title: string;
  details: string;
  date: string;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

@Component({
  selector: 'app-sincronizacion',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonCard, IonCardContent, IonBadge, IonItem, IonLabel
  ],
  templateUrl: './sincronizacion.page.html',
  styleUrls: ['./sincronizacion.page.css'],
})
export class SincronizacionPage {
  pendingRecords: SyncItem[] = [];
  lastSyncDate: Date | null = null;
  isSyncing = false;

  constructor(private toastCtrl: ToastController) {}

  ionViewWillEnter() {
    this.loadQueue();
    const lastSync = localStorage.getItem('last_sync_date');
    if (lastSync) {
      this.lastSyncDate = new Date(lastSync);
    }
  }

  loadQueue() {
    const queueStr = localStorage.getItem('sync_queue');
    if (queueStr) {
      this.pendingRecords = JSON.parse(queueStr);
      this.pendingRecords.forEach(r => {
        if (r.type === 'report') {
          r.icon = 'fas fa-box';
          r.iconColor = '#b91c1c';
          r.iconBg = '#fee2e2';
        } else if (r.type === 'observacion') {
          r.icon = 'fas fa-eye';
          r.iconColor = '#b91c1c';
          r.iconBg = '#fee2e2';
        } else {
          r.icon = 'far fa-file-alt';
          r.iconColor = '#6b7280';
          r.iconBg = '#f3f4f6';
        }
      });
    } else {
      this.pendingRecords = [];
    }
  }

  getTimeAgo() {
    if (!this.lastSyncDate) return 'Nunca';
    const diffMs = new Date().getTime() - this.lastSyncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  }

  async sincronizar() {
    if (this.pendingRecords.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'No hay registros pendientes.',
        duration: 2000,
        position: 'bottom',
        color: 'medium'
      });
      await toast.present();
      return;
    }
    
    this.isSyncing = true;
    
    setTimeout(async () => {
      localStorage.removeItem('sync_queue');
      this.lastSyncDate = new Date();
      localStorage.setItem('last_sync_date', this.lastSyncDate.toISOString());
      this.pendingRecords = [];
      this.isSyncing = false;
      
      const toast = await this.toastCtrl.create({
        message: 'Sincronización completada exitosamente.',
        duration: 3000,
        position: 'bottom',
        color: 'success',
        icon: 'checkmark-circle'
      });
      await toast.present();
    }, 2000);
  }

  borrarRegistro(record: SyncItem, event: Event) {
    event.stopPropagation();
    const index = this.pendingRecords.indexOf(record);
    if (index > -1) {
      this.pendingRecords.splice(index, 1);
      localStorage.setItem('sync_queue', JSON.stringify(this.pendingRecords));
    }
  }
}