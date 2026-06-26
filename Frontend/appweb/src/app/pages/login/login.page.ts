import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    this.errorMessage = '';
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingrese sus credenciales.';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        
        // RBAC validation
        if (user.rol === 'JEFE_CAMPO' || user.rol === 'SUPERVISOR') {
          this.errorMessage = 'Acceso denegado (403): Plataforma exclusiva para Administradores.';
          this.authService.logout();
        } else {
          this.cdr.detectChanges();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos.';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}
