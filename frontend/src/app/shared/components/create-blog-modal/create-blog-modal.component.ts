import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonSpinner } from '@ionic/angular/standalone';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-create-blog-modal',
  templateUrl: './create-blog-modal.component.html',
  styleUrls: ['./create-blog-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSpinner,
  ],
})
export class CreateBlogModalComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly http = inject(HttpClient);

  readonly blog = input<Blog | null>(null);
  readonly created = output<Blog>();
  readonly updated = output<Blog>();
  readonly dismissed = output<void>();

  blogName = '';
  blogHandle = '';
  isSubmitting = false;
  errorMessage = '';

  ngOnInit() {
    const blog = this.blog();
    if (blog) {
      this.blogName = blog.name;
      this.blogHandle = blog.handle;
    }
  }

  get isEditing(): boolean {
    return this.blog() !== null;
  }

  get title(): string {
    return this.isEditing ? 'Editar blog' : 'Crear blog';
  }

  get submitText(): string {
    return this.isEditing ? 'Guardar cambios' : 'Crear blog';
  }

  get loadingText(): string {
    return this.isEditing ? 'Guardando...' : 'Creando...';
  }

  dismiss() {
    this.dismissed.emit();
  }

  submit() {
    this.errorMessage = '';

    if (!this.blogName.trim() || this.blogName.trim().length < 3) {
      this.errorMessage = 'El nombre del blog debe tener al menos 3 caracteres.';
      return;
    }

    if (!this.blogHandle.trim() || this.blogHandle.trim().length < 2) {
      this.errorMessage = 'El identificador del blog debe tener al menos 2 caracteres.';
      return;
    }

    this.isSubmitting = true;

    const blogToEdit = this.blog();
    if (blogToEdit) {
      this.blogService.updateBlog({
        id: blogToEdit.id,
        name: this.blogName.trim(),
        handle: this.blogHandle.trim(),
      }).subscribe({
        next: (updatedBlog) => {
          this.isSubmitting = false;
          this.updated.emit(updatedBlog);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.setSubmitError(err, 'Error al editar el blog. Intentalo de nuevo.');
        },
      });
      return;
    }

    this.http.get<{ id: number; login: string }>('/api/account').subscribe({
      next: (user) => {
        const newBlog = {
          name: this.blogName.trim(),
          handle: this.blogHandle.trim(),
        };

        this.blogService.createBlog(newBlog).subscribe({
          next: (createdBlog) => {
            this.blogService.updateBlog({
              id: createdBlog.id,
              user: { id: user.id, login: user.login },
            }).subscribe({
              next: (updatedBlog) => {
                this.isSubmitting = false;
                this.created.emit(updatedBlog);
              },
              error: (err) => {
                this.isSubmitting = false;
                const errorBody = err.error;
                if (errorBody?.message === 'error.handleAlreadyExistsForUser') {
                  this.errorMessage = 'Ya existe un blog con ese identificador. Elegí otro.';
                } else if (errorBody?.title && errorBody.title !== 'Bad Request') {
                  this.errorMessage = errorBody.title;
                } else {
                  this.errorMessage = 'Error al crear el blog. Intentalo de nuevo.';
                }
              },
            });
          },
          error: (err) => {
            this.isSubmitting = false;
            const errorBody = err.error;
            if (errorBody?.message === 'error.handleAlreadyExistsForUser') {
              this.errorMessage = 'Ya existe un blog con ese identificador. Elegí otro.';
            } else if (errorBody?.title && errorBody.title !== 'Bad Request') {
              this.errorMessage = errorBody.title;
            } else {
              this.errorMessage = 'Error al crear el blog. Intentalo de nuevo.';
            }
          },
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo obtener la información del usuario.';
      },
    });
  }

  private setSubmitError(err: any, fallbackMessage: string) {
    const errorBody = err.error;
    if (errorBody?.message === 'error.handleAlreadyExistsForUser') {
      this.errorMessage = 'Ya existe un blog con ese identificador. Elegi otro.';
    } else if (errorBody?.title && errorBody.title !== 'Bad Request') {
      this.errorMessage = errorBody.title;
    } else {
      this.errorMessage = fallbackMessage;
    }
  }
}
