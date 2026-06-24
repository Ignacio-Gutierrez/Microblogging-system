import { Component, inject, output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  standalone: true,
  imports: [IonRefresher, IonRefresherContent],
})
export class PullToRefreshComponent {
  private readonly platform = inject(Platform);

  /** Emite el evento ionRefresh original para que el padre lo maneje y llame a complete() cuando termine. */
  readonly ionRefresh = output<{ target: { complete: () => void } }>();

  /** Solo se habilita en dispositivos móviles (touch). */
  readonly disabled = !this.platform.is('mobile');

  handleRefresh(event: { target: { complete: () => void } }) {
    this.ionRefresh.emit(event);
  }
}