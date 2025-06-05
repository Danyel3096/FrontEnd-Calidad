import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors, ThemeConfig } from '../../../interfaces/dynamic-colors.interface';
import { HttpClient } from '@angular/common/http';
import { NgbAccordionModule, NgbAccordionItem } from '@ng-bootstrap/ng-bootstrap';
import { ThemeSectionFormComponent } from '../../../components/theme-section-form/theme-section-form.component';
import { ThemeEditorService } from '../../../services/theme-editor.service';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, NgbAccordionItem, ThemeSectionFormComponent],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})

export class CustomizationDashboardComponent implements OnInit {
  themeForm!: FormGroup;
  currentConfig!: ThemeConfig;

  sectionForms: { [key: string]: FormGroup } = {};
  sectionKeys: string[] = [];

  constructor(
    private fb: FormBuilder,
    private themeService: DynamicThemeService,
    private http: HttpClient,
    private themeEditorService: ThemeEditorService
  ) {}

  ngOnInit(): void {
   this.themeService.getConfig().subscribe((config) => {
      this.currentConfig = config;
      const lightTheme = config.light;

      this.sectionKeys = Object.keys(lightTheme) as (keyof ThemeColors)[];
      this.sectionKeys.forEach((key) => {
        const section = (lightTheme as any)[key];
        this.sectionForms[key] = this.fb.group(
          Object.entries(section).reduce((group, [k, v]) => {
            group[k] = [v];
            return group;
          }, {} as { [key: string]: any })
        );
      });

      // Opcional: si quieres usar themeForm también
      this.themeForm = this.buildForm(config);
    });
  }

  buildForm(config: ThemeConfig): FormGroup {
    return this.fb.group({
      light: this.fb.group({
        pageButtons: this.fb.group({
          background: [config.light.pageButtons.background, Validators.required],
          text: [config.light.pageButtons.text, Validators.required],
          hoverBackground: [config.light.pageButtons.hoverBackground, Validators.required],
          hoverText: [config.light.pageButtons.hoverText, Validators.required]
        })
      }),
      dark: this.fb.group({
        pageButtons: this.fb.group({
          background: [config.dark.pageButtons.background, Validators.required],
          text: [config.dark.pageButtons.text, Validators.required],
          hoverBackground: [config.dark.pageButtons.hoverBackground, Validators.required],
          hoverText: [config.dark.pageButtons.hoverText, Validators.required]
        })
      })
    });
  }

  onSectionSubmit(sectionKey: string): void {
    const updatedSection = this.sectionForms[sectionKey].value;

    const updatedTheme: ThemeConfig = {
      ...this.currentConfig,
      light: {
        ...this.currentConfig.light,
        [sectionKey]: updatedSection
      },
      dark: {
        ...this.currentConfig.dark
        // Opcional: aplica también en dark si quieres sincronía
      }
    };

    this.themeEditorService.saveThemeConfig(updatedTheme).subscribe({
      next: () => {
        alert('Tema guardado correctamente en el servidor');
        this.themeService.updateThemeConfig(updatedTheme); // 🔁 Aplica dinámicamente
      },
      error: err => console.error('Error guardando tema', err)
    });
  }

  onFullSubmit(): void {
    if (!this.themeForm.valid) return;

    const updatedConfig: ThemeConfig = {
      ...this.currentConfig,
      light: {
        ...this.currentConfig.light,
        pageButtons: this.themeForm.value.light.pageButtons
      },
      dark: {
        ...this.currentConfig.dark,
        pageButtons: this.themeForm.value.dark.pageButtons
      }
    };

    this.themeEditorService.saveThemeConfig(updatedConfig).subscribe({
      next: () => {
        alert('Cambios guardados correctamente en el servidor');
        this.themeService.updateThemeConfig(updatedConfig);
      },
      error: err => console.error('Error guardando tema', err)
    });
  }

}
