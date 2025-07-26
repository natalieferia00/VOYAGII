import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdditionalGeneralInfo } from '../../../../shared/components/interfaces/additional-general-info.interface';


// Tipos de alojamiento
type AccommodationType = 'Hotel' | 'Hostal' | 'Airbnb' | 'Otro';

// Nuevos estados de alojamiento
export type AccommodationStatus = 'Solo Visto' | 'En Espera' | 'Reservado'; // Exportamos para el gráfico

// Interfaz para una entrada de alojamiento
export interface AccommodationEntry {
  id: number;
  type: AccommodationType;
  name: string;
  url: string;
  price: number | null;
  currency: string; // Ej: 'USD', 'EUR', 'COP'
  checkInDate: string;
  checkOutDate: string;
  photoUrl: string | ArrayBuffer | null; // URL de la imagen o base64 para preview (NO se guardará en localStorage)
  stars: number | null; // 1-5 estrellas
  opinion: string; // Campo editable directamente en la tabla
  status: AccommodationStatus; // Nuevo: Estado del alojamiento
}

@Component({
  selector: 'app-accommodation-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe // Asegúrate de que CurrencyPipe esté disponible
  ],
  templateUrl: './accommodation-planner.html',
  styleUrls: ['./accommodation-planner.scss']
})
export class AccommodationPlannerComponent implements OnInit {
  accommodationEntries: AccommodationEntry[] = [];
  nextId: number = 1;

  // Presupuesto de alojamiento desde Información General
  accommodationBudget: number | null = null;
  totalAccommodationCost: number = 0; // Nuevo: total gastado en alojamientos

  // Propiedades para el formulario de nueva entrada
  newEntryType: AccommodationType = 'Hotel';
  newEntryName: string = '';
  newEntryUrl: string = '';
  newEntryPrice: number | null = null;
  newEntryCurrency: string = 'USD'; // Moneda por defecto
  newEntryCheckInDate: string = '';
  newEntryCheckOutDate: string = '';
  newEntryPhotoFile: File | null = null;
  newEntryPhotoPreviewUrl: string | ArrayBuffer | null = null;
  newEntryStars: number | null = null;
  newEntryOpinion: string = '';
  newEntryStatus: AccommodationStatus = 'Solo Visto'; // Nuevo: Estado por defecto

  // Opciones para los selectores
  accommodationTypes: AccommodationType[] = ['Hotel', 'Hostal', 'Airbnb', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];
  accommodationStatusOptions: AccommodationStatus[] = ['Solo Visto', 'En Espera', 'Reservado']; // Opciones de estado

  constructor() { }

  ngOnInit(): void {
    this.loadAccommodationEntries(); // Cargar datos de alojamientos
    this.loadAccommodationBudget(); // Cargar el presupuesto de alojamiento
    this.calculateTotalAccommodationCost(); // Calcular el costo total inicial
  }

  /**
   * Carga el presupuesto de alojamiento desde localStorage.
   */
  private loadAccommodationBudget(): void {
    const storedAddInfo = localStorage.getItem('additionalGeneralInfo');
    if (storedAddInfo) {
      try {
        const parsedAddInfo: AdditionalGeneralInfo = JSON.parse(storedAddInfo);
        this.accommodationBudget = parsedAddInfo.accommodationBudget;
        console.log('Presupuesto de alojamiento cargado:', this.accommodationBudget);
      } catch (e) {
        console.error('Error al parsear información adicional desde localStorage para presupuesto de alojamiento:', e);
        this.accommodationBudget = null;
      }
    } else {
      console.log('No hay información adicional guardada para el presupuesto de alojamiento.');
      this.accommodationBudget = null;
    }
  }

  /**
   * Calcula el costo total de todos los alojamientos.
   * Asume que todos los precios están en la misma moneda (USD en este ejemplo simple).
   * Si las monedas fueran diferentes, necesitarías tasas de conversión.
   */
  private calculateTotalAccommodationCost(): void {
    this.totalAccommodationCost = this.accommodationEntries.reduce((sum, entry) => {
      // Solo suma si el precio no es null y es en USD (o la moneda base que decidas)
      // Para una solución más robusta, deberías convertir a una moneda base común si tienes múltiples monedas.
      if (entry.price !== null && entry.currency === 'USD') { // Ajusta la moneda base si es necesario
        return sum + entry.price;
      }
      return sum;
    }, 0);
    console.log('Costo total de alojamientos:', this.totalAccommodationCost);
  }

