export const opsTheme = {
  colors: {
    bg: '#0c0e14',
    surface: '#14171f',
    surface2: '#1a1e28',
    border: '#242836',
    borderLight: '#2e3347',
    text: '#e2e4ea',
    text2: '#9498a8',
    text3: '#5d6178',
    accent: '#4f8ff7',
    accentDim: 'rgba(79,143,247,0.12)',
    green: '#34d399',
    greenDim: 'rgba(52,211,153,0.10)',
    yellow: '#fbbf24',
    yellowDim: 'rgba(251,191,36,0.10)',
    red: '#f87171',
    redDim: 'rgba(248,113,113,0.10)',
    orange: '#fb923c',
    orangeDim: 'rgba(251,146,60,0.10)',
    purple: '#a78bfa',
  },
  layout: {
    sidebarWidth: '220px',
    topbarHeight: '48px',
    radius: '8px',
    radiusSm: '5px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  fonts: {
    body: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
    mono: "'SF Mono', Menlo, Monaco, Consolas, monospace",
  },
  transition: '0.2s ease',
} as const;

export type OpsTheme = typeof opsTheme;
