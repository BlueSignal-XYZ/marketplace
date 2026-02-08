import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import LandingPage from './LandingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import WarrantyPage from './pages/WarrantyPage';
import NotFoundPage from './pages/NotFoundPage';

// Lightweight pathname-based router (no react-router-dom — keeps bundle small)
const routes = {
  '/': LandingPage,
  '/privacy': PrivacyPage,
  '/terms': TermsPage,
  '/warranty': WarrantyPage,
};

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const Page = routes[path] || NotFoundPage;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Page />
    </ThemeProvider>
  </React.StrictMode>
);
