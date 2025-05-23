import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';  // Aquí importas la interfaz

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private baseUrl = 'https://tdd-billing-backend.onrender.com/api'; // URL base actual

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un producto por su ID
   * @param productId - ID del producto
   * @returns Observable<Product>
   */
  getProductById(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${productId}`;
    return this.http.get<Product>(url);
  }

  /**
   * Crea un nuevo producto
   * @param product - Objeto de producto a crear
   * @returns Observable<Product>
   */
  /**
   * Crea un nuevo producto usando FormData
   * @param productData - Objeto FormData con los datos del producto
   * @returns Observable<Product>
   */
  createProduct(productData: FormData): Observable<Product> {
    const url = `${this.baseUrl}/products`;
    return this.http.post<Product>(url, productData);
  }

  /**
   * Actualiza un producto existente usando FormData
   * @param productId - ID del producto
   * @param productData - Objeto FormData con los nuevos datos
   * @returns Observable<Product>
   */
  updateProduct(productId: number, productData: FormData): Observable<Product> {
    const url = `${this.baseUrl}/products/${productId}`;
    return this.http.put<Product>(url, productData);
  }

  /**
   * Elimina un producto por su ID
   * @param productId - ID del producto
   * @returns Observable<void>
   */
  deleteProduct(productId: number): Observable<void> {
    const url = `${this.baseUrl}/products/${productId}`;
    return this.http.delete<void>(url);
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
    }

    return this.http.get<any>(url, { params });
  }
}
