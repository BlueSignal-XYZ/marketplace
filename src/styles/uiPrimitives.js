/**
 * uiPrimitives.js — Shared, theme-aware styled components for BlueSignal.
 *
 * Every primitive reads from the styled-components ThemeProvider
 * (`props.theme`) so colours, radii, shadows, spacing, and transitions
 * stay consistent across Cloud and Marketplace modes.
 *
 * Import what you need:
 *   import { PageShell, LoadingContainer, Spinner, EmptyStateContainer, ... } from '../../styles/uiPrimitives';
 */

import styled, { keyframes } from 'styled-components';

/* ------------------------------------------------------------------ */
/*  Keyframes                                                          */
/* ------------------------------------------------------------------ */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ------------------------------------------------------------------ */
/*  Page Layout                                                        */
/* ------------------------------------------------------------------ */

/** Full-viewport page wrapper with the standard surface gradient. */
export const PageShell = styled.div`
  min-height: 100vh;
  padding: 80px 20px 40px;
  background: ${({ theme }) => theme.gradients?.surface || 'linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 100%)'};

  @media (max-width: 768px) {
    padding: 70px 16px 24px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: ${({ $maxWidth }) => $maxWidth || '1200px'};
  margin: 0 auto;
`;

/* ------------------------------------------------------------------ */
/*  Typography                                                         */
/* ------------------------------------------------------------------ */

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  max-width: 600px;
`;

export const SectionHeading = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;
`;

/* ------------------------------------------------------------------ */
/*  Cards                                                              */
/* ------------------------------------------------------------------ */

export const Card = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ theme }) => theme.transitions.default};

  ${({ $hoverable }) => $hoverable && `
    cursor: pointer;
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  `}
`;

export const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

/* ------------------------------------------------------------------ */
/*  Filter Chips                                                       */
/* ------------------------------------------------------------------ */

export const FilterChip = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary500 : theme.colors.ui200};
  background: ${({ theme, $active }) => $active ? theme.colors.primary500 : '#fff'};
  color: ${({ theme, $active }) => $active ? '#fff' : theme.colors.ui600};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme, $active }) => $active ? theme.colors.primary600 : theme.colors.ui50};
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

/* ------------------------------------------------------------------ */
/*  Status Badges                                                      */
/* ------------------------------------------------------------------ */

const statusColors = {
  active:   { bg: 'success100', text: 'success800' },
  verified: { bg: 'success100', text: 'success800' },
  enrolled: { bg: 'success100', text: 'success800' },
  upcoming: { bg: 'warning100', text: 'warning800' },
  pending:  { bg: 'warning100', text: 'warning800' },
  'pending-review': { bg: 'warning100', text: 'warning800' },
  listed:   { bg: 'primary100', text: 'primary700' },
  closed:   { bg: 'ui200', text: 'ui600' },
  sold:     { bg: 'ui200', text: 'ui600' },
  suspended:{ bg: 'red100', text: 'red700' },
  retired:  { bg: 'red100', text: 'red700' },
  withdrawn:{ bg: 'ui200', text: 'ui600' },
};

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ theme, $status }) => {
    const map = statusColors[$status];
    return map ? theme.colors[map.bg] : theme.colors.ui100;
  }};
  color: ${({ theme, $status }) => {
    const map = statusColors[$status];
    return map ? theme.colors[map.text] : theme.colors.ui700;
  }};
`;

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

export const PrimaryButton = styled.button`
  padding: ${({ $size }) => $size === 'lg' ? '16px 24px' : '10px 20px'};
  background: ${({ theme, disabled }) => disabled
    ? theme.colors.ui400
    : theme.gradients.primary};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: ${({ $size }) => $size === 'lg' ? '16px' : '14px'};
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

export const SecondaryButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary500};
  border: 1px solid ${({ theme }) => theme.colors.primary500};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.success50};
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.ui600};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.ui50};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

/* ------------------------------------------------------------------ */
/*  Loading                                                            */
/* ------------------------------------------------------------------ */

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
`;

export const Spinner = styled.div`
  width: ${({ $size }) => $size || '40px'};
  height: ${({ $size }) => $size || '40px'};
  border: 4px solid ${({ theme }) => theme.colors.ui200};
  border-top-color: ${({ theme }) => theme.colors.primary500};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/**
 * Drop-in loading state.
 * Usage: Import LoadingContainer + Spinner and compose in JSX:
 *   <LoadingContainer><Spinner /></LoadingContainer>
 * Or use the convenience wrapper LoadingSpinner in a .jsx file.
 */

/* ------------------------------------------------------------------ */
/*  Empty / Error States                                               */
/* ------------------------------------------------------------------ */

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const EmptyStateTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 16px 0 8px 0;
`;

export const EmptyStateText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 24px 0;
`;

export const ErrorBanner = styled.div`
  background: ${({ theme }) => theme.colors.red50};
  border: 1px solid ${({ theme }) => theme.colors.red200};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 16px 20px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.red600};
  font-size: 14px;
`;

export const SuccessBanner = styled.div`
  background: ${({ theme }) => theme.colors.success100};
  border: 1px solid ${({ theme }) => theme.colors.success300};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.success800};
  font-size: 15px;
  font-weight: 500;
`;

export const WarningBanner = styled.div`
  text-align: center;
  padding: 40px;
  background: ${({ theme }) => theme.colors.warning100};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  margin-top: 24px;

  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.warning800};
    margin: 0 0 16px 0;
  }
`;

/* ------------------------------------------------------------------ */
/*  Notification type colours                                          */
/* ------------------------------------------------------------------ */

export const notificationTypeColor = (type, theme) => {
  switch (type) {
    case 'trading-program-available': return theme.colors.success500;
    case 'credit-generated':         return theme.colors.primary400;
    case 'alert':                    return theme.colors.red500;
    case 'enrollment-update':        return theme.colors.warning500;
    default:                         return theme.colors.ui400;
  }
};
