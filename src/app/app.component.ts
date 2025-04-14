import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DynamicThemeService } from './services/dynamic-theme.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ThemeColors } from './interfaces/dynamic-colors.interface';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FontAwesomeModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  pageColors: ThemeColors['pageContent'] = {
      backgroundPage: '',
      backgroundSecondary: '',
      textTitle: '',
      textBody: ''
    };

  constructor(private themeService: DynamicThemeService, library: FaIconLibrary) {
    library.addIconPacks(fas); // Agrega todos los íconos sólidos
  }

  ngOnInit(): void {
    this.themeService.getDarkMode().subscribe(isDark => {
      console.log('AppComponent detectó isDarkMode:', isDark);
      document.documentElement.classList.toggle('dark', isDark);
    });

    this.themeService.getSection('pageContent').subscribe(colors => {
      console.log('AppComponent detectó pageContent:', colors);
      this.pageColors = colors;
    });
  }
}
