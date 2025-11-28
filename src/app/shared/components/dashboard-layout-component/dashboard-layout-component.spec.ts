import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLayoutComponent } from './dashboard-layout-component';
import { AuthService } from '../../../core/services/auth-service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { RouterTestingModule } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const mockAuthService = {
  logout: jasmine.createSpy('logout'),
};

describe('ComponenteDashboardLayout', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardLayoutComponent,
        PanelMenuModule,
        ButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideNoopAnimations(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar la estructura de menuItems correctamente', () => {
    expect(component.menuItems.length).toBe(1);
    expect(component.menuItems[0].label).toEqual('Funcionalidades');
    expect(component.menuItems[0].items?.length).toBe(2);
    expect(component.menuItems[0].items?.[0].label).toEqual('Gestión de Tareas');
    expect(component.menuItems[0].items?.[1].routerLink).toEqual(['/dashboard']);
  });

  it('debe llamar a authService.logout cuando se llama a logout()', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  });
});