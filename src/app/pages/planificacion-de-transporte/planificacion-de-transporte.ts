import { Component } from '@angular/core';
import { SidebarComponent } from "../../src/app/layout/app-sidebar/app-sidebar";
import { TransportationPlannerComponent } from "../../src/app/features/transportation-planner/transportation-planner";

@Component({
  selector: 'app-planificacion-de-transporte',
  imports: [SidebarComponent, TransportationPlannerComponent],
  templateUrl: './planificacion-de-transporte.html',
  styleUrl: './planificacion-de-transporte.scss'
})
export class PlanificacionDeTransporte {

}
