export interface HomePageColors {
    background: string;
    textTitle: string;
    textBody: string;
}

export interface NavbarColors {
    background: string;
    text: string;
}
  
export interface NavbarButtonsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}
  
export interface SidebarColors {
    background: string;
    text: string;
}

export interface SidebarButtonsColors {
    background: string;
    text: string;
    hoverBackground: string;
    hoverText: string;
}
  
export interface TitleNavbarColors {
    color: string;
}

export interface PageContentColors {
    backgroundPage: string;
    backgroundSecondary: string;
    textTitle: string;
    textBody: string;
}
  
export interface ThemeColors {
    homePage: HomePageColors,
    navbar: NavbarColors;
    navbarButtons: NavbarButtonsColors;
    sidebar: SidebarColors;
    sidebarButtons: SidebarButtonsColors;
    titleNavbar: TitleNavbarColors;
    pageContent: PageContentColors;
}
  
export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface DynamicColors {
}
