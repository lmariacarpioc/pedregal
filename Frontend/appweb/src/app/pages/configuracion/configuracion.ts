import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  usuarios: any[] = [];
  cargando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  nuevoUsuario = {
    nombre: '',
    email: '',
    rol: '',
    username: '',
    password: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.http.get<any[]>(`${this.apiUrl}/usuarios`).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.mensajeError = 'Error al cargar la lista de usuarios.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearCuenta(): void {
    if (!this.nuevoUsuario.nombre.trim() || !this.nuevoUsuario.email.trim() ||
        !this.nuevoUsuario.username.trim() || !this.nuevoUsuario.password.trim()) {
      this.mensajeError = 'Todos los campos obligatorios deben estar completos.';
      return;
    }

    const body = {
      username: this.nuevoUsuario.username,
      passwordHash: this.nuevoUsuario.password,
      nombreCompleto: this.nuevoUsuario.nombre,
      rol: this.nuevoUsuario.rol || 'SUPERVISOR',
      email: this.nuevoUsuario.email,
      activo: true,
      syncId: 'web-' + Date.now()
    };

    this.cargando = true;
    this.mensajeError = '';

    this.http.post(`${this.apiUrl}/usuarios`, body).subscribe({
      next: () => {
        this.mostrarNotificacion('Usuario creado exitosamente.');
        this.cargarUsuarios();
        this.nuevoUsuario = {
          nombre: '',
          email: '',
          rol: '',
          username: '',
          password: ''
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.mensajeError = 'Error al crear el usuario. Intente de nuevo.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleUsuarioActivo(usuario: any): void {
    const body = { ...usuario, activo: !usuario.activo };

    this.http.put(`${this.apiUrl}/usuarios/${usuario.id}`, body).subscribe({
      next: () => {
        usuario.activo = !usuario.activo;
        this.mostrarNotificacion(
          `Usuario ${usuario.nombreCompleto || usuario.username} ${usuario.activo ? 'activado' : 'desactivado'}.`
        );
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.mensajeError = 'Error al actualizar el estado del usuario.';
      }
    });
  }

  eliminarUsuario(id: number): void {
    this.http.delete(`${this.apiUrl}/usuarios/${id}`).subscribe({
      next: () => {
        this.mostrarNotificacion('Usuario eliminado exitosamente.');
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.mensajeError = 'Error al eliminar el usuario.';
      }
    });
  }

  mostrarNotificacion(msg: string): void {
    this.mensajeExito = msg;
    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }
}
