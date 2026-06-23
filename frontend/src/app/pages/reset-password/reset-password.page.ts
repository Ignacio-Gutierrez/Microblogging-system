import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    IonText,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class ResetPasswordPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly passwordForm = this.formBuilder.group({
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
    confirmPassword: ['', [Validators.required]],
  });

  key = '';
  isLoading = signal(false);
  success = signal(false);
  error = signal(false);
  errorMessage = signal('');
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    addIcons({ chatbubblesSharp, eyeOffOutline, eyeOutline });
  }

  ngOnInit(): void {
    const key = this.route.snapshot.queryParamMap.get('key');
    if (!key) {
      this.error.set(true);
      return;
    }
    this.key = key;
  }

  onSubmit() {
    this.errorMessage.set('');
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.isLoading.set(true);

    this.authService.finishPasswordReset(this.key, newPassword).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.success.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set(true);
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}