import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  combineLatest,
  map,
  catchError,
  shareReplay,
  tap
} from 'rxjs';
import { ThemeConfig, ThemeColors } from '../interfaces/dynamic-colors.interface';

@Injectable({ providedIn: 'root' })
export class DynamicThemeService {
  private isDarkMode$ = new BehaviorSubject<boolean>(false);

  /** Configuración de temas cargada desde JSON o fallback */
  private fallbackConfig: ThemeConfig = {
    light: {
      navbar: { background: '#1E3A8A', text: '#FFFFFF' },
      navbarButtons: { fondo: '#1E3A8A', texto: '#FFFFFF', fondoHover: '#FFFFFF40', textoHover: '#000000' },
      sidebar: { background: '#3d5891', text: '#FFFFFF' },
      sidebarButtons: { background: '#1E3A8A', text: '#FFFFFF', fondoHover: '#FFFFFF40', textoHover: '#000000' },
      title: { color: '#1E40AF' },
      background: '#F3F4F6'
    },
    dark: {
      navbar: { background: '#111827', text: '#FFFFFF' },
      navbarButtons: { fondo: '#1E40AF', texto: '#FFFFFF', fondoHover: '#FFFFFF40', textoHover: '#FFFFFF' },
      sidebar: { background: '#1F2937', text: '#FFFFFF' },
      sidebarButtons: { background: '#1E40AF', text: '#FFFFFF', fondoHover: '#FFFFFF40', textoHover: '#FFFFFF' },
      title: { color: '#93C5FD' },
      background: '#1F2937'
    }
  };

  /** Observable que carga y cachea el JSON de temas */
  private config$: Observable<ThemeConfig> = this.http
  .get<ThemeConfig>('assets/config/theme.json')
  .pipe(
    tap(cfg => console.log('config$ cargó:', cfg)),      // <-- Aquí el console.log
    catchError(() => {
      console.warn('Error cargando theme.json, usando fallback');
      return of(this.fallbackConfig);
    }),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {
    // 1. Borra valor previo para probar sistema
    localStorage.removeItem('theme');
  
    // 2. Inicializa según sistema (o localStorage si existe)
    const stored = localStorage.getItem('theme');
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mm.matches;
    console.log('matchMedia dark initial:', prefersDark);
  
    if (stored === 'dark' || stored === 'light') {
      this.isDarkMode$.next(stored === 'dark');
      console.log('isDarkMode$ from localStorage:', stored);
    } else {
      this.isDarkMode$.next(prefersDark);
    }
  
    // 3. Loguea cada emisión
    this.isDarkMode$.subscribe(isDark => {
      console.log('isDarkMode$ emitió:', isDark);
    });
  
    // 4. Escucha cambios del sistema
    mm.addEventListener('change', e => {
      console.log('matchMedia change, dark?', e.matches);
      if (!localStorage.getItem('theme')) {
        this.isDarkMode$.next(e.matches);
      }
    });
  
    // 5. Config$ como antes...
  }  

  /** Observable del modo oscuro */
  getDarkMode(): Observable<boolean> {
    return this.isDarkMode$.asObservable();
  }

  /** Cambia el modo y lo guarda */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode$.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  /** Paleta completa según el modo, emite en cada cambio */
  getActivePalette(): Observable<ThemeColors> {
    return combineLatest([this.config$, this.isDarkMode$]).pipe(
      map(([cfg, isDark]) => cfg[isDark ? 'dark' : 'light'])
    );
  }

  /** Sección específica de la paleta activa */
  getSection<K extends keyof ThemeColors>(section: K): Observable<ThemeColors[K]> {
    return combineLatest([this.config$, this.isDarkMode$]).pipe(
      map(([cfg, isDark]) => cfg[isDark ? 'dark' : 'light'][section])
    );
  }

  /** Cambia el modo oscuro y claro con el botón y lo guarda */
  toggleTheme(): void {
    const current = this.isDarkMode$.getValue();
    this.setDarkMode(!current);
  }
}
