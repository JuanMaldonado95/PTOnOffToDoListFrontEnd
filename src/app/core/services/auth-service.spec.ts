import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth-service';
import { ApiService } from './api-service';
import { NotificationService } from './notification-service';
import { mLoginCredential } from '../../shared/models/Auth/mLoginCredentials';
import { mLoginResponse } from '../../shared/models/Auth/mLoginResponse';

const AUTH_TOKEN_KEY = 'auth_token';

const mockApiService = {
  post: jasmine.createSpy('post')
};

const mockNotificationService = {
  showSuccess: jasmine.createSpy('showSuccess'),
  showError: jasmine.createSpy('showError'),
  showInfo: jasmine.createSpy('showInfo'),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  let service: AuthService;
  let apiService: ApiService;
  let router: Router;

  const credencialesPrueba: mLoginCredential = {
    tUserName: 'test@user.com',
    tPassword: '123456'
  };

  const respuestaExitosa: mLoginResponse = { token: 'token-mock' };

  beforeEach(() => {
    localStorageMock.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: {} },
        { provide: ApiService, useValue: mockApiService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);

    mockApiService.post.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  describe('Creación del servicio', () => {
    it('Debe crearse el servicio', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Manejo del token', () => {
    it('Debe retornar null cuando no hay token almacenado', () => {
      expect(service.getToken()).toBeNull();
    });

    it('Debe retornar el token cuando existe en el almacenamiento', () => {
      localStorage.setItem(AUTH_TOKEN_KEY, 'token-existente');
      expect(service.getToken()).toBe('token-existente');
    });
  });

  describe('Estado de autenticación', () => {
    it('isAuthenticated$ debe ser false al inicio si no hay token', (done) => {
      service.isAuthenticated$.subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('Método login', () => {
    it('Debe almacenar el token en localStorage y cambiar el estado a true', (done) => {
      mockApiService.post.and.returnValue(of(respuestaExitosa));

      service.login(credencialesPrueba).subscribe(res => {
        expect(apiService.post).toHaveBeenCalledWith('/Auth/login', credencialesPrueba);
        expect(res).toEqual(respuestaExitosa);
        expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('token-mock');

        service.isAuthenticated$.subscribe(auth => {
          expect(auth).toBeTrue();
        }).unsubscribe();

        done();
      });
    });

    it('No debe romperse si ocurre un error en la autenticación', (done) => {
      mockApiService.post.and.returnValue(throwError(() => ({ error: 'Error' })));

      service.login(credencialesPrueba).subscribe({
        next: () => fail('No debería emitir éxito'),
        error: () => {
          expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
          service.isAuthenticated$.subscribe(auth => {
            expect(auth).toBeFalse();
          }).unsubscribe();
          done();
        }
      });
    });
  });

  describe('Método logout', () => {
    it('Debe remover el token, navegar a login y notificar', () => {
      localStorage.setItem(AUTH_TOKEN_KEY, 'token');
      service['isAuthenticatedSubject'].next(true);

      service.logout();

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(mockNotificationService.showInfo).toHaveBeenCalledWith('Sesión cerrada correctamente.');
    });
  });
});
