// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importar para animaciones de PrimeNG

import { routes } from './app.routes'; // Tus rutas existentes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(), // ¡Importante para las animaciones de PrimeNG!
    // Puedes añadir PrimeNGConfig aquí si quieres configurar ripple, zIndex, etc.
    // { provide: PrimeNGConfig, useValue: { ripple: true } } // Necesitarías importar PrimeNGConfig
  ]
};
