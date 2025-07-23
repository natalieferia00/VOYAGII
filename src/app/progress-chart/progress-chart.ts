import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './progress-chart.html',
  styleUrls: ['./progress-chart.scss']
})
export class ProgressChartComponent {

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%' // ✅ Correcto aquí en Chart.js v4
  };

  chartType: 'doughnut' = 'doughnut'; // ✅ Corregido para evitar error de tipos

  // 📊 Gráfica 1: Documentos
  documentosChartData: ChartData<'doughnut'> = {
    labels: ['Preparado', 'Pendiente'],
    datasets: [{
      data: [90, 10],
      backgroundColor: ['#a0efa4ff', '#E0E0E0'],
      hoverBackgroundColor: ['#b3ffb7ff', '#BDBDBD'],
      borderWidth: 0
    }]
  };

  // 📊 Gráfica 2: Hospedajes
  hospedajeChartData: ChartData<'doughnut'> = {
    labels: ['Reservado', 'Pendiente'],
    datasets: [{
      data: [60, 40],
      backgroundColor: ['#bee2ffff', '#E0E0E0'],
      hoverBackgroundColor: ['#c8e4ffff', '#BDBDBD'],
      borderWidth: 0
    }]
  };

  // 📊 Gráfica 3: Presupuesto
  presupuestoChartData: ChartData<'doughnut'> = {
    labels: ['Ahorrado', 'Pendiente'],
    datasets: [{
      data: [75, 25],
      backgroundColor: ['#ffcde2ff', '#E0E0E0'],
      hoverBackgroundColor: ['#ffb6f2ff', '#BDBDBD'],
      borderWidth: 0
    }]
  };

}
