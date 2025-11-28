import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api'; 

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  private messageService = inject(MessageService);

  showSuccess(detail: string, summary: string = 'Éxito'): void {
    this.messageService.add({ 
        severity: 'success', 
        summary: summary, 
        detail: detail 
    });
    console.log('SUCCESS:', detail);
  }

  showError(detail: string, summary: string = 'Error'): void {
    this.messageService.add({ 
        severity: 'error', 
        summary: summary, 
        detail: detail,
        life: 6000 
    });
    console.error('ERROR:', detail);
  }

  showInfo(detail: string, summary: string = 'Información'): void {
    this.messageService.add({ 
        severity: 'info', 
        summary: summary, 
        detail: detail 
    });
    console.log('INFO:', detail);
  }

  showWarn(detail: string, summary: string = 'Advertencia'): void {
    this.messageService.add({ 
        severity: 'warn', 
        summary: summary, 
        detail: detail 
    });
    console.log('WARN:', detail);
  }
}