/**
 * WQTTopBar — Slim persistent top bar for waterquality.trading app routes.
 * Left: WQT logo, Center (desktop >=1024px): search placeholder, Right: notification bell + user avatar dropdown.
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Search, User, ChevronDown, LogOut } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import NotificationBell from '../../../components/shared/NotificationBell';

/* ── WQT Logo (reused from MarketplaceHeader) ─────────── */

const WQTLogo = ({ height = 36 }) => {
  const scale = height / 48;
  const width = 320 * scale;
  return (
    <svg width={width} height={height} viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z" fill="#0F4C81"/>
        <path d="M16 30L20 26L24 32L28 24L32 28" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M20 34L23 37L29 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      <text x="50" y="32" fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="22" fill="#0F4C81">
        <tspan fontWeight="700">WaterQuality</tspan><tspan fontWeight="400" fill="#0EA5E9">.Trading</tspan>
      </text>
    </svg>
  );
};

/* ── Animations ────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Styled Components ─────────────────────────────────── */

const TopBarOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex?.nav || 50};
  width: 100%;
  height: 56px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    height: 64px;
    padding: 0 24px;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 200ms ease-out;

  &:hover {
    transform: scale(1.02);
  }

  svg {
    display: block;
  }
`;

const SearchWrapper = styled.div`
  display: none;
  flex: 1;
  max-width: 480px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints?.lg || 1024}px) {
    display: flex;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  gap: 8px;
  background: ${({ theme }) => theme.colors?.background || '#F7F8FA'};
  border: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F0F1F3'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  transition: all 200ms ease-out;
  cursor: text;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.focus || 'rgba(0, 82, 204, 0.16)'};
  }
`;

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  flex-shrink: 0;
`;

const SearchField = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};

  &::placeholder {
    color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  flex-shrink: 0;
`;

/* ── User Avatar Dropdown ──────────────────────────────── */

const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  cursor: pointer;
  transition: all 200ms ease-out;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0, 82, 204, 0.04)'};
  }
`;

const AvatarCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius?.full || 9999}px;
  background: ${({ theme }) => theme.colors?.primaryLight || '#E6EEFA'};
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
`;

const AvatarChevron = styled(ChevronDown)`
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  transition: transform 200ms ease-out;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: ${({ theme }) => theme.radius?.md || 12}px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  animation: ${fadeIn} 150ms ease-out;
  z-index: ${({ theme }) => theme.zIndex?.dropdown || 100};
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radius?.sm || 6}px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  transition: all 200ms ease-out;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0, 82, 204, 0.04)'};
  }

  svg {
    color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
    flex-shrink: 0;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors?.borderLight || '#F0F1F3'};
  margin: 4px 0;
`;

const UserDropdownWrapper = styled.div`
  position: relative;
`;

/* ── Component ─────────────────────────────────────────── */

export function WQTTopBar() {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : null;

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    if (ACTIONS?.handleLogOut) {
      ACTIONS.handleLogOut();
    } else if (ACTIONS?.logout) {
      ACTIONS.logout();
    }
  };

  return (
    <TopBarOuter>
      <LogoLink href="/" aria-label="WaterQuality.Trading">
        <WQTLogo height={32} />
      </LogoLink>

      <SearchWrapper>
        <SearchInput>
          <SearchIcon size={16} />
          <SearchField
            type="text"
            placeholder="Search credits, projects, registries..."
            aria-label="Search"
          />
        </SearchInput>
      </SearchWrapper>

      <RightGroup>
        <NotificationBell />

        <UserDropdownWrapper ref={dropdownRef}>
          <AvatarButton
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <AvatarCircle>
              {userInitial || <User size={16} />}
            </AvatarCircle>
            <AvatarChevron size={14} $open={dropdownOpen} />
          </AvatarButton>

          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem onClick={() => handleNavigate('/profile')}>
                <User size={16} />
                Profile
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserDropdownWrapper>
      </RightGroup>
    </TopBarOuter>
  );
}
