import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private http: HttpClient) {}

  async downloadSyncData(): Promise<boolean> {
    try {
      const data: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/sync/download?dispositivoId=mobile`));
      
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
    try {
      const localesRaw = localStorage.getItem('agro_mobile_partes_locales');
      const partesLocales = localesRaw ? JSON.parse(localesRaw) : [];

      const queueRaw = localStorage.getItem('sync_queue');
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

      await firstValueFrom(this.http.post(`${environment.apiUrl}/sync/upload`, payload));
      
      // Limpiar datos locales después de subirlos con éxito
      localStorage.removeItem('agro_mobile_partes_locales');
      localStorage.removeItem('sync_queue');
      return true;
    } catch (error) {
      console.error('Upload sync error', error);
      return false;
    }
  }

  // API Local (Offline)

  getLocalTrabajadores() {
    const raw = localStorage.getItem('agro_sync_trabajadores');
    return raw ? JSON.parse(raw) : [];
  }

  guardarParteLocal(parte: any) {
    const raw = localStorage.getItem('agro_mobile_partes_locales');
    const partes = raw ? JSON.parse(raw) : [];
    
    const idx = partes.findIndex((p: any) => p.syncId === parte.syncId);
    if (idx >= 0) {
      partes[idx] = parte;
    } else {
      partes.push(parte);
    }
    
    localStorage.setItem('agro_mobile_partes_locales', JSON.stringify(partes));
  }
}
