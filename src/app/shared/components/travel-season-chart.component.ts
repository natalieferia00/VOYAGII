// src/app/shared/components/travel-season-chart.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-travel-season-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './travel-season-chart.component.html',
  styleUrls: ['./travel-season-chart.component.scss'],
})
export class TravelSeasonChartComponent {
  public radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111',
          font: {
            family: 'Roboto',
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Temporada vs Costo y Clima para Viajar',
        color: '#111',
        font: {
          family: 'Roboto',
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: {
      r: {
        angleLines: { color: '#ccc' },
        grid: { color: '#ddd' },
        pointLabels: {
          color: '#111',
          font: {
            family: 'Roboto',
            size: 13,
          },
        },
        ticks: {
          color: '#555',
          backdropColor: 'transparent',
        },
      },
    },
  };

  public radarChartLabels: string[] = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

  public radarChartDatasets: ChartConfiguration<'radar'>['data']['datasets'] = [
    {
      label: 'Costo promedio (USD)',
      data: [700, 1100, 800, 600],
      backgroundColor: 'rgba(255, 193, 7, 0.1)',    // Amarillo translúcido elegante
      borderColor: '#FFC107',                       // Amarillo sólido profesional
      pointBackgroundColor: '#FFC107',              // Puntos amarillos
      pointBorderColor: '#FFC107',
      pointHoverBackgroundColor: '#FFC107',
      pointHoverBorderColor: '#FFC107',
    },
    {
      label: 'Clima favorable (%)',
      data: [85, 75, 80, 60],
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Gris translúcido
      borderColor: '#000000ff',                      // Gris oscuro
      pointBackgroundColor: '#000000ff',
      pointBorderColor: '#070404ff',
      pointHoverBackgroundColor: '#000000ff',
      pointHoverBorderColor: '#000000ff',
    },
  ];
}
