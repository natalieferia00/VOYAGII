import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

// Definimos los posibles estados de una tarea/investigación
type TaskStatus = 'Iniciado' | 'En Proceso' | 'Realizado';

// Interfaz para una entrada de la tabla de planificación
interface PlannerEntry {
  id: number; // Para identificar cada fila de forma única
  countryCity: string; // Columna para País/Ciudad
  item: string;        // Columna para Vuelo, Hotel, Actividad, Presupuesto, etc.
  details: string;     // Columna para detalles o enlaces
  cost: number | null; // Columna para el costo (opcional)
  dueDate: string;     // Columna para fecha límite/de interés
  status: TaskStatus;  // Columna para el estado (Iniciado, En Proceso, Realizado)
}

@Component({
  selector: 'app-travel-planner', // Nuevo selector
  standalone: true,
  imports: [
    CommonModule, // Para directivas estructurales como *ngFor y *ngIf
    FormsModule   // Para el two-way data binding con ngModel
  ],
  templateUrl: './travel-planner.html', // Nuevo nombre de plantilla
  styleUrls: ['./travel-planner.scss']  // Nuevo nombre de estilos
})
export class TravelPlannerComponent implements OnInit {
  // Lista de todas las entradas de la tabla de planificación
  plannerEntries: PlannerEntry[] = [];
  nextId: number = 1; // Para generar IDs únicos

  // Propiedades para el formulario de nueva entrada
  newEntryCountryCity: string = '';
  newEntryItem: string = '';
  newEntryDetails: string = '';
  newEntryCost: number | null = null;
  newEntryDueDate: string = '';
  newEntryStatus: TaskStatus = 'Iniciado'; // Estado inicial por defecto

  // Opciones para el selector de estado
  statusOptions: TaskStatus[] = ['Iniciado', 'En Proceso', 'Realizado'];

  constructor() { }

  ngOnInit(): void {
    // Cargar entradas de ejemplo al iniciar
    this.plannerEntries = [
      { id: this.nextId++, countryCity: 'París, Francia', item: 'Vuelo', details: 'Investigar vuelos directos', cost: null, dueDate: '2024-09-01', status: 'Iniciado' },
      { id: this.nextId++, countryCity: 'París, Francia', item: 'Hotel', details: 'Buscar hoteles cerca de la Torre Eiffel', cost: null, dueDate: '2024-09-15', status: 'En Proceso' },
      { id: this.nextId++, countryCity: 'Roma, Italia', item: 'Presupuesto', details: 'Estimar gastos diarios', cost: 1500, dueDate: '2024-10-01', status: 'Realizado' },
      { id: this.nextId++, countryCity: 'Tokio, Japón', item: 'Actividades', details: 'Investigar templos y mercados', cost: null, dueDate: '2024-11-01', status: 'Iniciado' }
    ];
  }

  /**
   * Añade una nueva entrada a la tabla de planificación.
   */
  addPlannerEntry(): void {
    if (this.newEntryCountryCity && this.newEntryItem && this.newEntryDueDate) {
      const newEntry: PlannerEntry = {
        id: this.nextId++,
        countryCity: this.newEntryCountryCity,
        item: this.newEntryItem,
        details: this.newEntryDetails,
        cost: this.newEntryCost,
        dueDate: this.newEntryDueDate,
        status: this.newEntryStatus
      };
      this.plannerEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
    } else {
      alert('Por favor, completa los campos obligatorios (País/Ciudad, Ítem, Fecha Límite).');
    }
  }

  /**
   * Restablece los campos del formulario.
   */
  resetForm(): void {
    this.newEntryCountryCity = '';
    this.newEntryItem = '';
    this.newEntryDetails = '';
    this.newEntryCost = null;
    this.newEntryDueDate = '';
    this.newEntryStatus = 'Iniciado';
  }

  /**
   * Obtiene la clase CSS para el indicador de estado.
   */
  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case 'Iniciado':
        return 'status-initiated';
      case 'En Proceso':
        return 'status-in-progress';
      case 'Realizado':
        return 'status-completed';
      default:
        return '';
    }
  }
}
