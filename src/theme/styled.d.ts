import 'styled-components';
import { DefaultTheme } from 'styled-components/native';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        green: string;
        greenLight: string;
        greenDark: string;
        orange: string;
        orangeLight: string;
        orangeDark: string;
      };
      secondary: {
        gray: string;
        grayLight: string;
        grayDark: string;
        grayLighter: string;
        grayDarker: string;
      };
      neutral: {
        white: string;
        black: string;
        offWhite: string;
        lightGray: string;
        mediumGray: string;
        darkGray: string;
      };
      status: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
      background: {
        light: string;
        dark: string;
        card: string;
        cardDark: string;
        overlay: string;
      };
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        inverse: string;
        link: string;
      };
      border: {
        light: string;
        medium: string;
        dark: string;
      };
      // Theme-specific colors
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      primary: string;
      secondary: string;
      accent: string;
      error: string;
      warning: string;
      success: string;
    };
    typography: {
      fontFamily: {
        regular: string;
        medium: string;
        semiBold: string;
        bold: string;
      };
      fontSize: {
        xs: number;
        sm: number;
        base: number;
        lg: number;
        xl: number;
        '2xl': number;
        '3xl': number;
        '4xl': number;
        '5xl': number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
      fontWeight: {
        normal: string;
        medium: string;
        semiBold: string;
        bold: string;
      };
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    borderRadius: {
      none: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      full: number;
    };
    shadows: {
      sm: any;
      md: any;
      lg: any;
      xl: any;
    };
    isDark: boolean;
  }
}