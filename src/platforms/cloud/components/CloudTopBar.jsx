/**
 * CloudTopBar — Slim persistent top bar for the Cloud platform.
 * Shows logo + "Cloud" badge, demo toggle, notification bell, user avatar.
 * On mobile (<768px), includes a hamburger button to toggle the sidebar drawer.
 */

import React from 'react';
import styled from 'styled-components';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Inline SVG logo — the blue curved lines mark from bluesignal.xyz
const BlueSignalLogoSVG = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="BlueSignal"
  >
    <path
      d="M4 8 C8 5, 16 5, 24 8"
      stroke="#2d8cf0"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M4 14 C8 11, 16 11, 24 14"
      stroke="#2d8cf0"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M4 20 C8 17, 16 17, 24 20"
      stroke="#2d8cf0"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
import NotificationBell from '../../../components/shared/NotificationBell';
import { useAppContext } from '../../../context/AppContext';
import { isDemoMode, setDemoMode } from '../../../utils/demoMode';

/* ── Styled Components ────────────────────────────────── */

const TopBarOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex?.nav || 50};
  width: 100%;
  height: 56px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    height: 64px;
    padding: 0 24px;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  padding: 0;
  transition: all 200ms ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0, 102, 255, 0.04)'};
    color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || '#0066FF'};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: none;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  letter-spacing: -0.01em;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    font-size: 18px;
  }
`;

const CloudBadge = styled.span`
  display: none;
  padding: 3px 8px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  background: ${({ theme }) => theme.colors?.primaryLight || '#E8F0FE'};
  color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: ${({ theme }) => theme.radius?.sm || 6}px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: inline-flex;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ── Demo Toggle ──────────────────────────────────────── */

const DemoToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: ${({ theme }) => theme.radius?.full || 9999}px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors?.primary || '#0066FF' : theme.colors?.border || '#E5E7EB'};
  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary || '#0066FF' : theme.colors?.background || '#FAFAFA'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors?.textOnPrimary || '#FFFFFF' : theme.colors?.textSecondary || '#9CA3AF'};
  cursor: pointer;
  transition: all 200ms ease-out;
  white-space: nowrap;
  min-height: 28px;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || '#0066FF'};
    outline-offset: 2px;
  }
`;

const DemoDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#FFFFFF' : '#D1D5DB')};
  transition: background 200ms ease-out;
`;

/* ── User Avatar / Dropdown ───────────────────────────── */

const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  border: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F3F4F6'};
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border-radius: ${({ theme }) => theme.radius?.full || 9999}px;
  cursor: pointer;
  transition: all 200ms ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.border || '#E5E7EB'};
    background: ${({ theme }) => theme.colors?.background || '#FAFAFA'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || '#0066FF'};
    outline-offset: 2px;
  }
`;

const AvatarCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors?.primaryLight || '#E8F0FE'};
  color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarName = styled.span`
  display: none;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: block;
  }
`;

const AvatarChevron = styled.span`
  display: none;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    display: flex;
    align-items: center;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  z-index: ${({ theme }) => theme.zIndex?.dropdown || 100};
  padding: 4px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius?.sm || 6}px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors?.error || '#EF4444' : theme.colors?.text || '#1A1A1A'};
  transition: background 200ms ease-out;

  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? '#FEF2F2' : theme.colors?.hover || 'rgba(0, 102, 255, 0.04)'};
  }
`;

/* ── Component ────────────────────────────────────────── */

export function CloudTopBar({ onMenuToggle }) {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const demoActive = isDemoMode();

  const handleDemoToggle = () => {
    setDemoMode(!demoActive);
    window.location.reload();
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.displayName || user?.username || user?.email || 'User';

  return (
    <TopBarOuter>
      <LeftGroup>
        <HamburgerButton onClick={onMenuToggle} aria-label="Toggle navigation menu">
          <Menu size={22} />
        </HamburgerButton>

        <LogoLink href="/dashboard/main" aria-label="BlueSignal Cloud — Go to dashboard">
          <BlueSignalLogoSVG size={30} />
          <LogoText>BlueSignal</LogoText>
          <CloudBadge>Cloud</CloudBadge>
        </LogoLink>
      </LeftGroup>

      <RightGroup>
        <DemoToggle
          $active={demoActive}
          onClick={handleDemoToggle}
          aria-label={demoActive ? 'Disable demo mode' : 'Enable demo mode'}
          title={demoActive ? 'Demo mode ON — click to disable' : 'Click to enable demo mode'}
        >
          <DemoDot $active={demoActive} />
          Demo
        </DemoToggle>

        <NotificationBell />

        {user?.uid && (
          <DropdownWrapper ref={dropdownRef}>
            <AvatarButton
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <AvatarCircle>
                <User size={14} />
              </AvatarCircle>
              <AvatarName>{displayName}</AvatarName>
              <AvatarChevron>
                <ChevronDown size={14} />
              </AvatarChevron>
            </AvatarButton>

            {dropdownOpen && (
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/cloud/profile');
                  }}
                >
                  <User size={16} />
                  Profile & Settings
                </DropdownItem>
                <DropdownItem
                  $danger
                  onClick={() => {
                    setDropdownOpen(false);
                    ACTIONS.handleLogOut();
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownWrapper>
        )}
      </RightGroup>
    </TopBarOuter>
  );
}
