import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.API_URL_CATEGORIA_READALL);
  }

  getCategoriesByStore(storeId: number): Observable<{ content: Category[] }> {
    // Si vas a usar un storeId fijo como el "2" en tu env, puedes quitar el parámetro.
    return this.http.get<{ content: Category[] }>(`${environment.API_URL_CATEGORIA_READBYID}`);
  }

  deleteCategory(categoryId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_CATEGORIA_DELETELOGICALLY}${categoryId}`);
  }

  UpdateCategory(categoryId: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${environment.API_URL_CATEGORIA_UPDATE}${categoryId}`, category);
  }

  createCategory(idStore: number, category: Category): Observable<Category> {
    const payload = {
      store: { id: idStore },
      ...category
    };
    return this.http.post<Category>(environment.API_URL_CATEGORIA_CREATE, payload);
  }
}
