/**
 * FilterChips — pill-style toggle filters.
 * Used for category filters (All, Nitrogen, Phosphorus, etc.)
 * Active chip: filled background with white text.
 * Inactive chip: outlined/ghost style.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface ChipOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  /** Optional label before chips */
  label?: string;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: 4px;
  white-space: nowrap;
`;

const Chip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  min-height: 32px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.full}px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.fast};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textOnPrimary : theme.colors.textSecondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ $active, theme }) => !$active && `background: ${theme.colors.hover};`}
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const ChipCount = styled.span<{ $active: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background: ${({ $active, theme }) =>
    $active ? 'rgba(255,255,255,0.2)' : theme.colors.background};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textOnPrimary : theme.colors.textMuted};
`;

// ── Component ─────────────────────────────────────────────

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  value,
  onChange,
  label,
  className,
}) => (
  <Container className={className}>
    {label && <Label>{label}</Label>}
    {options.map((opt) => (
      <Chip
        key={opt.value}
        $active={value === opt.value}
        onClick={() => onChange(opt.value)}
        type="button"
      >
        {opt.label}
        {opt.count !== undefined && (
          <ChipCount $active={value === opt.value}>{opt.count}</ChipCount>
        )}
      </Chip>
    ))}
  </Container>
);
