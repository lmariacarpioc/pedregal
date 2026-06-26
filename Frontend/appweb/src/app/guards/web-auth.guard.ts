import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const webAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  // Si no es un ADMIN, denegar y mandar al login
  if (currentUser.rol !== 'ADMIN' && currentUser.rol !== 'ADMINISTRADOR') {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
