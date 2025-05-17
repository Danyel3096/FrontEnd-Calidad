import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CartStateService } from '../../../services/cart-state.service';
import { ProductsService } from '../../../services/product.service';
import { CategoriesService, Category } from '../../../services/categories-dashboard.service';
import { Product } from '../../../interfaces/product.interface';
import { TabsColors } from '../../../interfaces/dynamic-colors.interface';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { DynamicPagePaginationComponent } from '../../../components/dynamic-page-pagination/dynamic-page-pagination.component';
import { DynamicPageTabsComponent } from '../../../components/dynamic-page-tabs/dynamic-page-tabs.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, DynamicPagePaginationComponent, DynamicPageTabsComponent],
  templateUrl: './product-list.component.html',
})
export default class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoryService = inject(CategoriesService);
  private cartService = inject(CartStateService);
  private themeService = inject(DynamicThemeService);

  allProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: Category[] = [];
  categoryNames: string[] = [];
  productsPerPage = 6;


  selectedCategory: string = 'Todos';

  itemsPerPage = 6;
  currentPage = 1;
  totalPages = 1;

  isLoading = false;
  hasError = false;

  color: TabsColors = {
    background: '#ccc',
    text: '#000',
    hoverBackground: '#bbb',
    hoverText: '#111'
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();

    this.themeService.getSection('tabs').subscribe(colors => {
      this.color = colors;
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (res: Category[]) => {
        if (res?.length) {
          this.categories = res;
          this.categoryNames = ['Todos', ...res.map(cat => cat.name)];
        }
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.categoryNames = ['Todos'];
      }
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.hasError = false;

    this.productsService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.allProducts = res;
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(categoryName: string): void {
    if (categoryName === this.selectedCategory) return;

    this.selectedCategory = categoryName;
    this.isLoading = true;
    this.hasError = false;

    if (categoryName === 'Todos') {
      this.loadAllProducts();
      return;
    }

    this.productsService.getProductsByCategory(categoryName).subscribe({
      next: (res: Product[]) => {
        this.allProducts = res;
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
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

  pageChanged(page: number | 'next' | 'previous'): void {
    if (page === 'previous' && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (typeof page === 'number') {
      this.currentPage = page;
    }

    this.setPaginatedProducts();
  }

  addToCart(product: Product): void {
    this.cartService.state.add({ product, quantity: 1 });
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  onCategoryChange(categoryName: string): void {
    this.loadProductsByCategory(categoryName);
  }
}
