import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TravelPlan {
  id: number;
  country: string;
  ticketPrice: number;
  totalBudget: number;
  transportBudget: number;
  foodBudget: number;
  startDate: string;
  endDate: string;
  daysStayed: number;
}

@Component({
  selector: 'app-planning-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning-form.html',
  styleUrls: ['./planning-form.scss']
})
export class PlanningFormComponent {
  @Input() plan: TravelPlan | null = null;
  @Output() save = new EventEmitter<TravelPlan>();
  @Output() cancel = new EventEmitter<void>();

  form: Partial<TravelPlan> = {};

  ngOnChanges() {
    if (this.plan) {
      this.form = { ...this.plan };
    } else {
      this.form = {};
    }
  }

  calculateDays() {
    if (this.form.startDate && this.form.endDate) {
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      this.form.daysStayed = diff >= 0 ? diff : 0;
    }
  }

  submit() {
    if (
      this.form.country &&
      this.form.ticketPrice !== undefined &&
      this.form.totalBudget !== undefined &&
      this.form.transportBudget !== undefined &&
      this.form.foodBudget !== undefined &&
      this.form.startDate &&
      this.form.endDate &&
      this.form.daysStayed !== undefined
    ) {
      const plan: TravelPlan = {
        id: this.plan ? this.plan.id : Date.now(),
        country: this.form.country,
        ticketPrice: this.form.ticketPrice,
        totalBudget: this.form.totalBudget,
        transportBudget: this.form.transportBudget,
        foodBudget: this.form.foodBudget,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        daysStayed: this.form.daysStayed
      };
      this.save.emit(plan);
      this.form = {};
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
