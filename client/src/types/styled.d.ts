import 'styled-components';

// Define the theme interface 
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryHover: string;
      secondary: string;
      secondaryLight: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      background: string;
      surface: string;
      border: string;
      hover: string;
      focus: string;
      white: string;
      black: string;
      codeBackground: string;
      code: string;
      textOnPrimary: string;
      textOnSuccess: string;
      textOnWarning: string;
      textOnInfo: string;
      text: {
        primary: string;
        secondary: string;
        hint: string;
      };
    };
    typography: {
      fontFamily: string;
      fontFamilyCode: string;
      fontWeights: {
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
    zIndices: {
      modal: number;
      overlay: number;
      dropdown: number;
      header: number;
      tooltip: number;
    };
  }
} 