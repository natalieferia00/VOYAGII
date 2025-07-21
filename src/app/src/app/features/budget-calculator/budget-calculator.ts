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
    // Cargar algunos gastos de ejemplo
    this.expenseEntries = [
      { id: this.nextId++, date: '2024-07-20', name: 'Vuelo', details: 'Bogotá-Ámsterdam', amount: 800 },
      { id: this.nextId++, date: '2024-07-21', name: 'Hotel', details: '3 noches en Ámsterdam', amount: 300 },
      { id: this.nextId++, date: '2024-07-21', name: 'Comida', details: 'Cena en restaurante local', amount: 50 },
    ];
    this.calculateTotals(); // Calcular totales iniciales
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
    this.totalInUSD = this.totalExpenses / (this.currencyRates.USD || 1); // Divide por la tasa USD a base
    this.totalInEUR = this.totalExpenses / (this.currencyRates.EUR || 1); // Divide por la tasa EUR a base
    this.totalInCOP = this.totalExpenses / (this.currencyRates.COP || 1); // Divide por la tasa COP a base
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
      entry[field] = target.innerText;
    }
    this.calculateTotals(); // Recalcular totales después de editar
  }

  /**
   * Elimina un gasto de la lista.
   * @param entryToRemove El gasto a eliminar.
   */
  removeExpense(entryToRemove: BudgetEntry): void {
    this.expenseEntries = this.expenseEntries.filter(entry => entry.id !== entryToRemove.id);
    this.calculateTotals(); // Recalcular totales
  }
}
