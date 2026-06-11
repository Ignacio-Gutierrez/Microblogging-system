import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonIcon, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, personCircleOutline } from 'ionicons/icons';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonAvatar]
})
export class HeaderComponent {
  private readonly router = inject(Router);

  isLoggedIn: boolean = false;
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  pageTitle: string = 'Inicio';

  constructor() {
    addIcons({ chatbubblesSharp, personCircleOutline });

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
    if (this.isLoggedIn) {
      console.log('Ir al perfil');
    } else {
      console.log('Mostrar login');
    }
  }
}