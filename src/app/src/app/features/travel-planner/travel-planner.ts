import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

// Definimos los posibles estados de una tarea/investigación - ¡NUEVO ESTADO 'Pendiente'!
export type TaskStatus = 'Pendiente' | 'Iniciado' | 'En Proceso' | 'Realizado';

// Interfaz para una entrada de la tabla de planificación
export interface PlannerEntry {
  id: number;
  countryCity: string;
  item: string;
  details: string;
  cost: number | null;
  dueDate: string;
  status: TaskStatus; // El estado puede ser 'Pendiente' ahora
}

@Component({
  selector: 'app-travel-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './travel-planner.html',
  styleUrls: ['./travel-planner.scss']
})
export class TravelPlannerComponent implements OnInit {
  plannerEntries: PlannerEntry[] = [];
  nextId: number = 1;

  newEntryCountryCity: string = '';
  newEntryItem: string = '';
  newEntryDetails: string = '';
  newEntryCost: number | null = null;
  newEntryDueDate: string = '';
  newEntryStatus: TaskStatus = 'Pendiente'; // Estado inicial por defecto: 'Pendiente'

  // Opciones para el selector de estado - ¡Orden actualizado!
  statusOptions: TaskStatus[] = ['Pendiente', 'Iniciado', 'En Proceso', 'Realizado'];

  constructor() { }

  ngOnInit(): void {
    this.loadPlannerEntries();
  }

  private loadPlannerEntries(): void {
    const storedEntries = localStorage.getItem('plannerEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: PlannerEntry[] = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          this.plannerEntries = parsedEntries;
          console.log('Entradas de planificación cargadas desde localStorage:', this.plannerEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de planificación vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de planificación desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de planificación en localStorage.');
    }

    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de planificación inicializados.');
    }

    this.calculateNextId();
  }

  private savePlannerEntries(): void {
    localStorage.setItem('plannerEntries', JSON.stringify(this.plannerEntries));
    console.log('Entradas de planificación guardadas en localStorage.');
  }

  private calculateNextId(): void {
    let maxId = 0;
    if (this.plannerEntries.length > 0) {
      maxId = Math.max(...this.plannerEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for planner entries: ${this.nextId}`);
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.plannerEntries.
   * ¡Algunas tareas ahora tienen el estado 'Pendiente'!
   */
  private initializeExampleData(): void {
    let tempNextId = 1;
    this.plannerEntries = [
      { id: tempNextId++, countryCity: 'París, Francia', item: 'Vuelo', details: 'Investigar vuelos directos', cost: null, dueDate: '2024-09-01', status: 'Iniciado' },
      { id: tempNextId++, countryCity: 'París, Francia', item: 'Hotel', details: 'Buscar hoteles cerca de la Torre Eiffel', cost: null, dueDate: '2024-09-15', status: 'En Proceso' },
      { id: tempNextId++, countryCity: 'Roma, Italia', item: 'Presupuesto', details: 'Estimar gastos diarios', cost: 1500, dueDate: '2024-10-01', status: 'Realizado' },
      { id: tempNextId++, countryCity: 'Tokio, Japón', item: 'Actividades', details: 'Investigar templos y mercados', cost: null, dueDate: '2024-11-01', status: 'Pendiente' }, // Cambiado a 'Pendiente'
      { id: tempNextId++, countryCity: 'Nueva York, EE. UU.', item: 'Visados', details: 'Revisar requisitos de visado', cost: null, dueDate: '2024-08-20', status: 'Realizado' },
      { id: tempNextId++, countryCity: 'Londres, Reino Unido', item: 'Seguro de Viaje', details: 'Comparar pólizas', cost: null, dueDate: '2024-09-10', status: 'Pendiente' } // Cambiado a 'Pendiente'
    ];
    this.savePlannerEntries();
  }

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
      this.resetForm();
      this.savePlannerEntries();
    } else {
      alert('Por favor, completa los campos obligatorios (País/Ciudad, Ítem, Fecha Límite).');
    }
  }

  resetForm(): void {
    this.newEntryCountryCity = '';
    this.newEntryItem = '';
    this.newEntryDetails = '';
    this.newEntryCost = null;
    this.newEntryDueDate = '';
    this.newEntryStatus = 'Pendiente'; // Reinicia a 'Pendiente'
  }

  /**
   * Obtiene la clase CSS para el indicador de estado.
   * ¡Nueva clase para 'Pendiente'!
   */
  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case 'Pendiente':
        return 'status-pending'; // Nueva clase CSS
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

  onTableEdit(entry: PlannerEntry, field: keyof PlannerEntry, event: Event): void {
    const target = event.target as HTMLElement;
    if (field === 'cost') {
      const value = parseFloat(target.innerText.replace(/[^0-9.,]/g, '').replace(',', '.'));
      if (!isNaN(value)) {
        entry.cost = value;
      } else {
        target.innerText = entry.cost !== null ? entry.cost.toString() : '';
      }
    } else if (field === 'status') {
      (entry[field] as TaskStatus) = target.innerText as TaskStatus;
    } else {
      (entry[field] as string) = target.innerText;
    }
    this.savePlannerEntries();
  }

  onStatusChange(entry: PlannerEntry, event: Event): void {
    const target = event.target as HTMLSelectElement;
    entry.status = target.value as TaskStatus;
    this.savePlannerEntries();
  }

  removePlannerEntry(entryToRemove: PlannerEntry): void {
    this.plannerEntries = this.plannerEntries.filter(entry => entry.id !== entryToRemove.id);
    this.savePlannerEntries();
    this.calculateNextId();
  }
}
