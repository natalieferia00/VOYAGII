import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class DataStorageService {

  constructor() { }

  // Guarda un item en localStorage
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // Obtiene un item de localStorage
  getItem(key: string): any | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting from localStorage', e);
      return null;
    }
  }

  // Elimina un item de localStorage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  // Limpia todo localStorage (¡usar con precaución!)
  clearAll(): void {
    try {
      localStorage.clear();
      console.log('All localStorage data cleared.');
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
}
