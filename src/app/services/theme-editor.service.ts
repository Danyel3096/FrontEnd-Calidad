import { Injectable } from '@angular/core';
import { ThemeData } from '../interfaces/theme.interface';

@Injectable({
  providedIn: 'root'
})

export class ThemeEditorService {
  constructor() { }

  private themeData: ThemeData = {
    light: {
      homePage: {
        backgroundPrimary: '#6a11cb',
        backgroundSecondary: '#93c5fd',
        backgroundTertiary: '#bfdbfe',
        backgroundQuaternary: '#60a5fa',
        textTitle: '#0f172a',
        textBody: '#1e293b',
      },
      pageContent: {
        backgroundPage: '#f8fafc',
        backgroundSecondary: '#ffffff',
        textTitle: '#0f172a',
        textBody: '#334155',
        fontFamily: 'Georgia, serif',
        fontSizeH1: '2rem',
        fontSizeH2: '1.75rem',
        fontSizeH3: '1.5rem',
        fontSizeH4: '1.25rem',
        fontSizeH5: '1rem',
        fontSizeH6: '0.875rem',
        fontSizeText: '0.5rem',
      },
      // ... el resto igual
      pageButtons: { background: '#2563eb', text: '#ffffff', hoverBackground: '#1d4ed8', hoverText: '#ffffff' },
      titleNavbar: { color: '#ffffff' },
      navbar: { background: '#2563eb', text: '#f8fafc' },
      navbarButtons: { background: '#3b82f6', text: '#ffffff', hoverBackground: '#60a5fa', hoverText: '#1e293b' },
      sidebar: { background: '#e2e8f0', text: '#1e293b' },
      sidebarButtons: { background: '#3b82f6', text: '#ffffff', hoverBackground: '#60a5fa', hoverText: '#1e293b' },
      tabs: { background: '#3b82f6', text: '#ffffff', hoverBackground: '#60a5fa', hoverText: '#1e293b' },
      pagination: { background: '#3b82f6', text: '#ffffff', hoverBackground: '#60a5fa', hoverText: '#1e293b' },
      footer: { background: '#f1f5f9', text: '#334155', link: '#2563eb', hoverLink: '#1e40af' },
    },
    dark: {
      // ... igual que el anterior, versión dark
      homePage: {
        backgroundPrimary: '#3d0d80',
        backgroundSecondary: '#3b82f6',
        backgroundTertiary: '#1e3a8a',
        backgroundQuaternary: '#0ea5e9',
        textTitle: '#f8fafc',
        textBody: '#cbd5e1',
      },
      // el resto...
      pageContent: {
        backgroundPage: '#0f172a',
        backgroundSecondary: '#1e293b',
        textTitle: '#f8fafc',
        textBody: '#cbd5e1',
        fontFamily: 'Georgia, serif',
        fontSizeH1: '2rem',
        fontSizeH2: '1.75rem',
        fontSizeH3: '1.5rem',
        fontSizeH4: '1.25rem',
        fontSizeH5: '1rem',
        fontSizeH6: '0.875rem',
        fontSizeText: '0.5rem',
      },
      pageButtons: { background: '#28de1b', text: '#ffffff', hoverBackground: '#70cf69', hoverText: '#1e293b' },
      titleNavbar: { color: '#f1f5f9' },
      navbar: { background: '#1d4ed8', text: '#f8fafc' },
      navbarButtons: { background: '#3b82f6', text: '#ffffff', hoverBackground: '#93c5fd', hoverText: '#1e293b' },
      sidebar: { background: '#1e293b', text: '#f8fafc' },
      sidebarButtons: { background: '#0ea5e9', text: '#ffffff', hoverBackground: '#38bdf8', hoverText: '#1e293b' },
      tabs: { background: '#0ea5e9', text: '#ffffff', hoverBackground: '#38bdf8', hoverText: '#1e293b' },
      pagination: { background: '#0ea5e9', text: '#ffffff', hoverBackground: '#38bdf8', hoverText: '#1e293b' },
      footer: { background: '#1e293b', text: '#cbd5e1', link: '#93c5fd', hoverLink: '#60a5fa' },
    }
  };

  getTheme(): ThemeData {
    return this.themeData;
  }

  updateTheme(newData: ThemeData): void {
    this.themeData = newData;
    // Aquí podrías persistir en backend o localStorage si quieres
  }
}
