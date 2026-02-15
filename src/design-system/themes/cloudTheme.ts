/**
 * Cloud Theme — composed theme object for styled-components ThemeProvider.
 *
 * Usage:
 *   import { cloudTheme } from '@/design-system/themes/cloudTheme';
 *   <ThemeProvider theme={cloudTheme}>...</ThemeProvider>
 */

import { spacing, radius, elevation, animation, fonts, media, zIndex, breakpoints } from '../tokens/shared';
import { cloudColors, cloudTypography } from '../tokens/cloud';

export const cloudTheme = {
  mode: 'cloud' as const,

  colors: cloudColors,
  typography: cloudTypography,

  spacing,
  radius,
  elevation,
  animation,
  fonts,
  media,
  zIndex,
  breakpoints,

  /** Component-level semantic tokens — mapped from color palette */
  components: {
    // Header
    headerBg: cloudColors.surface,
    headerBorder: cloudColors.border,

    // Sidebar / navigation
    navActiveBg: cloudColors.primaryLight,
    navActiveText: cloudColors.primary,
    navText: cloudColors.textSecondary,

    // Cards
    cardBg: cloudColors.surface,
    cardBorder: cloudColors.border,
    cardHoverBorder: cloudColors.primary,

    // Tables (less prominent in Cloud — Apple aesthetic)
    tableHeaderBg: cloudColors.background,
    tableRowHover: cloudColors.hover,
    tableBorder: cloudColors.borderLight,

    // Inputs
    inputBg: cloudColors.surface,
    inputBorder: cloudColors.border,
    inputFocusBorder: cloudColors.primary,
    inputPlaceholder: cloudColors.textMuted,

    // Buttons
    buttonPrimaryBg: cloudColors.primary,
    buttonPrimaryText: cloudColors.textOnPrimary,
    buttonSecondaryBg: 'transparent',
    buttonSecondaryText: cloudColors.primary,
    buttonSecondaryBorder: cloudColors.primary,
    buttonGhostHover: cloudColors.hover,

    // Badges
    badgeSuccessBg: 'rgba(16, 185, 129, 0.1)',
    badgeSuccessText: cloudColors.success,
    badgeWarningBg: 'rgba(245, 158, 11, 0.1)',
    badgeWarningText: cloudColors.warning,
    badgeErrorBg: 'rgba(239, 68, 68, 0.1)',
    badgeErrorText: cloudColors.error,
    badgeNeutralBg: cloudColors.background,
    badgeNeutralText: cloudColors.textSecondary,

    // Toast
    toastSuccessBg: '#ECFDF5',
    toastSuccessBorder: cloudColors.success,
    toastErrorBg: '#FEF2F2',
    toastErrorBorder: cloudColors.error,
    toastWarningBg: '#FFFBEB',
    toastWarningBorder: cloudColors.warning,
    toastInfoBg: cloudColors.primaryLight,
    toastInfoBorder: cloudColors.primary,

    // Skeleton
    skeletonBase: '#E5E7EB',
    skeletonShimmer: '#F3F4F6',
  },
} as const;

export type CloudTheme = typeof cloudTheme;
