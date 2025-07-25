import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel

// Tipos de transporte
type TransportType = 'Vuelo' | 'Tren' | 'Autobús' | 'Metro' | 'Taxi' | 'Otro';

// Interfaz para una entrada de transporte
interface TransportationEntry {
  id: number;
  tripName: string; // Nombre del viaje al que pertenece (ej. "Viaje a Europa 2024")
  tripCode: string; // Código para identificar el viaje (ej. "EUR24-001")
  country: string;
  city: string;
  transportType: TransportType;
  company: string; // Aerolínea, compañía de tren, etc.
  price: number | null;
  currency: string;
  departureDate: string;
  arrivalDate: string;
  url: string; // URL de la reserva o información
  opinion: string; // Campo editable directamente en la tabla
}

@Component({
  selector: 'app-transportation-planner',
  standalone: true,
  imports: [
    CommonModule, // For structural directives like *ngFor, *ngIf
    FormsModule   // For two-way data binding with ngModel
  ],
  templateUrl: './transportation-planner.html',
  styleUrls: ['./transportation-planner.scss']
})
export class TransportationPlannerComponent implements OnInit {
  transportationEntries: TransportationEntry[] = [];
  nextId: number = 1;

  // Form properties for new entry
  newEntryTripName: string = '';
  newEntryTripCode: string = '';
  newEntryCountry: string = '';
  newEntryCity: string = '';
  newEntryTransportType: TransportType = 'Vuelo';
  newEntryCompany: string = '';
  newEntryPrice: number | null = null;
  newEntryCurrency: string = 'USD';
  newEntryDepartureDate: string = '';
  newEntryArrivalDate: string = '';
  newEntryUrl: string = '';
  newEntryOpinion: string = '';

  // Options for select inputs
  transportTypes: TransportType[] = ['Vuelo', 'Tren', 'Autobús', 'Metro', 'Taxi', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];

  constructor() { }

  ngOnInit(): void {
    this.loadTransportationEntries(); // Cargar datos al inicio
  }

  /**
   * Carga las entradas de transporte desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadTransportationEntries(): void {
    const storedEntries = localStorage.getItem('transportationEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: TransportationEntry[] = JSON.parse(storedEntries);
        // Verificar si los datos parseados son un array y no está vacío
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          this.transportationEntries = parsedEntries;
          console.log('Entradas de transporte cargadas desde localStorage:', this.transportationEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de transporte vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de transporte desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de transporte en localStorage.');
    }

    // Si no se cargaron datos exitosamente, inicializar con datos de ejemplo
    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de transporte inicializados.');
    }

    // Siempre calcular el nextId después de que this.transportationEntries esté poblado
    this.calculateNextId();
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.transportationEntries.length > 0) {
      maxId = Math.max(...this.transportationEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for transportation: ${this.nextId}`);
  }

  /**
   * Guarda las entradas de transporte en localStorage.
   */
  private saveTransportationEntries(): void {
    localStorage.setItem('transportationEntries', JSON.stringify(this.transportationEntries));
    console.log('Entradas de transporte guardadas en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.transportationEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    // Usamos un contador temporal para los IDs de los datos de ejemplo
    let tempNextId = 1;

    this.transportationEntries = [
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'España',
        city: 'Madrid',
        transportType: 'Vuelo',
        company: 'Iberia',
        price: 450,
        currency: 'EUR',
        departureDate: '2024-09-10',
        arrivalDate: '2024-09-10',
        url: 'https://iberia.com/madrid-paris',
        opinion: 'Vuelo directo, buena experiencia.'
      },
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'Francia',
        city: 'París',
        transportType: 'Tren',
        company: 'SNCF',
        price: 80,
        currency: 'EUR',
        departureDate: '2024-09-12',
        arrivalDate: '2024-09-12',
        url: 'https://sncf.fr/paris-lyon',
        opinion: 'Tren de alta velocidad, muy cómodo.'
      },
      {
        id: tempNextId++,
        tripName: 'Escapada a la Playa',
        tripCode: 'PLAYA25-002',
        country: 'México',
        city: 'Cancún',
        transportType: 'Vuelo',
        company: 'Aeromexico',
        price: 300,
        currency: 'USD',
        departureDate: '2025-03-01',
        arrivalDate: '2025-03-01',
        url: 'https://aeromexico.com/mexico-cancun',
        opinion: 'Vuelo temprano, sin problemas.'
      }
    ];
  }

  /**
   * Adds a new transportation entry to the table.
   */
  addTransportationEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryCountry && this.newEntryCity &&
        this.newEntryCompany && this.newEntryDepartureDate && this.newEntryArrivalDate && this.newEntryUrl) {
      const newEntry: TransportationEntry = {
        id: this.nextId++, // Usar el ID actual y luego incrementarlo
        tripName: this.newEntryTripName,
        tripCode: this.newEntryTripCode,
        country: this.newEntryCountry,
        city: this.newEntryCity,
        transportType: this.newEntryTransportType,
        company: this.newEntryCompany,
        price: this.newEntryPrice,
        currency: this.newEntryCurrency,
        departureDate: this.newEntryDepartureDate,
        arrivalDate: this.newEntryArrivalDate,
        url: this.newEntryUrl,
        opinion: this.newEntryOpinion
      };
      this.transportationEntries.push(newEntry);
      this.resetForm(); // Clear the form after adding
      this.saveTransportationEntries(); // Guardar cambios
    } else {
      alert('Please complete all required fields: Trip Name, Trip Code, Country, City, Company, Departure Date, Arrival Date, and URL.');
    }
  }

  /**
   * Resets the form fields.
   */
  resetForm(): void {
    this.newEntryTripName = '';
    this.newEntryTripCode = '';
    this.newEntryCountry = '';
    this.newEntryCity = '';
    this.newEntryTransportType = 'Vuelo';
    this.newEntryCompany = '';
    this.newEntryPrice = null;
    this.newEntryCurrency = 'USD';
    this.newEntryDepartureDate = '';
    this.newEntryArrivalDate = '';
    this.newEntryUrl = '';
    this.newEntryOpinion = '';
  }

  /**
   * Opens the URL of the entry in a new tab.
   */
  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Handles the opinion update directly in the table.
   * @param entry The table entry being edited.
   * @param event The input event.
   */
  onOpinionChange(entry: TransportationEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.opinion = target.innerText;
    this.saveTransportationEntries(); // Guardar cambios al editar la opinión
    console.log(`Opinion updated for ${entry.company} (${entry.transportType}): ${entry.opinion}`);
  }

  /**
   * Elimina una entrada de transporte de la tabla.
   * @param entryToRemove La entrada a eliminar.
   */
  removeTransportation(entryToRemove: TransportationEntry): void {
    const index = this.transportationEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.transportationEntries.splice(index, 1);
      this.saveTransportationEntries(); // Guardar cambios
      this.calculateNextId(); // Recalcular nextId después de eliminar
    }
  }
}
