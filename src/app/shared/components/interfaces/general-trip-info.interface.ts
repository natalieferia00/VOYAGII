// src/app/shared/components/interfaces/general-trip-info.interface.ts
export interface GeneralTripInfo {
  travelerName: string;
  generalBudget: number | null;
  startDate: string;
  endDate: string;
  numberOfPlannedCountries: number | null;
  mainDestination: string;
  tripDurationDays: number | null;
  plannedCountriesList: string; // ¡Esta propiedad debe estar aquí y solo aquí!
}
