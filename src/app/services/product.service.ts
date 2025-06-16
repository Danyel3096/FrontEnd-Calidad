import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) {}

  getProductsByStore(storeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_PRODUCTO_READBYSTORE}${storeId}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${environment.API_URL_PRODUCTO_READALL}${productId}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.API_URL_PRODUCTO_READALL);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_PRODUCTO_READALL}category/${category}`);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(environment.API_URL_PRODUCTO_CREATE, productData);
  }

  updateProduct(productId: number, productData: any): Observable<Product> {
    return this.http.put<Product>(`${environment.API_URL_PRODUCTO_UPDATE}${productId}`, productData);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_PRODUCTO_DELETELOGICALLY}${productId}`);
  }

  getRandomProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API_URL_PRODUCTO_READALL}random/${count}`);
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

    let url = `${environment.API_URL_PRODUCTO_READBYSTORE}${storeId}`;
    url += `/${categoryId !== undefined && categoryId !== null ? categoryId : 0}`;

    return this.http.get<any>(url, { params });
  }
}
