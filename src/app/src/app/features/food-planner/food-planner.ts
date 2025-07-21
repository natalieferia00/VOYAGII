import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule for directives, CurrencyPipe for currency formatting
import { FormsModule } from '@angular/forms'; // For ngModel

// Meal types
type MealType = 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Bebidas' | 'Otro';

// Interface for a food planning entry
interface FoodEntry {
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
}

@Component({
  selector: 'app-food-planner',
  standalone: true,
  imports: [
    CommonModule, // For structural directives like *ngFor, *ngIf
    FormsModule   // For two-way data binding with ngModel
  ],
  templateUrl: './food-planner.html',
  styleUrls: ['./food-planner.scss']
})
export class FoodPlannerComponent implements OnInit {
  foodEntries: FoodEntry[] = [];
  nextId: number = 1;

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

  // Options for select inputs
  mealTypes: MealType[] = ['Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Bebidas', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];

  constructor() { }

  ngOnInit(): void {
    // Load example entries on init
    this.foodEntries = [
      {
        id: this.nextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'Francia',
        city: 'París',
        mealType: 'Cena',
        restaurantName: 'Le Bistrot d\'André',
        cuisine: 'Francesa',
        estimatedCost: 50,
        currency: 'EUR',
        date: '2024-09-11',
        url: 'https://lebistrot.com',
        notes: 'Recomendado por locales, ambiente acogedor.'
      },
      {
        id: this.nextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        country: 'Italia',
        city: 'Roma',
        mealType: 'Almuerzo',
        restaurantName: 'Trattoria da Enzo al 29',
        cuisine: 'Italiana',
        estimatedCost: 30,
        currency: 'EUR',
        date: '2024-09-18',
        url: 'https://enzoal29.it',
        notes: 'Pasta casera increíble, reservar con antelación.'
      },
      {
        id: this.nextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        country: 'Japón',
        city: 'Tokio',
        mealType: 'Cena',
        restaurantName: 'Ichiran Ramen',
        cuisine: 'Japonesa',
        estimatedCost: 15,
        currency: 'JPY',
        date: '2025-04-05',
        url: 'https://ichiran.com',
        notes: 'Famoso por su ramen, experiencia única.'
      }
    ];
  }

  /**
   * Adds a new food planning entry to the table.
   */
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
        notes: this.newEntryNotes
      };
      this.foodEntries.push(newEntry);
      this.resetForm(); // Clear the form after adding
    } else {
      alert('Please complete all required fields: Trip Name, Trip Code, Country, City, Restaurant Name, and Date.');
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
    this.newEntryMealType = 'Almuerzo';
    this.newEntryRestaurantName = '';
    this.newEntryCuisine = '';
    this.newEntryEstimatedCost = null;
    this.newEntryCurrency = 'USD';
    this.newEntryDate = new Date().toISOString().substring(0, 10);
    this.newEntryUrl = '';
    this.newEntryNotes = '';
  }

  /**
   * Opens the URL of the entry in a new tab.
   */
  openUrl(url: string): void {
    if (url) { // Check if URL is not empty
      window.open(url, '_blank');
    }
  }

  /**
   * Handles the notes update directly in the table.
   * @param entry The table entry being edited.
   * @param event The input event.
   */
  onNotesChange(entry: FoodEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    // Here you could save the change to a service or database if you had one
    console.log(`Notes updated for ${entry.restaurantName}: ${entry.notes}`);
  }
}
