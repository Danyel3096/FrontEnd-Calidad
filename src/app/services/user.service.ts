import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los usuarios
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.API_URL_USUARIO_READALL);
  }

  /**
   * Obtiene los usuarios por tienda
   */
  getUsersByStore(storeId: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL_USUARIO_BY_STORE}/store/${storeId}`);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.API_URL_USUARIO_BY_STORE}${userId}`);
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(productData: FormData): Observable<User> {
    return this.http.post<User>(environment.API_URL_USUARIO_REGISTRO,  productData);
  }

  /**
   * Actualiza un usuario
   */
  updateUser(userId: number, productData: FormData): Observable<User> {
    return this.http.put<User>(`${environment.API_URL_USUARIO_UPDATE}${userId}`, productData);
  }

  /**
   * Elimina un usuario
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_USUARIO_UPDATE}${userId}`);
  }
}
