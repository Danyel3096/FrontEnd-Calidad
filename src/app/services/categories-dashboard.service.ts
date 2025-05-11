import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = environment.API_URL; // Base URL
  private storeCategoryUrl = `${this.baseUrl}`; // Endpoint para categorías por tienda

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las categorías filtradas por tienda
   * @param storeId - ID de la tienda
   * @returns Observable con un arreglo de categorías
   */
  getCategoriesByStore(storeId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.storeCategoryUrl}${storeId}`);
  }
}
