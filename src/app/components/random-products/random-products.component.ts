import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { ProductsService } from '../..//services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, SlicePipe, RouterLink],
  selector: 'app-random-products',
  templateUrl: './random-products.component.html',
  styleUrls: ['./random-products.component.css']
})
export class RandomProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.loadRandomProducts();
    });
  }

  loadRandomProducts() {
    this.productService.getRandomProducts(3).subscribe({
      next: (data: Product[]) => this.products = data,
      error: (err: any) => console.error('Error cargando productos aleatorios', err)
    });
  }
}
