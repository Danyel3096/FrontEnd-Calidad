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

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, RouterLink, RouterLinkActive, NgbCollapseModule, NgbDropdownModule, DynamicButtonComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  company = inject(CompanyService).getCompany();

  hoveredDropdownItem: number | string | null = null;

  isLoggedIn = false;
  user: any = null;

  navbarColor = {
    background: '',
    text: '',
    fondoHover: '',
    textoHover: ''
  };

  isNavbarCollapsed = true; // Controla el estado del colapso

  constructor(public login: LoginService, private dynamicThemeService: DynamicThemeService, private cartStateService: CartStateService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.login.isLoggedIn();
    this.user = this.login.getUser();

    this.login.loginStatusSubject.asObservable().subscribe(() => {
      this.isLoggedIn = this.login.isLoggedIn();
      this.user = this.login.getUser();
    });

    this.dynamicThemeService.getThemeColors().subscribe((data) => {
      this.navbarColor = data.navbar;
    });
  }

  public logout() {
    this.login.logout();
    window.location.reload();
  }

  cartState = inject(CartStateService).state;

  closeNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
