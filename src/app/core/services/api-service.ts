import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';

const BASE_URL = 'https://localhost:44363/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private http = inject(HttpClient);
  private injector = inject(Injector);
  private _authService: AuthService | null = null;

  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService!;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${BASE_URL}${path}`, { headers: this.getHeaders(), params });
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(`${BASE_URL}${path}`, body, { headers: this.getHeaders() });
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<T>(`${BASE_URL}${path}`, body, { headers: this.getHeaders() });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${BASE_URL}${path}`, { headers: this.getHeaders() });
  }

}
