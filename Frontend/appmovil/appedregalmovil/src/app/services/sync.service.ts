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
        return true;
      }
      return false;
    } catch (error) {
      console.error('Download sync error', error);
      return false;
    }
  }

  async uploadPartesDiarios(): Promise<boolean> {
    try {
      const localesRaw = localStorage.getItem('agro_mobile_partes_locales');
      if (!localesRaw) return true; // Nada que subir
      
      const partesLocales = JSON.parse(localesRaw);
      if (partesLocales.length === 0) return true;

      const payload = {
        dispositivoId: 'mobile',
        timestamp: new Date().toISOString(),
        partesDiarios: partesLocales
      };

      await firstValueFrom(this.http.post(`${environment.apiUrl}/sync/upload`, payload));
      
      // Limpiar partes locales después de subirlos con éxito
      localStorage.removeItem('agro_mobile_partes_locales');
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
