/**
 * SegmentedControl — toggle between 2-4 options.
 * Used for Map/List toggle, time range selection, etc.
 * Looks like a single connected component (not separate buttons).
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  /** Compact size */
  size?: 'sm' | 'md';
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
`;

const Segment = styled.button<{ $active: boolean; $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${({ $size }) => ($size === 'sm' ? '6px 12px' : '8px 16px')};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ $size }) => ($size === 'sm' ? '12px' : '13px')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  white-space: nowrap;
  cursor: pointer;
  border: none;
  transition: all ${({ theme }) => theme.animation.fast};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textOnPrimary : theme.colors.textSecondary};

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover:not([data-active='true']) {
    background: ${({ theme }) => theme.colors.hover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

// ── Component ─────────────────────────────────────────────

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className,
}) => (
  <Container className={className}>
    {options.map((opt) => (
      <Segment
        key={opt.value}
        $active={value === opt.value}
        $size={size}
        data-active={value === opt.value}
        onClick={() => onChange(opt.value)}
        type="button"
      >
        {opt.icon}
        {opt.label}
      </Segment>
    ))}
  </Container>
);
