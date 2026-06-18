import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';
import { addIcons } from 'ionicons';
import { closeSharp } from 'ionicons/icons';

@Component({
  selector: 'app-create-blog-modal',
  templateUrl: './create-blog-modal.component.html',
  styleUrls: ['./create-blog-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonSpinner,
  ],
})
export class CreateBlogModalComponent {
  private readonly blogService = inject(BlogService);
  private readonly http = inject(HttpClient);

  readonly created = output<Blog>();
  readonly dismissed = output<void>();

  blogName = '';
  blogHandle = '';
  isSubmitting = false;
  errorMessage = '';

  constructor() {
    addIcons({ closeSharp });
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

    this.http.get<{ id: number }>('/api/account').subscribe({
      next: (user) => {
        const newBlog = {
          name: this.blogName.trim(),
          handle: this.blogHandle.trim(),
          user: { id: user.id },
        };

        this.blogService.createBlog(newBlog).subscribe({
          next: (createdBlog) => {
            this.isSubmitting = false;
            this.created.emit(createdBlog);
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
}