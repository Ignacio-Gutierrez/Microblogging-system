import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then( m => m.MainLayoutComponent),
    children: [
      {
        path: 'feed',
        data: { title: 'Feed' },
        loadComponent: () => import('./pages/feed/feed.page').then( m => m.FeedPage)
      },
      { path: 'search', redirectTo: '/app/feed', pathMatch: 'full' },
      { path: 'home', redirectTo: '/app/feed', pathMatch: 'full' },
      { path: 'post', redirectTo: '/app/feed', pathMatch: 'full' },
      { path: '', redirectTo: '/app/feed', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/app/feed',
    pathMatch: 'full',
  }
];
