import { Routes } from '@angular/router';
import { AuthGuard } from '../app/src/app/core/services/auth.guard'; // Importa el AuthGuard

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
  {
  path: 'planificador-de-equipaje',
  loadComponent: () =>
    import('../app/pages/planificador-de-equipaje/planificador-de-equipaje').then(
      m => m.PlanificadorDeEquipaje
    ),
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
    {
    path: 'planificador-de-alojamientos',
    loadComponent: () =>
      import('../app/pages/planificador-de-alojamientos/planificador-de-alojamientos').then(
        m => m.PlanificadorDeAlojamientosComponent
      ),
  },
  {
  path: 'planificacion-de-transporte',
  loadComponent: () =>
    import('../app/pages/planificacion-de-transporte/planificacion-de-transporte').then(
      m => m.PlanificacionDeTransporte
    ),
},
{
  path: 'planificador-de-alimentacion',
  loadComponent: () =>
    import('../app/pages/planificador-de-alimentacion/planificador-de-alimentacion').then(
      m => m.PlanificadorDeAlimentacion
    ),
},
{
  path: 'planificador-de-seguros-y-extras',
  loadComponent: () =>
    import('../app/pages/planificador-de-seguros-y-extras/planificador-de-seguros-y-extras').then(
      m => m.PlanificadorDeSegurosYExtras
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
      import('../app/login/register/register').then(
        m => m.RegisterComponent
      ),
  },

  // Ruta comodín para manejar URLs no encontradas
  { path: '**', redirectTo: '/dashboard' },
];

