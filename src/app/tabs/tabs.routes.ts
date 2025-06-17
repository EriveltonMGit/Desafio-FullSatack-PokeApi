import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../favorites/favorites.component').then((m) => m.FavoritesComponent),
      },
      {
        path: 'details/:id', // Adicionado ':id' para capturar o parâmetro do Pokémon
        loadComponent: () =>
          import('../details/main-details.component').then((m) => m.MainDetailsComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];