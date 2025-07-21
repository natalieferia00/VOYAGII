import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { TravelPlannerComponent } from "../travel-planner/travel-planner";
import { AccommodationPlannerComponent } from "../accommodation-planner/accommodation-planner";
import { TransportationPlannerComponent } from "../transportation-planner/transportation-planner";
import { FoodPlannerComponent } from "../food-planner/food-planner";
import { InsurancePlannerComponent } from "../insurance-planner/insurance-planner"; // Asegúrate de que RouterLink esté importado

@Component({
  selector: 'app-travel-organizer',
  standalone: true,
  imports: [
    CommonModule, // Elimina la coma extra aquí
    SidebarComponent,
    TravelPlannerComponent,
    AccommodationPlannerComponent,
    TransportationPlannerComponent,
    FoodPlannerComponent,
    InsurancePlannerComponent
],
  templateUrl: './travel-organizer.html', // Asegúrate de que el nombre del archivo HTML sea correcto (travel-organizer.html o .component.html)
  styleUrls: ['./travel-organizer.scss']
})
export class TravelOrganizerComponent {
  trips = [
    { id: '1', name: 'Aventura en los Andes', date: '2024-09-15', destination: 'Perú, Colombia' },
    { id: '2', name: 'Escapada Europea', date: '2023-05-20', destination: 'España, Francia' },
    { id: '3', name: 'Relajo en la Playa', date: '2025-01-10', destination: 'México' },
  ];
}
