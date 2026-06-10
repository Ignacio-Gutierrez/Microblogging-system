import { Component } from '@angular/core';
import { IonIcon, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubblesSharp, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonAvatar]
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  pageTitle: string = 'Inicio';

  constructor() {
    addIcons({ chatbubblesSharp, personCircleOutline });
  }

  onProfileClick() {
    if (this.isLoggedIn) {
      console.log('Ir al perfil');
    } else {
      console.log('Mostrar login');
    }
  }
}