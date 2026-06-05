import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { StaffPage } from './pages/staff/staff.page';
import { Menu } from './pages/menu/menu';
import{Configuracion} from './pages/configuracion/configuracion';
import { Reportes } from './pages/reportes/reportes';
import{EditarTrabajador} from './pages/staff/editar_trabajador';
import { Crear_Parte } from './pages/dashboard/crear_parte';

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
{path: 'staff/editar_trabajador/:dni', component: EditarTrabajador},
{path: 'configuracion', component: Configuracion},
{path: 'reportes', component: Reportes},
{path: 'dashboard/crear_parte', component: Crear_Parte}
   ]
   }
  
];
