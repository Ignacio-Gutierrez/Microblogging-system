import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from './post.service';

@Injectable({ providedIn: 'root' })
export class PostActionsService {
  private readonly alertController = inject(AlertController);
  private readonly postService = inject(PostService);

  async confirmDeletePost(post: Post): Promise<boolean> {
    const alert = await this.alertController.create({
      cssClass: 'app-alert app-delete-alert',
      header: 'Eliminar post',
      message: `Seguro que queres eliminar "${post.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (role !== 'destructive') {
      return false;
    }

    try {
      await firstValueFrom(this.postService.deletePost(post.id));
      return true;
    } catch {
      await this.showDeleteError();
      return false;
    }
  }

  private async showDeleteError() {
    const alert = await this.alertController.create({
      cssClass: 'app-alert',
      header: 'No se pudo eliminar',
      message: 'No pudimos eliminar el post. Intenta de nuevo mas tarde.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
