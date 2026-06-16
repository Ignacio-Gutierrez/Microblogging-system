import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
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
import { PostCardComponent } from 'src/app/shared/components/post-card/post-card.component';
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
    PostCardComponent
  ],
})
export class FeedPage implements OnInit {
  private readonly postService = inject(PostService);

  posts: Post[] = [];
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
}
