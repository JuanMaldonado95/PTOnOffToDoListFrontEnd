import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { NotificationService } from '../services/notification-service';

const AUTH_ENDPOINT = '/Auth/login';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    const _authService = inject(AuthService);
    const _notificationService = inject(NotificationService);

    const authToken = _authService.getToken();

    let modifiedReq = req;

    if (authToken) {
        modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }

    return next(modifiedReq).pipe(
        catchError((error: HttpErrorResponse) => {

            if (req.url.includes(AUTH_ENDPOINT) && error.status === 401) {
                return throwError(() => error);
            }

            if (error.status === 401 || error.status === 0) {
                _notificationService.showWarn(
                    'Sesión Finalizada',
                    'Tu sesión ha expirado. Por favor inicia sesión nuevamente, lo redireccionaremos al Login.'
                );
                setTimeout(() => {
                    _authService.logout();
                }, 7000);
            }
            
            return throwError(() => error);
        })
    );
};