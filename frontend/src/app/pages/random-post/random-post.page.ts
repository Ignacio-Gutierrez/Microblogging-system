import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { Post } from 'src/app/shared/models/post.model';
import { PostService } from 'src/app/shared/services/post.service';
import { PostActionsService } from 'src/app/shared/services/post-actions.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PostCardComponent } from 'src/app/shared/components/post-card/post-card.component';
import { CreatePostModalComponent } from 'src/app/shared/components/create-post-modal/create-post-modal.component';
import { PageTitleService } from 'src/app/shared/services/page-title.service';
import { addIcons } from 'ionicons';
import { sad, refreshSharp } from 'ionicons/icons';

@Component({
  selector: 'app-random-post',
  templateUrl: './random-post.page.html',
  styleUrls: ['./random-post.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSpinner,
    IonIcon,
    CommonModule,
    PostCardComponent,
    CreatePostModalComponent,
  ],
})
export class RandomPostPage implements OnInit, ViewWillEnter {
  private readonly postService = inject(PostService);
  private readonly postActionsService = inject(PostActionsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pageTitleService = inject(PageTitleService);

  post: Post | null = null;
  showPostModal = false;
  postToEdit: Post | null = null;
  readonly currentUsername = this.authService.getUsername();
  isLoading = false;
  hasLoadError = false;
  noPostsToday = false;

  constructor() {
    addIcons({ sad, refreshSharp });
  }

  ngOnInit() {
    this.loadRandomPost();
  }

  ionViewWillEnter(): void {
    this.pageTitleService.setTitle('Post aleatorio');
  }

  loadRandomPost() {
    this.isLoading = true;
    this.hasLoadError = false;
    this.noPostsToday = false;

    this.postService.getRandomPost().subscribe({
      next: (post) => {
        this.isLoading = false;
        if (post) {
          this.post = post;
        } else {
          this.noPostsToday = true;
        }
      },
      error: () => {
        this.isLoading = false;
        this.hasLoadError = true;
      },
    });
  }

  refresh() {
    this.post = null;
    this.loadRandomPost();
  }

  onUserClick(post: Post) {
    const login = post.blog.user?.login;
    if (login) {
      this.router.navigate(['/app', login, 'blogs']);
    }
  }

  onBlogClick(post: Post) {
    const login = post.blog.user?.login;
    if (login) {
      this.router.navigate(['/app', login, 'blogs', post.blog.id, 'posts']);
    }
  }

  onTagClick(event: { tag: string; post: Post }) {
    this.router.navigate(['/app/tag', event.tag]);
  }

  openEditModal(post: Post) {
    if (post.blog.user?.login !== this.currentUsername) {
      return;
    }

    this.postToEdit = post;
    this.showPostModal = true;
  }

  onPostUpdated(updatedPost: Post) {
    this.showPostModal = false;
    this.postToEdit = null;
    this.postService.getPostById(updatedPost.id).subscribe({
      next: (reloadedPost) => this.applyUpdatedPost(reloadedPost),
      error: () => this.applyUpdatedPost(updatedPost),
    });
  }

  private applyUpdatedPost(updatedPost: Post) {
    this.post = this.post ? this.mergeUpdatedPost(this.post, updatedPost) : updatedPost;
  }

  onPostModalDismissed() {
    this.showPostModal = false;
    this.postToEdit = null;
  }

  async confirmDeletePost(post: Post) {
    if (post.blog.user?.login !== this.currentUsername) {
      return;
    }

    const deleted = await this.postActionsService.confirmDeletePost(post);
    if (deleted) {
      this.refresh();
    }
  }

  private mergeUpdatedPost(existingPost: Post, updatedPost: Post): Post {
    return {
      ...existingPost,
      ...updatedPost,
      blog: {
        ...existingPost.blog,
        ...updatedPost.blog,
        user: updatedPost.blog?.user ?? existingPost.blog.user,
      },
      tags: updatedPost.tags ?? existingPost.tags,
    };
  }
}
