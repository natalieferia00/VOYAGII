import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router
import { AuthService } from '../../src/app/core/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  confirmPassword = '';
  passwordMismatch: boolean = false;
  logoSrc: string = 'assets/images/logo.png';

  private observer: MutationObserver | undefined;

  // Inyecta Renderer2, Router y AuthService
  constructor(private renderer: Renderer2, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateLogoSrc();
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.attributeName === 'class') {
          this.updateLogoSrc();
        }
      });
    });
    this.observer.observe(document.body, { attributes: true });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateLogoSrc(): void {
    if (document.body.classList.contains('dark-mode')) {
      this.logoSrc = 'assets/images/logo-dark.png';
    } else {
      this.logoSrc = 'assets/images/logo.png';
    }
  }

  checkPasswordMatch(): void {
    this.passwordMismatch = this.password !== this.confirmPassword && this.confirmPassword.length > 0;
  }

  onRegister(form: NgForm): void {
    form.control.markAllAsTouched();
    this.checkPasswordMatch();

    if (form.valid && !this.passwordMismatch) {
      // Llama al servicio de autenticación para registrar al usuario
      const registrationSuccess = this.authService.register(this.email, this.password);

      if (registrationSuccess) {
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); // Redirige al login
      } else {
        alert('Error al crear la cuenta: El correo electrónico ya está registrado.');
      }
    } else {
      alert('Error: Por favor, revisa los campos y asegúrate que las contraseñas coincidan.');
    }
  }
}
