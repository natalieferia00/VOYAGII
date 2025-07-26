import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for NgIf

// Import the GeneralTripInfo interface
import { GeneralTripInfo } from '../../../shared/components/interfaces/general-trip-info.interface';

@Component({
  selector: 'app-trip-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-countdown.html',
  styleUrls: ['./trip-countdown.scss']
})
export class TripCountdownComponent implements OnInit, OnDestroy {
  countdownMessage: string = 'No hay un viaje planificado.';
  private intervalId: any; // To store the interval ID for cleanup

  constructor() { }

  ngOnInit(): void {
    this.updateCountdown(); // Initial calculation
    // Update countdown every second
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000); // Update every second

    // Listen for changes in localStorage to reactively update
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up the interval and event listener when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  /**
   * Handles changes in localStorage.
   * @param event The StorageEvent object.
   */
  private onStorageChange(event: StorageEvent): void {
    if (event.key === 'generalTripInfo') { // Check if the relevant key changed
      this.updateCountdown(); // Recalculate countdown if generalTripInfo changes
    }
  }

  /**
   * Calculates and updates the countdown message.
   */
  private updateCountdown(): void {
    const storedInfoStr = localStorage.getItem('generalTripInfo');
    if (storedInfoStr) {
      try {
        const generalInfo: GeneralTripInfo = JSON.parse(storedInfoStr);
        const startDateString = generalInfo.startDate;

        if (startDateString) {
          const startDate = new Date(startDateString);
          const now = new Date();

          // Set time to midnight for accurate day calculation
          startDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);

          const diffTime = startDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 0) {
            this.countdownMessage = `${-diffDays} día${diffDays !== 1 ? 's' : ''} para tu viaje.`;
          } else if (diffDays === 0) {
            this.countdownMessage = '¡Tu viaje es hoy!';
          } else {
            this.countdownMessage = 'Tu viaje ya ha comenzado o finalizado.';
          }
        } else {
          this.countdownMessage = 'No hay una fecha de inicio de viaje planificada.';
        }
      } catch (e) {
        console.error('Error parsing generalTripInfo for countdown:', e);
        this.countdownMessage = 'Error al cargar la fecha del viaje.';
      }
    } else {
      this.countdownMessage = 'No hay un viaje planificado.';
    }
  }
}
