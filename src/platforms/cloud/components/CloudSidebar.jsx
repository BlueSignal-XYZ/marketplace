/**
 * CloudSidebar — Persistent left sidebar (desktop) / slide-out drawer (mobile).
 * 6 primary nav items using NavLink for active-state detection.
 */

import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cpu, MapPin, BellRing, Wrench, Settings, X } from 'lucide-react';

/* ── Constants ────────────────────────────────────────── */

const SIDEBAR_WIDTH = 240;
const DRAWER_WIDTH = 280;
const TOPBAR_HEIGHT_MOBILE = 56;
const TOPBAR_HEIGHT_DESKTOP = 64;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard/main', end: true },
  { label: 'Devices', icon: Cpu, to: '/cloud/devices' },
  { label: 'Sites', icon: MapPin, to: '/cloud/sites' },
  { label: 'Alerts', icon: BellRing, to: '/cloud/alerts' },
  { label: 'Commission', icon: Wrench, to: '/cloud/commissioning' },
  { label: 'Settings', icon: Settings, to: '/cloud/profile' },
];

/* ── Styled Components ────────────────────────────────── */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 200ms ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: none;
  }
`;

const SidebarPanel = styled.aside`
  /* Mobile: fixed drawer */
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  height: 100dvh;
  width: ${DRAWER_WIDTH}px;
  z-index: 200;
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 200ms ease-out;

  /* Shared styles */
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border-right: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;

  /* Desktop: persistent sidebar */
  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    position: fixed;
    top: ${TOPBAR_HEIGHT_DESKTOP}px;
    height: calc(100vh - ${TOPBAR_HEIGHT_DESKTOP}px);
    height: calc(100dvh - ${TOPBAR_HEIGHT_DESKTOP}px);
    width: ${SIDEBAR_WIDTH}px;
    z-index: ${({ theme }) => theme.zIndex?.nav || 50};
    transform: none;
    transition: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F3F4F6'};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: none;
  }
`;

const DrawerTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ theme }) => theme.colors?.background || '#FAFAFA'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  padding: 0;
  transition: all 200ms ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    background: ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 8px;
  flex: 1;
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius?.sm || 6}px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  position: relative;
  transition: all 200ms ease-out;

  /* Default (inactive) state */
  color: ${({ theme }) => theme.navText || theme.colors?.textSecondary || '#6B7280'};
  background: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0, 102, 255, 0.04)'};
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  }

  /* Active state via NavLink */
  &.active {
    background: ${({ theme }) => theme.navActiveBg || theme.colors?.primaryLight || '#E8F0FE'};
    color: ${({ theme }) => theme.navActiveText || theme.colors?.primary || '#0066FF'};
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: ${({ theme }) => theme.colors?.primary || '#0066FF'};
      border-radius: 0 2px 2px 0;
    }
  }
`;

const NavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const Attribution = styled.div`
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F3F4F6'};
  flex-shrink: 0;
`;

const AttributionText = styled.span`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  letter-spacing: 0.02em;
`;

/* ── Component ────────────────────────────────────────── */

export function CloudSidebar({ open, onClose }) {
  const location = useLocation();

  // Close drawer on route change (mobile)
  React.useEffect(() => {
    onClose?.();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <>
      <Backdrop $open={open} onClick={handleBackdropClick} aria-hidden="true" />
      <SidebarPanel $open={open} aria-label="Cloud navigation" role="navigation">
        {/* Mobile-only drawer header with close button */}
        <DrawerHeader>
          <DrawerTitle>BlueSignal Cloud</DrawerTitle>
          <CloseButton onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </CloseButton>
        </DrawerHeader>

        <NavList aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, icon: Icon, to, end }) => (
            <NavItemLink key={to} to={to} end={end || undefined}>
              <NavIcon>
                <Icon size={20} />
              </NavIcon>
              {label}
            </NavItemLink>
          ))}
        </NavList>

        <Attribution>
          <AttributionText>BlueSignal Cloud v2.0</AttributionText>
        </Attribution>
      </SidebarPanel>
    </>
  );
}
