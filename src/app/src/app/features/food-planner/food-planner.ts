import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule for directives, CurrencyPipe for currency formatting
import { FormsModule } from '@angular/forms'; // For ngModel
import { AdditionalGeneralInfo } from '../../../../shared/components/interfaces/additional-general-info.interface';


// Meal types
type MealType = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Bebidas' | 'Otro';

// Nuevos estados de alimentación - ¡EXPORTADOS para el gráfico!
export type FoodStatus = 'Idea' | 'Recomendación' | 'En Espera' | 'Reservado' | 'Visitado' | 'No Aplica';

// Interface for a food planning entry - AHORA CON ESTADO
export interface FoodEntry {
  id: number;
  tripName: string; // Name of the trip it belongs to (e.g., "Europe Trip 2024")
  tripCode: string; // Code to identify the trip (e.g., "EUR24-001")
  country: string;
  city: string;
  mealType: MealType;
  restaurantName: string; // Restaurant, cafe, market, etc.
  cuisine: string; // Type of food (e.g., "Italian", "Local", "Vegetarian")
  estimatedCost: number | null;
  currency: string;
  date: string; // Date of the meal/planning
  url: string; // URL for reservation, menu, or review
  notes: string; // Editable field directly in the table
  status: FoodStatus; // Nuevo: Estado de la entrada de comida
}

@Component({
  selector: 'app-food-planner',
  standalone: true,
  imports: [
    CommonModule, // For structural directives like *ngFor, *ngIf
    FormsModule,  // For two-way data binding with ngModel
    CurrencyPipe  // Para formatear moneda en el HTML
  ],
  templateUrl: './food-planner.html',
  styleUrls: ['./food-planner.scss']
})
export class FoodPlannerComponent implements OnInit {
  foodEntries: FoodEntry[] = [];
  nextId: number = 1;

  // Presupuesto de alimentación desde Información General
  foodBudget: number | null = null;
  totalFoodCost: number = 0; // Nuevo: total gastado en alimentación

  // Form properties for new entry
  newEntryTripName: string = '';
  newEntryTripCode: string = '';
  newEntryCountry: string = '';
  newEntryCity: string = '';
  newEntryMealType: MealType = 'Almuerzo';
  newEntryRestaurantName: string = '';
  newEntryCuisine: string = '';
  newEntryEstimatedCost: number | null = null;
  newEntryCurrency: string = 'USD';
  newEntryDate: string = new Date().toISOString().substring(0, 10); // Default to current date
  newEntryUrl: string = '';
  newEntryNotes: string = '';
  newEntryStatus: FoodStatus = 'Idea'; // Nuevo: Estado inicial por defecto

  // Options for select inputs
  mealTypes: MealType[] = ['Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Bebidas', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];
  // Opciones de estado para alimentación
  foodStatusOptions: FoodStatus[] = ['Idea', 'Recomendación', 'En Espera', 'Reservado', 'Visitado', 'No Aplica'];

  constructor() { }

  ngOnInit(): void {
    this.loadFoodEntries(); // Cargar datos de comida
    this.loadFoodBudget(); // Cargar el presupuesto de comida
    this.calculateTotalFoodCost(); // Calcular el costo total inicial
  }

  /**
   * Carga el presupuesto de alimentación desde localStorage.
   */
  private loadFoodBudget(): void {
    const storedAddInfo = localStorage.getItem('additionalGeneralInfo');
    if (storedAddInfo) {
      try {
        const parsedAddInfo: AdditionalGeneralInfo = JSON.parse(storedAddInfo);
        this.foodBudget = parsedAddInfo.foodBudget;
        console.log('Presupuesto de alimentación cargado:', this.foodBudget);
      } catch (e) {
        console.error('Error al parsear información adicional desde localStorage para presupuesto de alimentación:', e);
        this.foodBudget = null;
      }
    } else {
      console.log('No hay información adicional guardada para el presupuesto de alimentación.');
      this.foodBudget = null;
    }
  }

