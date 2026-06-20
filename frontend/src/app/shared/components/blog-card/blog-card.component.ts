import { Component, input, output } from '@angular/core';
import { Blog } from '../../models/blog.model';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonPopover,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, ellipsisVerticalSharp, fileTray, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonItem,
    IonLabel,
    IonIcon,
    IonPopover,
  ],
})
export class BlogCardComponent {
  readonly blog = input.required<Blog>();
  readonly showActions = input(false);

  readonly click = output<Blog>();
  readonly editRequested = output<Blog>();
  readonly deleteRequested = output<Blog>();

  constructor() {
    addIcons({ createOutline, ellipsisVerticalSharp, fileTray, trashOutline });
  }

  get actionsTriggerId(): string {
    return `blog-actions-${this.blog().id}`;
  }

  onClick() {
    this.click.emit(this.blog());
  }

  requestEdit(event: Event) {
    event.stopPropagation();
    this.editRequested.emit(this.blog());
  }

  requestDelete(event: Event) {
    event.stopPropagation();
    this.deleteRequested.emit(this.blog());
  }
}
