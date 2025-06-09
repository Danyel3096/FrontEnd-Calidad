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
    return this.http.get<User[]>(environment.API_URL_USUARIO_REGISTRO);
  }

  /**
   * Obtiene los usuarios por tienda
   */
  getUsersByStore(storeId: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_URL_USUARIO_REGISTRO}/store/${storeId}`);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.API_URL_USUARIO_UPDATE}${userId}`);
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(environment.API_URL_USUARIO_REGISTRO, user);
  }

  /**
   * Actualiza un usuario
   */
  updateUser(userId: number, user: User): Observable<User> {
    const formData = new FormData();

    // Limpieza de propiedades innecesarias
    delete user.photoUrl;
    delete user.id;

    const file = user.photo;
    delete user.photo;

    const jsonBlob = new Blob([JSON.stringify(user)], { type: 'application/json' });
    formData.append('user', jsonBlob);

    if (file) {
      formData.append('file', file);
    }

    return this.http.put<User>(`${environment.API_URL_USUARIO_UPDATE}${userId}`, formData);
  }

  /**
   * Elimina un usuario
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL_USUARIO_UPDATE}${userId}`);
  }
}
