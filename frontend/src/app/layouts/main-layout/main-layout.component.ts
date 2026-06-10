import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [IonRouterOutlet, NavigationBarComponent, HeaderComponent],
})
export class MainLayoutComponent {

  constructor() { }
}