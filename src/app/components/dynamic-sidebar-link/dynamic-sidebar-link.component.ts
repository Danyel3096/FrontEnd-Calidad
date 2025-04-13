// dynamic-sidebar-link.component.ts
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dynamic-sidebar-link',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './dynamic-sidebar-link.component.html',
  styleUrls: ['./dynamic-sidebar-link.component.css']  // corregido
})

export class DynamicSidebarLinkComponent implements OnInit {
  @Input() routerLink!: string;
  @Input() label!: string;
  @Input() icon!: string;

  public router = inject(Router);

  color: ThemeColors['sidebar'] = {
    background: '#007bff',
    text: '#ffffff',
    fondoHover: 'rgba(255,255,255,0.2)',
    textoHover: '#ffffff'
  };

  isHovered = false;

  constructor(private themeService: DynamicThemeService) {}

  ngOnInit(): void {
    this.themeService.getSection('sidebar').subscribe(colors => {
      this.color = colors;
    });
  }
}
