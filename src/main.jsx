import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalStyle } from './styles/global.js';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/colors.js';
import { AppProvider } from './context/AppContext.jsx';

/**
 * Top-level ErrorBoundary — catches fatal errors that occur before the
 * platform-level ErrorBoundary (inside WQTApp/CloudApp) can render.
 * Uses inline styles only because styled-components ThemeProvider is below it.
 */
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[RootErrorBoundary] Fatal render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            padding: 24,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 40,
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: '0 0 12px' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' }}>
              The application failed to load. This may be a temporary issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#0f172a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
            {this.state.error && (
              <details style={{ marginTop: 20, textAlign: 'left' }}>
                <summary style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
                  Error details
                </summary>
                <pre
                  style={{
                    fontSize: 11,
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: 12,
                    borderRadius: 8,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: 160,
                    marginTop: 8,
                  }}
                >
                  {this.state.error.message}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <AppProvider>
              <App />
            </AppProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);
