import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})

export class CustomizationDashboardComponent {
  @Input() themeData: any = {}; // Recibe el JSON original
  @Input() themeType: 'light' | 'dark' = 'light'; // Por defecto 'light'
  @Output() themeUpdated = new EventEmitter<any>(); // Para emitir cambios

  themeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    const group: any = {};

    const section = this.themeData[this.themeType];
    for (const sectionKey in section) {
      const colors = section[sectionKey];
      for (const colorKey in colors) {
        const controlName = `${sectionKey}.${colorKey}`;
        group[controlName] = [colors[colorKey]];
      }
    }

    this.themeForm = this.fb.group(group);
  }

  onSubmit(): void {
    const updatedTheme = { ...this.themeData };
    const formValues = this.themeForm.value;

    // Reconstruir el JSON con los nuevos valores
    for (const key in formValues) {
      const [section, colorKey] = key.split('.');
      updatedTheme[this.themeType][section][colorKey] = formValues[key];
    }

    this.themeUpdated.emit(updatedTheme); // Envía el JSON modificado
  }

  getThemeSectionKeys(): string[] {
    return Object.keys(this.themeData[this.themeType]);
  }

  getColorKeys(sectionKey: string): string[] {
    return Object.keys(this.themeData[this.themeType][sectionKey]);
  }
}
