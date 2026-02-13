import { Routes } from '@angular/router';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./view/home/home.page').then((m) => m.HomePage), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./view/login/login.page').then( m => m.LoginPage), canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
