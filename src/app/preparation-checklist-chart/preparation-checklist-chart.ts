import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

import { PlannerEntry, TravelPlannerComponent } from '../src/app/features/travel-planner/travel-planner';

@Component({
  selector: 'app-preparation-checklist-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './preparation-checklist-chart.html',
  styleUrls: ['./preparation-checklist-chart.scss']
})
export class PreparationChecklistChartComponent implements OnInit, OnDestroy {

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x.toFixed(0) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => value + '%'
        }
      },
      y: {
        // Puedes configurar el eje Y si lo necesitas
      }
    }
  };

  chartData: ChartData<'bar'> = {
    // ¡Nuevas etiquetas y orden para los estados!
    labels: ['Pendiente', 'Iniciado', 'En Proceso', 'Realizado'],
    datasets: [{
      data: [0, 0, 0, 0], // Ahora 4 valores
      // ¡Nuevos colores y orden! Naranja para 'Pendiente'
      backgroundColor: ['#FF6F3C', '#FFC857', '#3A86FF', '#2E8B57'], // Naranja, Amarillo, Azul, Verde
      hoverBackgroundColor: ['#E05C2B', '#FFD700', '#5B9CFF', '#3CB371'],
      borderWidth: 0
    }]
  };

  chartType: 'bar' = 'bar';

  constructor() { }

  ngOnInit(): void {
    this.loadTaskDataAndCalculateProgress();
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  private onStorageChange(event: StorageEvent): void {
    if (event.key === 'plannerEntries') {
      this.loadTaskDataAndCalculateProgress();
    }
  }

  private loadTaskDataAndCalculateProgress(): void {
    const storedEntriesStr = localStorage.getItem('plannerEntries');
    const plannerEntries: PlannerEntry[] = storedEntriesStr ? JSON.parse(storedEntriesStr) : [];

    const totalTasks = plannerEntries.length;
    let pendingCount = 0; // Contador para el nuevo estado
    let initiatedCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;

    plannerEntries.forEach(entry => {
      switch (entry.status) {
        case 'Pendiente': // Contar el nuevo estado
          pendingCount++;
          break;
        case 'Iniciado':
          initiatedCount++;
          break;
        case 'En Proceso':
          inProgressCount++;
          break;
        case 'Realizado':
          completedCount++;
          break;
      }
    });

    // Calcular porcentajes
    const pendingPercentage = totalTasks > 0 ? (pendingCount / totalTasks) * 100 : 0;
    const initiatedPercentage = totalTasks > 0 ? (initiatedCount / totalTasks) * 100 : 0;
    const inProgressPercentage = totalTasks > 0 ? (inProgressCount / totalTasks) * 100 : 0;
    const completedPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

    // ¡Orden de los datos actualizado para coincidir con las etiquetas!
    this.chartData.datasets[0].data = [
      pendingPercentage,
      initiatedPercentage,
      inProgressPercentage,
      completedPercentage
    ];

    this.chartData = { ...this.chartData };
  }
}
