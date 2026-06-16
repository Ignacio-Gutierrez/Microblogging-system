import { Component, input, output } from '@angular/core';
import { Blog } from '../../models/blog.model';
import {
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fileTray } from 'ionicons/icons';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class BlogCardComponent {
  readonly blog = input.required<Blog>();

  readonly click = output<Blog>();

  constructor() {
    addIcons({ fileTray });
  }

  onClick() {
    this.click.emit(this.blog());
  }
}