import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonContent,
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { sad } from 'ionicons/icons';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonIcon,
    CommonModule,
    PostCardComponent,
    CreatePostModalComponent,
  ],
})
export class FeedPage implements OnInit, ViewWillEnter {
  private readonly postService = inject(PostService);
  private readonly postActionsService = inject(PostActionsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pageTitleService = inject(PageTitleService);

  posts: Post[] = [];
  showPostModal = false;
  postToEdit: Post | null = null;
  readonly currentUsername = this.authService.getUsername();
  currentPage = 0;
  readonly pageSize = 10;
  isLoading = false;
  hasMore = true;
  hasLoadError = false;

  constructor() {
    addIcons({ sad });
  }

  ngOnInit() {
    this.loadPosts();
  }

  ionViewWillEnter(): void {
    this.pageTitleService.setTitle('Feed');
  }

  loadPosts(onComplete?: () => void) {
    if (this.isLoading || !this.hasMore) {
      onComplete?.();
      return;
    }

    this.isLoading = true;
    this.hasLoadError = false;

    this.postService.getPosts(this.currentPage, this.pageSize).subscribe({
      next: (res: HttpResponse<Post[]>) => {
        const body = res.body ?? [];
        this.posts = [...this.posts, ...body];
        this.hasMore = body.length >= this.pageSize;
        this.currentPage++;
        this.isLoading = false;
        onComplete?.();
      },
      error: () => {
        this.isLoading = false;
        this.hasLoadError = true;
        onComplete?.();
      },
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.loadPosts(() => {
      event.target.complete();
      event.target.disabled = !this.hasMore || this.hasLoadError;
    });
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
    this.posts = this.posts.map(existingPost =>
      existingPost.id === updatedPost.id ? this.mergeUpdatedPost(existingPost, updatedPost) : existingPost
    );
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
      this.posts = this.posts.filter(existingPost => existingPost.id !== post.id);
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
