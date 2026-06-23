import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IUsuarioBackend {
  id?: number;
  username: string;
  passwordHash: string;
  nombreCompleto: string;
  rol: string;
  email: string;
  activo: boolean;
  syncId?: string;
  jefe?: { id: number };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IUsuarioBackend[]> {
    return this.http.get<IUsuarioBackend[]>(this.baseUrl);
  }

  getById(id: number): Observable<IUsuarioBackend> {
    return this.http.get<IUsuarioBackend>(`${this.baseUrl}/${id}`);
  }

  create(usuario: IUsuarioBackend): Observable<IUsuarioBackend> {
    return this.http.post<IUsuarioBackend>(this.baseUrl, usuario);
  }

  update(id: number, usuario: IUsuarioBackend): Observable<IUsuarioBackend> {
    return this.http.put<IUsuarioBackend>(`${this.baseUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
