/**
 * Cloud Theme Tokens — Clean, Spacious, Apple-Like
 *
 * Customer portal for BS-WQM-100 device owners.
 * Generous whitespace. Sensor data as beautiful typography. One CTA per screen.
 * Mobile-first. Installers and owners use phones in the field.
 */

export const cloudColors = {
  primary: '#0066FF',
  primaryLight: '#E8F0FE',
  primaryDark: '#004DCC',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  background: '#FAFAFA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#6B7280',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  accent: '#06B6D4',
  // Interactive states
  hover: 'rgba(0, 102, 255, 0.04)',
  active: 'rgba(0, 102, 255, 0.08)',
  focus: 'rgba(0, 102, 255, 0.16)',
} as const;

export const cloudTypography = {
  display: { size: 48, lineHeight: 56, tracking: -0.02, weight: 600 },
  h1: { size: 36, lineHeight: 44, tracking: -0.02, weight: 600 },
  h2: { size: 28, lineHeight: 36, tracking: -0.01, weight: 600 },
  h3: { size: 22, lineHeight: 28, tracking: 0, weight: 600 },
  h4: { size: 18, lineHeight: 24, tracking: 0, weight: 600 },
  body: { size: 16, lineHeight: 24, tracking: 0, weight: 400 },
  bodySmall: { size: 14, lineHeight: 20, tracking: 0, weight: 400 },
  caption: { size: 12, lineHeight: 16, tracking: 0.02, weight: 500 },
  label: { size: 14, lineHeight: 16, tracking: 0.01, weight: 500 },
} as const;

// ── Type exports ──────────────────────────────────────────

export type CloudColors = typeof cloudColors;
export type CloudTypography = typeof cloudTypography;
