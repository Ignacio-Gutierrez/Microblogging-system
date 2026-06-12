import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonIcon, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, logInOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton]
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  pageTitle: string = 'Microblogging';

  constructor() {
    addIcons({ chatbubblesSharp, logInOutline, logOutOutline });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.data['title'] as string | undefined;
      })
    ).subscribe(title => {
      if (title) {
        this.pageTitle = title;
      }
    });
  }

  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/app/profile');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  onLogout() {
    this.authService.logout();
  }
}