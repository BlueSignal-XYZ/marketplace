/**
 * ComingSoon — clean informational placeholder for features not yet available.
 * NO error styling — this is informational, not broken.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface ComingSoonProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  /** Optional action link */
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  max-width: 420px;
`;

const ActionLink = styled.button`
  margin-top: 20px;
  padding: 8px 16px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

// ── Component ─────────────────────────────────────────────

export const ComingSoon: React.FC<ComingSoonProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <Container className={className}>
    {icon && <IconWrap>{icon}</IconWrap>}
    <Title>{title}</Title>
    <Desc>{description}</Desc>
    {action && (
      <ActionLink onClick={action.onClick}>{action.label}</ActionLink>
    )}
  </Container>
);
