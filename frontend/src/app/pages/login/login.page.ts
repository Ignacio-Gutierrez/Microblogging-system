import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    RouterLink,
    FormsModule,
  ],
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  username = '';
  password = '';
  showPassword = false;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    addIcons({ chatbubblesSharp, eyeOffOutline, eyeOutline });
  }

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('Por favor completá todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({
      username: this.username.trim(),
      password: this.password,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: token => {
        this.authService.storeToken(token, this.username.trim());
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

  onForgotPassword() {
    // TODO: navigate to password recovery page
  }
}