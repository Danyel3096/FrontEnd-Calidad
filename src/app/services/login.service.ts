// src/app/services/login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginStatusSubject = new Subject<boolean>();

  private API_URL = 'https://fakestoreapi.com/auth';

  constructor(private http: HttpClient) {}

  generateToken(loginData: any) {
    return this.http.post(`${this.API_URL}/login`, loginData);
  }

  loginUser(token: string) {
    localStorage.setItem('token', token);
    return true;
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Estos métodos los puedes dejar como placeholders por ahora si FakeStore no los soporta
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRole() {
    // FakeStore no provee roles, puedes asignar uno fijo si quieres
    return 'NORMAL';
  }

  getCurrentUser() {
    // FakeStore no provee endpoint para datos del usuario autenticado
    return this.http.get('https://fakestoreapi.com/users/1'); // ⚠️ hardcoded temporal
  }
}
