import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // For ngModel (needed for forms)
import { RouterLink } from '@angular/router'; // For routerLink in HTML

// Asegúrate de que estas importaciones sean correctas si las usas en tu HTML
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { TravelPlannerComponent } from "../travel-planner/travel-planner";
// Los siguientes componentes no se usan directamente en el TS de TravelOrganizerComponent
// pero si los vas a usar en el HTML de travel-organizer, deben estar en `imports`
// import { TravelPlannerComponent } from "../travel-planner/travel-planner";
// import { AccommodationPlannerComponent } from "../accommodation-planner/accommodation-planner";
// import { TransportationPlannerComponent } from "../transportation-planner/transportation-planner";
// import { FoodPlannerComponent } from "../food-planner/food-planner";
// import { InsurancePlannerComponent } from "../insurance-planner/insurance-planner";
// import { PackingPlannerComponent } from "../packing-planner/packing-planner";

// Interfaz para un viaje
interface Trip {
  id: number; // Cambiado a number para gestión de IDs
  name: string;
  date: string;
  destination: string;
}

@Component({
  selector: 'app-travel-organizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Necesario para ngModel en el formulario
    SidebarComponent // Si el sidebar es parte de este componente, si no, quítalo
    ,
    TravelPlannerComponent
],
  templateUrl: './travel-organizer.html',
  styleUrls: ['./travel-organizer.scss']
})
export class TravelOrganizerComponent implements OnInit {
  trips: Trip[] = [];
  nextId: number = 1; // Contador para IDs únicos

  // Propiedades para el formulario de nuevo viaje
  newTripName: string = '';
  newTripDate: string = '';
  newTripDestination: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadTrips(); // Cargar datos al inicio
  }

  /**
   * Carga los viajes desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadTrips(): void {
    const storedTrips = localStorage.getItem('travelOrganizerTrips');
    let loadedSuccessfully = false;

    if (storedTrips) {
      try {
        const parsedTrips: Trip[] = JSON.parse(storedTrips);
        if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
          this.trips = parsedTrips;
          console.log('Viajes cargados desde localStorage:', this.trips);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de viajes vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear viajes desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de viajes en localStorage.');
    }

    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de viajes inicializados.');
    }

    // Siempre calcular el nextId después de que this.trips esté poblado
    this.calculateNextId();
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.trips.length > 0) {
      maxId = Math.max(...this.trips.map(trip => trip.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for trips: ${this.nextId}`);
  }

  /**
   * Guarda los viajes en localStorage.
   */
  private saveTrips(): void {
    localStorage.setItem('travelOrganizerTrips', JSON.stringify(this.trips));
    console.log('Viajes guardados en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.trips.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    let tempNextId = 1; // Contador temporal para IDs de ejemplo
    this.trips = [
      { id: tempNextId++, name: 'Aventura en los Andes', date: '2024-09-15', destination: 'Perú, Colombia' },
      { id: tempNextId++, name: 'Escapada Europea', date: '2023-05-20', destination: 'España, Francia' },
      { id: tempNextId++, name: 'Relajo en la Playa', date: '2025-01-10', destination: 'México' },
    ];
  }

  /**
   * Añade un nuevo viaje a la lista.
   */
  addTrip(): void {
    if (this.newTripName && this.newTripDate && this.newTripDestination) {
      const newTrip: Trip = {
        id: this.nextId++, // Asigna el ID y lo incrementa
        name: this.newTripName,
        date: this.newTripDate,
        destination: this.newTripDestination
      };
      this.trips.push(newTrip);
      this.resetForm(); // Limpia el formulario
      this.saveTrips(); // Guarda los cambios
    } else {
      alert('Por favor, completa todos los campos para añadir un viaje.');
    }
  }

  /**
   * Elimina un viaje de la lista.
   * @param tripToRemove El viaje a eliminar.
   */
  removeTrip(tripToRemove: Trip): void {
    const index = this.trips.findIndex(trip => trip.id === tripToRemove.id);
    if (index !== -1) {
      this.trips.splice(index, 1);
      this.saveTrips(); // Guarda los cambios
      this.calculateNextId(); // Recalcula el nextId por si se eliminó el ID más alto
    }
  }

  /**
   * Restablece los campos del formulario de nuevo viaje.
   */
  resetForm(): void {
    this.newTripName = '';
    this.newTripDate = '';
    this.newTripDestination = '';
  }
}
