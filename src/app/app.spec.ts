import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

@Component({ selector: 'router-outlet', template: '' })
class MockRouterOutlet { }

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, ToastModule],
      providers: [
        { provide: RouterOutlet, useClass: MockRouterOutlet },
        MessageService, 
        provideNoopAnimations(),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente de la aplicación (App)', () => {
    expect(component).toBeTruthy();
  });

  it('Debe compilar correctamente resolviendo RouterOutlet y ToastModule', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).not.toBeNull();
  });
});
