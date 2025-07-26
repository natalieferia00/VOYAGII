import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData } from 'chart.js'; // Import ChartType

// Importar la interfaz TransportationEntry y TransportationStatus
import { TransportationEntry } from "../../../src/app/features/transportation-planner/transportation-planner";

@Component({
  selector: 'app-transportation-status-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './transportation-status-chart.html',
  styleUrls: ['./transportation-status-chart.scss']
})
export class TransportationStatusChartComponent implements OnInit, OnDestroy {

  // Opciones para el gráfico de BARRAS (horizontal)
  chartOptions: ChartOptions<'bar'> = { // Tipo de gráfico 'bar'
    responsive: true,
    indexAxis: 'y', // Hace que las barras sean horizontales
    plugins: {
      legend: {
        display: false // No mostrar leyenda, las etiquetas de las barras son claras
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) { // Para barras horizontales, el valor es 'x'
              label += context.parsed.x.toFixed(1) + '%'; // Mostrar un decimal
            }
            return label;
          }
        }
      }
    },
    scales: { // Configuración de escalas para gráfico de barras
      x: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => value + '%' // Mostrar ticks como porcentajes
        }
      },
      y: {
        // Puedes configurar el eje Y si lo necesitas (ej. ocultar líneas de la cuadrícula)
      }
    }
    // 'cutout' se elimina porque es para gráficos de dona
  };

  chartType: 'bar' = 'bar'; // Tipo de gráfico 'bar'

  // 📊 Gráfica de Transporte: Solo Visto, En Espera, Reservado
  transportationStatusChartData: ChartData<'bar'> = { // Tipo 'bar'
    labels: ['Solo Visto', 'En Espera', 'Reservado'],
    datasets: [{
      data: [0, 0, 0], // Se inicializará con los datos reales
      // Colores de fondo: Amarillo, Marrón/Rojo Oscuro, Naranja
      backgroundColor: ['#FFC857', '#4e3131ff', '#FF6F3C'],
      // Colores de hover: Oro, Marrón más claro, Naranja más oscuro
      hoverBackgroundColor: ['#FFD700', '#6B4F4F', '#E05C2B'],
      borderWidth: 0
    }]
  };

  constructor() { }

  ngOnInit(): void {
    this.loadTransportationDataAndCalculateProgress();
    // Escuchar cambios en localStorage para reactividad
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  private onStorageChange(event: StorageEvent): void {
    // Solo recargar si cambia la clave de transportes
    if (event.key === 'transportationEntries') {
      this.loadTransportationDataAndCalculateProgress();
    }
  }

  private loadTransportationDataAndCalculateProgress(): void {
    // Cargar datos de Transporte
    const transportationEntriesStr = localStorage.getItem('transportationEntries');
    const transportationEntries: TransportationEntry[] = transportationEntriesStr ? JSON.parse(transportationEntriesStr) : [];

    this.calculateTransportationProgress(transportationEntries);
  }

  private calculateTransportationProgress(entries: TransportationEntry[]): void {
    const total = entries.length;
    let soloVistoCount = 0;
    let enEsperaCount = 0;
    let reservadoCount = 0;

    entries.forEach(entry => {
      // Asegúrate de que 'entry.status' exista y sea del tipo TransportationStatus
      switch (entry.status) {
        case 'Solo Visto':
          soloVistoCount++;
          break;
        case 'En Espera':
          enEsperaCount++;
          break;
        case 'Reservado':
          reservadoCount++;
          break;
      }
    });

    const soloVistoPercentage = total > 0 ? (soloVistoCount / total) * 100 : 0;
    const enEsperaPercentage = total > 0 ? (enEsperaCount / total) * 100 : 0;
    const reservadoPercentage = total > 0 ? (reservadoCount / total) * 100 : 0;

    this.transportationStatusChartData.datasets[0].data = [soloVistoPercentage, enEsperaPercentage, reservadoPercentage];
    this.transportationStatusChartData = { ...this.transportationStatusChartData };
  }
}
