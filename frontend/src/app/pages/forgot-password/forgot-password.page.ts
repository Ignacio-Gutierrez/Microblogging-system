import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp } from 'ionicons/icons';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    IonText,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class ForgotPasswordPage {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly emailForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]],
  });

  isLoading = signal(false);
  sent = signal(false);
  errorMessage = signal('');

  constructor() {
    addIcons({ chatbubblesSharp });
  }

  onSubmit() {
    this.errorMessage.set('');
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const { email } = this.emailForm.getRawValue();

    this.authService.requestPasswordReset(email).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.sent.set(true);
      },
    });
  }
}