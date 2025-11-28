import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { catchError, of, throwError } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';
import { mLoginCredential } from '../../../../shared/models/Auth/mLoginCredentials';
import { NotificationService } from '../../../../core/services/notification-service';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private _authService: AuthService;
  private _router: Router;

  constructor(
    authService: AuthService,
    router: Router,
    private _notificationService: NotificationService,
  ) {
    this._authService = authService;
    this._router = router;
  }

  tUserName = 'user@test.com';
  tPassword = '123456';

  isLoading = false;

  login(): void {
    if (!this.tUserName || !this.tPassword) {
      console.error("Usuario y contraseña son requeridos.");
      return;
    }

    this.isLoading = true;

    const credentials: mLoginCredential = {
      tUserName: this.tUserName,
      tPassword: this.tPassword
    };

    this._authService.login(credentials)
      .pipe(
        catchError(error => {
          this._notificationService.showError('Error de autenticación', 'Credenciales inválidas');
          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe(response => {
        this.isLoading = false;
        if (response) {
          this._notificationService.showSuccess('Bienvenido/a');
          this._router.navigate(['/tasks']);
        }
      });
  }
}