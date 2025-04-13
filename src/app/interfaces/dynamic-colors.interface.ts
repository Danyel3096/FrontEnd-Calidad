export interface NavbarColors {
    background: string;
    text: string;
    fondoHover: string;
    textoHover: string;
}
  
export interface ButtonColors {
    fondo: string;
    texto: string;
    fondoHover: string;
    textoHover: string;
}
  
export interface SidebarColors {
    background: string;
    text: string;
    fondoHover: string;
    textoHover: string;
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
    button: ButtonColors;
    sidebar: SidebarColors;
    sidebarButtons: SidebarButtonsColors;
    title: TitleColors;
    background: string;
}
  
export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface DynamicColors {
}
