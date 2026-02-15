/**
 * WQT Theme — composed theme object for styled-components ThemeProvider.
 *
 * Usage:
 *   import { wqtTheme } from '@/design-system/themes/wqtTheme';
 *   <ThemeProvider theme={wqtTheme}>...</ThemeProvider>
 */

import { spacing, radius, elevation, animation, fonts, media, zIndex, breakpoints } from '../tokens/shared';
import { wqtColors, wqtTypography } from '../tokens/wqt';

export const wqtTheme = {
  mode: 'wqt' as const,

  colors: wqtColors,
  typography: wqtTypography,

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
    headerBg: wqtColors.surface,
    headerBorder: wqtColors.border,

    // Sidebar / navigation
    navActiveBg: wqtColors.primaryLight,
    navActiveText: wqtColors.primary,
    navText: wqtColors.textSecondary,

    // Cards
    cardBg: wqtColors.surface,
    cardBorder: wqtColors.border,
    cardHoverBorder: wqtColors.primary,

    // Tables
    tableHeaderBg: wqtColors.background,
    tableRowHover: wqtColors.hover,
    tableBorder: wqtColors.borderLight,

    // Inputs
    inputBg: wqtColors.surface,
    inputBorder: wqtColors.border,
    inputFocusBorder: wqtColors.primary,
    inputPlaceholder: wqtColors.textMuted,

    // Buttons
    buttonPrimaryBg: wqtColors.primary,
    buttonPrimaryText: wqtColors.textOnPrimary,
    buttonSecondaryBg: 'transparent',
    buttonSecondaryText: wqtColors.primary,
    buttonSecondaryBorder: wqtColors.primary,
    buttonGhostHover: wqtColors.hover,

    // Badges
    badgeVerifiedBg: 'rgba(139, 92, 246, 0.1)',
    badgeVerifiedText: wqtColors.verified,
    badgePositiveBg: 'rgba(16, 185, 129, 0.1)',
    badgePositiveText: wqtColors.positive,
    badgeNegativeBg: 'rgba(239, 68, 68, 0.1)',
    badgeNegativeText: wqtColors.negative,
    badgeWarningBg: 'rgba(245, 158, 11, 0.1)',
    badgeWarningText: wqtColors.warning,
    badgeNeutralBg: wqtColors.background,
    badgeNeutralText: wqtColors.textSecondary,

    // Toast
    toastSuccessBg: '#ECFDF5',
    toastSuccessBorder: wqtColors.positive,
    toastErrorBg: '#FEF2F2',
    toastErrorBorder: wqtColors.negative,
    toastWarningBg: '#FFFBEB',
    toastWarningBorder: wqtColors.warning,
    toastInfoBg: wqtColors.primaryLight,
    toastInfoBorder: wqtColors.primary,

    // Skeleton
    skeletonBase: '#E5E7EB',
    skeletonShimmer: '#F3F4F6',
  },
} as const;

export type WQTTheme = typeof wqtTheme;
