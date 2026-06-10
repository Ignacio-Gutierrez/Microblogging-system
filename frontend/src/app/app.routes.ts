import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then( m => m.MainLayoutComponent),
    children: [
      {
        path: 'home',
        data: { title: 'Inicio' },
        loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
      },
      { path: '', redirectTo: '/app/home', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full',
  }
];
