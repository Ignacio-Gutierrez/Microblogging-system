import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  IonContent,
  IonSpinner,
  IonIcon,
  IonSearchbar,
  IonLabel,
  IonAvatar,
  IonChip,
} from '@ionic/angular/standalone';
import { PostCardComponent } from 'src/app/shared/components/post-card/post-card.component';
import { SearchService, SearchAllResult } from 'src/app/shared/services/search.service';
import { PageTitleService } from 'src/app/shared/services/page-title.service';
import { Post } from 'src/app/shared/models/post.model';
import { addIcons } from 'ionicons';
import { layersSharp, sad, peopleSharp } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSpinner,
    IonIcon,
    IonSearchbar,
    IonLabel,
    IonAvatar,
    IonChip,
    CommonModule,
    FormsModule,
    PostCardComponent,
  ],
})
export class SearchPage implements OnInit, OnDestroy {
  private readonly searchService = inject(SearchService);
  private readonly router = inject(Router);
  private readonly pageTitleService = inject(PageTitleService);

  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  query = '';
  users: SearchAllResult['users'] = [];
  posts: Post[] = [];
  isLoading = false;
  hasSearched = false;

  constructor() {
    addIcons({ layersSharp, sad, peopleSharp });
  }

  ngOnInit() {
    this.pageTitleService.setTitle('Buscar');

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(q => this.executeSearch(q));
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchInput(event: Event): void {
    const value = (event as CustomEvent).detail.value ?? '';
    this.query = value;
    this.searchSubject.next(value);
  }

  private executeSearch(query: string): void {
    if (!query.trim()) {
      this.users = [];
      this.posts = [];
      this.hasSearched = false;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;

    this.searchService.searchAll(query).subscribe({
      next: result => {
        this.users = result.users;
        this.posts = result.posts;
        this.isLoading = false;
      },
      error: () => {
        this.users = [];
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  onUserClick(login: string): void {
    this.router.navigate(['/app', login, 'blogs']);
  }

  onPostUserClick(post: Post): void {
    const login = post.blog.user?.login;
    if (login) {
      this.router.navigate(['/app', login, 'blogs']);
    }
  }

  onPostBlogClick(post: Post): void {
    const login = post.blog.user?.login;
    if (login) {
      this.router.navigate(['/app', login, 'blogs', post.blog.id, 'posts']);
    }
  }

  onPostTagClick(event: { tag: string; post: Post }): void {
    this.router.navigate(['/app/tag', event.tag]);
  }
}