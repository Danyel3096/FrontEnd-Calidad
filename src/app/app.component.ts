import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DynamicThemeService } from './services/dynamic-theme.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FontAwesomeModule],
  selector: 'app-root',
  template: `<app-navbar></app-navbar><router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  constructor(private themeService: DynamicThemeService, library: FaIconLibrary) {
    library.addIconPacks(fas); // Agrega todos los íconos sólidos
  }

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe(isDark => {
      console.log('AppComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });
  }
}
