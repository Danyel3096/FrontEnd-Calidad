// products.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { BaseHttpService } from './base-http.service';
import { Product } from '../pages/products/interfaces/product.interface';

// Servicio real con API
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseHttpService {
  getProducts(page: number, limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: {
        limit: limit.toString(), //  Se pasa el límite desde afuera
        page: page.toString(),   // El backend puede usarlo para paginar
      },
    });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}

//  Servicio simulado (por si estás en modo pruebas)
@Injectable({
  providedIn: 'root'
})
export class MockProductService {
  private suppliers: Products[] = [
    { id: 1, name: 'Product A', description: 'Lorem ipsum 1' },
    { id: 2, name: 'Product B', description: 'Lorem ipsum 2' },
    { id: 3, name: 'Product C', description: 'Lorem ipsum 3' },
    { id: 4, name: 'Product D', description: 'Lorem ipsum 4' },
  ];

  getProductsList(): Observable<Products[]> {
    return of(this.suppliers);
  }
}

// ✅ Interfaz de productos simulados
export interface Products {
  id: number;
  name: string;
  description: string;
}
