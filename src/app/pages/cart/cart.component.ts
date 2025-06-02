import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CartStateService } from '../../services/cart-state.service';
import { ProductItemCart } from '../../interfaces/product.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CartItemComponent],  
  templateUrl: './cart.component.html',
  styles: ``,
})
export default class CartComponent {
  state = inject(CartStateService).state;
  isLoading = false;

  promoCode: string = '';
  shipping: number = 10; // costo fijo o calculado
  taxRate: number = 0.1; // 10% de impuestos por ejemplo

  get products(): ProductItemCart[] {
    return this.state().products ?? [];
  }

  get subtotal(): number {
    return this.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get total(): number {
    // Suma subtotal + envío + impuestos
    return this.subtotal + this.shipping + this.tax;
  }

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
    if (productItemCart.quantity > 1) {
      this.state.udpate({
        ...productItemCart,
        quantity: productItemCart.quantity - 1,
      });
    }
  }

  trackById(index: number, productItemCart: ProductItemCart): number {
    return productItemCart.product.id;
  }

  isLast(item: ProductItemCart): boolean {
    const products = this.products;
    return products.indexOf(item) === products.length - 1;
  }

  applyPromoCode() {
    // Ejemplo simple: si promoCode es 'DESCUENTO10' da 10% de descuento en subtotal
    if (this.promoCode.trim().toUpperCase() === 'DESCUENTO10') {
      this.shipping = 0; // ejemplo: envío gratis con promo
      this.taxRate = 0.08; // menos impuestos también por promo
      alert('Código aplicado: 10% de descuento y envío gratis');
    } else if (this.promoCode.trim() === '') {
      alert('Ingrese un código promocional');
    } else {
      alert('Código inválido');
    }
  }

  checkout() {
    // Aquí podrías redirigir a la página de pago o proceso de compra
    alert(`Total a pagar: ${this.total.toFixed(2)}`);
  }
}
