import { Component, inject, output } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeSharp, addCircleSharp, fileTrayStackedSharp, searchSharp, globeSharp } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabBar, IonTabButton, RouterLink, RouterLinkActive],
})
export class NavigationBarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly createPost = output<void>();

  constructor() {
    addIcons({ homeSharp, addCircleSharp, fileTrayStackedSharp, searchSharp, globeSharp });
  }

  onCreatePost() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.createPost.emit();
  }

  get userBlogsLink(): string {
    if (!this.authService.isAuthenticated()) {
      return '/login';
    }
    return `/app/${this.authService.getUsername()}/blogs`;
  }
}
