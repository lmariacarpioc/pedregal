import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UsuarioDTO {
  id: number;
  syncId: string;
  username: string;
  email: string;
  nombreCompleto: string;
  rol: string;
  activo: boolean;
  jefeId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/usuarios`;
  private currentUserKey = 'agro_current_user';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): UsuarioDTO | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
