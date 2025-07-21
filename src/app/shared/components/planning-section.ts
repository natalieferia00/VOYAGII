import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningFormComponent} from '../../shared/components/planning-form'; // Asegúrate de que la ruta sea correcta

// Interfaz minimalista para el plan de viaje (debe coincidir con PlanningFormComponent)
interface TravelPlan {
  id: number;
  country: string;
  totalBudget: number;
  startDate: string;
  endDate: string;
  daysStayed: number;
}

@Component({
  selector: 'app-planning-section',
  standalone: true,
  imports: [CommonModule, PlanningFormComponent],
  templateUrl: './planning-section.html',
  styleUrls: ['./planning-section.scss']
})
export class PlanningSectionComponent {
  travelPlans: TravelPlan[] = [];
  editingPlan: TravelPlan | null = null;
  showForm = false;

  constructor() {
    this.loadPlans();
  }

  addPlan(plan: TravelPlan) {
    if (this.editingPlan) {
      this.travelPlans = this.travelPlans.map(p => p.id === plan.id ? plan : p);
      this.editingPlan = null;
    } else {
      this.travelPlans.push(plan);
    }
    this.savePlans();
    this.showForm = false;
  }

  editPlan(plan: TravelPlan) {
    this.editingPlan = { ...plan };
    this.showForm = true;
  }

  deletePlan(id: number) {
    this.travelPlans = this.travelPlans.filter(p => p.id !== id);
    this.savePlans();
  }

  savePlans() {
    localStorage.setItem('travelPlans', JSON.stringify(this.travelPlans));
  }

  loadPlans() {
    const saved = localStorage.getItem('travelPlans');
    this.travelPlans = saved ? JSON.parse(saved) : [];
  }
}
