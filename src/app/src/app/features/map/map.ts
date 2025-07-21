        import { Component } from '@angular/core';
        import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { WorldMapComponent } from "../../../../shared/components/world-map/world-map";
import { TravelPlannerComponent } from "../travel-planner/travel-planner";
import { TravelRoutePlannerComponent } from "../travel-route-planner/travel-route-planner";
import { TasksSectionComponent } from "../../../../shared/components/tasks-section.component";



        @Component({
          selector: 'app-map',
          standalone: true,
          imports: [SidebarComponent, TravelRoutePlannerComponent, TasksSectionComponent],
          templateUrl: './map.html',
          styleUrls: ['./map.scss']
        })
        export class MapComponent {
          // Lógica del mapa aquí
        }
        