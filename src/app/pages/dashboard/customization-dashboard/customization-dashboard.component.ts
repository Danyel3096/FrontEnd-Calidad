import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors, ThemeConfig } from '../../../interfaces/dynamic-colors.interface';
import { HttpClient } from '@angular/common/http';
import { NgbAccordionModule, NgbAccordionItem, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeSectionFormComponent } from '../../../components/theme-section-form/theme-section-form.component';
import { ThemeEditorService } from '../../../services/theme-editor.service';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbAccordionItem,
    ThemeSectionFormComponent,
  ],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})
export class CustomizationDashboardComponent implements OnInit {
  activeMode: 'light' | 'dark' = 'light';
  lightSectionForms: { [key: string]: FormGroup } = {};
  darkSectionForms: { [key: string]: FormGroup } = {};
  sectionKeys: (keyof ThemeColors)[] = [];
  currentConfig!: ThemeConfig;

  constructor(
    private fb: FormBuilder,
    private themeService: DynamicThemeService,
    private http: HttpClient,
    private themeEditorService: ThemeEditorService
  ) {}

  ngOnInit(): void {
    this.themeService.getConfig().subscribe(config => {
      this.currentConfig = config;
      this.sectionKeys = Object.keys(config.light) as (keyof ThemeColors)[];

      // Crear formularios para cada sección, en light y dark
      this.sectionKeys.forEach(section => {
        const lightSection = (config.light as any)[section];
        this.lightSectionForms[section] = this.fb.group(
          Object.entries(lightSection).reduce((acc, [k, v]) => {
            acc[k] = [v, Validators.required];
            return acc;
          }, {} as any)
        );

        const darkSection = (config.dark as any)[section];
        this.darkSectionForms[section] = this.fb.group(
          Object.entries(darkSection).reduce((acc, [k, v]) => {
            acc[k] = [v, Validators.required];
            return acc;
          }, {} as any)
        );
      });
    });
  }

  onSectionSubmit(sectionKey: string): void {
    const updatedSection = this.activeMode === 'light'
      ? this.lightSectionForms[sectionKey].value
      : this.darkSectionForms[sectionKey].value;

    const updatedTheme: ThemeConfig = {
      ...this.currentConfig,
      light: this.activeMode === 'light'
        ? { ...this.currentConfig.light, [sectionKey]: updatedSection }
        : this.currentConfig.light,
      dark: this.activeMode === 'dark'
        ? { ...this.currentConfig.dark, [sectionKey]: updatedSection }
        : this.currentConfig.dark,
    };

    this.themeEditorService.saveThemeConfig(updatedTheme).subscribe({
      next: () => {
        alert(`Sección ${sectionKey} guardada para modo ${this.activeMode}`);
        this.themeService.updateThemeConfig(updatedTheme);
        this.currentConfig = updatedTheme;
      },
      error: err => console.error('Error guardando tema', err)
    });
  }

  onFullSubmit(): void {
    // Validar todos los formularios antes de guardar
    const lightValid = Object.values(this.lightSectionForms).every(f => f.valid);
    const darkValid = Object.values(this.darkSectionForms).every(f => f.valid);
    if (!lightValid || !darkValid) {
      alert('Por favor corrige los errores en los formularios antes de guardar.');
      return;
    }

    const newLightConfig = this.sectionKeys.reduce((acc, key) => {
      acc[key] = this.lightSectionForms[key].value;
      return acc;
    }, {} as ThemeColors);

    const newDarkConfig = this.sectionKeys.reduce((acc, key) => {
      acc[key] = this.darkSectionForms[key].value;
      return acc;
    }, {} as ThemeColors);

    const updatedTheme: ThemeConfig = {
      ...this.currentConfig,
      light: newLightConfig,
      dark: newDarkConfig
    };

    this.themeEditorService.saveThemeConfig(updatedTheme).subscribe({
      next: () => {
        alert('Todos los cambios guardados correctamente');
        this.themeService.updateThemeConfig(updatedTheme);
        this.currentConfig = updatedTheme;
      },
      error: err => console.error('Error guardando tema', err)
    });
  }
}
