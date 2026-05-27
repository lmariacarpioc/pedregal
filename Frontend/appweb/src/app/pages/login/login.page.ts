import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  // Aquí irá la lógica de validación de credenciales
}
