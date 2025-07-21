import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf
import { FormsModule } from '@angular/forms'; // For ngModel

// Interface for a section within a travel route
interface RouteSection {
  id: number;
  date: string; // Date for this section (e.g., "2026-12-02")
  title: string; // Title of the section (e.g., "Flight Bogotá-Amsterdam")
  description: string; // Detailed description
  photoUrl: string | ArrayBuffer | null; // Optional photo for the section
}

// Interface for an entire travel route map
interface TravelRouteMap {
  id: number;
  name: string; // Name of the travel map (e.g., "Europe Trip 2026")
  startDate: string;
  endDate: string;
  sections: RouteSection[]; // Array of sections for this map
}

@Component({
  selector: 'app-travel-route-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './travel-route-planner.html',
  styleUrls: ['./travel-route-planner.scss']
})
export class TravelRoutePlannerComponent implements OnInit {
  travelMaps: TravelRouteMap[] = []; // List of all travel route maps
  nextMapId: number = 1; // For unique map IDs
  nextSectionId: number = 1; // For unique section IDs across all maps

  // Properties for creating a new travel map
  newMapName: string = '';
  newMapStartDate: string = '';
  newMapEndDate: string = '';

  // Properties for adding a new section to an active map
  activeMap: TravelRouteMap | null = null; // The map currently being edited/viewed
  newSectionDate: string = new Date().toISOString().substring(0, 10); // Default to current date
  newSectionTitle: string = '';
  newSectionDescription: string = '';
  newSectionPhotoFile: File | null = null;
  newSectionPhotoPreviewUrl: string | ArrayBuffer | null = null;

  constructor() { }

  ngOnInit(): void {
    // Load example data on init
    this.travelMaps = [
      {
        id: this.nextMapId++,
        name: 'Viaje a Europa 2026',
        startDate: '2026-12-01',
        endDate: '2026-12-15',
        sections: [
          { id: this.nextSectionId++, date: '2026-12-02', title: 'Vuelo Bogotá-Ámsterdam', description: 'Salida desde El Dorado, llegada al aeropuerto Schiphol.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Vuelo' },
          { id: this.nextSectionId++, date: '2026-12-03', title: 'Viaje en tren Ámsterdam-Gouda', description: 'Tren interurbano desde la Estación Central de Ámsterdam hasta Gouda.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Tren' },
          { id: this.nextSectionId++, date: '2026-12-04', title: 'Exploración de Gouda', description: 'Visita al mercado de queso y centro histórico.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Gouda' }
        ]
      },
      {
        id: this.nextMapId++,
        name: 'Viaje a Asia Diciembre 2026',
        startDate: '2026-12-20',
        endDate: '2027-01-05',
        sections: [
          { id: this.nextSectionId++, date: '2026-12-21', title: 'Vuelo Los Ángeles-Tokio', description: 'Vuelo transpacífico a Japón.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Vuelo+Asia' },
          { id: this.nextSectionId++, date: '2026-12-22', title: 'Llegada a Tokio y check-in', description: 'Alojamiento en el distrito de Shinjuku.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Tokio' }
        ]
      }
    ];

    // Set the first map as active by default if available
    if (this.travelMaps.length > 0) {
      this.activeMap = this.travelMaps[0];
    }
  }

  /**
   * Adds a new travel route map.
   */
  addTravelMap(): void {
    if (this.newMapName && this.newMapStartDate && this.newMapEndDate) {
      const newMap: TravelRouteMap = {
        id: this.nextMapId++,
        name: this.newMapName,
        startDate: this.newMapStartDate,
        endDate: this.newMapEndDate,
        sections: []
      };
      this.travelMaps.push(newMap);
      this.activeMap = newMap; // Set the newly created map as active
      this.resetNewMapForm(); // Clear the form
    } else {
      alert('Por favor, completa el nombre, fecha de inicio y fecha de fin para el nuevo mapa de ruta.');
    }
  }

  /**
   * Resets the new map form fields.
   */
  resetNewMapForm(): void {
    this.newMapName = '';
    this.newMapStartDate = '';
    this.newMapEndDate = '';
  }

  /**
   * Sets the active map to be viewed/edited.
   * @param map The map to set as active.
   */
  selectMap(map: TravelRouteMap): void {
    this.activeMap = map;
    this.resetNewSectionForm(); // Clear section form when changing map
  }

  /**
   * Handles file selection for a new section's photo.
   * @param event The file input event.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.newSectionPhotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newSectionPhotoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.newSectionPhotoFile);
    } else {
      this.newSectionPhotoFile = null;
      this.newSectionPhotoPreviewUrl = null;
    }
  }

  /**
   * Adds a new section to the active travel map.
   */
  addSectionToMap(): void {
    if (this.activeMap && this.newSectionDate && this.newSectionTitle && this.newSectionDescription) {
      const newSection: RouteSection = {
        id: this.nextSectionId++,
        date: this.newSectionDate,
        title: this.newSectionTitle,
        description: this.newSectionDescription,
        photoUrl: this.newSectionPhotoPreviewUrl
      };
      this.activeMap.sections.push(newSection);
      this.resetNewSectionForm(); // Clear the section form
    } else {
      alert('Por favor, completa la fecha, título y descripción para la nueva sección.');
    }
  }

  /**
   * Resets the new section form fields.
   */
  resetNewSectionForm(): void {
    this.newSectionDate = new Date().toISOString().substring(0, 10);
    this.newSectionTitle = '';
    this.newSectionDescription = '';
    this.newSectionPhotoFile = null;
    this.newSectionPhotoPreviewUrl = null;
  }

  /**
   * Handles content editing for section titles and descriptions directly in the view.
   * @param section The section being edited.
   * @param field The field name ('title' or 'description').
   * @param event The input event.
   */
  onContentChange(section: RouteSection, field: 'title' | 'description', event: Event): void {
    const target = event.target as HTMLElement;
    if (field === 'title') {
      section.title = target.innerText;
    } else if (field === 'description') {
      section.description = target.innerText;
    }
    // Here you could save the change to a service or database
    console.log(`Updated ${field} for section ${section.id}: ${target.innerText}`);
  }

  /**
   * Removes a travel map.
   * @param mapToRemove The map to remove.
   */
  removeMap(mapToRemove: TravelRouteMap): void {
    const index = this.travelMaps.findIndex(map => map.id === mapToRemove.id);
    if (index !== -1) {
      this.travelMaps.splice(index, 1);
      if (this.activeMap?.id === mapToRemove.id) {
        this.activeMap = this.travelMaps.length > 0 ? this.travelMaps[0] : null; // Select first map or null
      }
    }
  }

  /**
   * Removes a section from the active map.
   * @param sectionToRemove The section to remove.
   */
  removeSection(sectionToRemove: RouteSection): void {
    if (this.activeMap) {
      const index = this.activeMap.sections.findIndex(section => section.id === sectionToRemove.id);
      if (index !== -1) {
        this.activeMap.sections.splice(index, 1);
      }
    }
  }
}
