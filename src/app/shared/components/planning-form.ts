import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaz minimalista para el plan de viaje
interface TravelPlan {
  id: number;
  country: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  daysStayed: number; // Se calculará automáticamente
}

@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning-form.html', // Asegúrate de que el nombre del archivo HTML sea correcto
  styleUrls: ['./planning-form.scss'] // Asegúrate de que el nombre del archivo SCSS sea correcto
})
export class PlanningFormComponent implements OnChanges {
  @Input() plan: TravelPlan | null = null;
  @Output() save = new EventEmitter<TravelPlan>();
  @Output() cancel = new EventEmitter<void>();

  form: Partial<TravelPlan> = {};

  ngOnChanges() {
    if (this.plan) {
      this.form = { ...this.plan };
    } else {
      // Inicializa el formulario con valores por defecto si es un nuevo plan
      this.form = {
        country: '',
        totalBudget: 0,
        startDate: '',
        endDate: '',
        daysStayed: 0
      };
    }
    this.calculateDays(); // Recalcula los días al cargar el plan
  }

  calculateDays() {
    if (this.form.startDate && this.form.endDate) {
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.form.daysStayed = diffDays >= 0 ? diffDays : 0;
    } else {
      this.form.daysStayed = 0;
    }
  }

  submit() {
    // Validar solo los campos ahora presentes
    if (
      this.form.country &&
      this.form.totalBudget !== undefined &&
      this.form.startDate &&
      this.form.endDate &&
      this.form.daysStayed !== undefined
    ) {
      const plan: TravelPlan = {
        id: this.plan ? this.plan.id : Date.now(), // Usa Date.now() para generar un ID único si es nuevo
        country: this.form.country,
        totalBudget: this.form.totalBudget,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        daysStayed: this.form.daysStayed
      };
      this.save.emit(plan);
      this.form = {}; // Limpiar el formulario
    } else {
      alert('Por favor, completa todos los campos obligatorios del plan de viaje.');
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
