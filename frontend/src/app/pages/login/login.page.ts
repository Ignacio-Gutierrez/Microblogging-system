import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import {
  IonContent,
  IonText,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonIcon,
    IonSpinner,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    addIcons({ chatbubblesSharp, eyeOffOutline, eyeOutline });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor completá todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({
      username: username.trim(),
      password,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: token => {
        this.authService.storeToken(token, username.trim());
        this.isLoading.set(false);
        this.router.navigateByUrl('/app/feed', { replaceUrl: true });
      },
      error: err => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Usuario o contraseña incorrectos');
        } else {
          this.errorMessage.set('Error al conectar con el servidor');
        }
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRegisterClick() {
    this.router.navigateByUrl('/register');
  }

  onForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}