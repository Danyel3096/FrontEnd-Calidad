import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStateService } from '../../../services/product-state.service';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CartStateService } from '../../../services/cart-state.service';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ProductCardComponent],
  templateUrl: './product-list.component.html',
  providers: [ProductStateService],
})
export default class ProductsListComponent {
  productsState = inject(ProductStateService);
  cartState = inject(CartStateService).state;

  constructor() {
    this.productsState.changePage$.next(1);
  }

  previousPage() {
    const page = this.productsState.state.page();
    if (page > 1) {
      this.productsState.changePage$.next(page - 1);
    }
  }
  nextPage() {
    const page = this.productsState.state.page() + 1;
    this.productsState.changePage$.next(page);
  }

  pageChanged(page: string) {
    const pageNumber = parseInt(page, 10);

    if (!isNaN(pageNumber)) {
      this.productsState.changePage$.next(pageNumber); //change page cuando es un numero
    } else {
      switch (page) {
        case 'previous':
          this.previousPage();
          break;
        case 'next':
          this.nextPage();
          break;
        default:
          break;
      }
    }
  }

  addToCart(product: Product) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}
