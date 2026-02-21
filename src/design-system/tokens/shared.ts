/**
 * Shared design tokens — inherited by both WQT and Cloud themes.
 * Every spacing, radius, elevation, animation, and font value lives here.
 * No hardcoded design values anywhere else in the codebase.
 */

export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  section: 96,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const elevation = {
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardHover: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  modal: '0 20px 60px rgba(0,0,0,0.15)',
  none: 'none',
} as const;

export const animation = {
  fast: '150ms ease-out',
  medium: '250ms ease-out',
  slow: '400ms ease-out',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const fonts = {
  sans: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', monospace",
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Media query helpers (min-width) */
export const media = {
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
} as const;

/** Z-index scale */
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;

// ── Type exports ──────────────────────────────────────────

export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Elevation = typeof elevation;
export type Animation = typeof animation;
export type Fonts = typeof fonts;
export type Breakpoints = typeof breakpoints;
export type ZIndex = typeof zIndex;
