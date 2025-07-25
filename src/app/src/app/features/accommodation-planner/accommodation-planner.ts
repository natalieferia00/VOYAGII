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
  photoUrl: string | ArrayBuffer | null; // URL de la imagen o base64 para preview (NO se guardará en localStorage)
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
    this.loadAccommodationEntries(); // Cargar datos al inicio
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
        // Verificar si los datos parseados son un array y no está vacío
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          this.accommodationEntries = parsedEntries;
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

    // Si no se cargaron datos exitosamente, inicializar con datos de ejemplo
    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de alojamiento inicializados.');
    }

    // Siempre calcular el nextId después de que this.accommodationEntries esté poblado
    this.calculateNextId();
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
    // Crear una copia profunda de accommodationEntries para modificarla antes de guardar
    const entriesToSave = JSON.parse(JSON.stringify(this.accommodationEntries)) as AccommodationEntry[];

    entriesToSave.forEach(entry => {
      // Establecer photoUrl a null antes de guardar en localStorage.
      // Esto evita el error de cuota por almacenar imágenes Base64.
      // La imagen solo se mostrará durante la sesión actual, no persistirá.
      entry.photoUrl = null;
    });

    localStorage.setItem('accommodationEntries', JSON.stringify(entriesToSave));
    console.log('Entradas de alojamiento guardadas en localStorage (sin URLs de fotos Base64).');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.accommodationEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    // Usamos un contador temporal para los IDs de los datos de ejemplo
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
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hotel', // URL de placeholder
        stars: 4,
        opinion: 'Excelente ubicación, servicio amable.'
      },
      {
        id: tempNextId++,
        type: 'Airbnb',
        name: 'Apartamento con vistas al Sena',
        url: 'https://airbnb.com/sena-view',
        price: 85,
        currency: 'EUR',
        checkInDate: '2024-11-15',
        checkOutDate: '2024-11-20',
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Airbnb', // URL de placeholder
        stars: 5,
        opinion: 'Muy acogedor, ideal para parejas.'
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
        photoUrl: 'https://placehold.co/60x40/E0E0E0/424242?text=Hostal', // URL de placeholder
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
    this.saveAccommodationEntries(); // Guardar cambios al cambiar las estrellas
  }

  /**
   * Añade una nueva entrada de alojamiento a la tabla.
   */
  addAccommodationEntry(): void {
    if (this.newEntryName && this.newEntryUrl && this.newEntryCheckInDate && this.newEntryCheckOutDate) {
      const newEntry: AccommodationEntry = {
        id: this.nextId++, // Usar el ID actual y luego incrementarlo
        type: this.newEntryType,
        name: this.newEntryName,
        url: this.newEntryUrl,
        price: this.newEntryPrice,
        currency: this.newEntryCurrency,
        checkInDate: this.newEntryCheckInDate,
        checkOutDate: this.newEntryCheckOutDate,
        photoUrl: this.newEntryPhotoPreviewUrl, // Usamos la URL de previsualización (se pondrá null al guardar)
        stars: this.newEntryStars,
        opinion: this.newEntryOpinion
      };
      this.accommodationEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
      this.saveAccommodationEntries(); // Guardar cambios
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
    this.saveAccommodationEntries(); // Guardar cambios al editar la opinión
    console.log(`Opinión actualizada para ${entry.name}: ${entry.opinion}`);
  }

  /**
   * Elimina una entrada de alojamiento de la tabla.
   * @param entryToRemove La entrada a eliminar.
   */
  removeEntry(entryToRemove: AccommodationEntry): void {
    const index = this.accommodationEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.accommodationEntries.splice(index, 1);
      this.saveAccommodationEntries(); // Guardar cambios
      this.calculateNextId(); // Recalcular nextId después de eliminar
    }
  }
}
