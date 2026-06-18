import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { CreatePostModalComponent } from '../create-post-modal/create-post-modal.component';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    HeaderComponent,
    NavigationBarComponent,
    CreatePostModalComponent,
  ],
})
export class AppLayoutComponent {
  showCreatePostModal = false;

  openCreatePostModal() {
    this.showCreatePostModal = true;
  }

  onPostCreated(post: Post) {
    this.showCreatePostModal = false;
  }

  onPostModalDismissed() {
    this.showCreatePostModal = false;
  }
}