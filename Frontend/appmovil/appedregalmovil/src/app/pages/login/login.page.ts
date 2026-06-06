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
import { AuthService } from '../../services/auth.service';
import { SyncService } from '../../services/sync.service';

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
  errorMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService,
    private syncService: SyncService
  ) {
    addIcons({ arrowForwardOutline });
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  async ingresar() {
    this.errorMessage.set('');
    const valid = await this.authService.login(this.username(), this.password());
    if (valid) {
      // Intentar sincronizar datos iniciales (no bloquea si falla por offline)
      await this.syncService.downloadSyncData();
      this.router.navigateByUrl('/registro-diario');
    } else {
      this.errorMessage.set('Credenciales inválidas');
    }
  }
}