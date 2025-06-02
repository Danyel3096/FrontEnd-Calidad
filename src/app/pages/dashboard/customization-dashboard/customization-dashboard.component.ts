import { Component } from '@angular/core';
import { ThemeEditorComponent } from '../../../components/theme-editor/theme-editor.component';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [ThemeEditorComponent],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})

export class CustomizationDashboardComponent {
  onThemeUpdated(newTheme: any) {
    console.log('Tema actualizado:', newTheme);
    // Aquí puedes enviarlo a la API, guardarlo localmente, etc.
  }
}
