import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import ProductsListComponent from './features/product-list/product-list.component';
import CartListComponent from './cart/cart.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent }, // /products
  { path: 'cart', component: CartListComponent }, // /products/cart
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
