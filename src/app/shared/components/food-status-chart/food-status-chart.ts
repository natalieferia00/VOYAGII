import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

// Importar la interfaz FoodEntry y FoodStatus
import { FoodEntry, FoodStatus } from '../../../src/app/features/food-planner/food-planner';

@Component({
  selector: 'app-food-status-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './food-status-chart.html',
  styleUrls: ['./food-status-chart.scss']
})
export class FoodStatusChartComponent implements OnInit, OnDestroy {

  // Opciones para un gráfico CIRCULAR (DOUGHNUT)
  chartOptions: ChartOptions<'doughnut'> = { // Tipo de gráfico 'doughnut'
    responsive: true,
    plugins: {
      legend: {
        display: true, // Mostrar leyenda para los estados
        position: 'bottom', // Posicionar la leyenda abajo
        labels: {
          color: '#333',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toFixed(1) + '%'; // Mostrar un decimal
            }
            return label;
          }
        }
      }
    },
    cutout: '70%' // Para hacerla una dona
  };

  chartType: 'doughnut' = 'doughnut'; // Tipo de gráfico 'doughnut'

  // 📊 Gráfica de Alimentación: Idea, Recomendación, En Espera, Reservado, Visitado, No Aplica
  foodStatusChartData: ChartData<'doughnut'> = { // Tipo 'doughnut'
    labels: ['Idea', 'Recomendación', 'En Espera', 'Reservado', 'Visitado', 'No Aplica'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0], // Seis valores
      // Colores sugeridos: Gris, Marrón claro, Amarillo, Verde, Azul, Gris muy claro
      backgroundColor: ['#A9A9A9', '#8D6E63', '#FFC857', '#2E8B57', '#3A86FF', '#E0E0E0'],
      hoverBackgroundColor: ['#808080', '#795548', '#FFD700', '#3CB371', '#5B9CFF', '#BDBDBD'],
      borderWidth: 0
    }]
  };

  constructor() { }

  ngOnInit(): void {
    this.loadFoodDataAndCalculateProgress();
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  private onStorageChange(event: StorageEvent): void {
    if (event.key === 'foodEntries') {
      this.loadFoodDataAndCalculateProgress();
    }
  }

  private loadFoodDataAndCalculateProgress(): void {
    const storedEntriesStr = localStorage.getItem('foodEntries');
    const foodEntries: FoodEntry[] = storedEntriesStr ? JSON.parse(storedEntriesStr) : [];

    this.calculateFoodProgress(foodEntries);
  }

  private calculateFoodProgress(entries: FoodEntry[]): void {
    const total = entries.length;
    let ideaCount = 0;
    let recomendacionCount = 0;
    let enEsperaCount = 0;
    let reservadoCount = 0;
    let visitadoCount = 0;
    let noAplicaCount = 0;

    entries.forEach(entry => {
      switch (entry.status) {
        case 'Idea':
          ideaCount++;
          break;
        case 'Recomendación':
          recomendacionCount++;
          break;
        case 'En Espera':
          enEsperaCount++;
          break;
        case 'Reservado':
          reservadoCount++;
          break;
        case 'Visitado':
          visitadoCount++;
          break;
        case 'No Aplica':
          noAplicaCount++;
          break;
      }
    });

    const ideaPercentage = total > 0 ? (ideaCount / total) * 100 : 0;
    const recomendacionPercentage = total > 0 ? (recomendacionCount / total) * 100 : 0;
    const enEsperaPercentage = total > 0 ? (enEsperaCount / total) * 100 : 0;
    const reservadoPercentage = total > 0 ? (reservadoCount / total) * 100 : 0;
    const visitadoPercentage = total > 0 ? (visitadoCount / total) * 100 : 0;
    const noAplicaPercentage = total > 0 ? (noAplicaCount / total) * 100 : 0;

    this.foodStatusChartData.datasets[0].data = [
      ideaPercentage,
      recomendacionPercentage,
      enEsperaPercentage,
      reservadoPercentage,
      visitadoPercentage,
      noAplicaPercentage
    ];
    this.foodStatusChartData = { ...this.foodStatusChartData };
  }
}
