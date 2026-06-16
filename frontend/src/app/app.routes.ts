import { Routes } from '@angular/router';
import { redirectIfAuthenticatedGuard } from './shared/guards/redirect-if-authenticated.guard';
import { requireAuthGuard } from './shared/guards/require-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    data: { title: 'Iniciar Sesión' },
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    data: { title: 'Registrarse' },
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'app',
    loadComponent: () => import('./shared/components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: 'feed',
        data: { title: 'Feed' },
        loadComponent: () => import('./pages/feed/feed.page').then( m => m.FeedPage)
      },
      {
        path: 'blogs',
        data: { title: 'Mis Blogs' },
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./pages/blogs/blogs.page').then( m => m.BlogsPage)
      },
      { path: 'search', redirectTo: '/app/feed', pathMatch: 'full' },
      { path: 'post', redirectTo: '/app/feed', pathMatch: 'full' },
      { path: '', redirectTo: '/app/feed', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: 'app/feed',
    pathMatch: 'full',
  }
];
