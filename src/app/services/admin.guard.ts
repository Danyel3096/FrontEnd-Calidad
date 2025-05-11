import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Comprobar si el usuario está autenticado
    if (!this.loginService.isLoggedIn()) {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener el rol del usuario desde el servicio
    const role = this.loginService.getUserRole();

    // Comprobar si el usuario tiene el rol de ADMIN
    if (role === 'ADMIN') {
      return true;
    }

    // Si el usuario no tiene el rol adecuado, redirigir a una página de no autorizado
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
