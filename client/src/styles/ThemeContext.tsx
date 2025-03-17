import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, highContrastTheme, lowBlueTheme, neutralTheme } from './themes';
import GlobalStyle from './GlobalStyle';

// Define theme types
export type ThemeName = 'light' | 'dark' | 'high-contrast' | 'low-blue' | 'neutral';
export type FontSize = 12 | 14 | 16 | 18 | 20 | 22 | 24;
export type FontFamily = 'system' | 'sans-serif' | 'serif' | 'dyslexic';
export type LineSpacing = 1 | 1.5 | 2 | 2.5;

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  lineSpacing: LineSpacing;
  setLineSpacing: (spacing: LineSpacing) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  applyThemePreferences: () => void;
}

// Create theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  fontSize: 16,
  setFontSize: () => {},
  fontFamily: 'system',
  setFontFamily: () => {},
  lineSpacing: 1.5,
  setLineSpacing: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
  applyThemePreferences: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setTheme] = useState<ThemeName>(
    () => (localStorage.getItem('theme') as ThemeName) || 'light'
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    () => Number(localStorage.getItem('fontSize')) as FontSize || 16
  );
  const [fontFamily, setFontFamily] = useState<FontFamily>(
    () => (localStorage.getItem('fontFamily') as FontFamily) || 'system'
  );
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>(
    () => Number(localStorage.getItem('lineSpacing')) as LineSpacing || 1.5
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () => localStorage.getItem('reducedMotion') === 'true'
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    () => localStorage.getItem('highContrast') === 'true'
  );

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('fontSize', String(fontSize));
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('lineSpacing', String(lineSpacing));
    localStorage.setItem('reducedMotion', String(reducedMotion));
    localStorage.setItem('highContrast', String(highContrast));
  }, [theme, fontSize, fontFamily, lineSpacing, reducedMotion, highContrast]);

  // Check for user OS preferences on initial load
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && localStorage.getItem('reducedMotion') === null) {
      setReducedMotion(true);
    }

    // Check for color scheme preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode && localStorage.getItem('theme') === null) {
      setTheme('dark');
    }
  }, []);

  // Apply theme preferences to HTML element for global styling
  const applyThemePreferences = () => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.className = `theme-${theme} font-${fontFamily} spacing-${lineSpacing}`;
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  // Apply preferences when they change
  useEffect(() => {
    applyThemePreferences();
  }, [theme, fontSize, fontFamily, lineSpacing, reducedMotion, highContrast]);

  // Get theme object based on selected theme
  const getThemeObject = () => {
    if (highContrast) return highContrastTheme;
    
    switch (theme) {
      case 'dark':
        return darkTheme;
      case 'high-contrast':
        return highContrastTheme;
      case 'low-blue':
        return lowBlueTheme;
      case 'neutral':
        return neutralTheme;
      default:
        return lightTheme;
    }
  };

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineSpacing,
    setLineSpacing,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    applyThemePreferences,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={getThemeObject()}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme context
export const useTheme = () => useContext(ThemeContext); 