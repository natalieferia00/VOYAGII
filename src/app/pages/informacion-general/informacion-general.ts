import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsComponent } from '../../shared/components/metrics/metrics';
import { SidebarComponent } from '../../src/app/layout/app-sidebar/app-sidebar';
import { GeneralTripInfo } from '../../shared/components/interfaces/general-trip-info.interface';
import { AdditionalGeneralInfo } from '../../shared/components/interfaces/additional-general-info.interface';




// Interfaz combinada para el Input de MetricsComponent
type CombinedTripInfo = GeneralTripInfo & AdditionalGeneralInfo;

@Component({
  selector: 'app-informacion-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MetricsComponent,
    SidebarComponent
  ],
  templateUrl: './informacion-general.html',
  styleUrls: ['./informacion-general.scss']
})
export class InformacionGeneralComponent implements OnInit {
  travelerName: string = '';
  generalBudget: number | null = null;
  startDate: string = '';
  endDate: string = '';
  numberOfPlannedCountries: number | null = null;
  mainDestination: string = '';
  tripDurationDays: number | null = null;

  plannedCountriesList: string = '';
  travelMotto: string = '';
  emergencyContact: string = '';
  notes: string = '';
  transportBudget: number | null = null;
  foodBudget: number | null = null;
  accommodationBudget: number | null = null;

  generalTripInfoForMetrics: CombinedTripInfo | null = null;

  constructor() { }

  ngOnInit(): void {
    this.loadAllGeneralInfo();
  }

  private loadAllGeneralInfo(): void {
    const storedRegInfo = localStorage.getItem('generalTripInfo');
    if (storedRegInfo) {
      try {
        const parsedRegInfo: GeneralTripInfo = JSON.parse(storedRegInfo);
        this.travelerName = parsedRegInfo.travelerName || '';
        this.generalBudget = parsedRegInfo.generalBudget;
        this.startDate = parsedRegInfo.startDate;
        this.endDate = parsedRegInfo.endDate;
        this.numberOfPlannedCountries = parsedRegInfo.numberOfPlannedCountries;
        this.mainDestination = parsedRegInfo.mainDestination || '';
        this.tripDurationDays = parsedRegInfo.tripDurationDays;
        console.log('Info del registro cargada:', parsedRegInfo);
      } catch (e) {
        console.error('Error al parsear info del registro desde localStorage:', e);
      }
    } else {
      console.log('No hay info del registro guardada.');
    }

    const storedAddInfo = localStorage.getItem('additionalGeneralInfo');
    if (storedAddInfo) {
      try {
        const parsedAddInfo: AdditionalGeneralInfo = JSON.parse(storedAddInfo);
        this.plannedCountriesList = parsedAddInfo.plannedCountriesList || '';
        this.travelMotto = parsedAddInfo.travelMotto || '';
        this.emergencyContact = parsedAddInfo.emergencyContact || '';
        this.notes = parsedAddInfo.notes || '';
        this.transportBudget = parsedAddInfo.transportBudget;
        this.foodBudget = parsedAddInfo.foodBudget;
        this.accommodationBudget = parsedAddInfo.accommodationBudget;
        console.log('Info adicional cargada:', parsedAddInfo);
      } catch (e) {
        console.error('Error al parsear info adicional desde localStorage:', e);
      }
    } else {
      console.log('No hay info adicional guardada.');
    }

    this.updateMetricsInfo();
  }

  private updateMetricsInfo(): void {
    this.generalTripInfoForMetrics = {
      travelerName: this.travelerName,
      generalBudget: this.generalBudget,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfPlannedCountries: this.numberOfPlannedCountries,
      mainDestination: this.mainDestination,
      tripDurationDays: this.tripDurationDays,
      plannedCountriesList: this.plannedCountriesList,
      travelMotto: this.travelMotto,
      emergencyContact: this.emergencyContact,
      notes: this.notes,
      transportBudget: this.transportBudget,
      foodBudget: this.foodBudget,
      accommodationBudget: this.accommodationBudget
    };
  }

  saveGeneralInfo(): void {
    const regInfoToSave: GeneralTripInfo = {
      travelerName: this.travelerName,
      generalBudget: this.generalBudget,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfPlannedCountries: this.numberOfPlannedCountries,
      mainDestination: this.mainDestination,
      tripDurationDays: this.tripDurationDays
    };
    localStorage.setItem('generalTripInfo', JSON.stringify(regInfoToSave));

    const addInfoToSave: AdditionalGeneralInfo = {
      plannedCountriesList: this.plannedCountriesList,
      travelMotto: this.travelMotto,
      emergencyContact: this.emergencyContact,
      notes: this.notes,
      transportBudget: this.transportBudget,
      foodBudget: this.foodBudget,
      accommodationBudget: this.accommodationBudget
    };
    localStorage.setItem('additionalGeneralInfo', JSON.stringify(addInfoToSave));

    this.updateMetricsInfo();
    console.log('Información general y adicional guardada exitosamente.');
    alert('Información general guardada exitosamente.');
  }

  resetForm(): void {
    this.travelerName = '';
    this.generalBudget = null;
    this.startDate = '';
    this.endDate = '';
    this.numberOfPlannedCountries = null;
    this.mainDestination = '';
    this.tripDurationDays = null;

    this.plannedCountriesList = '';
    this.travelMotto = '';
    this.emergencyContact = '';
    this.notes = '';
    this.transportBudget = null;
    this.foodBudget = null;
    this.accommodationBudget = null;

    localStorage.setItem('generalTripInfo', JSON.stringify({
      travelerName: '', generalBudget: null, startDate: '', endDate: '',
      numberOfPlannedCountries: null, mainDestination: '', tripDurationDays: null
    }));
    localStorage.setItem('additionalGeneralInfo', JSON.stringify({
      plannedCountriesList: '', travelMotto: '', emergencyContact: '', notes: '',
      transportBudget: null, foodBudget: null, accommodationBudget: null
    }));

    this.updateMetricsInfo();
    alert('Formulario restablecido.');
  }
}