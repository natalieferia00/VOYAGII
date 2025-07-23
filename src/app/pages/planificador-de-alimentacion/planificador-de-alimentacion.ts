import { Component } from '@angular/core';
import { SidebarComponent } from "../../src/app/layout/app-sidebar/app-sidebar";
import { FoodPlannerComponent } from "../../src/app/features/food-planner/food-planner";

@Component({
  selector: 'app-planificador-de-alimentacion',
  imports: [SidebarComponent, FoodPlannerComponent],
  templateUrl: './planificador-de-alimentacion.html',
  styleUrl: './planificador-de-alimentacion.scss'
})
export class PlanificadorDeAlimentacion {

}
