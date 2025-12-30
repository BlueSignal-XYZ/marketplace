// BlueSignal Sales Portal - Unified Theme Tokens
// This file provides a cohesive design system for the entire sales portal

export const salesTheme = {
  // Primary color palette
  colors: {
    // Background colors
    bgPrimary: '#0f1729',       // Deep navy - hero, header, footer
    bgSecondary: '#1a2537',     // Slightly lighter navy - cards on dark
    bgSurface: '#f8fafc',       // Light gray - content sections
    bgCard: '#ffffff',          // White - product cards
    bgOverlay: 'rgba(15, 23, 42, 0.95)',

    // Accent colors
    accentPrimary: '#10b981',   // Green - CTAs, prices, highlights
    accentPrimaryHover: '#059669',
    accentSecondary: '#3b82f6', // Blue - links, tags
    accentSecondaryHover: '#2563eb',

    // Text colors
    textPrimary: '#ffffff',     // On dark backgrounds
    textSecondary: '#94a3b8',   // Muted text
    textDark: '#1e293b',        // On light backgrounds
    textMuted: '#64748b',       // Subtle text

    // Border colors
    border: '#e2e8f0',          // Card borders on light
    borderDark: '#334155',      // Card borders on dark
    borderLight: 'rgba(255, 255, 255, 0.1)',

    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Special effects
    glassDark: 'rgba(255, 255, 255, 0.05)',
    glassLight: 'rgba(255, 255, 255, 0.1)',
  },

  // Gradients
  gradients: {
    heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    darkCard: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    greenCta: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    blueCta: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    greenText: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
    roiResults: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
    sectionFade: 'linear-gradient(180deg, #0f1729 0%, #1a2537 50%, #f8fafc 100%)',
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace",

    // Font sizes with line heights
    heroH1: { size: '48px', lineHeight: '56px', weight: 600 },
    sectionH2: { size: '32px', lineHeight: '40px', weight: 600 },
    cardTitle: { size: '18px', lineHeight: '24px', weight: 600 },
    body: { size: '16px', lineHeight: '24px', weight: 400 },
    label: { size: '12px', lineHeight: '16px', weight: 500, transform: 'uppercase', tracking: '0.05em' },
    small: { size: '14px', lineHeight: '20px', weight: 400 },
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    section: '80px',
  },

  // Border radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    glow: '0 0 40px rgba(16, 185, 129, 0.3)',
    cardDark: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.2s ease-out',
    slow: '0.3s ease-out',
    spring: '0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px',
  },

  // Z-index layers
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 50,
    modal: 100,
    overlay: 200,
    tooltip: 300,
  },
};

// CSS custom properties generator
export const generateCSSVariables = () => `
  :root {
    /* Colors */
    --bg-primary: ${salesTheme.colors.bgPrimary};
    --bg-secondary: ${salesTheme.colors.bgSecondary};
    --bg-surface: ${salesTheme.colors.bgSurface};
    --bg-card: ${salesTheme.colors.bgCard};

    --accent-primary: ${salesTheme.colors.accentPrimary};
    --accent-primary-hover: ${salesTheme.colors.accentPrimaryHover};
    --accent-secondary: ${salesTheme.colors.accentSecondary};
    --accent-secondary-hover: ${salesTheme.colors.accentSecondaryHover};

    --text-primary: ${salesTheme.colors.textPrimary};
    --text-secondary: ${salesTheme.colors.textSecondary};
    --text-dark: ${salesTheme.colors.textDark};
    --text-muted: ${salesTheme.colors.textMuted};

    --border: ${salesTheme.colors.border};
    --border-dark: ${salesTheme.colors.borderDark};
    --border-light: ${salesTheme.colors.borderLight};

    /* Typography */
    --font-family: ${salesTheme.typography.fontFamily};
    --font-mono: ${salesTheme.typography.fontMono};

    /* Spacing */
    --spacing-xs: ${salesTheme.spacing.xs};
    --spacing-sm: ${salesTheme.spacing.sm};
    --spacing-md: ${salesTheme.spacing.md};
    --spacing-lg: ${salesTheme.spacing.lg};
    --spacing-xl: ${salesTheme.spacing.xl};
    --spacing-xxl: ${salesTheme.spacing.xxl};

    /* Border Radius */
    --radius-sm: ${salesTheme.borderRadius.sm};
    --radius-md: ${salesTheme.borderRadius.md};
    --radius-lg: ${salesTheme.borderRadius.lg};
    --radius-xl: ${salesTheme.borderRadius.xl};

    /* Transitions */
    --transition-fast: ${salesTheme.transitions.fast};
    --transition-normal: ${salesTheme.transitions.normal};
    --transition-slow: ${salesTheme.transitions.slow};
  }
`;

export default salesTheme;
