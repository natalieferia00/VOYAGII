// src/app/shared/components/interfaces/additional-general-info.interface.ts
export interface AdditionalGeneralInfo {
  // plannedCountriesList: string; // ¡ELIMINAR ESTA LÍNEA!
  travelMotto: string;
  emergencyContact: string;
  notes: string;
  transportBudget: number | null;
  foodBudget: number | null;
  accommodationBudget: number | null;
}
