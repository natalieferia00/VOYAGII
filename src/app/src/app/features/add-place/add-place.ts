        import { Component, OnInit } from '@angular/core';
        import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../layout/app-sidebar/app-sidebar";
import { BudgetCalculatorComponent } from "../budget-calculator/budget-calculator"; // Para ngModel
        // Para la selección de imágenes, necesitarías una librería como ngx-image-cropper
        // o manejar input[type="file"] directamente. Por ahora, un placeholder.

        @Component({
          selector: 'app-add-place',
          standalone: true,
          imports: [SidebarComponent, BudgetCalculatorComponent], // Importa FormsModule para ngModel
          templateUrl: './add-place.html',
          styleUrls: ['./add-place.scss']
        })
        export class AddPlaceComponent implements OnInit {
          placeName: string = '';
          countryCity: string = '';
          dateVisited: string = '';
          comment: string = '';
          rating: number = 0;
          imagePreviewUrl: string | ArrayBuffer | null = null; // Para previsualizar la imagen

          constructor() { }

          ngOnInit(): void { }

          onFileSelected(event: Event): void {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files[0]) {
              const file = input.files[0];
              const reader = new FileReader();
              reader.onload = () => {
                this.imagePreviewUrl = reader.result;
              };
              reader.readAsDataURL(file);
            }
          }

          setRating(star: number): void {
            this.rating = star;
          }

          handleSavePlace(): void {
            // Lógica para guardar el lugar (usar DataStorageService)
            console.log({
              placeName: this.placeName,
              countryCity: this.countryCity,
              dateVisited: this.dateVisited,
              comment: this.comment,
              rating: this.rating,
              image: this.imagePreviewUrl // En una app real, guardarías el archivo o su URL en un backend
            });
            alert('Lugar guardado (funcionalidad de guardado real pendiente)');
            // Aquí podrías inyectar DataStorageService y usarlo:
            // this.dataStorageService.savePlace({ ... });
            // Luego, redirigir: this.router.navigate(['/dashboard']);
          }
        }
        