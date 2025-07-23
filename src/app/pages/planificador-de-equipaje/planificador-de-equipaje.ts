import { Component } from '@angular/core';
import { SidebarComponent } from "../../src/app/layout/app-sidebar/app-sidebar";
import { PackingPlannerComponent } from "../../src/app/features/packing-planner/packing-planner";

@Component({
  selector: 'app-planificador-de-equipaje',
  imports: [SidebarComponent, PackingPlannerComponent],
  templateUrl: './planificador-de-equipaje.html',
  styleUrl: './planificador-de-equipaje.scss'
})
export class PlanificadorDeEquipaje {

}
