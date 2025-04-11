import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../services/dynamic-theme.service'; // ajusta el path si es necesario
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dynamic-button',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dynamic-button.component.html',
  styleUrl: './dynamic-button.component.css'
})

export class DynamicButtonComponent {
  @Input() label: string = 'Botón'; // texto del botón
  @Input() routerLink: string = '/'; // ruta
  @Input() routerLinkActive: string = 'active'; // clase activa opcional

  isHovered = false;

  color = {
    fondo: '#1E3A8A',
    texto: '#FFFFFF',
    fondoHover: '#FFFFFF40',
    textoHover: '#000000'
  };

  constructor(private dynamicThemeService: DynamicThemeService) {}

  ngOnInit(): void {
    this.dynamicThemeService.getThemeColors().subscribe((data) => {
      this.color = data.button; // Asigna los colores del botón desde el servicio
      // Puedes asignar otros colores aquí si es necesario
    });
  }
}
