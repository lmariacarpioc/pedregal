import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor(private http: HttpClient) {
    const userRaw = localStorage.getItem('agro_mobile_user');
    if (userRaw) {
      this.currentUser = JSON.parse(userRaw);
    }
  }

  async login(username: string, passwordHash: string): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/usuarios/login`, { username, password: passwordHash })
      );
      if (response && response.syncId) {
        this.currentUser = response;
        localStorage.setItem('agro_mobile_user', JSON.stringify(this.currentUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      // Fallback offline login
      const localUsersRaw = localStorage.getItem('agro_sync_usuarios');
      if (localUsersRaw) {
        const users = JSON.parse(localUsersRaw);
        const user = users.find((u: any) => u.username === username && u.passwordHash === passwordHash);
        if (user) {
          this.currentUser = user;
          localStorage.setItem('agro_mobile_user', JSON.stringify(this.currentUser));
          return true;
        }
      }
      return false;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserPrefix(): string {
    return this.currentUser?.username || 'default';
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('agro_mobile_user');
    // Limpiar caché local para aislamiento de datos entre sesiones
    localStorage.removeItem('agro_sync_trabajadores');
    localStorage.removeItem('agro_sync_partes');
    localStorage.removeItem('agro_sync_reportes');
  }
}
