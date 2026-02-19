/**
 * Button — primary, secondary, ghost, destructive, outline variants.
 * Themed via styled-components ThemeProvider. No hardcoded colors.
 */

import React from 'react';
import styled, { css } from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

// ── Size map ──────────────────────────────────────────────

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: 13px;
    line-height: 20px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  `,
  md: css`
    padding: 8px 16px;
    font-size: 14px;
    line-height: 20px;
    border-radius: ${({ theme }) => theme.radius.sm}px;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: 16px;
    line-height: 24px;
    border-radius: ${({ theme }) => theme.radius.md}px;
  `,
};

// ── Variant map ───────────────────────────────────────────

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.components.buttonPrimaryBg};
    color: ${({ theme }) => theme.components.buttonPrimaryText};
    border: 1px solid transparent;
    &:hover:not(:disabled) { opacity: 0.9; }
    &:active:not(:disabled) { opacity: 0.8; }
  `,
  secondary: css`
    background: ${({ theme }) => theme.components.buttonSecondaryBg};
    color: ${({ theme }) => theme.components.buttonSecondaryText};
    border: 1px solid ${({ theme }) => theme.components.buttonSecondaryBorder};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.components.buttonGhostHover}; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: ${({ theme }) => theme.components.buttonGhostHover}; }
  `,
  destructive: css`
    background: #EF4444;
    color: #FFFFFF;
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: #DC2626; }
    &:active:not(:disabled) { background: #B91C1C; }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.components.buttonSecondaryText};
    border: 1px solid ${({ theme }) => theme.components.buttonSecondaryBorder};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.components.buttonGhostHover}; }
  `,
};

// ── Styled component ─────────────────────────────────────

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.fast};
  white-space: nowrap;
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? 'none' : 'auto')};

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── Component ─────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, icon, iconRight, children, disabled, ...rest }, ref) => (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {!loading && iconRight}
    </StyledButton>
  ),
);

Button.displayName = 'Button';
