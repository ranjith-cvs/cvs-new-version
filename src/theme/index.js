import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#007bff', contrastText: '#fff' },
    secondary: { main: '#6c757d' },
    background: { default: '#f8f9fa', paper: '#fff' },
    text: { primary: '#212529', secondary: '#6c757d' },
    error: { main: '#dc3545' },
    success: { main: '#28a745' },
    warning: { main: '#ffc107' },
  },

  typography: {
    fontFamily: `'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    fontSize: 14,
    h1: { fontSize: '2.4rem', fontWeight: 600 },
    h2: { fontSize: '2rem',   fontWeight: 600 },
    h3: { fontSize: '1.8rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.3rem' },
    h6: { fontSize: '1.1rem' },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'capitalize' },
  },

  shape: { borderRadius: 10 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
