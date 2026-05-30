import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { StaffPage } from './pages/staff/staff.page';
import { Menu } from './pages/menu/menu';
import{Configuracion} from './pages/configuracion/configuracion';
import { Reportes } from './pages/reportes/reportes';

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
{path: 'staff', component: StaffPage},
{path: 'configuracion', component: Configuracion},
{path: 'reportes', component: Reportes}
   ]
   }
  
];
