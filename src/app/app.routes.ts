import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './shared/components/dashboard-layout-component/dashboard-layout-component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadChildren: () => import('./domains/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'tasks',
                loadChildren: () => import('./domains/task/task.routes').then(m => m.TASKS_ROUTES)
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./domains/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
