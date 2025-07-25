// src/app/shared/interfaces/additional-general-info.interface.ts

export interface AdditionalGeneralInfo {
  plannedCountriesList: string; // Lista de países (ej: "España, Francia, Italia")
  travelMotto: string; // Lema o frase del viaje
  emergencyContact: string; // Contacto de emergencia
  notes: string; // Notas generales del viaje
  transportBudget: number | null; // Presupuesto para transporte
  foodBudget: number | null;     // Presupuesto para comida
  accommodationBudget: number | null; // Presupuesto para alojamiento
}