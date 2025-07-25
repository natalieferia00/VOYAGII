import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralTripInfo } from '../interfaces/general-trip-info.interface';
import { AdditionalGeneralInfo } from '../interfaces/additional-general-info.interface';


// Interfaz combinada para el Input de MetricsComponent
type CombinedTripInfo = GeneralTripInfo & AdditionalGeneralInfo;

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.html',
  styleUrls: ['./metrics.scss']
})
export class MetricsComponent implements OnInit, OnChanges {

  @Input() generalInfo: CombinedTripInfo | null = null;

  // Actualizamos metricsData para incluir solo las métricas deseadas
  metricsData = [
    {
      title: 'Presupuesto General',
      value: 'N/A',
      trend: '',
      icon: 'fas fa-piggy-bank'
    },
    {
      title: 'Presupuesto Transporte',
      value: 'N/A',
      trend: '',
      icon: 'fas fa-plane-departure'
    },
    {
      title: 'Presupuesto Comida',
      value: 'N/A',
      trend: '',
      icon: 'fas fa-utensils'
    },
    {
      title: 'Presupuesto Alojamiento',
      value: 'N/A',
      trend: '',
      icon: 'fas fa-hotel'
    }
  ];

  // Ajustamos los colores para que coincidan con el número de métricas restantes
  dotColors = ['#FFC857', '#3A86FF', '#2E8B57', '#FF6F3C']; // 4 colores para 4 métricas

  constructor() { }

  ngOnInit(): void {
    this.updateMetrics();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['generalInfo']) {
      this.updateMetrics();
    }
  }

  private updateMetrics(): void {
    if (!this.generalInfo) {
      this.metricsData.forEach(metric => {
        metric.value = 'N/A';
        metric.trend = '';
      });
      return;
    }

    const currencyFormatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    // Presupuesto General (nuevo índice 0)
    if (this.generalInfo.generalBudget !== null) {
      this.metricsData[0].value = currencyFormatter.format(this.generalInfo.generalBudget);
      this.metricsData[0].trend = 'Monto total estimado';
    } else {
      this.metricsData[0].value = 'N/A';
      this.metricsData[0].trend = 'Presupuesto no definido';
    }

    // Presupuesto Transporte (nuevo índice 1)
    if (this.generalInfo.transportBudget !== null) {
      this.metricsData[1].value = currencyFormatter.format(this.generalInfo.transportBudget);
      this.metricsData[1].trend = 'Presupuesto para vuelos, trenes, etc.';
    } else {
      this.metricsData[1].value = 'N/A';
      this.metricsData[1].trend = 'Presupuesto de transporte no definido';
    }

    // Presupuesto Comida (nuevo índice 2)
    if (this.generalInfo.foodBudget !== null) {
      this.metricsData[2].value = currencyFormatter.format(this.generalInfo.foodBudget);
      this.metricsData[2].trend = 'Presupuesto para comidas y bebidas';
    } else {
      this.metricsData[2].value = 'N/A';
      this.metricsData[2].trend = 'Presupuesto de comida no definido';
    }

    // Presupuesto Alojamiento (nuevo índice 3)
    if (this.generalInfo.accommodationBudget !== null) {
      this.metricsData[3].value = currencyFormatter.format(this.generalInfo.accommodationBudget);
      this.metricsData[3].trend = 'Presupuesto para hoteles, Airbnb, etc.';
    } else {
      this.metricsData[3].value = 'N/A';
      this.metricsData[3].trend = 'Presupuesto de alojamiento no definido';
    }
  }

  onMetricTitleChange(index: number, event: Event): void {
    const target = event.target as HTMLElement;
    this.metricsData[index].title = target.innerText;
  }

  onMetricValueChange(index: number, event: Event): void {
    const target = event.target as HTMLElement;
    this.metricsData[index].value = target.innerText;
  }

  onMetricTrendChange(index: number, event: Event): void {
    const target = event.target as HTMLElement;
    this.metricsData[index].trend = target.innerText;
  }
}