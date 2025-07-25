import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CommonModule para directivas, CurrencyPipe para formato de moneda
import { FormsModule } from '@angular/forms'; // Para ngModel
import { GeneralTripInfo } from '../../../../shared/components/interfaces/general-trip-info.interface';


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
  // Presupuesto general cargado desde Información General
  generalBudget: number | null = null; // Renombrado de budgetAmount a generalBudget

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
    this.loadGeneralBudget(); // Cargar el presupuesto general primero
    this.loadBudgetPlannerData(); // Cargar los demás datos del planificador
    this.calculateTotals(); // Calcular totales iniciales después de cargar
  }

  /**
   * Carga el presupuesto general desde localStorage (de generalTripInfo).
   */
  private loadGeneralBudget(): void {
    const storedGeneralInfo = localStorage.getItem('generalTripInfo');
    if (storedGeneralInfo) {
      try {
        const parsedInfo: GeneralTripInfo = JSON.parse(storedGeneralInfo);
        this.generalBudget = parsedInfo.generalBudget;
        console.log('Presupuesto general cargado:', this.generalBudget);
      } catch (e) {
        console.error('Error al parsear información general desde localStorage para presupuesto general:', e);
        this.generalBudget = null;
      }
    } else {
      console.log('No hay información general guardada para el presupuesto general.');
      this.generalBudget = null;
    }
  }

  /**
   * Carga los datos del planificador de presupuesto (tasas, entradas) desde localStorage.
   * Si no hay datos válidos, inicializa con los datos de ejemplo.
   */
  private loadBudgetPlannerData(): void {
    const storedBaseCurrency = localStorage.getItem('budgetCalculatorBaseCurrency');
    const storedCurrencyRates = localStorage.getItem('budgetCalculatorCurrencyRates');
    const storedExpenseEntries = localStorage.getItem('budgetCalculatorExpenseEntries');
    const storedNextId = localStorage.getItem('budgetCalculatorNextId');

    let loadedSuccessfully: boolean = false;

    try {
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
      // o si se cargó alguna configuración de moneda/tasas
      loadedSuccessfully = this.expenseEntries.length > 0 ||
                           (storedBaseCurrency !== null) ||
                           (storedCurrencyRates !== null);

    } catch (e) {
      console.error('Error al parsear datos del presupuesto desde localStorage:', e);
      loadedSuccessfully = false;
    }

    if (!loadedSuccessfully) {
      console.log('No hay datos válidos de presupuesto en localStorage. Inicializando con datos de ejemplo.');
      this.initializeExampleData();
    }

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
    // generalBudget no se guarda aquí, se gestiona en InformacionGeneralComponent
    localStorage.setItem('budgetCalculatorBaseCurrency', this.baseCurrency);
    localStorage.setItem('budgetCalculatorCurrencyRates', JSON.stringify(this.currencyRates));
    localStorage.setItem('budgetCalculatorExpenseEntries', JSON.stringify(this.expenseEntries));
    localStorage.setItem('budgetCalculatorNextId', this.nextId.toString());
    console.log('Datos del planificador de presupuesto guardados en localStorage.');
  }

  /**
   * Inicializa los datos de ejemplo y los asigna a las propiedades del componente.
   * No guarda directamente en localStorage ni calcula nextId aquí.
   */
  private initializeExampleData(): void {
    let tempNextId = 1;
    // generalBudget no se inicializa aquí, se carga desde InformacionGeneralComponent
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
    // La conversión se hace desde la moneda base (this.baseCurrency)
    this.totalInUSD = this.convertCurrency(this.totalExpenses, this.baseCurrency, 'USD');
    this.totalInEUR = this.convertCurrency(this.totalExpenses, this.baseCurrency, 'EUR');
    this.totalInCOP = this.convertCurrency(this.totalExpenses, this.baseCurrency, 'COP');
  }

  /**
   * Convierte un monto de una moneda a otra usando las tasas de conversión.
   * @param amount El monto a convertir.
   * @param fromCurrency La moneda de origen.
   * @param toCurrency La moneda de destino.
   * @returns El monto convertido.
   */
  private convertCurrency(amount: number, fromCurrency: BaseCurrency, toCurrency: BaseCurrency): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convertir el monto a la moneda base (USD) primero si la moneda base no es USD
    let amountInUSD = amount;
    if (fromCurrency !== 'USD' && this.currencyRates[fromCurrency] !== 0) {
      amountInUSD = amount / this.currencyRates[fromCurrency]; // Si la tasa es 1 EUR = 1.08 USD, entonces 1 EUR / 1.08 = 0.92 USD
    }

    // Luego convertir de USD a la moneda de destino
    if (toCurrency === 'USD') {
      return amountInUSD;
    } else if (this.currencyRates[toCurrency] !== 0) {
      return amountInUSD * this.currencyRates[toCurrency];
    }
    return 0; // En caso de tasa no definida o cero
  }


  /**
   * Devuelve la clase CSS para el estado del presupuesto (verde/amarillo/rojo).
   */
  getBudgetStatusClass(): string {
    if (this.generalBudget === null || this.generalBudget === 0) {
      return 'budget-status-info'; // No hay presupuesto definido o es cero
    }
    const remaining = this.generalBudget - this.totalExpenses;
    if (remaining < 0) {
      return 'budget-status-exceeded'; // Excedido
    } else if (remaining <= this.generalBudget * 0.15) { // Advertencia si queda el 15% o menos
      return 'budget-status-warning'; // Cerca de exceder
    } else {
      return 'budget-status-ok'; // Dentro del presupuesto
    }
  }

  /**
   * Obtiene el mensaje del estado del presupuesto.
   */
  getBudgetStatusMessage(): string {
    if (this.generalBudget === null) {
      return 'Presupuesto general no definido en Información General.';
    }
    if (this.generalBudget === 0) {
        return 'Presupuesto general es cero. No hay límite establecido.';
    }

    const remaining = this.generalBudget - this.totalExpenses;
    const formattedRemaining = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: this.baseCurrency, // Formatear en la moneda base
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(remaining));

    if (remaining < 0) {
      return `¡ATENCIÓN! Has excedido tu presupuesto general por ${formattedRemaining}.`;
    } else if (remaining <= this.generalBudget * 0.15) {
      return `ADVERTENCIA: Te quedan ${formattedRemaining} de tu presupuesto general. ¡Estás cerca del límite!`;
    } else {
      return `Tienes ${formattedRemaining} restantes de tu presupuesto general.`;
    }
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
      // Eliminar el símbolo de moneda y comas para parsear el número
      const rawValue = target.innerText.replace(/[^0-9.,]/g, '').replace(',', '.');
      const value = parseFloat(rawValue);
      if (!isNaN(value)) {
        entry.amount = value;
      } else {
        // Revertir a valor anterior si la entrada no es un número válido
        target.innerText = entry.amount.toString();
      }
    } else {
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
   * Maneja el cambio de la moneda base.
   */
  onBaseCurrencyChange(): void {
    // Cuando la moneda base cambia, necesitamos recalcular las tasas de conversión
    // para que sigan siendo relativas a la nueva moneda base.
    // Una forma simple es asumir que las tasas actuales son correctas respecto a la *anterior* moneda base,
    // y luego ajustarlas a la nueva. O, más fácil, simplemente reinicializar las tasas para la nueva moneda base.
    // Para este ejemplo, asumiremos que el usuario reajustará las tasas si cambia la moneda base,
    // o que las tasas se refieren siempre a la moneda base seleccionada.
    // La lógica de `convertCurrency` ya maneja la conversión de la moneda base a otras.

    // Reinicializar las tasas para que la moneda base tenga un valor de 1
    if (this.baseCurrency === 'USD') {
      this.currencyRates = { USD: 1, EUR: 1.08, COP: 0.00026 };
    } else if (this.baseCurrency === 'EUR') {
      this.currencyRates = { USD: 0.92, EUR: 1, COP: 0.00024 }; // Ejemplos de tasas relativas a EUR
    } else if (this.baseCurrency === 'COP') {
      this.currencyRates = { USD: 3800, EUR: 4100, COP: 1 }; // Ejemplos de tasas relativas a COP
    }

    this.calculateTotals(); // Recalcular totales si la moneda base cambia
    this.saveBudgetPlannerData(); // Guardar cambios
  }
}