import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from './../../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login.service';

@Component({
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  selector: 'app-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  themeService = inject(DynamicThemeService);
  loginService = inject(LoginService);

  textTitleColor = '';
  textBodyColor = '';
  backgroundSecondary = '';

  role = '';
  isAdmin = false;
  isVendedor = false;
  isCliente = false;
  isProveedor = false;

  ngOnInit(): void {
    this.themeService.getSection('pageContent').subscribe(colors => {
      this.textTitleColor = colors.textTitle;
      this.textBodyColor = colors.textBody;
      this.backgroundSecondary = colors.backgroundSecondary;
    });

    this.role = this.loginService.getUserRole();

    this.isAdmin = this.role === 'ADMINISTRADOR';
    this.isVendedor = this.role === 'VENDEDOR_CAJERO';
    this.isCliente = this.role === 'CLIENTE';
    this.isProveedor = this.role === 'PROVEEDOR';
  }
}
