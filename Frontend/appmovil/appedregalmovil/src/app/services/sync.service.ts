import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom, timeout, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  
  public isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private http: HttpClient, private authService: AuthService) {
    window.addEventListener('online', () => this.updateNetworkStatus(true));
    window.addEventListener('offline', () => this.updateNetworkStatus(false));
  }

  private updateNetworkStatus(isOnline: boolean) {
    this.isOnline$.next(isOnline);
    if (isOnline) {
      // Intentar sincronizar cuando vuelve la conexión
      this.uploadSyncQueue().then(() => this.downloadSyncData());
    }
  }

  async downloadSyncData(): Promise<boolean> {
    if (!navigator.onLine) return false;
    try {
      const data: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/sync/download?dispositivoId=mobile`).pipe(timeout(30000))
      );
      
      if (data) {
        if (data.usuarios) localStorage.setItem('agro_sync_usuarios', JSON.stringify(data.usuarios));
        if (data.trabajadores) localStorage.setItem('agro_sync_trabajadores', JSON.stringify(data.trabajadores));
        if (data.partesDiarios) localStorage.setItem('agro_sync_partes', JSON.stringify(data.partesDiarios));

        if (data.reportes) localStorage.setItem('agro_sync_reportes', JSON.stringify(data.reportes));
        if (data.inversiones) localStorage.setItem('agro_sync_inversiones', JSON.stringify(data.inversiones));
        if (data.produccion) localStorage.setItem('agro_sync_produccion', JSON.stringify(data.produccion));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Download sync error', error);
      return false;
    }
  }

  async uploadSyncQueue(): Promise<boolean> {
    if (!navigator.onLine) return false;
    try {
      const localesRaw = localStorage.getItem(('agro_mobile_partes_locales_' + this.authService.getUserPrefix()));
      const partesLocales = localesRaw ? JSON.parse(localesRaw) : [];

      const queueRaw = localStorage.getItem(('sync_queue_' + this.authService.getUserPrefix()));
      const queueItems = queueRaw ? JSON.parse(queueRaw) : [];

      if (partesLocales.length === 0 && queueItems.length === 0) return true; // Nada que subir

      const payload: any = {
        dispositivoId: 'mobile',
        timestamp: new Date().toISOString(),
        partesDiarios: partesLocales,
        reportes: [],
        inversiones: [],
        produccion: []
      };

      queueItems.forEach((item: any) => {
        if (item.type === 'reporte' || item.type === 'report') {
          payload.reportes.push(item.data);
        } else if (item.type === 'inversion') {
          payload.inversiones.push(item.data);
        } else if (item.type === 'produccion') {
          payload.produccion.push(item.data);
        }
      });

      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/sync/upload`, payload).pipe(timeout(30000))
      );
      
      // Limpiar datos locales después de subirlos con éxito
      localStorage.removeItem(('agro_mobile_partes_locales_' + this.authService.getUserPrefix()));
      localStorage.removeItem(('sync_queue_' + this.authService.getUserPrefix()));
      return true;
    } catch (error) {
      console.error('Upload sync error', error);
      return false;
    }
  }

  // API Local (Offline)

  getLocalTrabajadores() {
    const raw = localStorage.getItem('agro_sync_trabajadores');
    let trabajadores = raw ? JSON.parse(raw) : [];
    
    // Aislamiento de datos: solo retornar trabajadores asignados al jefe logueado
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.syncId) {
      trabajadores = trabajadores.filter((t: any) => t.jefeSyncId === currentUser.syncId);
    }
    
    return trabajadores;
  }

  agregarTrabajadorLocal(trabajador: any) {
    const raw = localStorage.getItem('agro_sync_trabajadores');
    const trabajadores = raw ? JSON.parse(raw) : [];
    
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.syncId) {
      trabajador.jefeSyncId = currentUser.syncId;
    }
    
    trabajadores.push(trabajador);
    localStorage.setItem('agro_sync_trabajadores', JSON.stringify(trabajadores));
  }

  guardarParteLocal(parte: any) {
    const raw = localStorage.getItem(('agro_mobile_partes_locales_' + this.authService.getUserPrefix()));
    const partes = raw ? JSON.parse(raw) : [];
    
    const idx = partes.findIndex((p: any) => p.syncId === parte.syncId);
    if (idx >= 0) {
      partes[idx] = parte;
    } else {
      partes.push(parte);
    }
    
    localStorage.setItem(('agro_mobile_partes_locales_' + this.authService.getUserPrefix()), JSON.stringify(partes));
  }
}
