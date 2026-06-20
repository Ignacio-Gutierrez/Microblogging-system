import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import {
  AlertController,
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
import { CreateBlogModalComponent } from 'src/app/shared/components/create-blog-modal/create-blog-modal.component';
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
    BlogCardComponent,
    CreateBlogModalComponent,
  ],
})
export class BlogsPage implements OnInit, ViewWillEnter {
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly pageTitleService = inject(PageTitleService);
  private readonly alertController = inject(AlertController);

  blogs: Blog[] = [];
  isLoading = false;
  hasLoadError = false;
  isOwnProfile = false;
  profileLogin = '';
  showBlogModal = false;
  blogToEdit: Blog | null = null;

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

  async confirmDeleteBlog(blog: Blog) {
    if (!this.isOwnProfile) {
      return;
    }

    const alert = await this.alertController.create({
      cssClass: 'app-alert app-delete-alert',
      header: 'Eliminar blog',
      message: `Seguro que queres eliminar "${blog.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.deleteBlog(blog),
        },
      ],
    });

    await alert.present();
  }

  openCreateModal() {
    this.blogToEdit = null;
    this.showBlogModal = true;
  }

  openEditModal(blog: Blog) {
    if (!this.isOwnProfile) {
      return;
    }

    this.blogToEdit = blog;
    this.showBlogModal = true;
  }

  onBlogCreated(blog: Blog) {
    this.showBlogModal = false;
    this.blogToEdit = null;
    this.blogs.unshift(blog);
  }

  onBlogUpdated(blog: Blog) {
    this.showBlogModal = false;
    this.blogToEdit = null;
    this.blogs = this.blogs.map(existingBlog =>
      existingBlog.id === blog.id
        ? { ...existingBlog, ...blog, user: blog.user ?? existingBlog.user }
        : existingBlog
    );
  }

  onModalDismissed() {
    this.showBlogModal = false;
    this.blogToEdit = null;
  }

  private deleteBlog(blog: Blog) {
    this.blogService.deleteBlog(blog.id).subscribe({
      next: () => {
        this.loadBlogs(this.profileLogin);
      },
      error: () => this.showDeleteError(),
    });
  }

  private async showDeleteError() {
    const alert = await this.alertController.create({
      cssClass: 'app-alert',
      header: 'No se pudo eliminar',
      message: 'No pudimos eliminar el blog. Intenta de nuevo mas tarde.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
