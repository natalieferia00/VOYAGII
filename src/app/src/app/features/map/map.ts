        import { Component } from '@angular/core';
        import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";

        @Component({
          selector: 'app-map',
          standalone: true,
          imports: [ SidebarComponent],
          templateUrl: './map.html',
          styleUrls: ['./map.scss']
        })
        export class MapComponent {
          // Lógica del mapa aquí
        }
        