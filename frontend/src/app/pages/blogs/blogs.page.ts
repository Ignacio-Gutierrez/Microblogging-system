import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonContent,
  IonSpinner,
  IonIcon,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { Blog } from 'src/app/shared/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PageTitleService } from 'src/app/shared/services/page-title.service';
import { BlogCardComponent } from 'src/app/shared/components/blog-card/blog-card.component';
import { addIcons } from 'ionicons';
import { addSharp, sad } from 'ionicons/icons';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.page.html',
  styleUrls: ['./blogs.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonSpinner,
    IonIcon,
    IonButton,
    IonList,
    CommonModule,
    RouterLink,
    BlogCardComponent
  ],
})
export class BlogsPage implements OnInit, ViewWillEnter {
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly pageTitleService = inject(PageTitleService);

  blogs: Blog[] = [];
  isLoading = false;
  hasLoadError = false;
  isOwnProfile = false;
  profileLogin = '';

  constructor() {
    addIcons({ addSharp, sad });
  }

  ngOnInit() {
    this.setupBlogs();
  }

  ionViewWillEnter(): void {
    this.setupBlogs();
  }

  private setupBlogs() {
    this.route.paramMap.subscribe(params => {
      const login = params.get('login');
      if (login) {
        this.profileLogin = login;
        this.isOwnProfile = login === this.authService.getUsername();
        const displayName = login.charAt(0).toUpperCase() + login.slice(1);
        this.pageTitleService.setTitle(`${displayName} Blogs`);
        this.loadBlogs(login);
      }
    });
  }

  loadBlogs(login: string) {
    this.isLoading = true;
    this.hasLoadError = false;

    this.blogService.getBlogsByUser(login).subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasLoadError = true;
      },
    });
  }

  onBlogClick(blog: Blog) {
    this.router.navigate(['/app', this.profileLogin, 'blogs', blog.id, 'posts']);
  }
}