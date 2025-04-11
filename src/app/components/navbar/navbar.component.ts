import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CartStateService } from '../../services/cart-state.service';
import { DynamicButtonComponent } from '../dynamic-button/dynamic-button.component';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { CompanyService } from '../../services/company.service';
import { Collapse } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, RouterLink, RouterLinkActive, DynamicButtonComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  company = inject(CompanyService).getCompany();

  hoveredDropdownItem: number | string | null = null;

  @ViewChild('navbarToggler', { static: false }) navbarToggler!: ElementRef;
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;

  isLoggedIn = false;
  user: any = null;

  navbarColor = {
    background: '',
    text: '',
    fondoHover: '',
    textoHover: ''
  };

  constructor(public login: LoginService, private dynamicThemeService: DynamicThemeService) {}

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
    const navbarElement = document.getElementById('navbarSupportedContent');
    const bsCollapse = bootstrap.Collapse.getInstance(navbarElement!) || new bootstrap.Collapse(navbarElement!, { toggle: false });
    bsCollapse.hide();
  }

  toggleNavbar() {
    const collapseElement = this.navbarCollapse.nativeElement;
    const bsCollapse = Collapse.getOrCreateInstance(collapseElement);
  
    bsCollapse.toggle();
  }
}
