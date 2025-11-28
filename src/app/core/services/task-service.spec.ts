import { TestBed } from '@angular/core/testing';
import { TaskService } from './task-service';
import { ApiService } from './api-service';
import { mTaskModel } from '../../shared/models/Task/mTaskModel';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

const mockTask: mTaskModel = {
  iIDTask: 1,
  tTitle: 'Test Task Title',
  bIsCompleted: false,
  dtDateTimeRegister: new Date()
};

const mockApiService = {
  get: jasmine.createSpy('get').and.returnValue(of([mockTask])),
  post: jasmine.createSpy('post').and.returnValue(of(mockTask)),
  put: jasmine.createSpy('put').and.returnValue(of(undefined)),
  delete: jasmine.createSpy('delete').and.returnValue(of(undefined)),
};

describe('TaskService', () => {
  let service: TaskService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  const basePath = '/Task';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: ApiService, useValue: mockApiService }
      ]
    });

    service = TestBed.inject(TaskService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    apiServiceSpy.get.calls.reset();
    apiServiceSpy.post.calls.reset();
    apiServiceSpy.put.calls.reset();
    apiServiceSpy.delete.calls.reset();
  });

  it('Debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debe llamar a apiService.get sin parámetros cuando el estado es indefinido', (done) => {
    service.getTasks(undefined).subscribe(tasks => {
      expect(tasks).toEqual([mockTask]);

      const args = apiServiceSpy.get.calls.mostRecent().args;
      expect(args[0]).toBe(`${basePath}/GetTasks`);

      expect(args.length).toBeGreaterThanOrEqual(2);
      const params = args[1] as HttpParams;

      expect(params.toString()).toBe('');
      done();
    });
  });

  it('Debe llamar a apiService.get con status=true para tareas completadas', (done) => {
    service.getTasks(true).subscribe(() => {
      const args = apiServiceSpy.get.calls.mostRecent().args;
      const params: HttpParams = args[1] as HttpParams;

      expect(params.get('status')).toBe('true');
      done();
    });
  });

  it('Debe llamar a apiService.get con status=false para tareas pendientes', (done) => {
    service.getTasks(false).subscribe(() => {
      const args = apiServiceSpy.get.calls.mostRecent().args;
      const params: HttpParams = args[1] as HttpParams;

      expect(params.get('status')).toBe('false');
      done();
    });
  });

  it('Debe llamar a apiService.post con la URL y el cuerpo de la tarea correctos', (done) => {
    service.createTask(mockTask).subscribe(task => {
      expect(task).toEqual(mockTask);

      const args = apiServiceSpy.post.calls.mostRecent().args;
      expect(args[0]).toBe(`${basePath}/CrearTask`);
      expect(args[1]).toEqual(mockTask);
      done();
    });
  });

  it('Debe llamar a apiService.put con el ID de la tarea en la URL y el cuerpo de la tarea', (done) => {
    service.updateTask(mockTask).subscribe(() => {
      const args = apiServiceSpy.put.calls.mostRecent().args;
      expect(args[0]).toBe(`${basePath}/ActualizarTask/1`);
      expect(args[1]).toEqual(mockTask);
      done();
    });
  });

  it('Debe lanzar un error si updateTask es llamado sin iIDTask', () => {
    const taskWithoutId: mTaskModel = { tTitle: 'New Task', bIsCompleted: true, dtDateTimeRegister: new Date() };

    expect(() => service.updateTask(taskWithoutId)).toThrowError(
      'El ID de la tarea es requerido para la actualización.'
    );
    expect(apiServiceSpy.put).not.toHaveBeenCalled();
  });

  it('Debe llamar a apiService.delete con el ID correcto en la URL', (done) => {
    const taskId = 99;
    service.deleteTask(taskId).subscribe(() => {
      const args = apiServiceSpy.delete.calls.mostRecent().args;
      expect(args[0]).toBe(`${basePath}/EliminarTask/${taskId}`);
      done();
    });
  });
});