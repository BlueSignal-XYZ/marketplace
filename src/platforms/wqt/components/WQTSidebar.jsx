/**
 * WQTSidebar — Persistent left sidebar for desktop (>=768px) on waterquality.trading app routes.
 * 5 nav items with active state via NavLink. Shows only on desktop.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Home, TrendingUp, ShieldCheck, Globe, Wallet } from 'lucide-react';

/* ── Constants ─────────────────────────────────────────── */

const SIDEBAR_WIDTH = 240;
const SIDEBAR_WIDTH_TABLET = 68;

const NAV_ITEMS = [
  { label: 'Home', icon: Home, to: '/dashboard' },
  { label: 'Market', icon: TrendingUp, to: '/marketplace' },
  { label: 'Registry', icon: ShieldCheck, to: '/registry' },
  { label: 'Map', icon: Globe, to: '/map' },
  { label: 'Account', icon: Wallet, to: '/profile' },
];

/* ── Styled Components ─────────────────────────────────── */

const SidebarContainer = styled.nav`
  display: none;
  position: fixed;
  top: 64px; /* below top bar on desktop */
  left: 0;
  bottom: 0;
  width: ${SIDEBAR_WIDTH}px;
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border-right: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  z-index: ${({ theme }) => theme.zIndex?.nav || 50};
  flex-direction: column;
  padding: 16px 12px;
  overflow-y: auto;
  transition: width 200ms ease-out, padding 200ms ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: flex;
    width: ${SIDEBAR_WIDTH_TABLET}px;
    padding: 16px 8px;
    align-items: center;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.lg || 1024}px) {
    width: ${SIDEBAR_WIDTH}px;
    padding: 16px 12px;
    align-items: stretch;
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const NavLabel = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints?.lg || 1024}px) {
    display: inline;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.components?.navText || theme.colors?.textSecondary || '#6B7280'};
  transition: all 200ms ease-out;
  position: relative;
  border-left: 3px solid transparent;

  /* Tablet: center icon in narrow rail */
  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) and (max-width: ${({ theme }) => (theme.breakpoints?.lg || 1024) - 1}px) {
    justify-content: center;
    padding: 0;
    width: 48px;
    height: 48px;
    border-left: none;
    border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  }

  svg {
    flex-shrink: 0;
    transition: color 200ms ease-out;
  }

  &:hover {
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0, 82, 204, 0.04)'};
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  }

  &.active {
    background: ${({ theme }) => theme.components?.navActiveBg || theme.colors?.primaryLight || '#E6EEFA'};
    color: ${({ theme }) => theme.components?.navActiveText || theme.colors?.primary || '#0052CC'};
    border-left-color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
    font-weight: 600;

    /* Tablet: no left border indicator, use background only */
    @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) and (max-width: ${({ theme }) => (theme.breakpoints?.lg || 1024) - 1}px) {
      border-left-color: transparent;
    }

    svg {
      color: ${({ theme }) => theme.components?.navActiveText || theme.colors?.primary || '#0052CC'};
    }
  }
`;

const VersionText = styled.div`
  padding: 12px 16px;
  font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  opacity: 0.6;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) and (max-width: ${({ theme }) => (theme.breakpoints?.lg || 1024) - 1}px) {
    display: none;
  }
`;

/* ── Component ─────────────────────────────────────────── */

export function WQTSidebar() {
  return (
    <SidebarContainer aria-label="Main navigation">
      <NavList>
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <StyledNavLink
            key={to}
            to={to}
            end={to === '/marketplace' || to === '/dashboard'}
            title={label}
          >
            <Icon size={20} />
            <NavLabel>{label}</NavLabel>
          </StyledNavLink>
        ))}
      </NavList>
      <VersionText>WQT v1.0</VersionText>
    </SidebarContainer>
  );
}

export { SIDEBAR_WIDTH, SIDEBAR_WIDTH_TABLET };
