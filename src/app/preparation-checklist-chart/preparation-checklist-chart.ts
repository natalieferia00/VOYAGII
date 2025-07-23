import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-preparation-checklist-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './preparation-checklist-chart.html',
  styleUrls: ['./preparation-checklist-chart.scss']
})
export class PreparationChecklistChartComponent {

  chartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => value + '%'
        }
      }
    }
  };

  chartData: ChartData<'bar'> = {
    labels: ['Pasaporte', 'Hospedaje', 'Presupuesto', 'Equipaje'],
    datasets: [{
      data: [100, 60, 80, 30],
      backgroundColor: ['#c8efc9ff', '#ffedb6ff', '#b2dcffff', '#f8d1ffff']
    }]
  };

  chartType: ChartType = 'bar';
}
