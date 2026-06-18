import { Component, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { PostService } from '../../services/post.service';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../models/post.model';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSpinner,
  ],
})
export class CreatePostModalComponent implements OnInit {
  private readonly postService = inject(PostService);
  private readonly blogService = inject(BlogService);
  private readonly http = inject(HttpClient);

  readonly created = output<Post>();
  readonly dismissed = output<void>();

  postTitle = '';
  postContent = '';
  tagsInput = '';
  selectedBlogId: number | null = null;
  userBlogs: Blog[] = [];
  isLoadingBlogs = false;
  isSubmitting = false;
  errorMessage = '';

  ngOnInit() {
    this.loadUserBlogs();
  }

  private loadUserBlogs() {
    this.isLoadingBlogs = true;
    this.blogService.getMyBlogs().subscribe({
      next: (blogs) => {
        this.userBlogs = blogs;
        this.isLoadingBlogs = false;
      },
      error: () => {
        this.isLoadingBlogs = false;
        this.errorMessage = 'No se pudieron cargar tus blogs.';
      },
    });
  }

  dismiss() {
    this.dismissed.emit();
  }

  submit() {
    this.errorMessage = '';

    if (!this.postTitle.trim()) {
      this.errorMessage = 'El título del post es obligatorio.';
      return;
    }

    if (!this.postContent.trim()) {
      this.errorMessage = 'El contenido del post es obligatorio.';
      return;
    }

    if (!this.selectedBlogId) {
      this.errorMessage = 'Seleccioná un blog para publicar.';
      return;
    }

    this.isSubmitting = true;

    const tagNames = this.tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length >= 2);

    this.resolveTags(tagNames, (tags) => {
      const newPost: any = {
        title: this.postTitle.trim(),
        content: this.postContent.trim(),
        date: new Date().toISOString(),
        blog: { id: this.selectedBlogId },
      };

      if (tags.length > 0) {
        newPost.tags = tags;
      }

      this.postService.createPost(newPost).subscribe({
        next: (createdPost) => {
          this.isSubmitting = false;
          this.created.emit(createdPost);
        },
        error: (err) => {
          this.isSubmitting = false;
          const errorBody = err.error;
          if (errorBody?.title && errorBody.title !== 'Bad Request') {
            this.errorMessage = errorBody.title;
          } else {
            this.errorMessage = 'Error al crear el post. Intentalo de nuevo.';
          }
        },
      });
    });
  }

  private resolveTags(names: string[], callback: (tags: { id: number }[]) => void) {
    if (names.length === 0) {
      callback([]);
      return;
    }

    this.http.get<{ id: number; name: string }[]>('/api/tags').subscribe({
      next: (existingTags) => {
        const existingMap = new Map(existingTags.map(t => [t.name.toLowerCase(), t]));

        const resolved: { id: number }[] = [];
        const toCreate: string[] = [];

        for (const name of names) {
          const existing = existingMap.get(name);
          if (existing) {
            resolved.push({ id: existing.id });
          } else {
            toCreate.push(name);
          }
        }

        if (toCreate.length === 0) {
          callback(resolved);
          return;
        }

        let created = 0;
        for (const name of toCreate) {
          this.http.post<{ id: number }>('/api/tags', { name }).subscribe({
            next: (tag) => {
              resolved.push({ id: tag.id });
              created++;
              if (created === toCreate.length) {
                callback(resolved);
              }
            },
            error: () => {
              created++;
              if (created === toCreate.length) {
                callback(resolved);
              }
            },
          });
        }
      },
      error: () => {
        callback([]);
      },
    });
  }
}