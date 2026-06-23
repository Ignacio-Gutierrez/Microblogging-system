import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    IonText,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly registerForm = this.formBuilder.group({
    username: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(254),
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]],
    confirmPassword: ['', [
      Validators.required,
    ]],
  }, { validators: passwordMatchValidator });

  showPassword = false;
  showConfirmPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor() {
    addIcons({ chatbubblesSharp, eyeOffOutline, eyeOutline });
  }

  onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.errorMessage.set(this.getValidationMessage());
      return;
    }

    this.isLoading.set(true);

    const { username, email, password } = this.registerForm.getRawValue();

    this.authService.register({
      login: username,
      email,
      password,
      langKey: 'es',
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Revisá tu correo para activarla antes de iniciar sesión.');
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private resetForm() {
    this.registerForm.reset({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  private getValidationMessage(): string {
    if (this.registerForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    if (this.registerForm.controls.email.hasError('email')) {
      return 'Ingresá un email válido';
    }

    if (this.registerForm.controls.email.hasError('minlength')) {
      return 'El email debe tener al menos 5 caracteres';
    }

    if (this.registerForm.controls.email.hasError('maxlength')) {
      return 'El email no puede superar los 254 caracteres';
    }

    if (this.registerForm.controls.password.hasError('minlength')) {
      return 'La contraseña debe tener al menos 4 caracteres';
    }

    if (this.registerForm.controls.password.hasError('maxlength')) {
      return 'La contraseña no puede superar los 100 caracteres';
    }

    if (this.registerForm.controls.username.hasError('maxlength')) {
      return 'El usuario no puede superar los 50 caracteres';
    }

    if (this.registerForm.controls.username.hasError('pattern')) {
      return 'Ingresá un usuario válido';
    }

    return 'Por favor completá todos los campos';
  }

  private getErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 400) {
      return 'No se pudo crear la cuenta con esos datos';
    }

    return 'Error al conectar con el servidor';
  }
}
