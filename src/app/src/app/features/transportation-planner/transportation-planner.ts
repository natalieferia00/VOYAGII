import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel
import { AdditionalGeneralInfo } from '../../../../shared/components/interfaces/additional-general-info.interface';


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
    FormsModule,  // For two-way data binding with ngModel
    CurrencyPipe  // Para formatear moneda en el HTML
  ],
  templateUrl: './transportation-planner.html',
  styleUrls: ['./transportation-planner.scss']
})
export class TransportationPlannerComponent implements OnInit {
  transportationEntries: TransportationEntry[] = [];
  nextId: number = 1;

  // Presupuesto de transporte desde Información General
  transportBudget: number | null = null;
  totalTransportationCost: number = 0; // Nuevo: total gastado en transporte

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
    this.loadTransportationEntries(); // Cargar datos de transporte
    this.loadTransportBudget(); // Cargar el presupuesto de transporte
    this.calculateTotalTransportationCost(); // Calcular el costo total inicial
  }

  /**
   * Carga el presupuesto de transporte desde localStorage.
   */
  private loadTransportBudget(): void {
    const storedAddInfo = localStorage.getItem('additionalGeneralInfo');
    if (storedAddInfo) {
      try {
        const parsedAddInfo: AdditionalGeneralInfo = JSON.parse(storedAddInfo);
        this.transportBudget = parsedAddInfo.transportBudget;
        console.log('Presupuesto de transporte cargado:', this.transportBudget);
      } catch (e) {
        console.error('Error al parsear información adicional desde localStorage para presupuesto de transporte:', e);
        this.transportBudget = null;
      }
    } else {
      console.log('No hay información adicional guardada para el presupuesto de transporte.');
      this.transportBudget = null;
    }
  }

  /**
   * Calcula el costo total de todos los transportes.
   * Asume que todos los precios están en la misma moneda (USD en este ejemplo simple).
   * Si las monedas fueran diferentes, necesitarías tasas de conversión.
   */
  private calculateTotalTransportationCost(): void {
    this.totalTransportationCost = this.transportationEntries.reduce((sum, entry) => {
      // Solo suma si el precio no es null y es en USD (o la moneda base que decidas)
      if (entry.price !== null && entry.currency === 'USD') { // Ajusta la moneda base si es necesario
        return sum + entry.price;
      }
      return sum;
    }, 0);
    console.log('Costo total de transporte:', this.totalTransportationCost);
  }

  /**
   * Obtiene la clase CSS para el estado del presupuesto de transporte.
   */
  getBudgetStatusClass(): string {
    if (this.transportBudget === null || this.transportBudget === 0) {
      return 'budget-status-info'; // No hay presupuesto definido o es cero
    }
    const remaining = this.transportBudget - this.totalTransportationCost;
    if (remaining < 0) {
      return 'budget-status-exceeded'; // Excedido
    } else if (remaining <= this.transportBudget * 0.15) { // Advertencia si queda el 15% o menos
      return 'budget-status-warning'; // Cerca de exceder
    } else {
      return 'budget-status-ok'; // Dentro del presupuesto
    }
  }

  /**
   * Obtiene el mensaje del estado del presupuesto de transporte.
   */
  getBudgetStatusMessage(): string {
    if (this.transportBudget === null) {
      return 'Presupuesto de transporte no definido en Información General.';
    }
    if (this.transportBudget === 0) {
        return 'Presupuesto de transporte es cero. No hay límite establecido.';
    }

    const remaining = this.transportBudget - this.totalTransportationCost;
    const formattedRemaining = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(remaining));

    if (remaining < 0) {
      return `¡ATENCIÓN! Has excedido tu presupuesto de transporte por ${formattedRemaining}.`;
    } else if (remaining <= this.transportBudget * 0.15) {
      return `ADVERTENCIA: Te quedan ${formattedRemaining} de tu presupuesto de transporte. ¡Estás cerca del límite!`;
    } else {
      return `Tienes ${formattedRemaining} restantes de tu presupuesto de transporte.`;
    }
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

    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de transporte inicializados.');
    }

    this.calculateNextId();
    this.calculateTotalTransportationCost(); // Recalcular al cargar
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
    this.calculateTotalTransportationCost(); // Recalcular al guardar
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.transportationEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
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
        currency: 'USD', // Asegúrate de que la moneda base coincida con la del presupuesto
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
        currency: 'USD', // Cambiado a USD para que sume al total de ejemplo
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

  addTransportationEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryCountry && this.newEntryCity &&
        this.newEntryCompany && this.newEntryDepartureDate && this.newEntryArrivalDate && this.newEntryUrl) {
      const newEntry: TransportationEntry = {
        id: this.nextId++,
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
      this.resetForm();
      this.saveTransportationEntries(); // Esto también recalcula el total
    } else {
      alert('Please complete all required fields: Trip Name, Trip Code, Country, City, Company, Departure Date, Arrival Date, and URL.');
    }
  }

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

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  onOpinionChange(entry: TransportationEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.opinion = target.innerText;
    this.saveTransportationEntries(); // Esto también recalcula el total
    console.log(`Opinion updated for ${entry.company} (${entry.transportType}): ${entry.opinion}`);
  }

  removeTransportation(entryToRemove: TransportationEntry): void {
    const index = this.transportationEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.transportationEntries.splice(index, 1);
      this.saveTransportationEntries(); // Esto también recalcula el total
      this.calculateNextId();
    }
  }
}