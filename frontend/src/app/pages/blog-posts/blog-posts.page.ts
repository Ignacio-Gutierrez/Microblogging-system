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
import { BlogService } from 'src/app/shared/services/blog.service';
import { PostCardComponent } from 'src/app/shared/components/post-card/post-card.component';
import { PageTitleService } from 'src/app/shared/services/page-title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { sad } from 'ionicons/icons';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.page.html',
  styleUrls: ['./blog-posts.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonIcon,
    CommonModule,
    PostCardComponent,
  ],
})
export class BlogPostsPage implements OnInit {
  private readonly postService = inject(PostService);
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pageTitleService = inject(PageTitleService);

  posts: Post[] = [];
  currentPage = 0;
  readonly pageSize = 10;
  isLoading = false;
  hasMore = true;
  hasLoadError = false;
  blogId = 0;
  blogName = '';
  profileLogin = '';

  constructor() {
    addIcons({ sad });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const login = params.get('login');
      const blogIdStr = params.get('blogId');
      if (login && blogIdStr) {
        this.profileLogin = login;
        this.blogId = Number(blogIdStr);
        const displayName = login.charAt(0).toUpperCase() + login.slice(1);
        this.pageTitleService.setTitle(`${displayName} · ...`);
        this.verifyBlog();
      }
    });
  }

  private verifyBlog() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
        if (blog.user?.login !== this.profileLogin) {
          this.router.navigate(['/app', this.profileLogin, 'blogs']);
          return;
        }
        this.blogName = blog.name;
        const displayName = this.profileLogin.charAt(0).toUpperCase() + this.profileLogin.slice(1);
        this.pageTitleService.setTitle(`${displayName} · ${this.blogName}`);
        this.resetAndLoad();
      },
      error: () => {
        this.router.navigate(['/app', this.profileLogin, 'blogs']);
      },
    });
  }

  private resetAndLoad() {
    this.posts = [];
    this.currentPage = 0;
    this.hasMore = true;
    this.hasLoadError = false;
    this.loadPosts();
  }

  loadPosts(onComplete?: () => void) {
    if (this.isLoading || !this.hasMore) {
      onComplete?.();
      return;
    }

    this.isLoading = true;
    this.hasLoadError = false;

    this.postService.getPostsByBlog(this.blogId, this.currentPage, this.pageSize).subscribe({
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

  onBlogClick(_post: Post) {
    // Already viewing posts of this blog — no navigation needed
  }
}