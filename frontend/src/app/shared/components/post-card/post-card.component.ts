import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/post.model';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonIcon,
  IonButton,
  IonPopover,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, ellipsisVerticalSharp, timeOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonIcon,
    IonButton,
    IonPopover,
    DatePipe,
  ],
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly showActions = input(false);

  readonly userClick = output<Post>();
  readonly blogClick = output<Post>();
  readonly tagClick = output<{ tag: string; post: Post }>();
  readonly editRequested = output<Post>();
  readonly deleteRequested = output<Post>();

  constructor() {
    addIcons({ createOutline, ellipsisVerticalSharp, timeOutline, trashOutline });
  }

  get actionsTriggerId(): string {
    return `post-actions-${this.post().id}`;
  }

  onUserClick() {
    this.userClick.emit(this.post());
  }

  onBlogClick() {
    this.blogClick.emit(this.post());
  }

  onTagClick(tag: { id: number; name: string }) {
    this.tagClick.emit({ tag: tag.name, post: this.post() });
  }

  requestEdit(event: Event) {
    event.stopPropagation();
    this.editRequested.emit(this.post());
  }

  requestDelete(event: Event) {
    event.stopPropagation();
    this.deleteRequested.emit(this.post());
  }
}
