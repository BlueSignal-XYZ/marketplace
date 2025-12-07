// /src/styles/breakpoints.js

// Raw breakpoint values (for JS logic if you ever need it)
export const breakpoints = {
  xs: '320px',   // Small phones (iPhone SE)
  sm: '375px',   // Standard phones (iPhone 12/13/14)
  md: '428px',   // Large phones / phablets (iPhone Pro Max)
  lg: '768px',   // Tablets (iPad Mini)
  xl: '1024px',  // Small laptops / iPad Pro
  xxl: '1280px', // Desktops
};

// Legacy exports for backwards compatibility
export const mobile = breakpoints.xs;
export const tablet = breakpoints.lg;
export const laptop = breakpoints.xl;

// Enhanced media-query helpers for styled-components
export const media = {
  // Mobile-first breakpoints (min-width)
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`,

  // Legacy helpers (backwards compatibility)
  mobile: `@media (max-width: ${breakpoints.xs})`,
  tabletDown: `@media (max-width: ${breakpoints.lg})`,
  tabletUp: `@media (min-width: ${parseInt(breakpoints.lg, 10) + 1}px)`,
  laptopUp: `@media (min-width: ${breakpoints.xl})`,

  // Mobile-first helpers
  mobileOnly: `@media (max-width: ${parseInt(breakpoints.lg, 10) - 1}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl, 10) - 1}px)`,
  desktopUp: `@media (min-width: ${breakpoints.xl})`,

  // Touch/pointer detection for hover states
  touch: `@media (hover: none) and (pointer: coarse)`,
  mouse: `@media (hover: hover) and (pointer: fine)`,

  // Orientation
  portrait: `@media (orientation: portrait)`,
  landscape: `@media (orientation: landscape)`,
};

// Safe area insets for notched devices
export const safeAreaInsets = {
  top: 'env(safe-area-inset-top, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
};

// Helper function for safe area padding
export const withSafeArea = (position) => {
  if (position === 'top') return `padding-top: ${safeAreaInsets.top};`;
  if (position === 'bottom') return `padding-bottom: ${safeAreaInsets.bottom};`;
  if (position === 'both') return `
    padding-top: ${safeAreaInsets.top};
    padding-bottom: ${safeAreaInsets.bottom};
  `;
  return '';
};

// Touch target minimum size (44x44px per Apple HIG, 48x48px per Material)
export const touchTargetSize = '44px';

// Common mobile-friendly spacing
export const mobileSpacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};