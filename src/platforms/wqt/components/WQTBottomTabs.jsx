/**
 * WQTBottomTabs — Fixed bottom tab bar for mobile (<768px) on waterquality.trading app routes.
 * 5 tabs matching sidebar items, stacked icon + label layout.
 */

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Home, TrendingUp, ShieldCheck, Globe, Wallet } from 'lucide-react';

/* ── Constants ─────────────────────────────────────────── */

const TAB_BAR_HEIGHT = 56;

const TAB_ITEMS = [
  { label: 'Home', icon: Home, to: '/dashboard' },
  { label: 'Market', icon: TrendingUp, to: '/marketplace' },
  { label: 'Registry', icon: ShieldCheck, to: '/registry' },
  { label: 'Map', icon: Globe, to: '/map' },
  { label: 'Account', icon: Wallet, to: '/profile' },
];

/* ── Styled Components ─────────────────────────────────── */

const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${TAB_BAR_HEIGHT}px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
  z-index: ${({ theme }) => theme.zIndex?.nav || 50};
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: none;
  }
`;

const TabLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  text-decoration: none;
  color: ${({ theme }) => theme.components?.navText || theme.colors?.textSecondary || '#6B7280'};
  transition: color 200ms ease-out;
  -webkit-tap-highlight-color: transparent;

  svg {
    transition: color 200ms ease-out;
  }

  &.active {
    color: ${({ theme }) => theme.components?.navActiveText || theme.colors?.primary || '#0052CC'};

    svg {
      color: ${({ theme }) =>
        theme.components?.navActiveText || theme.colors?.primary || '#0052CC'};
    }
  }
`;

const TabLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
`;

/* ── Component ─────────────────────────────────────────── */

export function WQTBottomTabs() {
  return (
    <TabBarContainer aria-label="Main navigation">
      {TAB_ITEMS.map(({ label, icon: Icon, to }) => (
        <TabLink key={to} to={to} end={to === '/marketplace' || to === '/dashboard'}>
          <Icon size={20} />
          <TabLabel>{label}</TabLabel>
        </TabLink>
      ))}
    </TabBarContainer>
  );
}

export { TAB_BAR_HEIGHT };
