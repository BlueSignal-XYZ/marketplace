/**
 * WQT Theme Tokens — Data-Dense, Financial, Authoritative
 *
 * Think Bloomberg Terminal meets Senken.io.
 * Deep blue primary. Monospace numbers. Tables over cards.
 * Desktop-first. Terminal users on desktops.
 */

export const wqtColors = {
  primary: '#0052CC',
  primaryLight: '#E6EEFA',
  primaryDark: '#003D99',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  background: '#F7F8FA',         // Cool gray — terminal feel
  backgroundDark: '#1B1F2A',     // For optional dark data panels
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  border: '#E2E4E9',
  borderLight: '#F0F1F3',
  positive: '#10B981',           // Price up, verified, online
  negative: '#EF4444',           // Price down, rejected, offline
  warning: '#F59E0B',
  water: '#06B6D4',              // Environmental accent
  verified: '#8B5CF6',           // Blockchain-verified badge — purple
  // Interactive states
  hover: 'rgba(0, 82, 204, 0.04)',
  active: 'rgba(0, 82, 204, 0.08)',
  focus: 'rgba(0, 82, 204, 0.16)',
} as const;

export const wqtTypography = {
  display:   { size: 56, lineHeight: 64, tracking: -0.03, weight: 700 },
  h1:        { size: 40, lineHeight: 48, tracking: -0.02, weight: 700 },
  h2:        { size: 30, lineHeight: 38, tracking: -0.02, weight: 600 },
  h3:        { size: 22, lineHeight: 28, tracking: 0,     weight: 600 },
  h4:        { size: 18, lineHeight: 24, tracking: 0,     weight: 600 },
  body:      { size: 15, lineHeight: 24, tracking: 0,     weight: 400 },  // Tighter for density
  bodySmall: { size: 13, lineHeight: 20, tracking: 0,     weight: 400 },
  caption:   { size: 11, lineHeight: 16, tracking: 0.04,  weight: 600, transform: 'uppercase' as const },
  dataLarge: { size: 32, lineHeight: 40, tracking: -0.02, weight: 700, font: 'mono' as const },
  dataSmall: { size: 14, lineHeight: 20, tracking: 0,     weight: 500, font: 'mono' as const },
  label:     { size: 13, lineHeight: 16, tracking: 0.02,  weight: 500 },
} as const;

// ── Type exports ──────────────────────────────────────────

export type WQTColors = typeof wqtColors;
export type WQTTypography = typeof wqtTypography;
