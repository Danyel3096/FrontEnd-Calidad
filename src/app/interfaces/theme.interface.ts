export interface ThemeSection {
  [colorKey: string]: string; // Ej: "background": "#000000"
}

export interface Theme {
  homePage: ThemeSection;
  pageContent: ThemeSection;
  pageButtons: ThemeSection;
  titleNavbar: ThemeSection;
  navbar: ThemeSection;
  navbarButtons: ThemeSection;
  sidebar: ThemeSection;
  sidebarButtons: ThemeSection;
  tabs: ThemeSection;
  pagination: ThemeSection;
  footer: ThemeSection;
}

export interface ThemeData {
  light: Theme;
  dark: Theme;
}