  /**
   * Obtiene la clase CSS para el estado del presupuesto.
   */
  getBudgetStatusClass(): string {
    if (this.accommodationBudget === null || this.accommodationBudget === 0) {
      return 'budget-status-info'; // No hay presupuesto definido o es cero
    }
    const remaining = this.accommodationBudget - this.totalAccommodationCost;
    if (remaining < 0) {
      return 'budget-status-exceeded'; // Excedido
    } else if (remaining <= this.accommodationBudget * 0.15) { // Advertencia si queda el 15% o menos
      return 'budget-status-warning'; // Cerca de exceder
    } else {
      return 'budget-status-ok'; // Dentro del presupuesto
    }
  }

  /**
   * Obtiene el mensaje del estado del presupuesto.
   */
  getBudgetStatusMessage(): string {
    if (this.accommodationBudget === null) {
      return 'Presupuesto de alojamiento no definido en Información General.';
    }
    if (this.accommodationBudget === 0) {
        return 'Presupuesto de alojamiento es cero. No hay límite establecido.';
    }

    const remaining = this.accommodationBudget - this.totalAccommodationCost;
    const formattedRemaining = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(remaining));

    if (remaining < 0) {
      return `¡ATENCIÓN! Has excedido tu presupuesto de alojamiento por ${formattedRemaining}.`;
    } else if (remaining <= this.accommodationBudget * 0.15) {
      return `ADVERTENCIA: Te quedan ${formattedRemaining} de tu presupuesto de alojamiento. ¡Estás cerca del límite!`;
    } else {
      return `Tienes ${formattedRemaining} restantes de tu presupuesto de alojamiento.`;
    }
  }

  /**
   * Carga las entradas de alojamiento desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadAccommodationEntries(): void {
    const storedEntries = localStorage.getItem('accommodationEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: AccommodationEntry[] = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          // Asegúrate de que las entradas cargadas tengan la propiedad 'status'
          this.accommodationEntries = parsedEntries.map(entry => ({
            ...entry,
            status: entry.status || 'Solo Visto' // Asigna un valor por defecto si no existe
          }));
          console.log('Entradas de alojamiento cargadas desde localStorage:', this.accommodationEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de alojamiento vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de alojamiento desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de alojamiento en localStorage.');
    }

    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de alojamiento inicializados.');
    }

    this.calculateNextId();
    this.calculateTotalAccommodationCost(); // Recalcular al cargar
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.accommodationEntries.length > 0) {
      maxId = Math.max(...this.accommodationEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for accommodations: ${this.nextId}`);
  }

  /**
   * Guarda las entradas de alojamiento en localStorage.
   * Excluye las URLs de fotos (Base64) para evitar exceder la cuota de localStorage.
   */
  private saveAccommodationEntries(): void {
    const entriesToSave = JSON.parse(JSON.stringify(this.accommodationEntries)) as AccommodationEntry[];

    entriesToSave.forEach(entry => {
      entry.photoUrl = null; // Establecer photoUrl a null antes de guardar
    });

    localStorage.setItem('accommodationEntries', JSON.stringify(entriesToSave));
    console.log('Entradas de alojamiento guardadas en localStorage (sin URLs de fotos Base64).');
    this.calculateTotalAccommodationCost(); // Recalcular al guardar
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.accommodationEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    let tempNextId = 1;

    this.accommodationEntries = [
      {
        id: tempNextId++,
        type: 'Hotel',
        name: 'Hotel Plaza Mayor',
        url: 'https://hotelplazamayor.com',
        price: 120,
        currency: 'USD',
        checkInDate: '2024-10-05',
        checkOutDate: '2024-10-10',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hotel',
        stars: 4,
        opinion: 'Excelente ubicación, servicio amable.',
        status: 'Reservado' // Ejemplo: Reservado
      },
      {
        id: tempNextId++,
        type: 'Airbnb',
        name: 'Apartamento con vistas al Sena',
        url: 'https://airbnb.com/sena-view',
        price: 85,
        currency: 'EUR', // Este precio no se sumará si la base es USD
        checkInDate: '2024-11-15',
        checkOutDate: '2024-11-20',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Airbnb',
        stars: 5,
        opinion: 'Muy acogedor, ideal para parejas.',
        status: 'En Espera' // Ejemplo: En Espera
      },
      {
        id: tempNextId++,
        type: 'Hostal',
        name: 'Hostal Viajero Feliz',
        url: 'https://hostalviajero.com',
        price: 25,
        currency: 'USD',
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-05',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hostal',
        stars: 3,
        opinion: 'Económico y con buen ambiente, pero ruidoso.',
        status: 'Solo Visto' // Ejemplo: Solo Visto
      }
    ];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newEntryPhotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newEntryPhotoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.newEntryPhotoFile);
    } else {
      this.newEntryPhotoFile = null;
      this.newEntryPhotoPreviewUrl = null;
    }
  }

  setNewEntryStars(star: number): void {
    this.newEntryStars = star;
  }

  addAccommodationEntry(): void {
    if (this.newEntryName && this.newEntryUrl && this.newEntryCheckInDate && this.newEntryCheckOutDate) {
      const newEntry: AccommodationEntry = {
        id: this.nextId++,
        type: this.newEntryType,
        name: this.newEntryName,
        url: this.newEntryUrl,
        price: this.newEntryPrice,
        currency: this.newEntryCurrency,
        checkInDate: this.newEntryCheckInDate,
        checkOutDate: this.newEntryCheckOutDate,
        photoUrl: this.newEntryPhotoPreviewUrl,
        stars: this.newEntryStars,
        opinion: this.newEntryOpinion,
        status: this.newEntryStatus // Asigna el nuevo estado
      };
      this.accommodationEntries.push(newEntry);
      this.resetForm();
      this.saveAccommodationEntries();
    } else {
      alert('Por favor, completa los campos obligatorios: Nombre, URL, Fecha de Entrada y Fecha de Salida.');
    }
  }

  resetForm(): void {
    this.newEntryType = 'Hotel';
    this.newEntryName = '';
    this.newEntryUrl = '';
    this.newEntryPrice = null;
    this.newEntryCurrency = 'USD';
    this.newEntryCheckInDate = '';
    this.newEntryCheckOutDate = '';
    this.newEntryPhotoFile = null;
    this.newEntryPhotoPreviewUrl = null;
    this.newEntryStars = null;
    this.newEntryOpinion = '';
    this.newEntryStatus = 'Solo Visto'; // Reinicia el estado a por defecto
  }

  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  onOpinionChange(entry: AccommodationEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.opinion = target.innerText;
    this.saveAccommodationEntries();
    console.log(`Opinión actualizada para ${entry.name}: ${entry.opinion}`);
  }

  // Nuevo método para manejar el cambio de estado de alojamiento
  onStatusChange(entry: AccommodationEntry, event: Event): void {
    const target = event.target as HTMLSelectElement;
    entry.status = target.value as AccommodationStatus;
    this.saveAccommodationEntries(); // Guarda el cambio de estado
    console.log(`Estado de alojamiento actualizado para ${entry.name}: ${entry.status}`);
  }

  // Obtiene la clase CSS para el indicador de estado en la tabla
  getAccommodationStatusClass(status: AccommodationStatus): string {
    switch (status) {
      case 'Solo Visto':
        return 'status-solo-visto';
      case 'En Espera':
        return 'status-en-espera';
      case 'Reservado':
        return 'status-reservado';
      default:
        return '';
    }
  }

  removeEntry(entryToRemove: AccommodationEntry): void {
    const index = this.accommodationEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.accommodationEntries.splice(index, 1);
      this.saveAccommodationEntries();
      this.calculateNextId();
    }
  }
}
