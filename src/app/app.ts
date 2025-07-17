// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes como NgIf, NgFor
import { RouterOutlet } from '@angular/router'; // Necesario para <router-outlet>
//import { SidebarComponent } from './shared/components/sidebar/sidebar.component'; // Importa tu SidebarComponent

@Component({
  selector: 'app-root', // Este selector es el que se usa en src/index.html (<app-root></app-root>)
  standalone: true, // Indica que este es un componente standalone
  imports: [
    CommonModule,     // Provee directivas comunes de Angular
    RouterOutlet,     // Permite que las rutas definidas se muestren en el HTML
   // SidebarComponent  // Importa tu componente de sidebar para usarlo en la plantilla
  ],
  templateUrl: './app.html', // Enlaza al archivo HTML de la plantilla (¡observa el nombre!)
  styleUrls: ['./app.scss']  // Enlaza al archivo de estilos (¡observa el nombre!)
})
export class App { // La clase del componente se llama 'App'
  title = 'MiAppViajesAngular'; // Una propiedad de ejemplo
}
