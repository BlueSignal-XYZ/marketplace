/**
 * EmptyState — illustration + message + single CTA.
 * Replaces wizards. "No devices? Show beautiful empty state with one CTA."
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Icon or illustration element */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Compact variant for inline empty states (inside tables, cards) */
  compact?: boolean;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ $compact }) => ($compact ? '32px 16px' : '64px 24px')};
  max-width: 400px;
  margin: 0 auto;
`;

const IconWrap = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0 0 24px;
`;

const ActionBtn = styled.button`
  padding: 10px 20px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textOnPrimary};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.animation.fast};
  &:hover { opacity: 0.9; }
`;

// ── Component ─────────────────────────────────────────────

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
}) => (
  <Container $compact={compact} className={className}>
    {icon && <IconWrap>{icon}</IconWrap>}
    <Title>{title}</Title>
    {description && <Desc>{description}</Desc>}
    {action && <ActionBtn onClick={action.onClick}>{action.label}</ActionBtn>}
  </Container>
);
