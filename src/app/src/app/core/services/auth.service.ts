import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {

  constructor() { }

  /**
   * Simula el registro de un usuario.
   * En una aplicación real, esto enviaría credenciales a un backend.
   * Para esta demo, guarda el usuario en localStorage.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns true si el registro fue "exitoso", false si el usuario ya existe.
   */
  register(email: string, password: string): boolean {
    // Simulación: Comprobar si el usuario ya existe en localStorage
    const storedUser = localStorage.getItem('registeredUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        console.warn('Registro fallido: El usuario ya existe.');
        return false; // Usuario ya existe
      }
    }

    // Simulación: Guardar el nuevo usuario en localStorage
    localStorage.setItem('registeredUser', JSON.stringify({ email, password }));
    console.log('Usuario registrado exitosamente (frontend-only):', email);
    return true;
  }

  /**
   * Simula el inicio de sesión de un usuario.
   * En una aplicación real, esto validaría credenciales con un backend
   * y recibiría un token de sesión.
   * Para esta demo, verifica las credenciales en localStorage y establece un estado de sesión.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns true si el login fue exitoso, false en caso contrario.
   */
  login(email: string, password: string): boolean {
    const storedUser = localStorage.getItem('registeredUser');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email && user.password === password) {
        // Simulación: Establecer el estado de "logueado"
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Inicio de sesión exitoso (frontend-only):', email);
        return true;
      }
    }
    console.warn('Inicio de sesión fallido: Credenciales incorrectas o usuario no registrado.');
    return false; // Credenciales incorrectas o usuario no registrado
  }

  /**
   * Simula el cierre de sesión.
   * En una aplicación real, esto invalidaría el token de sesión.
   * Para esta demo, limpia el estado de sesión en localStorage.
   */
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    console.log('Sesión cerrada.');
  }

  /**
   * Verifica si el usuario está "autenticado".
   * @returns true si el usuario está logueado, false en caso contrario.
   */
  isAuthenticated(): boolean {
    // En una aplicación real, aquí se verificaría la validez de un token.
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
