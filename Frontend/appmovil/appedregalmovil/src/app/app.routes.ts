import { Routes } from '@angular/router';

export const routes: Routes = [

  // Ruta raíz → Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ── Login ──────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },

  // ── Registro Diario (entre Login y Dashboard) ─────
  {
    path: 'registro-diario',
    loadComponent: () =>
      import('./pages/registro-diario/registro-diario.page').then(
        m => m.RegistroDiarioPage
      ),
  },

  // ── Tabs (Dashboard, Reports, Staff, Sync) ─────────
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.page').then(m => m.ReportsPage),
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./pages/staff/staff.page').then(m => m.StaffPage),
      },
      {
        path: 'sync',
        loadComponent: () =>
          import('./pages/sincronizacion/sincronizacion.page').then(
            m => m.SincronizacionPage
          ),
      },
    ],
  },

  // Wildcard → login
  {
    path: '**',
    redirectTo: 'login',
  },

];