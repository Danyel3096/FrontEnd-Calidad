import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../services/dynamic-theme.service'; // ajusta el path si es necesario
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dynamic-button',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dynamic-button.component.html',
  styleUrl: './dynamic-button.component.css'
})

export class DynamicButtonComponent {
  @Input() label: string = ''; // texto del botón
  @Input() routerLink: string = ''; // ruta
  @Input() routerLinkActive: string = ''; // clase activa opcional
  @Output() click = new EventEmitter<Event>();

  isHovered = false;

  color = {
    fondo: '',
    texto: '',
    fondoHover: '',
    textoHover: ''
  };

  constructor(private dynamicThemeService: DynamicThemeService, public router: Router) {}

  ngOnInit(): void {
    this.dynamicThemeService.getThemeColors().subscribe((data) => {
      this.color = data.button; // Asigna los colores del botón desde el servicio
      // Puedes asignar otros colores aquí si es necesario
    });
  }

  handleClick(event: Event): void {
    this.click.emit(event);
  }

  isActiveRoute(): boolean {
    return this.router.url === this.routerLink;
  }
}