  /**
   * Calcula el costo total de todas las entradas de comida.
   * Asume que todos los precios están en la misma moneda (USD en este ejemplo simple).
   * Si las monedas fueran diferentes, necesitarías tasas de conversión.
   */
  private calculateTotalFoodCost(): void {
    this.totalFoodCost = this.foodEntries.reduce((sum, entry) => {
      // Solo suma si el precio no es null y es en USD (o la moneda base que decidas)
      if (entry.estimatedCost !== null && entry.currency === 'USD') { // Ajusta la moneda base si es necesario
        return sum + entry.estimatedCost;
      }
      return sum;
    }, 0);
    console.log('Costo total de alimentación:', this.totalFoodCost);
  }

  /**
   * Obtiene la clase CSS para el estado del presupuesto de alimentación.
   */
  getBudgetStatusClass(): string {
    if (this.foodBudget === null || this.foodBudget === 0) {
      return 'budget-status-info'; // No hay presupuesto definido o es cero
    }
    const remaining = this.foodBudget - this.totalFoodCost;
    if (remaining < 0) {
      return 'budget-status-exceeded'; // Excedido
    } else if (remaining <= this.foodBudget * 0.15) { // Advertencia si queda el 15% o menos
      return 'budget-status-warning'; // Cerca de exceder
    } else {
      return 'budget-status-ok'; // Dentro del presupuesto
    }
  }

  /**
   * Obtiene el mensaje del estado del presupuesto de alimentación.
   */
  getBudgetStatusMessage(): string {
    if (this.foodBudget === null) {
      return 'Presupuesto de alimentación no definido en Información General.';
    }
    if (this.foodBudget === 0) {
        return 'Presupuesto de alimentación es cero. No hay límite establecido.';
    }

    const remaining = this.foodBudget - this.totalFoodCost;
    const formattedRemaining = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(remaining));

