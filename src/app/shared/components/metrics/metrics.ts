import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.html',
  styleUrls: ['./metrics.scss']
})
export class MetricsComponent {

  metrics = [
    { 
      title: 'Países Planificados',  
      value: '5', 
      trend: '2 pendientes de visa', 
      icon: 'fas fa-globe-americas'  
    },
    {     
      title: 'Días Restantes', 
      value: '45', 
      trend: 'Faltan 15 para empacar', 
      icon: 'fas fa-calendar-alt' 
    },
    {  
      title: 'Presupuesto Ahorrado',
      value: '$8,500', 
      trend: '$1,500 por completar', 
      icon: 'fas fa-piggy-bank'
    },
    {
      title: 'Checklist Completado',
      value: '70%',
      trend: '30% pendiente',
      icon: 'fas fa-check-circle'
    }
  ];

  dotColors = ['#FFC857', '#3A86FF', '#2E8B57', '#FF6F3C', '#a000fe', '#FF6F3C'];

}
