import { DefaultTheme } from 'styled-components';

// Theme interface
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      hint: string;
    };
    error: string;
    warning: string;
    success: string;
    info: string;
    border: string;
    divider: string;
    focus: string;
    buttonText: string;
    buttonBackground: string;
    inputBackground: string;
    inputBorder: string;
    cardBackground: string;
    tooltip: string;
    tooltipText: string;
    highlight: string;
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
    pill: string;
  };
  typography: {
    fontSizeBase: number;
    fontSizeScale: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeights: {
      light: number;
      regular: number;
      medium: number;
      bold: number;
    };
    headings: {
      h1: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h2: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h3: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h4: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h5: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
      h6: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
      };
    };
  };
  transitions: {
    fast: string;
    medium: string;
    slow: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  zIndices: {
    modal: number;
    overlay: number;
    dropdown: number;
    tooltip: number;
  };
}

// Base theme with values common to all themes
const baseTheme: Partial<Theme> = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    pill: '9999px',
  },
  typography: {
    fontSizeBase: 16,
    fontSizeScale: {
      xs: 0.75,
      sm: 0.875,
      md: 1,
      lg: 1.25,
      xl: 1.5,
      xxl: 2,
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    headings: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.35,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.4,
      },
    },
  },
  transitions: {
    fast: '150ms ease-in-out',
    medium: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  zIndices: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    tooltip: 700,
  },
};

// Light theme
export const lightTheme: Theme = {
  ...baseTheme as Theme,
  id: 'light',
  name: 'Light',
  colors: {
    primary: '#4555B9',
    secondary: '#65C6CA',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: {
      primary: '#212529',
      secondary: '#495057',
      disabled: '#ADB5BD',
      hint: '#6C757D',
    },
    error: '#D94560',
    warning: '#F59E0B',
    success: '#2F9E44',
    info: '#4DABF7',
    border: '#DEE2E6',
    divider: '#E9ECEF',
    focus: '#3B82F6',
    buttonText: '#FFFFFF',
    buttonBackground: '#4555B9',
    inputBackground: '#FFFFFF',
    inputBorder: '#CED4DA',
    cardBackground: '#FFFFFF',
    tooltip: '#212529',
    tooltipText: '#FFFFFF',
    highlight: '#FFF3CD',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)',
  },
};

// Dark theme
export const darkTheme: Theme = {
  ...baseTheme as Theme,
  id: 'dark',
  name: 'Dark',
  colors: {
    primary: '#6372D6',
    secondary: '#86D8DC',
    background: '#121212',
    surface: '#1E1E1E',
    text: {
      primary: '#F8F9FA',
      secondary: '#E9ECEF',
      disabled: '#6C757D',
      hint: '#ADB5BD',
    },
    error: '#ED6A81',
    warning: '#F9C762',
    success: '#57C365',
    info: '#73C0F9',
    border: '#343A40',
    divider: '#2A2A2A',
    focus: '#609BF8',
    buttonText: '#FFFFFF',
    buttonBackground: '#6372D6',
    inputBackground: '#2A2A2A',
    inputBorder: '#495057',
    cardBackground: '#292929',
    tooltip: '#F8F9FA',
    tooltipText: '#121212',
    highlight: '#2F2B15',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.25)',
    md: '0 4px 6px rgba(0, 0, 0, 0.25)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.25)',
  },
};

// High contrast theme (better visibility)
export const highContrastTheme: Theme = {
  ...baseTheme as Theme,
  id: 'high-contrast',
  name: 'High Contrast',
  colors: {
    primary: '#FFDD00',
    secondary: '#00CBFF',
    background: '#000000',
    surface: '#121212',
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      disabled: '#A0A0A0',
      hint: '#FFFFFF',
    },
    error: '#FF6666',
    warning: '#FFCA28',
    success: '#4CAF50',
    info: '#29B6F6',
    border: '#FFFFFF',
    divider: '#FFFFFF',
    focus: '#FFDD00',
    buttonText: '#000000',
    buttonBackground: '#FFDD00',
    inputBackground: '#121212',
    inputBorder: '#FFFFFF',
    cardBackground: '#121212',
    tooltip: '#FFFFFF',
    tooltipText: '#000000',
    highlight: '#3F3000',
  },
  shadows: {
    sm: '0 0 0 1px #FFFFFF',
    md: '0 0 0 2px #FFFFFF',
    lg: '0 0 0 3px #FFFFFF',
  },
};

// Low blue light theme (reduced blue light for eye comfort)
export const lowBlueTheme: Theme = {
  ...baseTheme as Theme,
  id: 'low-blue',
  name: 'Low Blue Light',
  colors: {
    primary: '#B97452',
    secondary: '#D4A373',
    background: '#F5F0E6',
    surface: '#FFF8EB',
    text: {
      primary: '#433422',
      secondary: '#664E33',
      disabled: '#A89D8D',
      hint: '#907A61',
    },
    error: '#C74A52',
    warning: '#C87629',
    success: '#5A8754',
    info: '#7A93A6',
    border: '#E6D7C3',
    divider: '#F0E6D6',
    focus: '#B97452',
    buttonText: '#FFFFFF',
    buttonBackground: '#B97452',
    inputBackground: '#FFF8EB',
    inputBorder: '#E6D7C3',
    cardBackground: '#FFF8EB',
    tooltip: '#433422',
    tooltipText: '#FFFFFF',
    highlight: '#F7E7CC',
  },
  shadows: {
    sm: '0 1px 2px rgba(67, 52, 34, 0.05)',
    md: '0 4px 6px rgba(67, 52, 34, 0.05)',
    lg: '0 10px 15px rgba(67, 52, 34, 0.05)',
  },
};

// Neutral theme (minimal colors for reduced sensory input)
export const neutralTheme: Theme = {
  ...baseTheme as Theme,
  id: 'neutral',
  name: 'Neutral',
  colors: {
    primary: '#666666',
    secondary: '#888888',
    background: '#F1F1F1',
    surface: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#555555',
      disabled: '#AAAAAA',
      hint: '#777777',
    },
    error: '#A55',
    warning: '#AA7',
    success: '#585',
    info: '#557',
    border: '#DDDDDD',
    divider: '#EEEEEE',
    focus: '#666666',
    buttonText: '#FFFFFF',
    buttonBackground: '#666666',
    inputBackground: '#FFFFFF',
    inputBorder: '#CCCCCC',
    cardBackground: '#FFFFFF',
    tooltip: '#333333',
    tooltipText: '#FFFFFF',
    highlight: '#F7F7E7',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.025)',
    md: '0 2px 4px rgba(0, 0, 0, 0.025)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.025)',
  },
};

// Export all themes
export const themes: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
  'low-blue': lowBlueTheme,
  neutral: neutralTheme,
};

// Get theme by ID
export const getThemeById = (themeId: string): Theme => {
  return themes[themeId] || lightTheme;
}; 