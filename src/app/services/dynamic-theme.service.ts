import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DynamicThemeService {
  private themeColors: any = null;

  constructor(private http: HttpClient) {}
  
  // Simula un fetch a la base de datos
  getThemeColors(): Observable<any> {
    if (this.themeColors) {
      return of(this.themeColors); // Si ya están en memoria
    } else {
      return this.http.get<any>('assets/config/theme.json').pipe(
        tap(data => this.themeColors = data), // Guardamos en caché
        catchError(() => {
          // Fallback si el JSON no está, o error de red
          const fallbackTheme = {
            navbar: {
              background: '#1E3A8A',
              text: '#FFFFFF',
              fondoHover: '#FFFFFF40',
              textoHover: '#000000'
            },
            button: {
              fondo: '#1E3A8A',
              texto: '#FFFFFF',
              fondoHover: '#FFFFFF40',
              textoHover: '#000000'
            },
            sidebar: {
              background: '#111827',
              text: '#FFFFFF'
            },
            title: {
              color: '#1E40AF'
            },
            background: '#F3F4F6'
          };
          this.themeColors = fallbackTheme;
          return of(fallbackTheme);
        })
      );
    }
  }

  resetThemeColors(): void {
    this.themeColors = null;
  }
}