    if (remaining < 0) {
      return `¡ATENCIÓN! Has excedido tu presupuesto de alimentación por ${formattedRemaining}.`;
    } else if (remaining <= this.foodBudget * 0.15) {
      return `ADVERTENCIA: Te quedan ${formattedRemaining} de tu presupuesto de alimentación. ¡Estás cerca del límite!`;
    } else {
      return `Tienes ${formattedRemaining} restantes de tu presupuesto de alimentación.`;
    }
  }

  /**
   * Carga las entradas de planificación de comida desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadFoodEntries(): void {
    const storedEntries = localStorage.getItem('foodEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: FoodEntry[] = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          // Asegúrate de que las entradas cargadas tengan la propiedad 'status'
          this.foodEntries = parsedEntries.map(entry => ({
            ...entry,
            status: entry.status || 'Idea' // Asigna un valor por defecto si no existe
          }));
          console.log('Entradas de comida cargadas desde localStorage:', this.foodEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de comida vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de comida desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de comida en localStorage.');
    }

    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de comida inicializados.');
    }

    this.calculateNextId();
    this.calculateTotalFoodCost(); // Recalcular al cargar
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.foodEntries.length > 0) {
      maxId = Math.max(...this.foodEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for food planner: ${this.nextId}`);
  }

  /**
   * Guarda las entradas de planificación de comida en localStorage.
   */
  private saveFoodEntries(): void {
    localStorage.setItem('foodEntries', JSON.stringify(this.foodEntries));
    console.log('Entradas de comida guardadas en localStorage.');
    this.calculateTotalFoodCost(); // Recalcular al guardar
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.foodEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    let tempNextId = 1;

    this.foodEntries = [
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'Francia',
        city: 'París',
        mealType: 'Cena',
        restaurantName: 'Le Bistrot d\'André',
        cuisine: 'Francesa',
        estimatedCost: 50,
        currency: 'USD',
        date: '2024-09-11',
        url: 'https://lebistrot.com',
        notes: 'Recomendado por locales, ambiente acogedor.',
        status: 'Reservado' // Ejemplo: Reservado
      },
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'Italia',
        city: 'Roma',
        mealType: 'Almuerzo',
        restaurantName: 'Trattoria da Enzo al 29',
        cuisine: 'Italiana',
        estimatedCost: 30,
        currency: 'USD',
        date: '2024-09-18',
        url: 'https://enzoal29.it',
        notes: 'Pasta casera increíble, reservar con antelación.',
        status: 'En Espera' // Ejemplo: En Espera
      },
      {
        id: tempNextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        country: 'Japón',
        city: 'Tokio',
        mealType: 'Cena',
        restaurantName: 'Ichiran Ramen',
        cuisine: 'Japonesa',
        estimatedCost: 15,
        currency: 'USD',
        date: '2025-04-05',
        url: 'https://ichiran.com',
        notes: 'Famoso por su ramen, experiencia única.',
        status: 'Idea' // Ejemplo: Idea
      },
      {
        id: tempNextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        country: 'Japón',
        city: 'Kioto',
        mealType: 'Snack',
        restaurantName: 'Mercado de Nishiki',
        cuisine: 'Local',
        estimatedCost: 10,
        currency: 'JPY',
        date: '2025-04-07',
        url: '',
        notes: 'Probar takoyaki y mochi.',
        status: 'Recomendación' // Ejemplo: Recomendación
      },
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'España',
        city: 'Barcelona',
        mealType: 'Cena',
        restaurantName: 'El Quim de la Boqueria',
        cuisine: 'Española',
        estimatedCost: 40,
        currency: 'EUR',
        date: '2024-09-25',
        url: 'https://elquimdelaboqueria.com',
        notes: 'Tapas excelentes, ambiente de mercado.',
        status: 'Visitado' // Ejemplo: Visitado
      }
    ];
  }

  addFoodEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryCountry && this.newEntryCity &&
        this.newEntryRestaurantName && this.newEntryDate) {
      const newEntry: FoodEntry = {
        id: this.nextId++,
        tripName: this.newEntryTripName,
        tripCode: this.newEntryTripCode,
        country: this.newEntryCountry,
        city: this.newEntryCity,
        mealType: this.newEntryMealType,
        restaurantName: this.newEntryRestaurantName,
        cuisine: this.newEntryCuisine,
        estimatedCost: this.newEntryEstimatedCost,
        currency: this.newEntryCurrency,
        date: this.newEntryDate,
        url: this.newEntryUrl,
        notes: this.newEntryNotes,
        status: this.newEntryStatus // Asigna el nuevo estado
      };
      this.foodEntries.push(newEntry);
      this.resetForm();
      this.saveFoodEntries(); // Esto también recalcula el total
    } else {
      alert('Por favor, completa los campos obligatorios: Nombre del Viaje, Código del Viaje, País, Ciudad, Restaurante/Lugar y Fecha.');
    }
  }

  resetForm(): void {
    this.newEntryTripName = '';
    this.newEntryTripCode = '';
    this.newEntryCountry = '';
    this.newEntryCity = '';
    this.newEntryMealType = 'Almuerzo';
    this.newEntryRestaurantName = '';
    this.newEntryCuisine = '';
    this.newEntryEstimatedCost = null;
    this.newEntryCurrency = 'USD';
    this.newEntryDate = new Date().toISOString().substring(0, 10);
    this.newEntryUrl = '';
    this.newEntryNotes = '';
    this.newEntryStatus = 'Idea'; // Reinicia el estado a por defecto
  }

  openUrl(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onNotesChange(entry: FoodEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    this.saveFoodEntries(); // Esto también recalcula el total
    console.log(`Notes updated for ${entry.restaurantName}: ${entry.notes}`);
  }

  // Nuevo método para manejar el cambio de estado de alimentación
  onStatusChange(entry: FoodEntry, event: Event): void {
    const target = event.target as HTMLSelectElement;
    entry.status = target.value as FoodStatus;
    this.saveFoodEntries(); // Guarda el cambio de estado
    console.log(`Estado de alimentación actualizado para ${entry.restaurantName}: ${entry.status}`);
  }

  // Obtiene la clase CSS para el indicador de estado en la tabla
  getFoodStatusClass(status: FoodStatus): string {
    switch (status) {
      case 'Idea':
        return 'status-idea';
      case 'Recomendación':
        return 'status-recomendacion';
      case 'En Espera':
        return 'status-en-espera';
      case 'Reservado':
        return 'status-reservado';
      case 'Visitado':
        return 'status-visitado';
      case 'No Aplica':
        return 'status-no-aplica';
      default:
        return '';
    }
  }

  removeFoodEntry(entryToRemove: FoodEntry): void {
    const index = this.foodEntries.findIndex(entry => entry.id === entryToRemove.id);
    if (index !== -1) {
      this.foodEntries.splice(index, 1);
      this.saveFoodEntries(); // Esto también recalcula el total
      this.calculateNextId();
    }
  }
}
