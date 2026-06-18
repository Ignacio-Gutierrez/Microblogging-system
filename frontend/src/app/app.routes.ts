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
        path: ':login/blogs',
        data: { title: 'User Blogs' },
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./pages/blogs/blogs.page').then( m => m.BlogsPage)
      },
      {
        path: ':login/blogs/:blogId/posts',
        data: { title: 'Blog Posts' },
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./pages/blog-posts/blog-posts.page').then( m => m.BlogPostsPage)
      },
      {
        path: 'tag/:tagName',
        data: { title: 'Tag' },
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./pages/tag-posts/tag-posts.page').then( m => m.TagPostsPage)
      },
      {
        path: 'search',
        data: { title: 'Buscar' },
        canActivate: [requireAuthGuard],
        loadComponent: () => import('./pages/search/search.page').then( m => m.SearchPage)
      },
      {
        path: 'random',
        data: { title: 'Post aleatorio' },
        loadComponent: () => import('./pages/random-post/random-post.page').then( m => m.RandomPostPage)
      },
      { path: '**', redirectTo: '/app/feed' },
      { path: '', redirectTo: '/app/feed', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: 'app/feed',
    pathMatch: 'full',
  }
];
