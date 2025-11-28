import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page.js';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: LoginPage,
    }
];