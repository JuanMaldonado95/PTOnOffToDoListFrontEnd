import { Component, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { TaskService } from '../../../../core/services/task-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { mTaskModel } from '../../../../shared/models/Task/mTaskModel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../../core/services/auth-service';
type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined;

@Component({
  selector: 'app-task-page',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    DividerModule,
    AutoCompleteModule,
    SelectModule,
    TooltipModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule
  ],
  templateUrl: './task-page.html',
  styleUrl: './task-page.scss',
  providers: [ConfirmationService, MessageService]
})
export class TaskPage {

  tasks: mTaskModel[] = [];
  filteredTasks: mTaskModel[] = [];
  selectedTasks: mTaskModel[] = [];
  loading: boolean = true;
  displayModal: boolean = false;
  isEditing: boolean = false;
  currentTask: Partial<mTaskModel> = {};
  displayDeleteModal: boolean = false;
  taskToDelete?: mTaskModel;
  public rows: number = 10;
  public totalRecords = signal<number>(0);

  filterState: string = 'all';
  stateOptions: MenuItem[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Completadas', value: 'completed' },
    { label: 'Pendientes', value: 'pending' }
  ];

  constructor(
    private _taskService: TaskService,
    private _notificationService: NotificationService,
    private _confirmationService: ConfirmationService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  trackByTask(index: number, task: mTaskModel): number {
    return task.iIDTask!;
  }

  loadTasks(): void {
    this.loading = true;
    this._taskService.getTasks().pipe(
      catchError(error => {
        this._notificationService.showError('Error de Conexión', 'No se pudieron cargar las tareas del servidor.');
        this.loading = false;
        return throwError(() => error);
      })
    ).subscribe((tasks: any[]) => {
      this.totalRecords.set(tasks.length);
      this.tasks = tasks
        .map(t => ({ ...t, createdAt: new Date(t.createdAt) }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      this.loading = false;
      this.onFilterChange();
    });
  }

  onFilterChange(): void {
    let tempTasks = this.tasks;
    if (this.filterState === 'all') {
      this.filteredTasks = this.tasks;
    } else if (this.filterState === 'completed') {
      this.filteredTasks = this.tasks.filter(t => t.bIsCompleted);
    } else if (this.filterState === 'pending') {
      this.filteredTasks = this.tasks.filter(t => !t.bIsCompleted);
    }
    this.totalRecords.set(tempTasks.length);

  }

  getSeverity(bIsCompleted: boolean): Severity {
    return bIsCompleted ? 'success' : 'warn';
  }

  createTask(): void {
    const userId = this._authService.getUserIdFromToken();
    this.isEditing = false;
    if (userId !== null)
      this.currentTask = { iIDTask: undefined, tTitle: '', bIsCompleted: false, iIDUser: userId };
    this.displayModal = true;
  }

  editTask(task: mTaskModel): void {
    this.isEditing = true;
    this.currentTask = { ...task };
    this.displayModal = true;
  }

  saveTask(): void {
    if (!this.currentTask.tTitle) {
      this._notificationService.showError('Falta Título', 'El título de la tarea es obligatorio.');
      return;
    }

    this.displayModal = false;

    if (this.isEditing && this.currentTask.iIDTask) {
      this._taskService.updateTask(this.currentTask as mTaskModel).pipe(
        catchError(error => {
          this._notificationService.showError('Fallo al Actualizar', 'No se pudo guardar la tarea en el servidor.');
          return throwError(() => error);
        })
      ).subscribe({
        next: () => {
          this._notificationService.showSuccess('Tarea Actualizada', `"${this.currentTask.tTitle}" ha sido modificada.`);
          this.loadTasks();
        }
      });
    } else {
      this._taskService.createTask(this.currentTask as mTaskModel).pipe(
        catchError(error => {
          this._notificationService.showError('Fallo al Crear', 'No se pudo crear la tarea en el servidor.');
          return throwError(() => error);
        })
      ).subscribe({
        next: () => {
          this._notificationService.showSuccess('Tarea Creada', `"${this.currentTask.tTitle}" ha sido añadida.`);
          this.loadTasks();
        }
      });
    }
  }

  deleteTask(task: mTaskModel): void {
    this.taskToDelete = task;
    this.displayDeleteModal = true;
  }

  confirmDeleteTask(): void {
    if (!this.taskToDelete?.iIDTask) return;

    this._taskService.deleteTask(this.taskToDelete.iIDTask).pipe(
      catchError(error => {
        this._notificationService.showError('Fallo al Eliminar', 'No se pudo eliminar la tarea del servidor.');
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        this._notificationService.showSuccess('Tarea Eliminada', `"${this.taskToDelete?.tTitle}" fue eliminada.`);
        this.displayDeleteModal = false;
        this.taskToDelete = undefined;
        this.loadTasks();
      }
    })
  }


  toggleCompletion(task: mTaskModel): void {
    const updatedTask = { ...task, bIsCompleted: !task.bIsCompleted };

    if (!updatedTask.iIDTask) return;

    this._taskService.updateTask(updatedTask).pipe(
      catchError(error => {
        this._notificationService.showError('Fallo de Estado', 'No se pudo cambiar el estado de la tarea.');
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        const status = updatedTask.bIsCompleted ? 'Completada' : 'Pendiente';
        this._notificationService.showInfo('Estado Actualizado', `Tarea marcada como ${status}.`);
        this.loadTasks();
      }
    });
  }

  deleteSelectedTasks(): void {
    this._confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar ${this.selectedTasks.length} tareas seleccionadas?`,
      header: 'Confirmar Eliminación Múltiple',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const tasksToDelete = this.selectedTasks.filter(t => t.iIDTask);
        tasksToDelete.forEach(task => {
          this._taskService.deleteTask(task.iIDTask!).subscribe({
            next: () => {
            },
            error: (e) => {
              this._notificationService.showError('Error Parcial', `La tarea "${task.tTitle}" no se pudo eliminar.`);
            }
          });
        });
        this.selectedTasks = [];
        this._notificationService.showSuccess('Procesando Eliminación', `${tasksToDelete.length} tareas están siendo eliminadas...`);
        setTimeout(() => this.loadTasks(), 500);
      }
    });
  }

}
