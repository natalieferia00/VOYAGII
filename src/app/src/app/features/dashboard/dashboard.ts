    import { Component, OnInit } from '@angular/core';
    import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
    // Importa aquí cualquier componente que uses en tu dashboard.html
    // Por ejemplo, si tienes un componente para las tarjetas:
    // import { DashboardCardComponent } from '../../shared/components/dashboard-card/dashboard-card.component';

    @Component({
      selector: 'app-dashboard',
      standalone: true, // Si quieres que sea standalone
      imports: [
    CommonModule,
    SidebarComponent
],
      templateUrl: './dashboard.html',
      styleUrls: ['./dashboard.scss']
    })
    export class DashboardComponent implements OnInit {
      // Aquí va la lógica de tu dashboard
      // Por ejemplo, datos para las métricas
      metrics = [
        { title: 'Países Visitados', value: '12', trend: '+1.5%', color: '#6A1B9A' },
        { title: 'Ciudades Exploradas', value: '45', trend: '+3.2%', color: '#4A148C' },
        { title: 'Fotos Guardadas', value: '768', trend: '+0.8%', color: '#9C27B0' },
        { title: 'Próximos Viajes', value: '3', trend: '-0.2%', color: '#7B1FA2' },
      ];

      constructor() { }

      ngOnInit(): void {
        // Lógica de inicialización del dashboard
      }
    }
    