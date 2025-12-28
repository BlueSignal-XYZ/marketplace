// /src/styles/colors.js
// Enhanced color palette for BlueSignal Marketplace

export const colors = {
  deepBlue: "#0A2E36",
  lightBlue: "#4FBDBA",
  accentBlue: "#88CDDA",
  white: "#FFF",
  red: "red",
};

export const logoColors = {
  primary: "#005A87",
  secondary: "#003F5E",
  accent: "#007BB5",
};

// Credit type badge colors for WaterQuality.Trading marketplace
export const creditTypeColors = {
  nitrogen: {
    bg: "#DBEAFE",      // blue-100
    text: "#1D4ED8",    // blue-700
    border: "#93C5FD",  // blue-300
  },
  phosphorus: {
    bg: "#DCFCE7",      // green-100
    text: "#15803D",    // green-700
    border: "#86EFAC",  // green-300
  },
  thermal: {
    bg: "#FFEDD5",      // orange-100
    text: "#C2410C",    // orange-700
    border: "#FDBA74",  // orange-300
  },
  stormwater: {
    bg: "#F3E8FF",      // purple-100
    text: "#7E22CE",    // purple-700
    border: "#D8B4FE",  // purple-300
  },
};

export const theme = {
  colors: {
    // Primary brand colors - ocean/water inspired
    primary50: "#E6F7F8",
    primary100: "#C0EAEB",
    primary200: "#8FDADB",
    primary300: "#5DC9CC",
    primary400: "#38BDBE",
    primary500: "#1D7072",
    primary600: "#196061",
    primary700: "#0F393A",
    primary800: "#0A2E36",
    primary900: "#051A1F",

    // Accent colors for CTAs and highlights
    accent50: "#E0F7FA",
    accent100: "#B2EBF2",
    accent200: "#80DEEA",
    accent300: "#4DD0E1",
    accent400: "#26C6DA",
    accent500: "#00BCD4",
    accent600: "#00ACC1",
    accent700: "#0097A7",
    accent800: "#00838F",
    accent900: "#006064",

    // UI Neutrals - refined gray scale
    ui50: "#FAFAFA",
    ui100: "#F4F5F7",
    ui200: "#E5E7EB",
    ui300: "#D1D5DB",
    ui400: "#9CA3AF",
    ui500: "#6B7280",
    ui600: "#4B5563",
    ui700: "#374151",
    ui800: "#1F2937",
    ui900: "#111827",
    ui950: "#030712",

    // Success colors
    success50: "#ECFDF5",
    success100: "#D1FAE5",
    success200: "#A7F3D0",
    success300: "#6EE7B7",
    success400: "#34D399",
    success500: "#10B981",
    success600: "#059669",
    success700: "#047857",
    success800: "#065F46",
    success900: "#064E3B",

    // Warning colors
    warning50: "#FFFBEB",
    warning100: "#FEF3C7",
    warning200: "#FDE68A",
    warning300: "#FCD34D",
    warning400: "#FBBF24",
    warning500: "#F59E0B",
    warning600: "#D97706",
    warning700: "#B45309",
    warning800: "#92400E",
    warning900: "#78350F",

    // Error/Danger colors
    red50: "#FEF2F2",
    red100: "#FEE2E2",
    red200: "#FECACA",
    red300: "#FCA5A5",
    red400: "#F87171",
    red500: "#EF4444",
    red600: "#DC2626",
    red700: "#B91C1C",
    red800: "#991B1B",
    red900: "#7F1D1D",

    // Semantic aliases
    bg: "#FAFAFA",
    bgAlt: "#F4F5F7",
    text: "#1F2937",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    borderHover: "#D1D5DB",
  },

  // Box shadows - enhanced depth system
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    glow: "0 0 20px rgba(29, 112, 114, 0.15)",
    glowStrong: "0 0 30px rgba(29, 112, 114, 0.25)",
  },
  boxShadow: {
    light: `rgba(17, 17, 26, 0.1) 0px 0px 16px`,
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #1D7072 0%, #0A2E36 100%)",
    primaryLight: "linear-gradient(135deg, #38BDBE 0%, #1D7072 100%)",
    accent: "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)",
    surface: "linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 100%)",
    card: "linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)",
    hero: "linear-gradient(135deg, #0A2E36 0%, #196061 50%, #38BDBE 100%)",
  },

  mainBreakpoint: "1200px",

  borderRadius: {
    sm: "6px",
    default: "12px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    full: "9999px",
  },

  // Spacing scale
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
    // Standardized values from UI audit
    card: "24px",       // Standard card padding
    section: "48px",    // Standard section spacing
  },

  formHeightMd: "44px",
  formHeightLg: "52px",

  // Audit-specified semantic tokens
  audit: {
    primary: "#0D9488",        // Teal action color
    backgroundDark: "#0F172A", // Slate-900
    backgroundLight: "#F8FAFC",// Slate-50
    error: "#DC2626",          // Red-600
    warning: "#F59E0B",        // Amber-500
  },

  // Transitions
  transitions: {
    fast: "0.1s ease-out",
    default: "0.15s ease-out",
    slow: "0.3s ease-out",
    spring: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};
