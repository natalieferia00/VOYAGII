import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';

  onRegister() {
    console.log('Registro:', this.email, this.password);
    // Aquí se implementará la lógica de registro más adelante
  }
}
