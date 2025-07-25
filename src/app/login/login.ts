import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router
import { AuthService } from '../../app/src/app/core/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
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

  onLogin(form: NgForm): void {
    form.control.markAllAsTouched(); // Marcar campos como tocados para mostrar validaciones

    if (form.valid) {
      // Llama al servicio de autenticación para intentar el login
      const loginSuccess = this.authService.login(this.email, this.password);

      if (loginSuccess) {
        alert('¡Inicio de sesión exitoso! Redirigiendo al dashboard.');
        this.router.navigate(['/dashboard']); // Redirige al dashboard
      } else {
        alert('Error de inicio de sesión: Correo o contraseña incorrectos.');
      }
    } else {
      alert('Formulario inválido. Por favor, revisa los campos.');
    }
  }
}
