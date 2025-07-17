    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    // Importa tus componentes compartidos aquí
    //import { SidebarComponent } from './components/sidebar/sidebar.component';
    // import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component'; // Descomenta si lo tienes

    @NgModule({
      declarations: [], // Si tus componentes son standalone, no van aquí
      imports: [
      //  CommonModule,
      //  SidebarComponent, // Importa SidebarComponent (si es standalone)
        // DashboardCardComponent // Importa DashboardCardComponent (si es standalone)
      ],
      exports: [
       // SidebarComponent, // Exporta SidebarComponent para que otros módulos puedan usarlo
        // DashboardCardComponent, // Exporta DashboardCardComponent
        CommonModule // Exporta CommonModule para que los módulos que importen SharedModule tengan acceso a NgIf, NgFor, etc.
      ]
    })
    export class SharedModule { }
    