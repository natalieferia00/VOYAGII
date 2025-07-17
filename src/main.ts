import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router'; // Importa provideRouter
import { routes } from './app/app.routes'; // Importa tus rutas desde app.routes.ts

bootstrapApplication(App, {
  providers: [
    provideRouter(routes) // Provee el router con tus rutas definidas en app.routes.ts
  ]
}).catch(err => console.error(err));
