import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import './styles/index.css';

const container = document.getElementById('root');

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0099FF',
    },
    secondary: {
      main: '#0000ff',
    },
    background: {
      default: '#001125',
      paper: '#001337'
    }
  },
});

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error('Container element not found.');
}
