import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, combineLatest, map, catchError, shareReplay, tap, switchMap } from 'rxjs';
import { ThemeConfig, ThemeColors } from '../interfaces/dynamic-colors.interface';

@Injectable({ providedIn: 'root' })
export class DynamicThemeService {
  private isDarkMode$ = new BehaviorSubject<boolean>(false);

  private fallbackConfig: ThemeConfig = {
    light: {
      homePage: { backgroundPrimary: "", backgroundSecondary: "", backgroundTertiary: "", backgroundQuaternary: "", textTitle: "", textBody: "5" },//background: '#F3F4F6',
      pageContent: { backgroundPage: "", backgroundSecondary: "", textTitle: "", textBody: "", fontFamily: "ns-serif", fontSizeH1: "", fontSizeH2: "", fontSizeH3: "", fontSizeH4: "", fontSizeH5: "", fontSizeH6: "", fontSizeText: ""},//backgroundPage: '#F3F4F6',
      pageButtons: { background: '', text: '', hoverBackground:'', hoverText: '' },
      titleNavbar: { color: '' },
      navbar: { background: '', text: '' },
      navbarButtons: { background: '', text: '', hoverBackground:'', hoverText: '' },
      sidebar: { background: '', text: '' },
      sidebarButtons: { background: '', text: '', hoverBackground: '', hoverText: '' },
      tabs: { background: '', text: '', hoverBackground: '', hoverText: '' },
      pagination: { background: '', text: '', hoverBackground: '', hoverText: '' },
      footer: { background: '', text: '', hoverBackground: '', hoverText: '' }
    },
    dark: {
      homePage: { backgroundPrimary: "", backgroundSecondary: "", backgroundTertiary: "", backgroundQuaternary: "", textTitle: "", textBody: "1" },//background: '',
      pageContent: { backgroundPage: "", backgroundSecondary: "", textTitle: "", textBody: "", fontFamily: "ns-serif", fontSizeH1: "", fontSizeH2: "", fontSizeH3: "", fontSizeH4: "", fontSizeH5: "", fontSizeH6: "", fontSizeText: ""},//backgroundPage: '',
      pageButtons: { background: '', text: '', hoverBackground:'', hoverText: '' },
      titleNavbar: { color: '' },
      navbar: { background: '', text: '' },
      navbarButtons: { background: '', text: '', hoverBackground: '', hoverText: '' },
      sidebar: { background: '', text: '' },
      sidebarButtons: { background: '', text: '', hoverBackground: '', hoverText: '' },
      tabs: { background: '', text: '', hoverBackground: '', hoverText: '' },
      pagination: { background: '', text: '', hoverBackground: '', hoverText: '' },
      footer: { background: '', text: '', hoverBackground: '', hoverText: '' }
    }
  };

  private configSubject = new BehaviorSubject<ThemeConfig>(this.fallbackConfig);

  constructor(private http: HttpClient) {
    this.initTheme();
    this.loadInitialConfig();
  }

  // --- Modo oscuro ---

  getDarkMode(): Observable<boolean> {
    return this.isDarkMode$.asObservable();
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode$.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const current = this.isDarkMode$.getValue();
    this.setDarkMode(!current);
  }

  // --- Configuración del tema ---

  /** Inicializa el modo oscuro y escucha cambios del sistema */
  private initTheme(): void {
    const stored = localStorage.getItem('theme');
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mm.matches;

    this.isDarkMode$.next(stored === 'dark' ? true : stored === 'light' ? false : prefersDark);

    mm.addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.isDarkMode$.next(e.matches);
      }
    });
  }

  /** Carga el JSON y lo emite a `configSubject`, usa override si existe */
  private loadInitialConfig(): void {
    this.http.get<ThemeConfig>('assets/config/theme.json').pipe(
      map(jsonConfig => {
        const localOverride = localStorage.getItem('customTheme');
        if (localOverride) {
          try {
            return JSON.parse(localOverride) as ThemeConfig;
          } catch {
            console.warn('Error parseando override local, usando JSON original');
          }
        }
        return jsonConfig;
      }),
      catchError(() => {
        console.warn('Error cargando theme.json, usando fallback');
        return of(this.fallbackConfig);
      }),
      tap(config => this.configSubject.next(config)),
      shareReplay(1)
    ).subscribe();
  }

  /** Devuelve todo el objeto de configuración */
  getConfig(): Observable<ThemeConfig> {
    return this.configSubject.asObservable();
  }

  /** Actualiza toda la configuración (desde formulario) */
  updateThemeConfig(updated: ThemeConfig): void {
    localStorage.setItem('customTheme', JSON.stringify(updated)); // guarda localmente si deseas persistir
    this.configSubject.next(updated);
  }

  /** Paleta activa completa (light o dark) */
  getActivePalette(): Observable<ThemeColors> {
    return combineLatest([this.getConfig(), this.isDarkMode$]).pipe(
      map(([cfg, isDark]) => cfg[isDark ? 'dark' : 'light'])
    );
  }

  /** Sección específica del tema activo */
  getSection<K extends keyof ThemeColors>(section: K): Observable<ThemeColors[K]> {
    return this.getActivePalette().pipe(map(palette => palette[section]));
  }
}
