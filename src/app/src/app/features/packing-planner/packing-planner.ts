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
    // Cargar entradas de ejemplo al iniciar
    this.packingEntries = [
      {
        id: this.nextId++,
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
        id: this.nextId++,
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
        id: this.nextId++,
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
        id: this.nextId++,
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
        id: this.nextId++,
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
    // Aquí podrías guardar el cambio en un servicio o base de datos si tuvieras uno
  }

  /**
   * Maneja la actualización de las notas directamente en la tabla.
   * @param entry La entrada de la tabla que se está editando.
   * @param event El evento de entrada (input event).
   */
  onNotesChange(entry: PackingEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    // Aquí podrías guardar el cambio en un servicio o base de datos si tuvieras uno
    console.log(`Notas actualizadas para ${entry.itemName}: ${entry.notes}`);
  }
}
