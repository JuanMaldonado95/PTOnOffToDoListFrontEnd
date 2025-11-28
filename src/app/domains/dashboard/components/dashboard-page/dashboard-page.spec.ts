import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardPage } from './dashboard-page';
import { TaskService } from '../../../../core/services/task-service';
import { NotificationService } from '../../../../core/services/notification-service';
import { mTaskModel } from '../../../../shared/models/Task/mTaskModel';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

const mockTaskService = {
  getTasks: jasmine.createSpy('getTasks'),
};

const mockNotificationService = {
  showError: jasmine.createSpy('showError'),
  showInfo: jasmine.createSpy('showInfo'),
};

const mockTasks: mTaskModel[] = [
  {
    iIDTask: 1,
    tTitle: 'Tarea A',
    bIsCompleted: false,
    dtDateTimeRegister: new Date('2023-10-20T10:00:00Z'),
  },
  {
    iIDTask: 2,
    tTitle: 'Tarea B',
    bIsCompleted: true,
    dtDateTimeRegister: new Date('2023-10-21T10:00:00Z'),
  },
  {
    iIDTask: 3,
    tTitle: 'Tarea C',
    bIsCompleted: false,
    dtDateTimeRegister: new Date('2023-10-22T10:00:00Z'),
  },
];

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let taskService: TaskService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardPage,
        CommonModule,
        CardModule,
        TagModule,
        DividerModule,
        IconFieldModule,
        InputIconModule,
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService);
    notificationService = TestBed.inject(NotificationService);

    mockTaskService.getTasks.calls.reset();
    mockNotificationService.showError.calls.reset();
    mockNotificationService.showInfo.calls.reset();
  });

  it('Debe crear el componente', () => {
    mockTaskService.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('Debe llamar a loadTasks() en ngOnInit', () => {
    const loadTasksSpy = spyOn(component, 'loadTasks');
    mockTaskService.getTasks.and.returnValue(of([]));
    fixture.detectChanges();
    expect(loadTasksSpy).toHaveBeenCalled();
  });

  it('loadTasks() debe cargar y ordenar las tareas correctamente en caso de éxito', () => {
    mockTaskService.getTasks.and.returnValue(of(mockTasks));

    component.loadTasks();

    expect(component.loading).toBeFalse();
    expect(component.tasks.length).toBe(3);

    expect(component.tasks[0].tTitle).toBe('Tarea C', 'La tarea más reciente (Tarea C) debe estar primera.');
    expect(component.tasks[1].tTitle).toBe('Tarea B', 'La tarea intermedia (Tarea B) debe estar segunda.');
    expect(component.tasks[2].tTitle).toBe('Tarea A', 'La tarea más antigua (Tarea A) debe estar última.');

    expect(notificationService.showInfo).toHaveBeenCalledWith(
      'Se cargaron 3 tareas correctamente.',
      'Información Obtenida'
    );
  });

  it('loadTasks() debe manejar errores y notificar al usuario', fakeAsync(() => {
    mockTaskService.getTasks.and.returnValue(throwError(() => new Error('API Error')));

    try {
      component.loadTasks();
      tick();
    } catch (e) {
    }

    expect(component.loading).toBeFalse();
    expect(component.tasks.length).toBe(0);
    expect(notificationService.showError).toHaveBeenCalledWith(
      'Error de Conexión',
      'No se pudieron cargar las tareas del servidor.'
    );
  }));

  beforeEach(() => {
    component.tasks = mockTasks;
  });

  it('totalTasks debe retornar el número total de tareas', () => {
    expect(component.totalTasks).toBe(3);
  });

  it('completedTasks debe retornar el número de tareas completadas', () => {
    expect(component.completedTasks).toBe(1);
  });

  it('pendingTasks debe retornar el número de tareas pendientes', () => {
    expect(component.pendingTasks).toBe(2);
  });

});