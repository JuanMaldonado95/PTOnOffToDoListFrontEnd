import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/services/auth-service';
import { NotificationService } from '../../../../core/services/notification-service';

// Mock Services
const mockAuthService = {
  login: jasmine.createSpy('login').and.returnValue(of({ token: 'mock-jwt-token' }))
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockNotificationService = {
  showError: jasmine.createSpy('showError'),
  showSuccess: jasmine.createSpy('showSuccess')
};

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginPage,
        CommonModule,
        FormsModule,
        CardModule,
        InputTextModule,
        ButtonModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    mockAuthService.login.calls.reset();
    mockRouter.navigate.calls.reset();
    mockNotificationService.showError.calls.reset();
    mockNotificationService.showSuccess.calls.reset();

    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe tener el estado inicial con credenciales de demo', () => {
    expect(component.tUserName).toBe('user@test.com');
    expect(component.tPassword).toBe('123456');
    expect(component.isLoading).toBeFalse();
  });

  it('Debe llamar a AuthService.login, deshabilitar loading y navegar a /tasks en éxito', fakeAsync(() => {
    mockAuthService.login.and.returnValue(of({ token: 'mock-jwt-token' }));

    component.tUserName = 'test@user.com';
    component.tPassword = 'password';

    component.login();
    tick();

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBeFalse();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('Debe manejar el error de login, deshabilitar loading, y NO navegar', fakeAsync(() => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Credenciales inválidas')));

    component.tUserName = 'bad@user.com';
    component.tPassword = 'wrong';

    try {
      component.login();
      tick();
    } catch (error) {
    }

    expect(component.isLoading).toBeFalse();
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Error de autenticación',
      'Credenciales inválidas'
    );
  }));

  it('No debe llamar a login si tPassword está vacío', () => {
    component.tUserName = 'test@user.com';
    component.tPassword = '';

    component.login();

    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('El botón de submit debe deshabilitarse cuando falta tUserName', fakeAsync(() => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]');

    expect(button.disabled).toBeFalse();

    component.tUserName = '';
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();

    component.tUserName = 'a';
    component.tPassword = 'a';
    component.isLoading = true;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
  }));
});
