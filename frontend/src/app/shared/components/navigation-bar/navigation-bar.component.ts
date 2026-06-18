import { Component, inject } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeSharp, addCircleSharp, fileTrayStackedSharp, searchSharp } from 'ionicons/icons';
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

  constructor() {
    addIcons({ homeSharp, addCircleSharp, fileTrayStackedSharp, searchSharp });
  }

  get userBlogsLink(): string {
    const username = this.authService.getUsername();
    return username ? `/app/${username}/blogs` : '/app/feed';
  }
}
