import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { WorldMapComponent } from "../../../../shared/components/world-map/world-map";
import { CommentsFormComponent} from "../../../../shared/components/comments-form";
import { PlanningSectionComponent } from "../../../../shared/components/planning-section";
import { TasksSectionComponent } from "../../../../shared/components/tasks-section.component";
import { TravelSeasonChartComponent } from "../../../../shared/components/travel-season-chart.component";
import { ProgressChartComponent } from "../../../../progress-chart/progress-chart";
import { PreparationChecklistChartComponent } from "../../../../preparation-checklist-chart/preparation-checklist-chart";
import { PackingPlannerComponent } from "../packing-planner/packing-planner";
import { VisitedFormComponent } from "../../../../shared/components/visited-form";
import { GeneralTripInfo } from '../../../../shared/components/interfaces/general-trip-info.interface';
import { AdditionalGeneralInfo } from '../../../../shared/components/interfaces/additional-general-info.interface';
import { MetricsComponent } from '../../../../shared/components/metrics/metrics';
import { WelcomeMessageComponent } from '../../../../welcome-message/welcome-message';
import { TransportationStatusChartComponent } from "../../../../shared/components/transportation-status-chart/transportation-status-chart";
import { FoodStatusChartComponent } from "../../../../shared/components/food-status-chart/food-status-chart";
import { CountryCardsComponent } from "../../../../shared/components/country-cards/country-cards";



// Interfaz combinada que MetricsComponent espera
type CombinedTripInfo = GeneralTripInfo & AdditionalGeneralInfo;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule,
    SidebarComponent,
    MetricsComponent,
    WorldMapComponent,
    CommentsFormComponent,
    PlanningSectionComponent,
    PreparationChecklistChartComponent,
    TasksSectionComponent,
    WelcomeMessageComponent,
    ProgressChartComponent,
    TransportationStatusChartComponent,
    FoodStatusChartComponent,
    CountryCardsComponent
],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  generalTripInfoForMetrics: CombinedTripInfo | null = null;
  travelerName: string | null = null; // Para pasar el nombre al WelcomeMessageComponent

  constructor() { }

  ngOnInit(): void {
    this.loadAllGeneralInfo();
  }

  private loadAllGeneralInfo(): void {
    let loadedRegInfo: GeneralTripInfo | null = null;
    let loadedAddInfo: AdditionalGeneralInfo | null = null;

    const storedRegInfo = localStorage.getItem('generalTripInfo');
    if (storedRegInfo) {
      try {
        loadedRegInfo = JSON.parse(storedRegInfo);
        // ¡Aquí está la clave! Comprobamos explícitamente que loadedRegInfo no es null
        // antes de acceder a sus propiedades.
        if (loadedRegInfo) {
          this.travelerName = loadedRegInfo.travelerName || null;
        }
        console.log('Info del registro cargada en Dashboard:', loadedRegInfo);
      } catch (e) {
        console.error('Error al parsear info del registro desde localStorage en Dashboard:', e);
        loadedRegInfo = null; // Asegurarse de que sea null en caso de error de parseo
      }
    }

    const storedAddInfo = localStorage.getItem('additionalGeneralInfo');
    if (storedAddInfo) {
      try {
        loadedAddInfo = JSON.parse(storedAddInfo);
        console.log('Info adicional cargada en Dashboard:', loadedAddInfo);
      } catch (e) {
        console.error('Error al parsear info adicional desde localStorage en Dashboard:', e);
        loadedAddInfo = null; // Asegurarse de que sea null en caso de error de parseo
      }
    }

    // Combinar la información si ambas partes existen
    if (loadedRegInfo && loadedAddInfo) {
      this.generalTripInfoForMetrics = {
        ...loadedRegInfo,
        ...loadedAddInfo
      };
    } else if (loadedRegInfo) {
      // Si solo hay info de registro, inicializar los campos adicionales a vacíos/null
      this.generalTripInfoForMetrics = {
        ...loadedRegInfo,
        plannedCountriesList: '',
        travelMotto: '',
        emergencyContact: '',
        notes: '',
        transportBudget: null,
        foodBudget: null,
        accommodationBudget: null
      };
    } else if (loadedAddInfo) {
      // Si solo hay info adicional, y loadedRegInfo es null, necesitamos un travelerName por defecto
      this.generalTripInfoForMetrics = {
        travelerName: '', // Valor por defecto si no hay info de registro
        generalBudget: null,
        startDate: '',
        endDate: '',
        numberOfPlannedCountries: null,
        mainDestination: '',
        tripDurationDays: null,
        ...loadedAddInfo
      };
    } else {
      // Si no hay ninguna información, establecer a null
      this.generalTripInfoForMetrics = null;
      this.travelerName = null; // Asegúrate de que el nombre también sea null si no hay info
      console.log('No hay información general del viaje ni adicional guardada en localStorage para el Dashboard.');
    }
  }
}