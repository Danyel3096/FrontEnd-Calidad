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
  isHovered = false;

  constructor(private dynamicThemeService: DynamicThemeService, /* … */) {}
  
  titleColor: ThemeColors['titleNavbar'] = { color: '#000' };  // valor por defecto
  
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
    this.login.loginStatusSubject.subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    // SUSCRÍBETE a la sección 'navbar' del tema activo
    this.dynamicThemeService.getSection('navbar').subscribe(colors => {
      this.navbarColor = colors;
      console.log('Navbar colors:', this.navbarColor);
    });

    this.dynamicThemeService.getSection('navbarButtons').subscribe(colors => {
      this.color = colors;
      console.log('Navbar colors:', this.navbarColor);
    });

    this.dynamicThemeService.getSection('titleNavbar').subscribe(c => {
      this.titleColor = c;
    });

    // Paleta completa (si la necesitas) //SIN USO ACTUALMENTE, SE UTILIZA CADA SECCIÓN POR SEPARADO
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
