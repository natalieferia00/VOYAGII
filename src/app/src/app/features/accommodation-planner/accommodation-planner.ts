import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel

// Tipos de alojamiento
type AccommodationType = 'Hotel' | 'Hostal' | 'Airbnb' | 'Otro';

// Interfaz para una entrada de alojamiento
interface AccommodationEntry {
  id: number;
  type: AccommodationType;
  name: string;
  url: string;
  price: number | null;
  currency: string; // Ej: 'USD', 'EUR', 'COP'
  checkInDate: string;
  checkOutDate: string;
  photoUrl: string | ArrayBuffer | null; // URL de la imagen o base64 para preview
  stars: number | null; // 1-5 estrellas
  opinion: string; // Campo editable directamente en la tabla
}

@Component({
  selector: 'app-accommodation-planner',
  standalone: true,
  imports: [
    CommonModule, // Para *ngFor, *ngIf, y el pipe CurrencyPipe
    FormsModule   // Para ngModel
  ],
  templateUrl: './accommodation-planner.html',
  styleUrls: ['./accommodation-planner.scss']
})
export class AccommodationPlannerComponent implements OnInit {
  accommodationEntries: AccommodationEntry[] = [];
  nextId: number = 1;

  // Propiedades para el formulario de nueva entrada
  newEntryType: AccommodationType = 'Hotel';
  newEntryName: string = '';
  newEntryUrl: string = '';
  newEntryPrice: number | null = null;
  newEntryCurrency: string = 'USD'; // Moneda por defecto
  newEntryCheckInDate: string = '';
  newEntryCheckOutDate: string = '';
  newEntryPhotoFile: File | null = null; // Para el archivo de la foto
  newEntryPhotoPreviewUrl: string | ArrayBuffer | null = null; // Para la vista previa de la foto
  newEntryStars: number | null = null;
  newEntryOpinion: string = '';

  // Opciones para los selectores
  accommodationTypes: AccommodationType[] = ['Hotel', 'Hostal', 'Airbnb', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY']; // Monedas comunes

  constructor() { }

  ngOnInit(): void {
    // Cargar entradas de ejemplo
    this.accommodationEntries = [
      {
        id: this.nextId++,
        type: 'Hotel',
        name: 'Hotel Plaza Mayor',
        url: 'https://hotelplazamayor.com',
        price: 120,
        currency: 'USD',
        checkInDate: '2024-10-05',
        checkOutDate: '2024-10-10',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hotel',
        stars: 4,
        opinion: 'Excelente ubicación, servicio amable.'
      },
      {
        id: this.nextId++,
        type: 'Airbnb',
        name: 'Apartamento con vistas al Sena',
        url: 'https://airbnb.com/sena-view',
        price: 85,
        currency: 'EUR',
        checkInDate: '2024-11-15',
        checkOutDate: '2024-11-20',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Airbnb',
        stars: 5,
        opinion: 'Muy acogedor, ideal para parejas.'
      },
      {
        id: this.nextId++,
        type: 'Hostal',
        name: 'Hostal Viajero Feliz',
        url: 'https://hostalviajero.com',
        price: 25,
        currency: 'USD',
        checkInDate: '2025-01-01',
        checkOutDate: '2025-01-05',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hostal',
        stars: 3,
        opinion: 'Económico y con buen ambiente, pero ruidoso.'
      }
    ];
  }

  /**
   * Maneja la selección de un archivo de imagen para la vista previa.
   */
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

  /**
   * Establece la calificación de estrellas para la nueva entrada.
   */
  setNewEntryStars(star: number): void {
    this.newEntryStars = star;
  }

  /**
   * Añade una nueva entrada de alojamiento a la tabla.
   */
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
        photoUrl: this.newEntryPhotoPreviewUrl, // Usamos la URL de previsualización
        stars: this.newEntryStars,
        opinion: this.newEntryOpinion
      };
      this.accommodationEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
    } else {
      alert('Por favor, completa los campos obligatorios: Nombre, URL, Fecha de Entrada y Fecha de Salida.');
    }
  }

  /**
   * Restablece los campos del formulario.
   */
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
  }

  /**
   * Abre la URL de la entrada en una nueva pestaña.
   */
  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Maneja la actualización de la opinión directamente en la tabla.
   * @param entry La entrada de la tabla que se está editando.
   * @param event El evento de entrada (input event).
   */
  onOpinionChange(entry: AccommodationEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.opinion = target.innerText;
    // Aquí podrías guardar el cambio en un servicio o base de datos si tuvieras uno
    console.log(`Opinión actualizada para ${entry.name}: ${entry.opinion}`);
  }
}
