import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import baserUrl from './helper';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginStatusSubjec = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  //generamos el token
  public generateToken(loginData:any){
    return this.http.post(`${baserUrl}/generate-token`,loginData);
  }

  public getCurrentUser(){
    return this.http.get(`${baserUrl}/actual-usuario`);
  }

  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token: any): boolean {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      return true;
    }
    return false;
  }

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      let tokenStr = localStorage.getItem('token');
      return tokenStr !== undefined && tokenStr !== '' && tokenStr !== null;
    }

    return false;
  }

  //cerranis sesion y eliminamos el token del localStorage
  public logout(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    }
    return false;
  }

  //obtenemos el token
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  public setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      if (userStr !== null) {
        return JSON.parse(userStr);
      } else {
        this.logout();
        return null;
      }
    }

    return null;
  }

  public getUserRole(): any {
    let user = this.getUser();
    return user.authorities[0].authority;
  }

}
