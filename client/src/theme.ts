import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green 800 - A calming, natural color
      light: '#4CAF50', // Green 500
      dark: '#1B5E20', // Green 900
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1976D2', // Blue 700 - For secondary actions
      light: '#2196F3', // Blue 500
      dark: '#0D47A1', // Blue 900
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F', // Red 700 - For errors and warnings
      light: '#EF5350', // Red 400
      dark: '#C62828', // Red 800
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Grey 100 - A soft, non-white background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121', // Grey 900 - High contrast for readability
      secondary: '#616161', // Grey 700
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme; 