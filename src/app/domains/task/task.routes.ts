import { Routes } from '@angular/router';
import { TaskPage } from './components/task-page/task-page';

export const TASKS_ROUTES: Routes = [
    {
        path: '',
        component: TaskPage,
    },
];