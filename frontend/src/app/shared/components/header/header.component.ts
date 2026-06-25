import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { IonIcon, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, logInOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { PageTitleService } from '../../services/page-title.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, AsyncPipe]
})
export class HeaderComponent {
  private readonly pageTitleService = inject(PageTitleService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly pageTitle$ = this.pageTitleService.title$;

  constructor() {
    addIcons({ chatbubblesSharp, logInOutline, logOutOutline });
  }

  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      const username = this.authService.getUsername();
      this.router.navigateByUrl(`/app/${username}/blogs`);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  onLogout() {
    this.authService.logout();
    const currentUrl = this.router.url;
    if (currentUrl !== '/app/feed' && currentUrl !== '/app/random') {
      this.router.navigateByUrl('/login');
    }
  }
}