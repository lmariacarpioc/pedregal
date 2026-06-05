import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  email = '';
  password = '';
  errorMsg = '';

  // Credenciales hardcodeadas (para demo sin backend)
  readonly USUARIO_VALIDO = 'admin@pedregal.pe';
  readonly PASS_VALIDA = 'pedregal2024';

  constructor(private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completa todos los campos.';
      return;
    }
    if (this.email !== this.USUARIO_VALIDO || this.password !== this.PASS_VALIDA) {
      this.errorMsg = 'Usuario o contraseña incorrectos.';
      return;
    }
    this.errorMsg = '';
    this.router.navigate(['/dashboard']);
  }
}
