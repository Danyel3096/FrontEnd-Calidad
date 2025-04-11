import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicThemeService {
  // Simula un fetch a la base de datos
  getThemeColors(): Observable<any> {
    const theme = {
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
    // más adelante será un fetch a tu API
    return of(theme); // Devuelve un observable como si fuera de una API
  }
}
