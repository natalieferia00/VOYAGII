import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel

// Tipos de moneda base
type BaseCurrency = 'USD' | 'EUR' | 'COP';

// Interfaz para una entrada de gasto
interface BudgetEntry {
  id: number;
  date: string;
  name: string; // Nombre del gasto (ej. "Cena", "Entrada museo")
  details: string; // Detalles adicionales
  amount: number; // Monto del gasto en la moneda base
}

// Interfaz para las tasas de conversión de moneda
interface CurrencyRates {
  USD: number; // Valor de 1 USD en la moneda base (ej. si base es EUR, 1 USD = 0.92 EUR)
  EUR: number; // Valor de 1 EUR en la moneda base
  COP: number; // Valor de 1 COP en la moneda base
}

@Component({
  selector: 'app-budget-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe // Asegúrate de que CurrencyPipe esté disponible
  ],
  templateUrl: './budget-calculator.html',
  styleUrls: ['./budget-calculator.scss']
})
export class BudgetCalculatorComponent implements OnInit {
  // Configuración del presupuesto
  budgetAmount: number | null = null; // Presupuesto total opcional
  baseCurrency: BaseCurrency = 'USD'; // Moneda base para el presupuesto y cálculos

  // Tasas de conversión (el usuario las ingresará manualmente)
  currencyRates: CurrencyRates = {
    USD: 1, // 1 USD = 1 USD
    EUR: 1.08, // Ejemplo: 1 EUR = 1.08 USD
    COP: 0.00026 // Ejemplo: 1 COP = 0.00026 USD
  };

  // Lista de gastos
  expenseEntries: BudgetEntry[] = [];
  nextId: number = 1;

  // Propiedades para el formulario de nuevo gasto
  newExpenseDate: string = new Date().toISOString().substring(0, 10);
  newExpenseName: string = '';
  newExpenseDetails: string = '';
  newExpenseAmount: number | null = null;

