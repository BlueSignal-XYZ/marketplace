/**
 * Input — text, search, number inputs.
 * Themed via styled-components ThemeProvider.
 */

import React from 'react';
import styled, { css } from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize;
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

// ── Sizes ─────────────────────────────────────────────────

const sizeMap = {
  sm: css`height: 36px; font-size: 16px; padding: 0 10px;`,
  md: css`height: 44px; font-size: 16px; padding: 0 12px;`,
  lg: css`height: 48px; font-size: 16px; padding: 0 16px;`,
};

// ── Styled ────────────────────────────────────────────────

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InputRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconSlot = styled.span<{ $side: 'left' | 'right' }>`
  position: absolute;
  ${({ $side }) => ($side === 'left' ? 'left: 10px;' : 'right: 10px;')}
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const StyledInput = styled.input<{
  $inputSize: InputSize;
  $hasError: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
}>`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.sans};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.components.inputBg};
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? '#EF4444' : theme.components.inputBorder};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  transition: border-color ${({ theme }) => theme.animation.fast};
  outline: none;

  ${({ $inputSize }) => sizeMap[$inputSize]}
  ${({ $hasLeftIcon }) => $hasLeftIcon && css`padding-left: 36px;`}
  ${({ $hasRightIcon }) => $hasRightIcon && css`padding-right: 36px;`}

  &::placeholder { color: ${({ theme }) => theme.components.inputPlaceholder}; }

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? '#EF4444' : theme.components.inputFocusBorder};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) =>
      $hasError ? 'rgba(239,68,68,0.1)' : theme.colors.focus};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HintText = styled.span<{ $error: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ $error }) => ($error ? '#EF4444' : 'inherit')};
  color: ${({ theme, $error }) => ($error ? '#EF4444' : theme.colors.textMuted)};
`;

// ── Component ─────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = 'md', label, error, hint, icon, iconRight, fullWidth = false, ...rest }, ref) => (
    <Wrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputRow>
        {icon && <IconSlot $side="left">{icon}</IconSlot>}
        <StyledInput
          ref={ref}
          $inputSize={inputSize}
          $hasError={!!error}
          $hasLeftIcon={!!icon}
          $hasRightIcon={!!iconRight}
          {...rest}
        />
        {iconRight && <IconSlot $side="right">{iconRight}</IconSlot>}
      </InputRow>
      {(error || hint) && <HintText $error={!!error}>{error || hint}</HintText>}
    </Wrapper>
  ),
);

Input.displayName = 'Input';
