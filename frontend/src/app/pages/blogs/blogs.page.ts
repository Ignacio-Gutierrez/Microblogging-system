import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  IonIcon,
  IonFab,
  IonFabButton,
  IonList,
} from '@ionic/angular/standalone';
import { Blog } from 'src/app/shared/models/blog.model';
import { BlogService } from 'src/app/shared/services/blog.service';
import { BlogCardComponent } from 'src/app/shared/components/blog-card/blog-card.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { NavigationBarComponent } from 'src/app/shared/components/navigation-bar/navigation-bar.component';
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
    IonFab,
    IonFabButton,
    IonList,
    CommonModule,
    RouterLink,
    BlogCardComponent,
    HeaderComponent,
    NavigationBarComponent,
  ],
})
export class BlogsPage implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);

  blogs: Blog[] = [];
  isLoading = false;
  hasLoadError = false;

  constructor() {
    addIcons({ addSharp, sad });
  }

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.hasLoadError = false;

    this.blogService.getMyBlogs().subscribe({
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
    this.router.navigate(['/app/blogs', blog.id]);
  }
}