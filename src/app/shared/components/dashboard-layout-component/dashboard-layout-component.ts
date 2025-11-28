import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button'
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-dashboard-layout-component',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    PanelMenuModule,
    ButtonModule
  ],
  templateUrl: './dashboard-layout-component.html',
  styleUrl: './dashboard-layout-component.scss',
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: 'Funcionalidades',
      items: [
        {
          label: 'Gestión de Tareas',
          icon: 'pi pi-list',
          routerLink: ['/tasks'] 
        },
        {
          label: 'Dashboard de Resumen',
          icon: 'pi pi-chart-bar',
          routerLink: ['/dashboard'] 
        },
      ]
    },
  ];

  logout(): void {
    this.authService.logout();
  }

}
