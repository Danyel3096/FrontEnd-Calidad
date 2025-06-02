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
  pageSize = 8;
  totalPages = 1; //Originalmente 0
  storeId = 2;

  paginatedProducts: Product[] = [];
  categories: Category[] = [];
  categoryNames: { id: number; name: string }[] = [];
  productsPerPage = 6;

  selectedCategoryName: string | number = 0; // '0' equivale a "Todos"

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
        const categoryParam = parseInt(params['category'], 10);

        this.currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
        this.pageSize = isNaN(sizeParam) || sizeParam < 1 ? 5 : sizeParam;

        // Si categoryParam es NaN (no existe o no es número), asigna 0, que es "Todos"
        this.selectedCategoryName = isNaN(categoryParam) ? 0 : categoryParam;

        this.loadProducts(this.currentPage);
      });
    });
  }

  loadCategories(): Promise<void> {
  return new Promise((resolve) => {
    this.categoryService.getCategoriesByStore(this.storeId).subscribe({
      next: (response) => {
        const content = response.content;
        if (content?.length) {
          this.categories = content;
          this.categoryNames = [
            { id: 0, name: 'Todos' },
            ...content.map(cat => ({ id: cat.id, name: cat.name }))
          ];
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
    const backendPageIndex = page;
    if (page >= 1) {
      const backendPageIndex = page - 1;
    }

    this.productsService.getProductsByPage(
      this.storeId,
      backendPageIndex,
      this.pageSize,
      +this.selectedCategoryName // Convertir a número
    ).subscribe(response => {
      this.paginatedProducts = response.content;
      this.totalPages = response.totalPages;
    });
  }

  loadProductsByCategory(categoryId: number): void {
    if (categoryId === +this.selectedCategoryName) return;

    this.selectedCategoryName = categoryId.toString();
    this.currentPage = 1;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        size: this.pageSize,
        category: this.selectedCategoryName
      },
      queryParamsHandling: 'merge'
    });

    this.loadProducts(this.currentPage);
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
        size: this.pageSize,
        category: this.selectedCategoryName
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

  onCategoryChange(categoryId: string | number): void {
    this.loadProductsByCategory(+categoryId);
  }
}
