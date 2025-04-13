import { Component, OnInit, Input, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonColors } from '../../interfaces/dynamic-colors.interface';

@Component({
  standalone: true,
  selector: 'app-dynamic-button',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.css']  // corregido
})
export class DynamicButtonComponent implements OnInit {
  @Input() label = ''; 
  @Input() routerLink = ''; 
  @Input() routerLinkActive = 'active'; 
  @Output() click = new EventEmitter<Event>();

  isHovered = false;
  //color!: ButtonColors;

  private themeService = inject(DynamicThemeService);
  public router = inject(Router);

  color: ButtonColors = {
    fondo: '#ccc',
    texto: '#000',
    fondoHover: '#bbb',
    textoHover: '#111'
  };

  ngOnInit(): void {
    // Suscribirse a la sección 'button' de la paleta activa
    this.themeService.getSection('button').subscribe(colors => {
      console.log('Button colors:', colors);
      this.color = colors;
    });
  }

  handleClick(event: Event): void {
    this.click.emit(event);
  }

  isActiveRoute(): boolean {
    return this.router.url === this.routerLink;
  }
}
