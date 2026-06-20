import { Component, inject, input, output, OnInit } from '@angular/core';
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

  readonly post = input<Post | null>(null);
  readonly created = output<Post>();
  readonly updated = output<Post>();
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
    const postToEdit = this.post();
    if (postToEdit) {
      this.postTitle = postToEdit.title;
      this.postContent = postToEdit.content;
      this.selectedBlogId = postToEdit.blog.id;
      this.tagsInput = postToEdit.tags?.map(tag => tag.name).join(', ') ?? '';
    }

    this.loadUserBlogs();
  }

  get isEditing(): boolean {
    return this.post() !== null;
  }

  get title(): string {
    return this.isEditing ? 'Editar post' : 'Crear post';
  }

  get submitText(): string {
    return this.isEditing ? 'Guardar cambios' : 'Crear post';
  }

  get loadingText(): string {
    return this.isEditing ? 'Guardando...' : 'Creando...';
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
    const selectedBlogId = this.selectedBlogId;

    const tagNames = this.tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length >= 2);

    this.resolveTags(tagNames, (tags) => {
      const postToEdit = this.post();
      if (postToEdit) {
        const updatedPostPayload = {
          id: postToEdit.id,
          title: this.postTitle.trim(),
          content: this.postContent.trim(),
          date: postToEdit.date,
          blog: { id: selectedBlogId },
          tags,
        };

        this.postService.updatePost(updatedPostPayload).subscribe({
          next: (updatedPost) => {
            this.isSubmitting = false;
            this.updated.emit(this.enrichUpdatedPost(postToEdit, updatedPost, tags));
          },
          error: (err) => {
            this.isSubmitting = false;
            this.setSubmitError(err, 'Error al editar el post. Intentalo de nuevo.');
          },
        });
        return;
      }

      const newPost: any = {
        title: this.postTitle.trim(),
        content: this.postContent.trim(),
        date: new Date().toISOString(),
        blog: { id: selectedBlogId },
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
          this.setSubmitError(err, 'Error al crear el post. Intentalo de nuevo.');
        },
      });
    });
  }

  private resolveTags(names: string[], callback: (tags: { id: number; name: string }[]) => void) {
    if (names.length === 0) {
      callback([]);
      return;
    }

    this.http.get<{ id: number; name: string }[]>('/api/tags').subscribe({
      next: (existingTags) => {
        const existingMap = new Map(existingTags.map(t => [t.name.toLowerCase(), t]));

        const resolved: { id: number; name: string }[] = [];
        const toCreate: string[] = [];

        for (const name of names) {
          const existing = existingMap.get(name);
          if (existing) {
            resolved.push({ id: existing.id, name: existing.name });
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
              resolved.push({ id: tag.id, name });
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

  private enrichUpdatedPost(originalPost: Post, updatedPost: Post, tags: { id: number; name: string }[]): Post {
    const selectedBlog = this.userBlogs.find(blog => blog.id === this.selectedBlogId);

    return {
      ...originalPost,
      ...updatedPost,
      blog: {
        ...originalPost.blog,
        ...selectedBlog,
        ...updatedPost.blog,
        user: updatedPost.blog?.user ?? selectedBlog?.user ?? originalPost.blog.user,
      },
      tags,
    };
  }

  private setSubmitError(err: any, fallbackMessage: string) {
    const errorBody = err.error;
    if (errorBody?.title && errorBody.title !== 'Bad Request') {
      this.errorMessage = errorBody.title;
    } else {
      this.errorMessage = fallbackMessage;
    }
  }
}
