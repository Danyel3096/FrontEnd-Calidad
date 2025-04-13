export interface NavbarColors {
    background: string;
    text: string;
}
  
export interface NavbarButtonsColors {
    fondo: string;
    texto: string;
    fondoHover: string;
    textoHover: string;
}
  
export interface SidebarColors {
    background: string;
    text: string;
}

export interface SidebarButtonsColors {
    background: string;
    text: string;
    fondoHover: string;
    textoHover: string;
}
  
export interface TitleColors {
    color: string;
}
  
export interface ThemeColors {
    navbar: NavbarColors;
    navbarButtons: NavbarButtonsColors;
    sidebar: SidebarColors;
    sidebarButtons: SidebarButtonsColors;
    titleNavbar: TitleColors;
    backgroundPage: string;
}
  
export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface DynamicColors {
}
