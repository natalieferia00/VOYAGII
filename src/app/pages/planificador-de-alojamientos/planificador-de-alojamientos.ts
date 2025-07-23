import { Component } from '@angular/core';
import { AccommodationPlannerComponent } from "../../src/app/features/accommodation-planner/accommodation-planner";
import { SidebarComponent } from "../../src/app/layout/app-sidebar/app-sidebar";

@Component({
  selector: 'app-planificador-de-alojamientos',
  standalone: true,
  imports: [AccommodationPlannerComponent, SidebarComponent],
  templateUrl: './planificador-de-alojamientos.html',
  styleUrls: ['./planificador-de-alojamientos.scss']
})
export class PlanificadorDeAlojamientosComponent {}
