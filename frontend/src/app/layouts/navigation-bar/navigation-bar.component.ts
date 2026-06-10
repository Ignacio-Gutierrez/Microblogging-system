import { Component } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeSharp, searchSharp, addCircleSharp } from 'ionicons/icons';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  standalone: true,
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class NavigationBarComponent {
  constructor() { 
    addIcons({ homeSharp, searchSharp, addCircleSharp });
  }
}