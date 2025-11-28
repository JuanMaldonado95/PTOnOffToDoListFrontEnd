import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api-service';
import { NotificationService } from './notification-service';
import { Router } from '@angular/router';
import { mLoginResponse } from '../../shared/models/Auth/mLoginResponse';
import { mLoginCredential } from '../../shared/models/Auth/mLoginCredentials';

const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isTokenExpired(token: string): boolean {
    throw new Error('Method not implemented.');
  }
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.isAuthenticatedSubject.next(this.hasValidToken());
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  }

  login(credentials: mLoginCredential): Observable<mLoginResponse> {
    return this.apiService.post<mLoginResponse>('/Auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
    this.notificationService.showInfo('Sesión cerrada correctamente.');
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.idUser ?? null;
    } catch {
      return null;
    }
  }


}
