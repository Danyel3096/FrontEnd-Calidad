import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { CommonModule } from '@angular/common';
import { DynamicSidebarLinkComponent } from '../dynamic-sidebar-link/dynamic-sidebar-link.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DynamicSidebarLinkComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  themeService = inject(DynamicThemeService);

  sidebarColor: ThemeColors['sidebar'] = {
    background: '#007bff',  // valores por defecto
    text: '#ffffff',
    fondoHover: 'rgba(255,255,255,0.2)',
    textoHover: '#ffffff'
  };

  ngOnInit(): void {
    this.themeService.getSection('sidebar').subscribe(colors => {
      this.sidebarColor = colors;
      console.log('Sidebar colors:', this.sidebarColor);
    });
  }
}
