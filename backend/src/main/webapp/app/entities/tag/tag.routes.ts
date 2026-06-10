import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import TagResolve from './route/tag-routing-resolve.service';

const tagRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tag').then(m => m.Tag),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/tag-detail').then(m => m.TagDetail),
    resolve: {
      tag: TagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/tag-update').then(m => m.TagUpdate),
    resolve: {
      tag: TagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/tag-update').then(m => m.TagUpdate),
    resolve: {
      tag: TagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tagRoute;
