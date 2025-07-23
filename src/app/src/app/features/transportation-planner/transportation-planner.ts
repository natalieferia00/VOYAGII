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
removeTransportation(_t235: TransportationEntry) {
throw new Error('Method not implemented.');
}
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
    // Load example entries on init
    this.transportationEntries = [
      {
        id: this.nextId++,
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
        id: this.nextId++,
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
        id: this.nextId++,
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
      this.resetForm(); // Clear the form after adding
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
    // Here you could save the change to a service or database if you had one
    console.log(`Opinion updated for ${entry.company} (${entry.transportType}): ${entry.opinion}`);
  }
}
