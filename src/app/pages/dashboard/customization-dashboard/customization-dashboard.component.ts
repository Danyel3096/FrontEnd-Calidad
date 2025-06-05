import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors, ThemeConfig } from '../../../interfaces/dynamic-colors.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})

export class CustomizationDashboardComponent implements OnInit {
  themeForm!: FormGroup;
  currentConfig!: ThemeConfig;

  constructor(
    private fb: FormBuilder,
    private themeService: DynamicThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.themeService.getConfig().subscribe((config) => {
      this.currentConfig = config;
      console.log('Datos que llegaron al custom dashboard:', config.light.pageButtons);
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

  onSubmit(): void {
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

    // 🔁 Guardar el nuevo archivo JSON en backend (o local si es solo front)
    this.http
      .put('/assets/config/theme.json', updatedConfig)
      .subscribe(() => console.log('Guardado con éxito'));

    // 🔄 Refrescar el tema activo
    this.themeService.forceUpdate(updatedConfig);
  }
}
