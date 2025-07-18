

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
    { title: 'PAISES',  value: '12', trend: '+2 este año', icon: 'fas fa-globe-americas'  },
    {     title: 'Días de Viaje', value: '120', trend: '+30 este año',icon: 'fas fa-plane' },
    {  title: 'Presupuesto Gastado',value: '$15,000', trend: '+$2,000 este año', icon: 'fas fa-wallet'}
  ];
dotColors = ['#dbf8ffff', '#f9e6ffff', '#ffc5c5ff', '#ffd7b1ff', '#a000fe', '#a000fe'];


}
