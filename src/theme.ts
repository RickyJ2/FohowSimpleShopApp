import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#225E37', // Custom high-contrast green
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 20, // Elder-friendly minimum font size
    button: {
      fontSize: '1.25rem', // Larger text for buttons
      fontWeight: 'bold',
      textTransform: 'none', // More readable
    },
    h4: {
      fontWeight: 'bold',
    },
    h5: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1.25rem', // Base text 20px
    },
    body2: {
      fontSize: '1.125rem', // Slightly smaller but still readable
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '60px', // Large touch targets
          borderRadius: '12px',
          padding: '12px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '1.25rem',
            minHeight: '60px', // Large touch targets for inputs
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.25rem',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          minHeight: '60px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          minHeight: '48px', // Large touch targets for dropdown options
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
        },
      },
    },
  },
});

export default theme;
