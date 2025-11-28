import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mTaskModel } from '../../shared/models/Task/mTaskModel';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private apiService = inject(ApiService);
  private basePath = '/Task';

  getTasks(status?: boolean): Observable<mTaskModel[]> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    return this.apiService.get<mTaskModel[]>(`${this.basePath}/GetTasks`, params);
  }

  createTask(task: mTaskModel): Observable<mTaskModel> {
    return this.apiService.post<mTaskModel>(`${this.basePath}/CrearTask`, task);
  }

  updateTask(task: mTaskModel): Observable<void> {
    if (!task.iIDTask) {
      throw new Error("El ID de la tarea es requerido para la actualización.");
    }
    return this.apiService.put<void>(`${this.basePath}/ActualizarTask/${task.iIDTask}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.basePath}/EliminarTask/${id}`);
  }

}