  // Totales calculados
  totalExpenses: number = 0; // Total en la moneda base
  totalInUSD: number = 0;
  totalInEUR: number = 0;
  totalInCOP: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadBudgetPlannerData(); // Cargar datos al inicio
    this.calculateTotals(); // Calcular totales iniciales después de cargar
  }

  /**
   * Carga los datos del planificador de presupuesto desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadBudgetPlannerData(): void {
    const storedBudgetAmount = localStorage.getItem('budgetAmount');
    const storedBaseCurrency = localStorage.getItem('baseCurrency');
    const storedCurrencyRates = localStorage.getItem('currencyRates');
    const storedExpenseEntries = localStorage.getItem('expenseEntries');
    const storedNextId = localStorage.getItem('budgetNextId');

    let loadedSuccessfully: boolean = false; // Asegura que sea un booleano

    try {
      if (storedBudgetAmount !== null && storedBudgetAmount !== '') { // También verifica si no es una cadena vacía
        this.budgetAmount = parseFloat(storedBudgetAmount);
      } else {
        this.budgetAmount = null; // Si es nulo o vacío, establecer a null
      }

      if (storedBaseCurrency) {
        this.baseCurrency = storedBaseCurrency as BaseCurrency;
      }
      if (storedCurrencyRates) {
        this.currencyRates = JSON.parse(storedCurrencyRates);
      }
      if (storedExpenseEntries) {
        const parsedEntries: BudgetEntry[] = JSON.parse(storedExpenseEntries);
        if (Array.isArray(parsedEntries)) {
          this.expenseEntries = parsedEntries;
        }
      }
      if (storedNextId) {
        this.nextId = parseInt(storedNextId, 10);
      }
      // Consideramos que se cargó exitosamente si hay al menos una entrada de gasto
      // O si se cargó alguna configuración de presupuesto/moneda/tasas
      loadedSuccessfully = this.expenseEntries.length > 0 || 
                           (storedBudgetAmount !== null && storedBudgetAmount !== '') || 
                           (storedBaseCurrency !== null) || 
                           (storedCurrencyRates !== null);

    } catch (e) {
      console.error('Error al parsear datos del presupuesto desde localStorage:', e);
      loadedSuccessfully = false; // Si hay un error, no se cargó exitosamente
    }

    if (!loadedSuccessfully) {
      console.log('No hay datos válidos de presupuesto en localStorage. Inicializando con datos de ejemplo.');
      this.initializeExampleData();
    }

    // Asegurarse de que nextId sea correcto incluso si los datos de ejemplo se cargaron
    this.calculateNextIdFromEntries();
  }

  /**
   * Calcula el siguiente ID basándose en el ID más alto existente en expenseEntries.
   */
  private calculateNextIdFromEntries(): void {
    let maxId = 0;
    if (this.expenseEntries.length > 0) {
      maxId = Math.max(...this.expenseEntries.map(entry => entry.id));
    }
    this.nextId = maxId + 1;
    console.log(`Calculated nextId for budget entries: ${this.nextId}`);
  }

  /**
   * Guarda todos los datos del planificador de presupuesto en localStorage.
   */
  private saveBudgetPlannerData(): void {
    // Guardar budgetAmount como string o cadena vacía si es null
    localStorage.setItem('budgetAmount', this.budgetAmount !== null ? this.budgetAmount.toString() : '');
    localStorage.setItem('baseCurrency', this.baseCurrency);
    localStorage.setItem('currencyRates', JSON.stringify(this.currencyRates));
    localStorage.setItem('expenseEntries', JSON.stringify(this.expenseEntries));
    localStorage.setItem('budgetNextId', this.nextId.toString());
    console.log('Datos del planificador de presupuesto guardados en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a las propiedades del componente.
   * No guarda directamente en localStorage ni calcula nextId aquí.
   */
  private initializeExampleData(): void {
    // Reiniciar los IDs para los datos de ejemplo
    let tempNextId = 1;
    this.budgetAmount = 1500;
    this.baseCurrency = 'USD';
    this.currencyRates = {
      USD: 1,
      EUR: 1.08,
      COP: 0.00026
    };
    this.expenseEntries = [
      { id: tempNextId++, date: '2024-07-20', name: 'Vuelo', details: 'Bogotá-Ámsterdam', amount: 800 },
      { id: tempNextId++, date: '2024-07-21', name: 'Hotel', details: '3 noches en Ámsterdam', amount: 300 },
      { id: tempNextId++, date: '2024-07-21', name: 'Comida', details: 'Cena en restaurante local', amount: 50 },
    ];
  }

  /**
   * Añade una nueva entrada de gasto.
   */
  addExpenseEntry(): void {
    if (this.newExpenseName && this.newExpenseAmount !== null && this.newExpenseAmount > 0) {
      const newEntry: BudgetEntry = {
        id: this.nextId++,
        date: this.newExpenseDate,
        name: this.newExpenseName,
        details: this.newExpenseDetails,
        amount: this.newExpenseAmount
      };
      this.expenseEntries.push(newEntry);
      this.resetNewExpenseForm();
      this.calculateTotals(); // Recalcular totales
      this.saveBudgetPlannerData(); // Guardar cambios
    } else {
      alert('Por favor, ingresa un nombre y un monto válido para el gasto.');
    }
  }

  /**
   * Restablece los campos del formulario de nuevo gasto.
   */
  resetNewExpenseForm(): void {
    this.newExpenseDate = new Date().toISOString().substring(0, 10);
    this.newExpenseName = '';
    this.newExpenseDetails = '';
    this.newExpenseAmount = null;
  }

  /**
   * Calcula el total de gastos y los convierte a las otras monedas.
   */
  calculateTotals(): void {
    this.totalExpenses = this.expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

    // Conversión a otras monedas usando las tasas ingresadas por el usuario
    // Asegurarse de que las tasas no sean cero o nulas para evitar divisiones por cero
    this.totalInUSD = this.totalExpenses / (this.currencyRates.USD || 1);
    this.totalInEUR = this.totalExpenses / (this.currencyRates.EUR || 1);
    this.totalInCOP = this.totalExpenses / (this.currencyRates.COP || 1);
  }

  /**
   * Devuelve la clase CSS para el estado del presupuesto (verde/rojo).
   */
  getBudgetStatusClass(): string {
    if (this.budgetAmount === null) {
      return ''; // No hay presupuesto establecido
    }
    return this.totalExpenses > this.budgetAmount ? 'over-budget' : 'under-budget';
  }

  /**
   * Maneja la actualización de las tasas de cambio.
   */
  onRateChange(): void {
    this.calculateTotals(); // Recalcular totales cuando las tasas cambian
    this.saveBudgetPlannerData(); // Guardar cambios
  }

  /**
   * Maneja la edición de un campo directamente en la tabla.
   * @param entry El gasto que se está editando.
   * @param field El campo a actualizar ('name', 'details', 'amount').
   * @param event El evento de entrada.
   */
  onTableEdit(entry: BudgetEntry, field: 'name' | 'details' | 'amount', event: Event): void {
    const target = event.target as HTMLElement;
    if (field === 'amount') {
      const value = parseFloat(target.innerText);
      if (!isNaN(value)) {
        entry.amount = value;
      } else {
        // Opcional: revertir a valor anterior o mostrar error si la entrada no es un número
        target.innerText = entry.amount.toString();
      }
    } else {
      // Asegurarse de que el tipo sea compatible
      (entry[field] as any) = target.innerText;
    }
    this.calculateTotals(); // Recalcular totales después de editar
    this.saveBudgetPlannerData(); // Guardar cambios
  }

  /**
   * Elimina un gasto de la lista.
   * @param entryToRemove El gasto a eliminar.
   */
  removeExpense(entryToRemove: BudgetEntry): void {
    this.expenseEntries = this.expenseEntries.filter(entry => entry.id !== entryToRemove.id);
    this.calculateTotals(); // Recalcular totales
    this.saveBudgetPlannerData(); // Guardar cambios
    this.calculateNextIdFromEntries(); // Recalcular nextId
  }

  /**
   * Maneja el cambio del monto del presupuesto.
   */
  onBudgetAmountChange(): void {
    this.calculateTotals(); // Recalcular totales si el presupuesto cambia
    this.saveBudgetPlannerData(); // Guardar cambios
  }

  /**
   * Maneja el cambio de la moneda base.
   */
  onBaseCurrencyChange(): void {
    this.calculateTotals(); // Recalcular totales si la moneda base cambia
    this.saveBudgetPlannerData(); // Guardar cambios
  }
}
