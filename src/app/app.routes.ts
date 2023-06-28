import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full',
  },
  {
    path: 'notes',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'notes/:id',
    loadComponent: () => import('./details/details.page').then( m => m.DetailsPage)
  },
];
