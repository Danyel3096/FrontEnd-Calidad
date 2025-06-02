import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private baseUrl = 'https://tdd-billing-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  getProductsByStore(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/store/${storeId}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/category/${category}`);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, productData);
  }

  updateProduct(productId: number, productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${productId}`, productData);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${productId}`);
  }

  getRandomProducts(count: number): Observable<Product[]> {
    const url = `${this.baseUrl}/products/random/${count}`;
    return this.http.get<Product[]>(url);
  }

  getProductsByPage(
    storeId: number,
    page: number,
    size: number,
    categoryId?: number
  ): Observable<any> {
    const params: any = {
      page: page.toString(),
      size: size.toString()
    };

    // Construir URL dinámicamente
    let url = `${this.baseUrl}/products/store/${storeId}`;
    if (categoryId !== undefined && categoryId !== null) {
      url += `/${categoryId}`;
    } else {
      url += `/0`; // Si tu backend requiere siempre un categoryId
    }

    return this.http.get<any>(url, { params });
  }
}
