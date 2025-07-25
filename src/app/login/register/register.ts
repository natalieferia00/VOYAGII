import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../src/app/core/services/auth.service';
import { GeneralTripInfo } from '../../shared/components/interfaces/general-trip-info.interface'; // Importa la interfaz centralizada

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

  showGeneralInfoForm: boolean = false;
  travelerName: string = '';
  generalBudget: number | null = null;
  startDate: string = '';
  endDate: string = '';
  numberOfPlannedCountries: number | null = null;
  mainDestination: string = '';
  tripDurationDays: number | null = null;

  private observer: MutationObserver | undefined;

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
      const registrationSuccess = this.authService.register(this.email, this.password);

      if (registrationSuccess) {
        this.showGeneralInfoForm = true;
        alert('¡Cuenta creada exitosamente! Ahora, por favor, ingresa la información general de tu primer viaje.');
      } else {
        alert('Error al crear la cuenta: El correo electrónico ya está registrado.');
      }
    } else {
      alert('Error: Por favor, revisa los campos y asegúrate que las contraseñas coincidan.');
    }
  }

  saveGeneralTripInfo(): void {
    if (!this.travelerName || !this.startDate || !this.endDate || this.numberOfPlannedCountries === null || this.numberOfPlannedCountries < 0 || !this.mainDestination || this.tripDurationDays === null || this.tripDurationDays < 0) {
      alert('Por favor, completa todos los campos obligatorios: Nombre del Viajero, Fechas de Inicio y Fin, Número de Países, Destino Principal y Duración del Viaje.');
      return;
    }

    const infoToSave: GeneralTripInfo = {
      travelerName: this.travelerName,
      generalBudget: this.generalBudget,
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfPlannedCountries: this.numberOfPlannedCountries,
      mainDestination: this.mainDestination,
      tripDurationDays: this.tripDurationDays
    };
    localStorage.setItem('generalTripInfo', JSON.stringify(infoToSave));
    console.log('Información general inicial guardada desde registro:', infoToSave);
    alert('Información del viaje guardada. ¡Ahora puedes iniciar sesión!');
    this.router.navigate(['/login']);
  }
}