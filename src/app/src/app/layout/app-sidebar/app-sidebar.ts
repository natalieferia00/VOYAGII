import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes de Angular (ej. NgIf, NgFor)
import { RouterLink, RouterLinkActive } from '@angular/router'; // Necesario para la navegación y el estado 'active'

@Component({
  selector: 'app-sidebar', // El selector que usarás en tu HTML para insertar el sidebar
  standalone: true, // Declara este componente como standalone (autónomo)
  imports: [
    CommonModule,     // Provee directivas como NgIf, NgFor
    RouterLink,       // Permite usar [routerLink] para la navegación declarativa
    RouterLinkActive  // Permite aplicar una clase CSS (ej. 'active') cuando la ruta está activa
  ],
  templateUrl: './app-sidebar.html', // Enlaza a la plantilla HTML del sidebar
  styleUrls: ['./app-sidebar.scss']  // Enlaza a los estilos SCSS del sidebar
})
export class SidebarComponent {
  // Puedes añadir lógica aquí si quisieras un sidebar colapsable, por ejemplo.
  // Por ahora, es un sidebar de navegación estático.
}
