import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // Necesario para ngModel

// Tipos de categorías de ítems de equipaje
type ItemCategory = 'Ropa' | 'Electrónica' | 'Documentos' | 'Aseo Personal' | 'Salud' | 'Calzado' | 'Accesorios' | 'Otro';

// Interfaz para una entrada de la lista de equipaje
interface PackingEntry {
  id: number;
  tripName: string; // Nombre del viaje al que pertenece (ej. "Viaje a Europa 2024")
  tripCode: string; // Código para identificar el viaje (ej. "EUR24-001")
  category: ItemCategory; // Categoría del ítem (Ropa, Electrónica, etc.)
  itemName: string; // Nombre específico del ítem (ej. "Camiseta", "Cargador de móvil")
  quantity: number; // Cantidad del ítem
  weightKg: number | null; // Peso estimado en kg (opcional)
  notes: string; // Notas adicionales sobre el ítem
  packed: boolean; // Estado: ¿Ya está empacado?
}

@Component({
  selector: 'app-packing-planner',
  standalone: true,
  imports: [
    CommonModule, // Para directivas estructurales como *ngFor, *ngIf
    FormsModule   // Para el two-way data binding con ngModel
  ],
  templateUrl: './packing-planner.html',
  styleUrls: ['./packing-planner.scss']
})
export class PackingPlannerComponent implements OnInit {
  packingEntries: PackingEntry[] = [];
  nextId: number = 1;

  // Propiedades para el formulario de nueva entrada
  newEntryTripName: string = '';
  newEntryTripCode: string = '';
  newEntryCategory: ItemCategory = 'Ropa';
  newEntryItemName: string = '';
  newEntryQuantity: number = 1;
  newEntryWeightKg: number | null = null;
  newEntryNotes: string = '';

  // Opciones para el selector de categoría
  itemCategories: ItemCategory[] = ['Ropa', 'Electrónica', 'Documentos', 'Aseo Personal', 'Salud', 'Calzado', 'Accesorios', 'Otro'];

  constructor() { }

  ngOnInit(): void {
    this.loadPackingEntries(); // Cargar datos al inicio
  }

  /**
   * Carga las entradas de equipaje desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadPackingEntries(): void {
    const storedEntries = localStorage.getItem('packingEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: PackingEntry[] = JSON.parse(storedEntries);
        // Verificar si los datos parseados son un array y no está vacío
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          this.packingEntries = parsedEntries;
          console.log('Entradas de equipaje cargadas desde localStorage:', this.packingEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de equipaje vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de equipaje desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de equipaje en localStorage.');
    }

    // Si no se cargaron datos exitosamente, inicializar con datos de ejemplo
    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de equipaje inicializados.');
    }

    // Siempre calcular el nextId después de que this.packingEntries esté poblado
    this.calculateNextId();
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.packingEntries.length > 0) {
      maxId = Math.max(...this.packingEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for packing: ${this.nextId}`);
  }

  /**
   * Guarda las entradas de equipaje en localStorage.
   */
  private savePackingEntries(): void {
    localStorage.setItem('packingEntries', JSON.stringify(this.packingEntries));
    console.log('Entradas de equipaje guardadas en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.packingEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    // Usamos un contador temporal para los IDs de los datos de ejemplo
    let tempNextId = 1;

    this.packingEntries = [
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        category: 'Ropa',
        itemName: 'Camisetas',
        quantity: 5,
        weightKg: 0.5,
        notes: 'Ligeras y de secado rápido',
        packed: false
      },
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        category: 'Electrónica',
        itemName: 'Cámara DSLR',
        quantity: 1,
        weightKg: 1.2,
        notes: 'Con baterías extra y tarjeta SD',
        packed: true
      },
      {
        id: tempNextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        category: 'Documentos',
        itemName: 'Pasaporte',
        quantity: 1,
        weightKg: null,
        notes: 'Copia física y digital en la nube',
        packed: true
      },
      {
        id: tempNextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        category: 'Aseo Personal',
        itemName: 'Kit de viaje',
        quantity: 1,
        weightKg: 0.3,
        notes: 'Champú, jabón, pasta de dientes tamaño viaje',
        packed: false
      }
    ];
  }

  /**
   * Añade una nueva entrada a la lista de equipaje.
   */
  addPackingEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryItemName && this.newEntryQuantity > 0) {
      const newEntry: PackingEntry = {
        id: this.nextId++, // Usar el ID actual y luego incrementarlo
        tripName: this.newEntryTripName,
        tripCode: this.newEntryTripCode,
        category: this.newEntryCategory,
        itemName: this.newEntryItemName,
        quantity: this.newEntryQuantity,
        weightKg: this.newEntryWeightKg,
        notes: this.newEntryNotes,
        packed: false // Por defecto, no empacado
      };
      this.packingEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
      this.savePackingEntries(); // Guardar cambios
    } else {
      alert('Por favor, completa los campos obligatorios: Nombre del Viaje, Código del Viaje, Nombre del Ítem y Cantidad.');
    }
  }

  /**
   * Restablece los campos del formulario.
   */
  resetForm(): void {
    this.newEntryTripName = '';
    this.newEntryTripCode = '';
    this.newEntryCategory = 'Ropa';
    this.newEntryItemName = '';
    this.newEntryQuantity = 1;
    this.newEntryWeightKg = null;
    this.newEntryNotes = '';
  }

  /**
   * Alterna el estado 'packed' de una entrada.
   */
  togglePackedStatus(entry: PackingEntry): void {
    entry.packed = !entry.packed;
    console.log(`Estado de empacado para "${entry.itemName}" (${entry.tripName}) cambiado a: ${entry.packed ? 'Empacado' : 'No Empacado'}`);
    this.savePackingEntries(); // Guardar cambios al alternar el estado
  }

  /**
   * Maneja la actualización de las notas directamente en la tabla.
   * @param entry La entrada de la tabla que se está editando.
   * @param event El evento de entrada (input event).
   */
  onNotesChange(entry: PackingEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    this.savePackingEntries(); // Guardar cambios al editar las notas
    console.log(`Notas actualizadas para ${entry.itemName}: ${entry.notes}`);
  }

  /**
   * Elimina una entrada de equipaje de la tabla.
   * @param entryToRemove La entrada a eliminar.
   */
  removePackingEntry(entryToRemove: PackingEntry): void {
    const index = this.packingEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.packingEntries.splice(index, 1);
      this.savePackingEntries(); // Guardar cambios
      this.calculateNextId(); // Recalcular nextId después de eliminar
    }
  }
}
