import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';

// Importar interfaces de datos
import { GeneralTripInfo } from '../shared/components/interfaces/general-trip-info.interface';
// Importa AccommodationEntry y AccommodationStatus
import { AccommodationEntry, AccommodationStatus } from '../src/app/features/accommodation-planner/accommodation-planner';
// Ya no necesitamos TransportationEntry ni FoodEntry si solo mostramos alojamientos
// import { TransportationEntry } from '../features/transportation-planner/transportation-planner.component';
// import { FoodEntry } from '../features/food-planner/food-planner.component';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule, CurrencyPipe],
  templateUrl: './progress-chart.html',
  styleUrls: ['./progress-chart.scss']
})
export class ProgressChartComponent implements OnInit, OnDestroy {

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Mostrar leyenda para los estados de alojamiento
        position: 'bottom',
        labels: {
          color: '#333', // Color del texto de la leyenda
          font: {
            size: 14 // Tamaño de fuente para la leyenda
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
    cutout: '70%'
  };

  chartType: 'doughnut' = 'doughnut';

  // 📊 Única Gráfica: Estado de Alojamientos
  accommodationStatusChartData: ChartData<'doughnut'> = {
    labels: ['Solo Visto', 'En Espera', 'Reservado'],
    datasets: [{
      data: [0, 0, 0], // Se inicializará con los datos reales
      // Colores que coinciden con el orden de la barra (Naranja, Amarillo, Verde)
      backgroundColor: ['#FF6F3C', '#FFC857', '#2E8B57'],
      hoverBackgroundColor: ['#E05C2B', '#FFD700', '#3CB371'],
      borderWidth: 0
    }]
  };

  constructor() { }

  ngOnInit(): void {
    this.loadAccommodationDataAndCalculateProgress();
    // Escuchar cambios en localStorage para reactividad
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  private onStorageChange(event: StorageEvent): void {
    // Solo recargar si cambia la clave de alojamientos
    if (event.key === 'accommodationEntries') {
      this.loadAccommodationDataAndCalculateProgress();
    }
  }

  private loadAccommodationDataAndCalculateProgress(): void {
    // Cargar datos de Alojamientos
    const accommodationEntriesStr = localStorage.getItem('accommodationEntries');
    const accommodationEntries: AccommodationEntry[] = accommodationEntriesStr ? JSON.parse(accommodationEntriesStr) : [];

    this.calculateAccommodationProgress(accommodationEntries);
  }

  // Método para calcular el progreso de los estados de alojamiento
  private calculateAccommodationProgress(entries: AccommodationEntry[]): void {
    const total = entries.length;
    let soloVistoCount = 0;
    let enEsperaCount = 0;
    let reservadoCount = 0;

    entries.forEach(entry => {
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

    // Actualizar los datos de la gráfica
    this.accommodationStatusChartData.datasets[0].data = [soloVistoPercentage, enEsperaPercentage, reservadoPercentage];
    this.accommodationStatusChartData = { ...this.accommodationStatusChartData }; // Clonar para que Chart.js detecte el cambio
  }
}
