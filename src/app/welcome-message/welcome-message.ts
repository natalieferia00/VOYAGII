// src/app/shared/components/welcome-message/welcome-message.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-card">
      <h2 class="welcome-title">¡Hola {{ travelerName || 'Viajero' }}!</h2>
      <p class="welcome-question">¿Listo para planificar tu próxima gran aventura?</p>
    </div>
  `,
  styleUrls: ['./welcome-message.scss']
})
export class WelcomeMessageComponent implements OnInit {
  @Input() travelerName: string | null = null;

  constructor() { }

  ngOnInit(): void {
    // Puedes añadir lógica aquí si es necesario, pero para un saludo simple no es crucial.
  }
}