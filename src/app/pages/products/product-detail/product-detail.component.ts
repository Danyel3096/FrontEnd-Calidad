import { Component, effect, inject, input } from '@angular/core';
import { ProductDetailStateService } from '../../../services/product-detail-state.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CartStateService } from '../../../services/cart-state.service';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { ThemeColors } from '../../../interfaces/dynamic-colors.interface';
import { RatingStarsComponent } from '../../../components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ CommonModule, CurrencyPipe, RatingStarsComponent],
  templateUrl: './product-detail.component.html', 
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductDetailStateService],
})

export default class ProductDetailComponent {
  productDetailState = inject(ProductDetailStateService).state;
  cartState = inject(CartStateService).state;

  id = input.required<string>();

  isHovered = false;
  activePalette!: ThemeColors;

  // 360 View state
  is360Mode = false;
  totalFrames = 36;
  currentFrame = 1;
  currentFrameUrl = this.getFrameUrl(1);

  homePageColor: ThemeColors['homePage'] = {
    backgroundPrimary: '',
    backgroundSecondary: '',
    backgroundTertiary: '',
    backgroundQuaternary: '',
    textTitle: '',
    textBody: ''
  };

  pageButtonsColor: ThemeColors['pageButtons'] = {
    background: '',
    text: '',
    hoverBackground:'',
    hoverText: ''
  };

  constructor(
    private dynamicThemeService: DynamicThemeService
  ) {
    effect(() => {
      this.productDetailState.getById(this.id());
    });
  }

  ngOnInit(): void {
    // SUSCRÍBETE a la sección 'home page' del tema activo
    this.dynamicThemeService.getSection('homePage').subscribe(colors => {
      this.homePageColor = colors;
      console.log('Footer colors:', this.homePageColor);
    });

    // SUSCRÍBETE a la sección 'home page' del tema activo
    this.dynamicThemeService.getSection('pageButtons').subscribe(colors => {
      this.pageButtonsColor = colors;
      console.log('Footer colors:', this.pageButtonsColor);
    });
  }

  addToCart() {
    this.cartState.add({
      product: this.productDetailState.product()!,
      quantity: 1,
    });
  }

  toggle360() {
    this.is360Mode = !this.is360Mode;
    this.currentFrame = 1;
    this.currentFrameUrl = this.getFrameUrl(1);
  }

  onMouseMove(event: MouseEvent) {
    const containerWidth = (event.target as HTMLElement).clientWidth;
    const mouseX = event.offsetX;
    const percent = mouseX / containerWidth;
    const frame = Math.ceil(percent * this.totalFrames);

    this.currentFrame = frame;
    this.currentFrameUrl = this.getFrameUrl(frame);
  }

  getFrameUrl(frame: number): string {
    const padded = frame.toString().padStart(3, '0');
    return `assets/images/shirt360/shirt_${padded}.png`;
  }
}