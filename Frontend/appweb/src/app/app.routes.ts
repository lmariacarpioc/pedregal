import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage // <-- Usamos directamente el componente standalone
  },
  
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  }
];
