import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification-service';
import { MessageService } from 'primeng/api';

class MockMessageService {
  add = jasmine.createSpy('add');
}

describe('NotificationService', () => {
  let service: NotificationService;
  let mockMessageService: MockMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MessageService, useClass: MockMessageService }
      ]
    });

    service = TestBed.inject(NotificationService);
    mockMessageService = TestBed.inject(MessageService) as unknown as MockMessageService;

    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  it('Debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debe llamar a messageService.add con severidad "success" para showSuccess', () => {
    const detail = 'Operación realizada correctamente.';
    const summary = 'Todo OK';

    service.showSuccess(detail, summary);

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: summary,
      detail: detail
    });
    expect(console.log).toHaveBeenCalledWith('SUCCESS:', detail);
  });

  it('Debe llamar a messageService.add con severidad "error" y vida personalizada para showError', () => {
    const detail = 'Ha ocurrido un fallo en la API.';
    const summary = 'Fallo Crítico';

    service.showError(detail, summary);

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 6000
    });

    expect(console.error).toHaveBeenCalledWith('ERROR:', detail);
  });

  it('Debe llamar a messageService.add con severidad "info" para showInfo', () => {
    const detail = 'Revisa tu bandeja de entrada.';
    const summary = 'Nuevo Correo';

    service.showInfo(detail, summary);

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: summary,
      detail: detail
    });
    expect(console.log).toHaveBeenCalledWith('INFO:', detail);
  });

  it('Debe llamar a messageService.add con severidad "warn" para showWarn', () => {
    const detail = 'La sesión expirará pronto.';
    const summary = 'Atención';

    service.showWarn(detail, summary);

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: summary,
      detail: detail
    });
    expect(console.log).toHaveBeenCalledWith('WARN:', detail);
  });

  it('Debe usar el resumen predeterminado si no se proporciona', () => {
    service.showSuccess('Detalle sin summary');
    expect(mockMessageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      summary: 'Éxito',
      severity: 'success'
    }));
  });
});