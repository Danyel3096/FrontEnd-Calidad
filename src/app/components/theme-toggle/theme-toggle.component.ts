import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle', 
  standalone: true,
  imports: [CommonModule],
  template: `
    <button>
      Cambiar tema
    </button>
  `,
  styles: [`
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  `]
})

export class ThemeToggleComponent {
  
}
