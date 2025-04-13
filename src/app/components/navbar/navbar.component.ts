import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CartStateService } from '../../services/cart-state.service';
import { DynamicButtonComponent } from '../dynamic-button/dynamic-button.component';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CompanyService } from '../../services/company.service';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarColors, ThemeColors } from '../../interfaces/dynamic-colors.interface';

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
    DynamicButtonComponent
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  company = inject(CompanyService).getCompany();
  cartState = inject(CartStateService).state;
  login = inject(LoginService);
  themeService = inject(DynamicThemeService);

  hoveredDropdownItem: number | string | null = null;
  isLoggedIn = false;
  user: any = null;

  // Tipado con interfaces
  //navbarColor!: NavbarColors;
  activePalette!: ThemeColors;
  //navbarColor!: ThemeColors['navbar'];  // ahora tipado para la sección navbar

  isNavbarCollapsed = true; // Controla el estado del colapso

  constructor(private dynamicThemeService: DynamicThemeService, /* … */) {}

  navbarColor: ThemeColors['navbar'] = {
    background: '',
    text: '',
    fondoHover: '',
    textoHover: ''
  };

  ngOnInit(): void {
    // Estado de login
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();
    this.login.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    // SUSCRÍBETE a la sección 'navbar' del tema activo
    this.dynamicThemeService.getSection('navbar').subscribe(colors => {
      this.navbarColor = colors;
      console.log('Navbar colors:', this.navbarColor);
    });

    // Paleta completa (si la necesitas)
    this.themeService.getActivePalette().subscribe(palette => {
      this.activePalette = palette;
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
    window.location.reload();
  }

  toggleTheme(): void {
    this.dynamicThemeService.toggleTheme();
  }
}
