import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CartStateService } from '../../../services/cart-state.service';
import { ProductsService } from '../../../services/product.service';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
})
export default class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cartService = inject(CartStateService);

  allProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  categories: string[] = [];
  selectedCategory: string = 'all';

  itemsPerPage = 6;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe((res: string[]) => {
      this.categories = ['all', ...res];
    });
  }

  loadAllProducts(): void {
    this.productsService.getAllProducts().subscribe((res: Product[]) => {
      this.allProducts = res;
      this.updatePagination();
    });
  }

  loadProductsByCategory(category: string): void {
    if (category === 'all') {
      this.loadAllProducts();
      return;
    }

    this.productsService.getProductsByCategory(category).subscribe((res: Product[]) => {
      this.allProducts = res;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);
    this.setPaginatedProducts();
  }

  setPaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.allProducts.slice(start, end);
  }

  pageChanged(page: string): void {
    if (page === 'previous' && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else {
      const pageNumber = parseInt(page, 10);
      if (!isNaN(pageNumber)) {
        this.currentPage = pageNumber;
      }
    }

    this.setPaginatedProducts();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.loadProductsByCategory(category);
  }

  addToCart(product: Product): void {
    this.cartService.state.add({ product, quantity: 1 });
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }
}
