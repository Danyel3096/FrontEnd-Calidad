import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';
import { CartStateService } from '../../../services/cart-state.service';
import { ProductsService } from '../../../services/product.service';
import { CategoriesService } from '../../../services/categories-dashboard.service';
import { Product } from '../../../interfaces/product.interface';
import { Category } from '../../../interfaces/category.interface';
import { TabsColors } from '../../../interfaces/dynamic-colors.interface';
import { DynamicThemeService } from '../../../services/dynamic-theme.service';
import { DynamicPagePaginationComponent } from '../../../components/dynamic-page-pagination/dynamic-page-pagination.component';
import { DynamicPageTabsComponent } from '../../../components/dynamic-page-tabs/dynamic-page-tabs.component';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  currentPage = 1;
  pageSize = 5;
  totalPages = 1; //Originalmente 0
  storeId = 2;

  paginatedProducts: Product[] = [];
  categories: Category[] = [];
  categoryNames: { id: number; name: string }[] = [];
  productsPerPage = 6;

  selectedCategoryName: string | 'Todos' = 'Todos';

  itemsPerPage = 6;

  isLoading = false;
  hasError = false;

  color: TabsColors = {
    background: '#ccc',
    text: '#000',
    hoverBackground: '#bbb',
    hoverText: '#111'
  };

  ngOnInit(): void {
    // 1. Cargar colores
    this.themeService.getSection('tabs').subscribe(colors => {
      this.color = colors;
    });

    // 2. Cargar categorías primero
    this.loadCategories().then(() => {
      // 3. Leer query params y cargar productos paginados
      this.route.queryParams.subscribe(params => {
        const pageParam = parseInt(params['page'], 10);
        const sizeParam = parseInt(params['size'], 10);

        this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
        this.pageSize = isNaN(sizeParam) || sizeParam < 1 ? 5 : sizeParam;

        // Asegurar categoría válida
        if (!this.selectedCategoryName) this.selectedCategoryName = 'Todos';

        this.loadProducts(this.currentPage);
      });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.categoryService.getCategories().subscribe({
        next: (res: Category[]) => {
          if (res?.length) {
            this.categories = res;
            this.categoryNames = [{ id: 0, name: 'Todos' }, ...res.map(cat => ({ id: cat.id, name: cat.name }))];
          } else {
            this.categoryNames = [{ id: 0, name: 'Todos' }];
          }
          this.selectedCategoryName = 'Todos'; // Default
          resolve();
        },
        error: (err) => {
          console.error('Error cargando categorías', err);
          this.categoryNames = [{ id: 0, name: 'Todos' }];
          this.selectedCategoryName = 'Todos';
          resolve();
        }
      });
    });
  }

  loadProducts(page: number) {
  const backendPageIndex = page - 1;

  this.productsService.getProductsByPage(this.storeId, this.selectedCategoryName, backendPageIndex, this.pageSize)
    .subscribe(response => {
      this.paginatedProducts = response.content;
      this.totalPages = response.totalPages;
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.hasError = false;

    this.productsService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.paginatedProducts = res;
        this.updatePagination();
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(categoryName: string | 'Todos'): void {
    if (categoryName === this.selectedCategoryName) return;

    this.selectedCategoryName = categoryName;
    this.isLoading = true;
    this.hasError = false;

    if (categoryName === 'Todos') {
      this.loadAllProducts();
      return;
    }

    this.productsService.getAllProducts().subscribe({
      next: (res: Product[]) => {
        this.paginatedProducts = res.filter(p => p.category.name === categoryName);
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
    this.totalPages = Math.ceil(this.paginatedProducts.length / this.itemsPerPage);
    this.setPaginatedProducts();
  }

  setPaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.paginatedProducts.slice(start, end);
  }

  onPageChange(page: number | 'next' | 'previous') {
    let targetPage = this.currentPage;

    if (page === 'next') targetPage++;
    else if (page === 'previous') targetPage--;
    else targetPage = page;

    if (targetPage < 1 || targetPage > this.totalPages) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage,
        size: this.pageSize
      },
      queryParamsHandling: 'merge'
    });
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
