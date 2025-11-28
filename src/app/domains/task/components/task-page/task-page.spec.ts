import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskPage } from './task-page';
import { TaskService } from '../../../../core/services/task-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth-service';
import { of, throwError } from 'rxjs';
import { mTaskModel } from '../../../../shared/models/Task/mTaskModel';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockTasks: mTaskModel[] = [
  { iIDTask: 1, tTitle: 'Comprar leche', bIsCompleted: false, createdAt: new Date('2025-01-01T10:00:00Z') } as any,
  { iIDTask: 2, tTitle: 'Pagar facturas', bIsCompleted: true, createdAt: new Date('2025-01-02T10:00:00Z') } as any,
  { iIDTask: 3, tTitle: 'Estudiar Angular', bIsCompleted: false, createdAt: new Date('2025-01-03T10:00:00Z') } as any,
];

const mockTaskService = {
  getTasks: jasmine.createSpy('getTasks').and.returnValue(of(mockTasks)),
  createTask: jasmine.createSpy('createTask').and.returnValue(of({ iIDTask: 4, tTitle: 'Nueva Tarea', bIsCompleted: false })),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(of(undefined)),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(undefined)),
};

const mockNotificationService = {
  showSuccess: jasmine.createSpy('showSuccess'),
  showError: jasmine.createSpy('showError'),
  showInfo: jasmine.createSpy('showInfo'),
};

const mockConfirmationService = {
  confirm: jasmine.createSpy('confirm').and.callFake((c: any) => c.accept()),
};

// 🆕 NUEVO MOCK
const mockAuthService = {
  getUserIdFromToken: jasmine.createSpy('getUserIdFromToken').and.returnValue(99)
};

describe('TaskPage', () => {
  let component: TaskPage;
  let fixture: ComponentFixture<TaskPage>;
  let taskService: any;
  let notificationService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPage],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: AuthService, useValue: mockAuthService } // 👈 NUEVO
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskPage);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService);
    notificationService = TestBed.inject(NotificationService);

    fixture.detectChanges();
  });

  describe('Inicialización', () => {
    it('debe crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('ngOnInit debe llamar a loadTasks', () => {
      spyOn(component, 'loadTasks');
      component.ngOnInit();
      expect(component.loadTasks).toHaveBeenCalled();
    });
  });

  describe('Carga de tareas', () => {
    it('loadTasks debe manejar error de conexión', fakeAsync(() => {
      taskService.getTasks.and.returnValue(throwError(() => new Error()));
      component.loadTasks();
      tick();

      expect(notificationService.showError)
        .toHaveBeenCalledWith('Error de Conexión', 'No se pudieron cargar las tareas del servidor.');
      expect(component.tasks.length).toBe(0);
      expect(component.loading).toBeFalse();
    }));
  });

  describe('Filtrado de tareas', () => {
    it('debe mostrar todas cuando filterState = all', () => {
      component.tasks = mockTasks;
      component.filterState = 'all';
      component.onFilterChange();
      expect(component.filteredTasks.length).toBe(3);
    });

    it('debe mostrar solo completadas cuando filterState = completed', () => {
      component.tasks = mockTasks;
      component.filterState = 'completed';
      component.onFilterChange();
      expect(component.filteredTasks.length).toBe(1);
      expect(component.filteredTasks[0].iIDTask).toBe(2);
    });

    it('debe mostrar solo pendientes cuando filterState = pending', () => {
      component.tasks = mockTasks;
      component.filterState = 'pending';
      component.onFilterChange();
      expect(component.filteredTasks.map(x => x.iIDTask)).toEqual([1, 3]);
    });
  });

  describe('Etiquetas de severidad', () => {
    it('getSeverity debe retornar "success" para completadas', () => {
      expect(component.getSeverity(true)).toBe('success');
    });

    it('getSeverity debe retornar "warn" para pendientes', () => {
      expect(component.getSeverity(false)).toBe('warn');
    });
  });

  describe('Edición y creación de tareas', () => {
    it('createTask debe inicializar currentTask con usuario del token', () => {
      component.createTask();
      expect(component.isEditing).toBeFalse();
      expect(component.displayModal).toBeTrue();
      expect(component.currentTask.iIDUser).toBe(99); // 👈 NUEVA EXPECT
      expect(component.currentTask.iIDTask).toBeUndefined();
    });

    it('editTask debe preparar currentTask para editar', () => {
      component.editTask(mockTasks[1]);
      expect(component.isEditing).toBeTrue();
      expect(component.currentTask.tTitle).toBe('Pagar facturas');
    });

    it('saveTask debe validar título vacío', () => {
      component.currentTask = { tTitle: '' };
      component.saveTask();
      expect(notificationService.showError)
        .toHaveBeenCalledWith('Falta Título', 'El título de la tarea es obligatorio.');
    });

    it('saveTask (UPDATE) debe llamar updateTask y recargar', fakeAsync(() => {
      taskService.getTasks.calls.reset();
      component.isEditing = true;
      component.currentTask = { iIDTask: 1, tTitle: 'Editada' };

      component.saveTask();
      tick();

      expect(taskService.updateTask).toHaveBeenCalled();
      expect(notificationService.showSuccess)
        .toHaveBeenCalledWith('Tarea Actualizada', '"Editada" ha sido modificada.');
      expect(taskService.getTasks).toHaveBeenCalled();
    }));

    it('saveTask (CREATE) debe llamar createTask y recargar', fakeAsync(() => {
      taskService.getTasks.calls.reset();
      component.isEditing = false;
      component.currentTask = { tTitle: 'Nueva' };

      component.saveTask();
      tick();

      expect(taskService.createTask).toHaveBeenCalled();
      expect(notificationService.showSuccess)
        .toHaveBeenCalledWith('Tarea Creada', '"Nueva" ha sido añadida.');
      expect(taskService.getTasks).toHaveBeenCalled();
    }));
  });

  describe('Completado de tareas', () => {
    it('toggleCompletion debe actualizar la tarea y recargar', fakeAsync(() => {
      taskService.getTasks.calls.reset();
      component.toggleCompletion(mockTasks[0]);
      tick();

      expect(taskService.updateTask).toHaveBeenCalled();
      expect(taskService.getTasks).toHaveBeenCalled();
      expect(notificationService.showInfo)
        .toHaveBeenCalledWith('Estado Actualizado', 'Tarea marcada como Completada.');
    }));
  });

  describe('Eliminación de tareas', () => {
    it('deleteTask debe preparar el modal de eliminación', () => {
      component.deleteTask(mockTasks[0]);
      expect(component.taskToDelete).toBe(mockTasks[0]);
      expect(component.displayDeleteModal).toBeTrue();
    });

    it('confirmDeleteTask debe eliminar y recargar', fakeAsync(() => {
      taskService.getTasks.calls.reset();
      component.taskToDelete = mockTasks[0];

      component.confirmDeleteTask();
      tick();

      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
      expect(notificationService.showSuccess)
        .toHaveBeenCalledWith('Tarea Eliminada', '"Comprar leche" fue eliminada.');
      expect(taskService.getTasks).toHaveBeenCalled();
    }));
  });
});
