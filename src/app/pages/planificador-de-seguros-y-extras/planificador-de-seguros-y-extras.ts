import { Component } from '@angular/core';
import { SidebarComponent } from "../../src/app/layout/app-sidebar/app-sidebar";
import { InsurancePlannerComponent } from "../../src/app/features/insurance-planner/insurance-planner";

@Component({
  selector: 'app-planificador-de-seguros-y-extras',
  imports: [SidebarComponent, InsurancePlannerComponent],
  templateUrl: './planificador-de-seguros-y-extras.html',
  styleUrl: './planificador-de-seguros-y-extras.scss'
})
export class PlanificadorDeSegurosYExtras {

}
