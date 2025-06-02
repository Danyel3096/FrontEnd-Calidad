export interface ThemeColors {
  homePage: ColorSection;
  pageContent: ContentSection;
  pageButtons: ColorSection;
  titleNavbar: { color: string };
  navbar: ColorSection;
  navbarButtons: ColorSection;
  sidebar: ColorSection;
  sidebarButtons: ColorSection;
  tabs: ColorSection;
  pagination: ColorSection;
  footer: FooterSection;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

interface ColorSection {
  background?: string;
  backgroundPrimary?: string;
  backgroundSecondary?: string;
  backgroundTertiary?: string;
  backgroundQuaternary?: string;
  text?: string;
  textTitle?: string;
  textBody?: string;
  hoverBackground?: string;
  hoverText?: string;
}

interface ContentSection extends ColorSection {
  fontFamily: string;
  fontSizeH1: string;
  fontSizeH2: string;
  fontSizeH3: string;
  fontSizeH4: string;
  fontSizeH5: string;
  fontSizeH6: string;
  fontSizeText: string;
}

interface FooterSection extends ColorSection {
  link: string;
  hoverLink: string;
}
