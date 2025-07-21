import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel

// Tipos de ítems adicionales
type ItemType = 'Seguro de Viaje' | 'Visado' | 'Equipaje Extra' | 'Tarjeta SIM Local' | 'Alquiler de Coche' | 'Otro';

// Interfaz para una entrada de seguros y extras
interface InsuranceEntry {
  id: number;
  tripName: string; // Nombre del viaje al que pertenece (ej. "Viaje a Europa 2024")
  tripCode: string; // Código para identificar el viaje (ej. "EUR24-001")
  itemType: ItemType; // Tipo de ítem (Seguro, Visado, etc.)
  itemName: string; // Nombre específico del ítem (ej. "Seguro IATI Mochilero")
  company: string; // Compañía o proveedor (ej. "IATI", "Embajada")
  price: number | null;
  currency: string;
  startDate: string; // Fecha de inicio de validez/cobertura
  endDate: string; // Fecha de fin de validez/cobertura
  url: string; // URL de compra, información o póliza
  notes: string; // Campo editable directamente en la tabla
}

@Component({
  selector: 'app-insurance-planner',
  standalone: true,
  imports: [
    CommonModule, // Para directivas estructurales como *ngFor, *ngIf
    FormsModule   // Para el two-way data binding con ngModel
  ],
  templateUrl: './insurance-planner.html',
  styleUrls: ['./insurance-planner.scss']
})
export class InsurancePlannerComponent implements OnInit {
  insuranceEntries: InsuranceEntry[] = [];
  nextId: number = 1;

  // Propiedades para el formulario de nueva entrada
  newEntryTripName: string = '';
  newEntryTripCode: string = '';
  newEntryItemType: ItemType = 'Seguro de Viaje';
  newEntryItemName: string = '';
  newEntryCompany: string = '';
  newEntryPrice: number | null = null;
  newEntryCurrency: string = 'USD';
  newEntryStartDate: string = '';
  newEntryEndDate: string = '';
  newEntryUrl: string = '';
  newEntryNotes: string = '';

  // Opciones para los selectores
  itemTypes: ItemType[] = ['Seguro de Viaje', 'Visado', 'Equipaje Extra', 'Tarjeta SIM Local', 'Alquiler de Coche', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];

  constructor() { }

  ngOnInit(): void {
    // Cargar entradas de ejemplo al iniciar
    this.insuranceEntries = [
      {
        id: this.nextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        itemType: 'Seguro de Viaje',
        itemName: 'Seguro IATI Mochilero',
        company: 'IATI Seguros',
        price: 85,
        currency: 'EUR',
        startDate: '2024-09-09',
        endDate: '2024-09-25',
        url: 'https://iati.es/poliza123',
        notes: 'Cobertura médica y de equipaje. Descargar póliza.'
      },
      {
        id: this.nextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        itemType: 'Tarjeta SIM Local',
        itemName: 'SIM Card Orange',
        company: 'Orange España',
        price: 20,
        currency: 'EUR',
        startDate: '2024-09-10',
        endDate: '2024-09-20',
        url: 'https://orange.es/sim-travel',
        notes: '10GB de datos, recargar si es necesario.'
      },
      {
        id: this.nextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        itemType: 'Visado',
        itemName: 'Visa Japón',
        company: 'Embajada de Japón',
        price: 0, // Algunas visas son gratuitas
        currency: 'USD',
        startDate: '2025-03-01',
        endDate: '2025-05-30',
        url: 'https://embajada-jp.org/visa-info',
        notes: 'Tramitar con 2 meses de antelación.'
      }
    ];
  }

  /**
   * Añade una nueva entrada de seguro/extra a la tabla.
   */
  addInsuranceEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryItemName &&
        this.newEntryCompany && this.newEntryStartDate && this.newEntryEndDate && this.newEntryUrl) {
      const newEntry: InsuranceEntry = {
        id: this.nextId++,
        tripName: this.newEntryTripName,
        tripCode: this.newEntryTripCode,
        itemType: this.newEntryItemType,
        itemName: this.newEntryItemName,
        company: this.newEntryCompany,
        price: this.newEntryPrice,
        currency: this.newEntryCurrency,
        startDate: this.newEntryStartDate,
        endDate: this.newEntryEndDate,
        url: this.newEntryUrl,
        notes: this.newEntryNotes
      };
      this.insuranceEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
    } else {
      alert('Por favor, completa todos los campos obligatorios: Nombre del Viaje, Código del Viaje, Nombre del Ítem, Compañía, Fecha Inicio, Fecha Fin y URL.');
    }
  }

  /**
   * Restablece los campos del formulario.
   */
  resetForm(): void {
    this.newEntryTripName = '';
    this.newEntryTripCode = '';
    this.newEntryItemType = 'Seguro de Viaje';
    this.newEntryItemName = '';
    this.newEntryCompany = '';
    this.newEntryPrice = null;
    this.newEntryCurrency = 'USD';
    this.newEntryStartDate = '';
    this.newEntryEndDate = '';
    this.newEntryUrl = '';
    this.newEntryNotes = '';
  }

  /**
   * Abre la URL de la entrada en una nueva pestaña.
   */
  openUrl(url: string): void {
    if (url) { // Check if URL is not empty
      window.open(url, '_blank');
    }
  }

  /**
   * Maneja la actualización de las notas directamente en la tabla.
   * @param entry La entrada de la tabla que se está editando.
   * @param event El evento de entrada (input event).
   */
  onNotesChange(entry: InsuranceEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    // Aquí podrías guardar el cambio en un servicio o base de datos si tuvieras uno
    console.log(`Notas actualizadas para ${entry.itemName}: ${entry.notes}`);
  }
}
