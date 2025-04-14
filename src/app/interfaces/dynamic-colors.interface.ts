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
  
export interface TitleNavbarColors {
    color: string;
}

export interface PageColors {
    backgroundPage: string;
    backgroundSecondary: string;
    textTitle: string;
    textBody: string;
}
  
export interface ThemeColors {
    navbar: NavbarColors;
    navbarButtons: NavbarButtonsColors;
    sidebar: SidebarColors;
    sidebarButtons: SidebarButtonsColors;
    titleNavbar: TitleNavbarColors;
    pageContent: PageColors;
}
  
export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface DynamicColors {
}
