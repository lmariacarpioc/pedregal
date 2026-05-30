import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { StaffPage } from './pages/staff/staff.page';
import { Menu } from './pages/menu/menu';

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
    path: '',
   component: Menu,
   children: [
{path: 'dashboard', component: DashboardPage},
{path: 'staff', component: StaffPage}
   ]
   }
  
];
