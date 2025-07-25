import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importa HttpClient y HttpClientModule

// Tipos de ítems adicionales (actualizado para coincidir con los emojis y el HTML)
type ItemType = 'Seguro' | 'Visado' | 'Vacuna' | 'Moneda Extranjera' | 'Adaptador Eléctrico' | 'Tarjeta SIM Local' | 'Alquiler de Coche' | 'Otro';

// Interfaz para una entrada de seguros y extras
interface InsuranceEntry {
  id: number;
  tripName: string; // Nombre del viaje al que pertenece (ej. "Viaje a Europa 2024")
  tripCode: string; // Código para identificar el viaje (ej. "EUR24-001")
  itemType: ItemType; // Tipo de ítem (Seguro, Visado, etc.)
  itemName: string; // Nombre específico del ítem (ej. "Seguro IATI Mochilero")
  company: string; // Compañía o proveedor (ej. "IATI", "Embajada")
  price: number | null;
  currency: string;
  startDate: string; // Fecha de inicio de validez/cobertura
  endDate: string; // Fecha de fin de validez/cobertura
  url: string; // URL de compra, información o póliza
  notes: string; // Campo editable directamente en la tabla
}

@Component({
  selector: 'app-insurance-planner',
  standalone: true,
  imports: [
    CommonModule, // Para directivas estructurales como *ngFor, *ngIf
    FormsModule,  // Para el two-way data binding con ngModel
    CurrencyPipe, // Asegúrate de que CurrencyPipe esté importado aquí
    HttpClientModule // Necesario para usar HttpClient (aunque no se usa para localStorage)
  ],
  templateUrl: './insurance-planner.html',
  styleUrls: ['./insurance-planner.scss']
})
export class InsurancePlannerComponent implements OnInit {
  insuranceEntries: InsuranceEntry[] = [];
  nextId: number = 1;

  // Propiedades para el formulario de nueva entrada
  newEntryTripName: string = '';
  newEntryTripCode: string = '';
  newEntryItemType: ItemType = 'Seguro'; // Valor por defecto actualizado
  newEntryItemName: string = '';
  newEntryCompany: string = '';
  newEntryPrice: number | null = null;
  newEntryCurrency: string = 'USD';
  newEntryStartDate: string = '';
  newEntryEndDate: string = '';
  newEntryUrl: string = '';
  newEntryNotes: string = '';

  // Opciones para los selectores (actualizado para coincidir con los emojis)
  itemTypes: ItemType[] = ['Seguro', 'Visado', 'Vacuna', 'Moneda Extranjera', 'Adaptador Eléctrico', 'Tarjeta SIM Local', 'Alquiler de Coche', 'Otro'];
  currencies: string[] = ['USD', 'EUR', 'COP', 'GBP', 'JPY'];

  // Si tuvieras un backend, descomentarías esta línea y la usarías en las funciones
  // private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { } // Inyecta HttpClient (no usado para localStorage)

  ngOnInit(): void {
    this.loadInsuranceEntries(); // Cargar datos al inicio
  }

