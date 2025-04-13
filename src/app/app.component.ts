import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DynamicThemeService } from './services/dynamic-theme.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  selector: 'app-root',
  template: `<app-navbar></app-navbar><router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  constructor(private themeService: DynamicThemeService) {}

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe(isDark => {
      console.log('AppComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });
  }
}
