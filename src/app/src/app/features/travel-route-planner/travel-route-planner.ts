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
  nextSectionId: number = 1; // For unique section IDs across all maps (global counter)

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
  isLast: any; // Esta propiedad no parece usarse, puedes considerarla para eliminarla si no es necesaria.

  constructor() { }

  ngOnInit(): void {
    this.loadTravelMaps(); // Cargar datos al inicio
    // Establecer el primer mapa como activo por defecto si hay alguno
    if (this.travelMaps.length > 0) {
      this.activeMap = this.travelMaps[0];
    }
  }

  /**
   * Carga los mapas de ruta desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadTravelMaps(): void {
    const storedMaps = localStorage.getItem('travelRouteMaps');
    let loadedSuccessfully = false;

    if (storedMaps) {
      try {
        const parsedMaps: TravelRouteMap[] = JSON.parse(storedMaps);
        // Verificar si los datos parseados son un array y no está vacío
        if (Array.isArray(parsedMaps) && parsedMaps.length > 0) {
          this.travelMaps = parsedMaps;
          console.log('Mapas de ruta cargados desde localStorage:', this.travelMaps);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de mapas vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear mapas de ruta desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de mapas en localStorage.');
    }

    // Si no se cargaron datos exitosamente, inicializar con datos de ejemplo
    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo inicializados.');
    }

    // Siempre calcular los IDs después de que this.travelMaps esté poblado
    this.calculateNextIds();
  }

  /**
   * Calcula los IDs siguientes basándose en los IDs más altos existentes.
   * Esto asegura que los nuevos IDs sean únicos, ya sea que los datos provengan de localStorage o de ejemplo.
   */
  private calculateNextIds(): void {
    let maxMapId = 0;
    let maxSectionId = 0;

    if (this.travelMaps.length > 0) {
      maxMapId = Math.max(...this.travelMaps.map(map => map.id));
      this.travelMaps.forEach(map => {
        if (map.sections && map.sections.length > 0) { // Asegúrate de que sections exista
          maxSectionId = Math.max(maxSectionId, ...map.sections.map(section => section.id));
        }
      });
    }
    this.nextMapId = maxMapId + 1;
    this.nextSectionId = maxSectionId + 1;
    console.log(`Calculated nextMapId: ${this.nextMapId}, nextSectionId: ${this.nextSectionId}`);
  }

  /**
   * Guarda los mapas de ruta en localStorage.
   * Excluye las URLs de fotos (Base64) para evitar exceder la cuota de localStorage.
   */
  private saveTravelMaps(): void {
    // Crear una copia profunda de travelMaps para modificarla antes de guardar
    // sin afectar el estado actual del componente.
    const mapsToSave = JSON.parse(JSON.stringify(this.travelMaps)) as TravelRouteMap[];

    mapsToSave.forEach(map => {
      map.sections.forEach(section => {
        // Establecer photoUrl a null antes de guardar en localStorage.
        // Esto evita el error de cuota por almacenar imágenes Base64.
        // La imagen solo se mostrará durante la sesión actual, no persistirá.
        section.photoUrl = null;
      });
    });

    localStorage.setItem('travelRouteMaps', JSON.stringify(mapsToSave));
    console.log('Mapas de ruta guardados en localStorage (sin URLs de fotos Base64).');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.travelMaps.
   * NO debe guardar directamente en localStorage ni calcular next IDs aquí.
   */
  private initializeExampleData(): void {
    // Usamos un contador temporal para los IDs de los datos de ejemplo,
    // ya que nextMapId/nextSectionId se calcularán globalmente después.
    let tempNextMapId = 1;
    let tempNextSectionId = 1;

    this.travelMaps = [
      {
        id: tempNextMapId++,
        name: 'Viaje a Europa 2026',
        startDate: '2026-12-01',
        endDate: '2026-12-15',
        sections: [
          { id: tempNextSectionId++, date: '2026-12-02', title: 'Vuelo Bogotá-Ámsterdam', description: 'Salida desde El Dorado, llegada al aeropuerto Schiphol.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Vuelo' },
          { id: tempNextSectionId++, date: '2026-12-03', title: 'Viaje en tren Ámsterdam-Gouda', description: 'Tren interurbano desde la Estación Central de Ámsterdam hasta Gouda.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Tren' },
          { id: tempNextSectionId++, date: '2026-12-04', title: 'Exploración de Gouda', description: 'Visita al mercado de queso y centro histórico.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Gouda' }
        ]
      },
      {
        id: tempNextMapId++,
        name: 'Viaje a Asia Diciembre 2026',
        startDate: '2026-12-20',
        endDate: '2027-01-05',
        sections: [
          { id: tempNextSectionId++, date: '2026-12-21', title: 'Vuelo Los Ángeles-Tokio', description: 'Vuelo transpacífico a Japón.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Vuelo+Asia' },
          { id: tempNextSectionId++, date: '2026-12-22', title: 'Llegada a Tokio y check-in', description: 'Alojamiento en el distrito de Shinjuku.', photoUrl: 'https://placehold.co/150x100/E0E0E0/424242?text=Tokio' }
        ]
      }
    ];
  }

  /**
   * Adds a new travel route map.
   */
  addTravelMap(): void {
    if (this.newMapName && this.newMapStartDate && this.newMapEndDate) {
      const newMap: TravelRouteMap = {
        id: this.nextMapId++, // Usar el ID actual y luego incrementarlo
        name: this.newMapName,
        startDate: this.newMapStartDate,
        endDate: this.newMapEndDate,
        sections: []
      };
      this.travelMaps.push(newMap);
      this.activeMap = newMap; // Set the newly created map as active
      this.resetNewMapForm(); // Clear the form
      this.saveTravelMaps(); // Guardar cambios
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
        // No llamamos a saveTravelMaps aquí con la URL de la foto,
        // ya que saveTravelMaps la establecerá en null antes de guardar.
        // La foto solo se mostrará en la sesión actual.
      };
      reader.readAsDataURL(this.newSectionPhotoFile);
    } else {
      this.newSectionPhotoFile = null;
      this.newSectionPhotoPreviewUrl = null;
      // Si se quita la imagen, guardamos el estado sin ella
      this.saveTravelMaps();
    }
  }

  /**
   * Adds a new section to the active travel map.
   */
  addSectionToMap(): void {
    if (this.activeMap && this.newSectionDate && this.newSectionTitle && this.newSectionDescription) {
      const newSection: RouteSection = {
        id: this.nextSectionId++, // Usar el ID actual y luego incrementarlo
        date: this.newSectionDate,
        title: this.newSectionTitle,
        description: this.newSectionDescription,
        // Al añadir la sección, asignamos la URL de la vista previa.
        // saveTravelMaps se encargará de ponerla en null antes de persistir.
        photoUrl: this.newSectionPhotoPreviewUrl
      };
      this.activeMap.sections.push(newSection);
      this.resetNewSectionForm(); // Clear the section form
      this.saveTravelMaps(); // Guardar cambios
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
    this.saveTravelMaps(); // Guardar cambios después de editar contenido
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
      this.saveTravelMaps(); // Guardar cambios
      this.calculateNextIds(); // Recalcular IDs después de eliminar para asegurar unicidad futura
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
        this.saveTravelMaps(); // Guardar cambios
        this.calculateNextIds(); // Recalcular IDs después de eliminar para asegurar unicidad futura
      }
    }
  }
}
