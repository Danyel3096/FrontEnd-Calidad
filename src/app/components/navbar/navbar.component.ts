import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CartStateService } from '../../services/cart-state.service';
import { DynamicNavbarButtonComponent } from '../dynamic-navbar-button/dynamic-navbar-button.component';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CompanyService } from '../../services/company.service';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarButtonsColors, ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification.interface';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    NgbCollapseModule,
    NgbDropdownModule,
    DynamicNavbarButtonComponent
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  company = inject(CompanyService).getCompany();
  cartState = inject(CartStateService).state;
  login: LoginService = inject(LoginService); // Asegúrate de que el servicio está correctamente inyectado
  themeService = inject(DynamicThemeService);
  notificationService = inject(NotificationService);

  themeIcon: string = 'moon'; // valor por defecto

  hoveredDropdownItem: number | string | null = null;
  isLoggedIn = false;
  user: any = null;

  activePalette!: ThemeColors;
  isNavbarCollapsed = true; // Controla el estado del colapso
  isHovered = false;

  

  constructor(private dynamicThemeService: DynamicThemeService) {}

  notifications: Notification[] = [];

  titleColor: ThemeColors['titleNavbar'] = { color: '#000' };

  navbarColor: ThemeColors['navbar'] = {
    background: '',
    text: ''
  };

  color: NavbarButtonsColors = {
    background: '#ccc',
    text: '#000',
    hoverBackground: '#bbb',
    hoverText: '#111'
  };

  ngOnInit(): void {
    // Estado de login
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();

    // Verificación de si el usuario existe y tiene la estructura esperada
    if (this.user) {
      console.log('Usuario actual:', this.user);  // Solo para depurar
      this.cargarNotificaciones(this.user.id);
    } else {
      console.log('No hay usuario logueado');
    }

    this.login.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
      if (this.user) {
        this.cargarNotificaciones(this.user.id);
      }
    });

    this.dynamicThemeService.getSection('navbar').subscribe(colors => {
      this.navbarColor = colors;
    });

    this.dynamicThemeService.getSection('navbarButtons').subscribe(colors => {
      this.color = colors;
    });

    this.dynamicThemeService.getSection('titleNavbar').subscribe(c => {
      this.titleColor = c;
    });

    this.themeService.getActivePalette().subscribe(palette => {
      this.activePalette = palette;
    });

    this.themeService.getDarkMode().subscribe(isDark => {
      this.themeIcon = isDark ? 'moon' : 'sun'; // Iconos para cambiar el modo
    });
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  closeNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  logout(): void {
    this.login.logout();
    window.location.reload(); // Recarga la página para actualizar el estado
  }

  toggleTheme(): void {
    this.dynamicThemeService.toggleTheme();
  }

  // Notificaciones
  cargarNotificaciones(userId: number): void {
    this.notificationService.getNotificationsByUser(userId).subscribe({
      next: (notifs) => {
        this.notifications = notifs.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
      }
    });
  }

  notificacionesSinLeer(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  marcarTodasComoLeidas(): void {
    if (!this.user?.id) return;
    this.notificationService.markAllAsRead(this.user.id).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
      },
      error: (err) => {
        console.error('Error al marcar notificaciones como leídas:', err);
      }
    });
  }
}
