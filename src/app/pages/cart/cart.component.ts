import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CartStateService } from '../../services/cart-state.service';
import { ProductItemCart } from '../../interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styles: ``,
})

export default class CartComponent {
  state = inject(CartStateService).state;

  isLoading = false;
  
  onRemove(id: number) {
    this.state.remove(id);
  }

  onIncrease(productItemCart: ProductItemCart) {
    this.state.udpate({
      product: productItemCart.product,
      quantity: productItemCart.quantity + 1,
    });
  }

  onDecrease(productItemCart: ProductItemCart) {
    this.state.udpate({
      ...productItemCart,
      quantity: productItemCart.quantity - 1,
    });
  }

  trackById(index: number, productItemCart: ProductItemCart): number {
    return productItemCart.product.id;
  }
}