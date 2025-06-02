import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';

@Component({
  standalone: true,
  selector: 'app-customization-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customization-dashboard.component.html',
  styleUrl: './customization-dashboard.component.css'
})

export class CustomizationDashboardComponent implements OnInit {
  themeForm!: FormGroup;
  currentTheme!: ThemeColors;

  constructor(
    private fb: FormBuilder,
    private themeService: DynamicThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.getActivePalette().subscribe(theme => {
      this.currentTheme = theme;
      this.buildForm(theme);
    });
  }

  buildForm(theme: ThemeColors): void {
    this.themeForm = this.fb.group({
      homePage: this.fb.group({
        backgroundPrimary: [theme.homePage.backgroundPrimary],
        backgroundSecondary: [theme.homePage.backgroundSecondary],
        backgroundTertiary: [theme.homePage.backgroundTertiary],
        backgroundQuaternary: [theme.homePage.backgroundQuaternary],
        textTitle: [theme.homePage.textTitle],
        textBody: [theme.homePage.textBody],
      }),
      navbar: this.fb.group({
        background: [theme.navbar.background],
        text: [theme.navbar.text],
      }),
      footer: this.fb.group({
        background: [theme.footer.background],
        text: [theme.footer.text],
        hoverBackground: [theme.footer.hoverBackground || ''],
        hoverText: [theme.footer.hoverText || ''],
      }),
      // Puedes seguir agregando más secciones aquí...
    });
  }

  applyChanges(): void {
    const updatedTheme = this.themeForm.value as ThemeColors;
    console.log('Nuevo tema aplicado:', updatedTheme);

    // Aquí podrías emitir este nuevo objeto a través de un Subject
    // o actualizar una propiedad en el servicio si deseas aplicarlo dinámicamente.
  }
}
