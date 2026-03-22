/**
 * MarketplaceHeader — sticky header for waterquality.trading.
 * Inline nav links for primary sections + hamburger for mobile.
 *
 * Nav items: Marketplace · How It Works · Solutions ▾ · Credit Registry · [Get Started]
 */

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import NotificationBell from "../shared/NotificationBell";
import { APP_NAME } from "../../constants/constants";
import { useAppContext } from "../../context/AppContext";
import { isDemoMode, setDemoMode } from "../../utils/demoMode";

// Inline SVG logo component for crisp rendering at all sizes
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

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.3s ease-out;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (min-width: 768px) {
    height: 72px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
`;

const LogoWrapper = styled.a`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const LogoSvgWrapper = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.02);
  }

  svg {
    display: block;
  }
`;

const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 4px;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? (theme.colors?.primary || '#0052CC') : (theme.colors?.textSecondary || '#64748B')};
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;
  ${({ $active, theme }) => $active ? `border-bottom: 2px solid ${theme.colors?.primary || '#0052CC'};` : ''}

  &:hover {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0,82,204,0.04)'};
  }
`;

// ── Desktop Solutions dropdown (light theme) ────────────

const dropdownFadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.button`
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.textSecondary || '#64748B'};
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover,
  &[aria-expanded="true"] {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0,82,204,0.04)'};
  }
`;

const ChevronIcon = styled(FontAwesomeIcon)`
  font-size: 10px;
  transition: transform 200ms;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  background: #FFFFFF;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  animation: ${dropdownFadeIn} 150ms ease-out;
  z-index: 100;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 10px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.textSecondary || '#64748B'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0,82,204,0.04)'};
  }
`;

const SOLUTIONS_ITEMS = [
  { label: "For Utilities", href: "/for-utilities" },
  { label: "For Homeowners", href: "/for-homeowners" },
  { label: "For Aggregators", href: "/for-aggregators" },
  { label: "For Credit Generators", href: "/generate-credits" },
];

function SolutionsDropdownLight() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <DropdownWrapper
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownTrigger
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((p) => !p)}
      >
        Solutions
        <ChevronIcon icon={faChevronDown} $open={open} />
      </DropdownTrigger>
      {open && (
        <DropdownPanel>
          {SOLUTIONS_ITEMS.map((item) => (
            <DropdownItem
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownPanel>
      )}
    </DropdownWrapper>
  );
}

const SignUpButton = styled.a`
  display: none;
  align-items: center;
  padding: 8px 20px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  background: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  border-radius: 8px;
  text-decoration: none;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors?.primaryDark || '#003D99'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 82, 204, 0.25);
  }

  @media (min-width: 768px) {
    display: inline-flex;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuButton = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 12px;
  background: transparent;
  border: 1.5px solid transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors?.text || "#1A1A1A"};
  font-size: 20px;
  line-height: 1;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || "#0052CC"};
    background: ${({ theme }) => theme.colors?.hover || "rgba(0,82,204,0.04)"};
    border-color: ${({ theme }) => theme.colors?.border || "#E2E4E9"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || "#0052CC"};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const DemoToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? '#0052CC' : '#E5E7EB')};
  background: ${({ $active }) => ($active ? '#0052CC' : '#FAFAFA')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#9CA3AF')};
  cursor: pointer;
  transition: all 0.2s ease-out;
  white-space: nowrap;
  min-height: 28px;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const DemoDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#FFFFFF' : '#D1D5DB')};
  transition: background 0.2s;
`;

export function MarketplaceHeader({ onMenuClick }) {
  const { STATES } = useAppContext();
  const location = useLocation();
  const isSignedIn = !!STATES?.user?.uid;
  const ctaHref = isSignedIn ? "/marketplace" : "/login";
  const demoActive = isDemoMode();
  const pathname = location.pathname;

  const handleClick = () => {
    if (onMenuClick) onMenuClick();
  };

  const handleDemoToggle = () => {
    setDemoMode(!demoActive);
    window.location.reload();
  };

  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoWrapper href="/" aria-label={APP_NAME || "WaterQuality.Trading"}>
          <LogoSvgWrapper>
            <WQTLogo height={36} />
          </LogoSvgWrapper>
        </LogoWrapper>

        <NavLinks aria-label="Main navigation">
          <NavLink href="/marketplace" $active={pathname === '/marketplace'}>Marketplace</NavLink>
          <NavLink href="/registry" $active={pathname === '/registry'}>Credit Registry</NavLink>
          <NavLink href="/map" $active={pathname === '/map'}>Project Map</NavLink>
          <NavLink href="/programs" $active={pathname === '/programs' || pathname.startsWith('/programs/')}>Programs</NavLink>
        </NavLinks>

        <RightGroup>
          <SignUpButton href={ctaHref}>{isSignedIn ? 'Dashboard' : 'Sign In'}</SignUpButton>
          <NotificationBell />
          <MenuButton onClick={handleClick} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MenuButton>
        </RightGroup>
      </HeaderInner>
    </HeaderOuter>
  );
}
