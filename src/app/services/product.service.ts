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
   * Obtiene los productos para una tienda específica por ID
   * @param storeId - ID de la tienda
   * @returns Observable<Product[]>
   */
  getProductsByStore(storeId: number): Observable<Product[]> {
    const url = `${this.baseUrl}/products/store/${storeId}`;
    return this.http.get<Product[]>(url);
  }

  /**
   * Obtiene un producto por su ID
   * @param productId - ID del producto
   * @returns Observable<Product>
   */
  getProductById(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/products/${productId}`;
    return this.http.get<Product>(url);
  }

    getAllProducts(): Observable<Product[]> {
    const url = `${this.baseUrl}/products`; // Asegúrate de que la URL sea correcta
    return this.http.get<Product[]>(url);
  }

    getProductsByCategory(category: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/category/${category}`; // Ajusta la URL según tu API
    return this.http.get<Product[]>(url);
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
}
