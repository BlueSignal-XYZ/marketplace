/**
 * Badge — status badges for verified, pending, rejected, online, offline, etc.
 * Themed via styled-components ThemeProvider.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export type BadgeVariant =
  | 'positive' // verified, online, approved
  | 'negative' // rejected, offline, error
  | 'warning' // pending, low battery
  | 'neutral' // default, inactive
  | 'verified' // blockchain-verified — purple (WQT only)
  | 'info'; // informational — primary color

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  children: React.ReactNode;
}

// ── Color resolver ────────────────────────────────────────

function getColors(variant: BadgeVariant, theme: import('styled-components').DefaultTheme) {
  const c = theme.components as Record<string, string>;
  switch (variant) {
    case 'positive':
      return {
        bg: c.badgePositiveBg ?? c.badgeSuccessBg,
        text: c.badgePositiveText ?? c.badgeSuccessText,
      };
    case 'negative':
      return {
        bg: c.badgeNegativeBg ?? c.badgeErrorBg,
        text: c.badgeNegativeText ?? c.badgeErrorText,
      };
    case 'warning':
      return { bg: c.badgeWarningBg, text: c.badgeWarningText };
    case 'neutral':
      return { bg: c.badgeNeutralBg, text: c.badgeNeutralText };
    case 'verified':
      return {
        bg: c.badgeVerifiedBg ?? 'rgba(139,92,246,0.1)',
        text: c.badgeVerifiedText ?? '#8B5CF6',
      };
    case 'info':
      return { bg: theme.colors.primaryLight, text: theme.colors.primary };
    default:
      return { bg: c.badgeNeutralBg, text: c.badgeNeutralText };
  }
}

// ── Styled ────────────────────────────────────────────────

const StyledBadge = styled.span<{
  $variant: BadgeVariant;
  $size: BadgeSize;
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 600;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background: ${({ theme, $variant }) => getColors($variant, theme).bg};
  color: ${({ theme, $variant }) => getColors($variant, theme).text};
  font-size: ${({ $size }) => ($size === 'sm' ? '11px' : '12px')};
  line-height: 1;
  padding: ${({ $size }) => ($size === 'sm' ? '3px 8px' : '4px 10px')};
  letter-spacing: 0.02em;
`;

const Dot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $variant }) => getColors($variant, theme).text};
  flex-shrink: 0;
`;

// ── Component ─────────────────────────────────────────────

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  children,
}) => (
  <StyledBadge $variant={variant} $size={size}>
    {dot && <Dot $variant={variant} />}
    {icon}
    {children}
  </StyledBadge>
);
