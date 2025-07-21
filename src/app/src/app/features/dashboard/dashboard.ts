import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ¡Añadir CommonModule aquí!
import { RouterLink } from '@angular/router';

// Importar módulos de PrimeNG si los estás usando en el HTML de este componente
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { MetricsComponent } from "../../../../shared/components/metrics/metrics";
import { WorldMapComponent } from "../../../../shared/components/world-map/world-map";
import { VisitedFormComponent } from "../../../../shared/components/visited-form";
import { CommentsFormComponent } from "../../../../shared/components/comments-form";
import { PlanningSectionComponent } from "../../../../shared/components/planning-section";
import { TasksSectionComponent } from "../../../../shared/components/tasks-section.component";
import { TravelSeasonChartComponent } from "../../../../shared/components/travel-season-chart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule,
    SidebarComponent,
    MetricsComponent,
    WorldMapComponent,
    CommentsFormComponent,
    PlanningSectionComponent,
    TasksSectionComponent,
    TravelSeasonChartComponent
],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})



export class DashboardComponent implements OnInit {
  metrics = [
    { title: 'Países Visitados', value: '12', trend: '+1.5%', color: '#6A1B9A' },
    { title: 'Ciudades Exploradas', value: '45', trend: '+3.2%', color: '#4A148C' },
    { title: 'Fotos Guardadas', value: '768', trend: '+0.8%', color: '#9C27B0' },
    { title: 'Próximos Viajes', value: '3', trend: '-0.2%', color: '#7B1FA2' },
  ];

  constructor() { }
  ngOnInit(): void { }
}
