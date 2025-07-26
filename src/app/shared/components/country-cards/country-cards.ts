import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngFor

// Import the GeneralTripInfo interface (ensure this path is correct)
import { GeneralTripInfo } from '../../../shared/components/interfaces/general-trip-info.interface';

@Component({
  selector: 'app-country-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-cards.html', // Corrected to .html
  styleUrls: ['./country-cards.scss'] // Corrected to .scss
})
export class CountryCardsComponent implements OnInit, OnDestroy {
  // List of countries/words to display as cards
  countries: string[] = [];
  // Flag to indicate if no countries have been entered yet
  noCountriesEntered: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.loadCountries();
    // Listen for changes in localStorage to reactively update the cards
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener('storage', this.onStorageChange.bind(this));
  }

  /**
   * Handles changes in localStorage.
   * @param event The StorageEvent object.
   */
  private onStorageChange(event: StorageEvent): void {
    if (event.key === 'generalTripInfo') { // Check if the relevant key changed
      this.loadCountries(); // Reload countries if generalTripInfo changes
    }
  }

  /**
   * Loads the comma-separated list of countries from localStorage
   * and populates the 'countries' array.
   */
  private loadCountries(): void {
    const storedInfoStr = localStorage.getItem('generalTripInfo');
    if (storedInfoStr) {
      try {
        const generalInfo: GeneralTripInfo = JSON.parse(storedInfoStr);
        // Ensure plannedCountriesList exists before splitting
        if (generalInfo.plannedCountriesList) {
          // Split the string by comma, trim whitespace, and filter out empty strings
          this.countries = generalInfo.plannedCountriesList
            .split(',')
            .map((country: string) => country.trim())
            .filter((country: string) => country.length > 0); // Removed 'any[]' from filter type
          this.noCountriesEntered = this.countries.length === 0;
        } else {
          this.countries = [];
          this.noCountriesEntered = true;
        }
      } catch (e) {
        console.error('Error parsing generalTripInfo from localStorage:', e);
        this.countries = [];
        this.noCountriesEntered = true;
      }
    } else {
      this.countries = [];
      this.noCountriesEntered = true;
    }
    console.log('Loaded countries for cards:', this.countries);
  }
}
