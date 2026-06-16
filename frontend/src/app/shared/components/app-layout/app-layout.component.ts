import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    HeaderComponent,
    NavigationBarComponent,
  ],
})
export class AppLayoutComponent {}