  /**
   * Carga las entradas de seguros y extras desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadInsuranceEntries(): void {
    const storedEntries = localStorage.getItem('insuranceEntries');
    let loadedSuccessfully = false;

    if (storedEntries) {
      try {
        const parsedEntries: InsuranceEntry[] = JSON.parse(storedEntries);
        // Verificar si los datos parseados son un array y no está vacío
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          this.insuranceEntries = parsedEntries;
          console.log('Entradas de seguros y extras cargadas desde localStorage:', this.insuranceEntries);
          loadedSuccessfully = true;
        } else {
          console.log('LocalStorage de entradas de seguros y extras vacío o inválido (array vacío).');
        }
      } catch (e) {
        console.error('Error al parsear entradas de seguros y extras desde localStorage:', e);
        console.log('Error de parseo en localStorage.');
      }
    } else {
      console.log('No hay datos de seguros y extras en localStorage.');
    }

    // Si no se cargaron datos exitosamente, inicializar con datos de ejemplo
    if (!loadedSuccessfully) {
      this.initializeExampleData();
      console.log('Datos de ejemplo de seguros y extras inicializados.');
    }

    // Siempre calcular el nextId después de que this.insuranceEntries esté poblado
    this.calculateNextId();
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente.
   */
  private calculateNextId(): void {
    let maxId = 0;
    if (this.insuranceEntries.length > 0) {
      maxId = Math.max(...this.insuranceEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for insurance planner: ${this.nextId}`);
  }

  /**
   * Guarda las entradas de seguros y extras en localStorage.
   */
  private saveInsuranceEntries(): void {
    localStorage.setItem('insuranceEntries', JSON.stringify(this.insuranceEntries));
    console.log('Entradas de seguros y extras guardadas en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a this.insuranceEntries.
   * Solo se llama si no hay datos válidos en localStorage.
   */
  private initializeExampleData(): void {
    // Usamos un contador temporal para los IDs de los datos de ejemplo
    let tempNextId = 1;

    this.insuranceEntries = [
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        itemType: 'Seguro',
        itemName: 'Seguro IATI Mochilero',
        company: 'IATI Seguros',
        price: 85,
        currency: 'EUR',
        startDate: '2024-09-09',
        endDate: '2024-09-25',
        url: 'https://iati.es/poliza123',
        notes: 'Cobertura médica y de equipaje. Descargar póliza.'
      },
      {
        id: tempNextId++,
        tripName: 'Viaje a Europa 2024',
        tripCode: 'EUR24-001',
        itemType: 'Tarjeta SIM Local',
        itemName: 'SIM Card Orange',
        company: 'Orange España',
        price: 20,
        currency: 'EUR',
        startDate: '2024-09-10',
        endDate: '2024-09-20',
        url: 'https://orange.es/sim-travel',
        notes: '10GB de datos, recargar si es necesario.'
      },
      {
        id: tempNextId++,
        tripName: 'Aventura en Asia',
        tripCode: 'ASIA25-003',
        itemType: 'Visado',
        itemName: 'Visa Japón',
        company: 'Embajada de Japón',
        price: 0,
        currency: 'USD',
        startDate: '2025-03-01',
        endDate: '2025-05-30',
        url: 'https://embajada-jp.org/visa-info',
        notes: 'Tramitar con 2 meses de antelación.'
      }
    ];
  }

  /**
   * Añade una nueva entrada de seguro/extra a la tabla.
   */
  addInsuranceEntry(): void {
    if (this.newEntryTripName && this.newEntryTripCode && this.newEntryItemName &&
        this.newEntryCompany && this.newEntryStartDate && this.newEntryEndDate && this.newEntryUrl) {
      const newEntry: InsuranceEntry = {
        id: this.nextId++, // Usar el ID actual y luego incrementarlo
        tripName: this.newEntryTripName,
        tripCode: this.newEntryTripCode,
        itemType: this.newEntryItemType,
        itemName: this.newEntryItemName,
        company: this.newEntryCompany,
        price: this.newEntryPrice,
        currency: this.newEntryCurrency,
        startDate: this.newEntryStartDate,
        endDate: this.newEntryEndDate,
        url: this.newEntryUrl,
        notes: this.newEntryNotes
      };
      this.insuranceEntries.push(newEntry);
      this.resetForm(); // Limpiar el formulario después de añadir
      this.saveInsuranceEntries(); // Guardar cambios

      // Si tuvieras un backend, descomentarías esta línea y la usarías en las funciones
      /*
      this.http.post<any>(`${this.apiUrl}/insurance`, newEntry).subscribe({
        next: (response) => {
          console.log(response.message);
          // this.loadInsuranceEntries(); // Recargar la lista para incluir el nuevo elemento con el ID real del backend
          this.resetForm();
        },
        error: (err) => console.error('Error al añadir entrada de seguro:', err)
      });
      */

    } else {
      // Usar un modal personalizado en lugar de alert() en un entorno de producción
      alert('Por favor, completa todos los campos obligatorios: Nombre del Viaje, Código del Viaje, Nombre del Ítem, Compañía, Fecha Inicio, Fecha Fin y URL.');
    }
  }

  /**
   * Restablece los campos del formulario.
   */
  resetForm(): void {
    this.newEntryTripName = '';
    this.newEntryTripCode = '';
    this.newEntryItemType = 'Seguro'; // Restablecer al valor por defecto actualizado
    this.newEntryItemName = '';
    this.newEntryCompany = '';
    this.newEntryPrice = null;
    this.newEntryCurrency = 'USD';
    this.newEntryStartDate = '';
    this.newEntryEndDate = '';
    this.newEntryUrl = '';
    this.newEntryNotes = '';
  }

  /**
   * Elimina una entrada de seguro/extra de la tabla.
   * @param entryToRemove La entrada de la tabla que se va a eliminar.
   */
  removeInsuranceEntry(entryToRemove: InsuranceEntry): void {
    // En un entorno real, aquí mostrarías un modal de confirmación personalizado.
    // Para este ejemplo, simplemente filtramos el array.
    console.log(`Intentando eliminar: ${entryToRemove.itemName}`);
    this.insuranceEntries = this.insuranceEntries.filter(entry => entry.id !== entryToRemove.id);
    console.log('Entrada eliminada de la lista local.');
    this.saveInsuranceEntries(); // Guardar cambios
    this.calculateNextId(); // Recalcular nextId después de eliminar

    // Si tuvieras un backend, lo harías así:
    /*
    if (confirm(`¿Estás seguro de que quieres eliminar "${entryToRemove.itemName}" de ${entryToRemove.company}?`)) {
      this.http.delete<any>(`${this.apiUrl}/insurance/${entryToRemove.id}`).subscribe({
        next: (response) => {
          console.log(response.message);
          this.insuranceEntries = this.insuranceEntries.filter(e => e.id !== entryToRemove.id);
          this.saveInsuranceEntries(); // Guardar cambios después de la eliminación del backend
          this.calculateNextId(); // Recalcular nextId
        },
        error: (err) => console.error('Error al eliminar entrada de seguro:', err)
      });
    }
    */
  }

  /**
   * Maneja la actualización de las notas directamente en la tabla.
   * @param entry La entrada de la tabla que se está editando.
   * @param event El evento de entrada (input event).
   */
  onNotesChange(entry: InsuranceEntry, event: Event): void {
    const target = event.target as HTMLElement;
    entry.notes = target.innerText;
    this.saveInsuranceEntries(); // Guardar cambios al editar las notas
    console.log(`Notas actualizadas para ${entry.itemName}: ${entry.notes}`);

    // Si tuvieras un backend, lo harías así:
    /*
    this.http.put<any>(`${this.apiUrl}/insurance/${entry.id}`, entry).subscribe({
      next: (response) => console.log(response.message),
      error: (err) => console.error('Error al actualizar notas:', err)
    });
    */
  }
}
