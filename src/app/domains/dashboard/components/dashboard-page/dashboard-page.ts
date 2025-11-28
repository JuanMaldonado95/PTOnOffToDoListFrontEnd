import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { mTaskModel } from '../../../../shared/models/Task/mTaskModel';
import { TaskService } from '../../../../core/services/task-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {

  tasks: mTaskModel[] = [];
  loading: boolean = false;

  constructor(
    private _taskService: TaskService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this._taskService.getTasks().pipe(
      catchError(error => {
        this._notificationService.showError(
          'Error de Conexión',
          'No se pudieron cargar las tareas del servidor.'
        );
        this.loading = false;
        return throwError(() => error);
      })
    ).subscribe((tasks: mTaskModel[]) => {
      this.tasks = tasks
        .map(t => ({
          ...t,
          dtDateTimeRegister: t.dtDateTimeRegister
            ? new Date(t.dtDateTimeRegister)
            : new Date()
        }))
        .sort((a, b) =>
          a.dtDateTimeRegister && b.dtDateTimeRegister
            ? b.dtDateTimeRegister.getTime() - a.dtDateTimeRegister.getTime()
            : 0
        );

      if (tasks.length > 0) {
        this._notificationService.showInfo(
          `Se cargaron ${tasks.length} tareas correctamente.`,
          'Información Obtenida'
        );
      } else {
        this._notificationService.showInfo(
          'Actualmente no tienes tareas registradas.',
          'Sin Tareas'
        );
      }

      this.loading = false;
    });
  }

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(t => t.bIsCompleted).length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(t => !t.bIsCompleted).length;
  }

}
