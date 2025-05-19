import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from '@angular/router';

import { DynamicThemeService } from '../../services/dynamic-theme.service';
import { ThemeColors } from '../../interfaces/dynamic-colors.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styles: ``,
})

export class ProductCardComponent implements OnInit {
  @Input() product!: Product; // Recibe el producto como input
  @Output() addToCart = new EventEmitter<Product>(); // Emite el producto al agregar al carrito

  activePalette!: ThemeColors;

  constructor(private dynamicThemeService: DynamicThemeService, /* … */) { }

  homePageColor: ThemeColors['homePage'] = {
    backgroundPrimary: '',
    backgroundSecondary: '',
    backgroundTertiary: '',
    backgroundQuaternary: '',
    textTitle: '',
    textBody: ''
  };

  ngOnInit(): void {
    // SUSCRÍBETE a la sección 'home page' del tema activo
    this.dynamicThemeService.getSection('homePage').subscribe(colors => {
      this.homePageColor = colors;
      console.log('Footer colors:', this.homePageColor);
    });
  }

  add(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product);
  }
}
