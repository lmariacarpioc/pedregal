import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonCheckbox, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  username = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline });
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  ingresar() {
    // Por ahora navegación directa sin validación real
    this.router.navigateByUrl('/registro-diario');
  }
}