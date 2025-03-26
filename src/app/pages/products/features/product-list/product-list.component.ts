import { Component, inject } from '@angular/core';
import { ProductsSateService } from '../../data-access/products-state.service';
import { ProductCardComponent } from '../../../../components/product-card/product-card.component';
import { CartStateService } from '../../shared/data-access/cart-state.service';
import { Product } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './product-list.component.html',
  providers: [ProductsSateService],
})
export default class ProductsListComponent {
  productsState = inject(ProductsSateService);
  cartState = inject(CartStateService).state;

  previousPage() {
    const page = this.productsState.state.page() - 1;
    this.productsState.changePage$.next(page);
  }
  nextPage() {
    const page = this.productsState.state.page() + 1;
    this.productsState.changePage$.next(page);
  }
  
  pageChanged(page: String) {
    //const page = this.productsState.state.page();
  }

  addToCart(product: Product) {
    this.cartState.add({
      product,
      quantity: 1,
    });
  }
}