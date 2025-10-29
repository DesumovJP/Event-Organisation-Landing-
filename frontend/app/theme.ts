import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 700,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: 600,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 2rem)',
      fontWeight: 600,
    },
    h4: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
      fontWeight: 500,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 500,
    },
    h6: {
      fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
