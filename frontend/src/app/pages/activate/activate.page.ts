import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, checkmarkCircleSharp, closeCircleSharp } from 'ionicons/icons';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.page.html',
  styleUrls: ['./activate.page.scss'],
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
  ],
})
export class ActivatePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal(true);
  success = signal(false);
  error = signal(false);

  constructor() {
    addIcons({ chatbubblesSharp, checkmarkCircleSharp, closeCircleSharp });
  }

  ngOnInit(): void {
    const key = this.route.snapshot.queryParamMap.get('key');

    if (!key) {
      this.isLoading.set(false);
      this.error.set(true);
      return;
    }

    this.authService.activateAccount(key).pipe(
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

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}