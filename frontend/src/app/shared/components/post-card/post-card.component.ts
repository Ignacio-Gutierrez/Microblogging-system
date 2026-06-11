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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';

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
    DatePipe,
  ],
})
export class PostCardComponent {
  readonly post = input.required<Post>();

  readonly userClick = output<Post>();
  readonly blogClick = output<Post>();
  readonly tagClick = output<{ tag: string; post: Post }>();

  constructor() {
    addIcons({ timeOutline });
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
}