/**
 * DataCard — large number + label + optional trend/sparkline.
 * Core widget for dashboards (both WQT and Cloud).
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface DataCardProps {
  label: string;
  value: string | number;
  /** Formatted change string, e.g. "+2.4%" */
  change?: string;
  /** Positive or negative trend */
  trend?: 'up' | 'down' | 'neutral';
  /** Unit suffix, e.g. "kg", "$/credit" */
  unit?: string;
  /** Optional icon to the left of label */
  icon?: React.ReactNode;
  /** Compact size for dense layouts */
  compact?: boolean;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Card = styled.div<{ $compact: boolean }>`
  background: ${({ theme }) => theme.components.cardBg};
  border: 1px solid ${({ theme }) => theme.components.cardBorder};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ $compact }) => ($compact ? '14px 16px' : '20px 24px')};
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => ($compact ? '6px' : '8px')};
  transition: box-shadow ${({ theme }) => theme.animation.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.elevation.cardHover};
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LabelIcon = styled.span`
  display: flex;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Value = styled.span<{ $compact: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ $compact }) => ($compact ? '24px' : '32px')};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Unit = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Change = styled.span<{ $trend: 'up' | 'down' | 'neutral' }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ $trend, theme }) => {
    if ($trend === 'up') return theme.colors.positive ?? theme.colors.success;
    if ($trend === 'down') return theme.colors.negative ?? theme.colors.error;
    return theme.colors.textMuted;
  }};
`;

// ── Component ─────────────────────────────────────────────

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  change,
  trend = 'neutral',
  unit,
  icon,
  compact = false,
  className,
}) => (
  <Card $compact={compact} className={className}>
    <LabelRow>
      {icon && <LabelIcon>{icon}</LabelIcon>}
      <Label>{label}</Label>
    </LabelRow>
    <ValueRow>
      <Value $compact={compact}>{value}</Value>
      {unit && <Unit>{unit}</Unit>}
      {change && <Change $trend={trend}>{change}</Change>}
    </ValueRow>
  </Card>
);
