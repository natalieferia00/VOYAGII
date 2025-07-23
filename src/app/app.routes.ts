import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirige la ruta raíz a dashboard

  // Ruta para el Dashboard (carga perezosa del componente standalone)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./src/app/features/dashboard/dashboard').then(
        m => m.DashboardComponent
      ),
  },
  // Ruta para el Mapa (carga perezosa del componente standalone)
  {
    path: 'map',
    loadComponent: () =>
      import('./src/app/features/map/map').then(m => m.MapComponent),
  },
  // Ruta para el Organizador de Viajes (carga perezosa del componente standalone)
  {
    path: 'travel-organizer',
    loadComponent: () =>
      import('./src/app/features/travel-organizer/travel-organizer').then(
        m => m.TravelOrganizerComponent
      ),
  },
  // Ruta para Añadir Lugar (carga perezosa del componente standalone)
  {
    path: 'add-place',
    loadComponent: () =>
      import('./src/app/features/add-place/add-place').then(
        m => m.AddPlaceComponent
      ),
  },

  // Ruta para Login
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.LoginComponent),
  },
  // Ruta para Register
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then(
        m => m.RegisterComponent
      ),
  },

  // Ruta comodín para manejar URLs no encontradas
  { path: '**', redirectTo: '/dashboard' },
];
