import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { OpsGlobalStyles } from './theme/GlobalStyles';
import { opsTheme } from './theme/tokens';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={opsTheme}>
      <OpsGlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
