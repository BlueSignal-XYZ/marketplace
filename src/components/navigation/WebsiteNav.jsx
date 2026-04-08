/**
 * WebsiteNav — clean, minimal navigation for WQT marketing/content pages.
 * Dark/transparent background that blends with the dark hero sections.
 *
 * Nav items: Marketplace · How It Works · Solutions ▾ · Credit Registry · [Get Started]
 * Solutions dropdown contains: For Utilities, For Homeowners, For Aggregators, For Generators
 */

import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../context/AppContext';
import { isDemoMode, setDemoMode } from '../../utils/demoMode';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dropdownFadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NavOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: rgba(11, 17, 32, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  animation: ${fadeIn} 0.3s ease-out;
`;

const NavInner = styled.div`
  max-width: 1100px;
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

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
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
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.06);
  }
`;

// ── Desktop dropdown ────────────────────────────────────

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.button`
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
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
  &[aria-expanded='true'] {
    color: rgba(255, 255, 255, 0.95);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const ChevronIcon = styled(FontAwesomeIcon)`
  font-size: 10px;
  transition: transform 200ms;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 200px;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  animation: ${dropdownFadeIn} 150ms ease-out;
  z-index: 100;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 10px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

// ── CTA ─────────────────────────────────────────────────

const CTALink = styled.a`
  display: none;
  align-items: center;
  padding: 8px 20px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  text-decoration: none;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    background: rgba(14, 165, 233, 0.25);
    border-color: rgba(14, 165, 233, 0.5);
  }

  @media (min-width: 1024px) {
    display: inline-flex;
  }
`;

// ── Mobile ──────────────────────────────────────────────

const MobileMenuBtn = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 4px;
  padding: 12px 24px 20px;
  background: rgba(11, 17, 32, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileNavLink = styled.a`
  display: block;
  padding: 12px 16px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const MobileSectionToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const MobileSubLinks = styled.div`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  flex-direction: column;
  padding-left: 16px;
  gap: 2px;
`;

const MobileSubLink = styled.a`
  display: block;
  padding: 10px 16px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  border-radius: 6px;
  transition: all 150ms;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const MobileCTA = styled.a`
  display: block;
  padding: 14px 16px;
  margin-top: 8px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background: rgba(14, 165, 233, 0.15);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  transition: all 150ms;

  &:hover {
    background: rgba(14, 165, 233, 0.25);
  }
`;

// ── Demo toggle + app menu button (dark variant) ────────

const DemoToggleDark = styled.button`
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
  border: 1px solid ${({ $active }) => ($active ? '#0EA5E9' : 'rgba(255, 255, 255, 0.15)')};
  background: ${({ $active }) => ($active ? '#0EA5E9' : 'rgba(255, 255, 255, 0.06)')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)')};
  cursor: pointer;
  transition: all 0.2s ease-out;
  white-space: nowrap;
  min-height: 28px;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }
`;

const DemoDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)')};
  transition: background 0.2s;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ── Logo ────────────────────────────────────────────────

const WQTLogoLight = () => (
  <svg width="200" height="32" viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path
        d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z"
        fill="#3B82F6"
      />
      <path
        d="M16 30L20 26L24 32L28 24L32 28"
        stroke="#0EA5E9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20 34L23 37L29 31"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
    <text
      x="50"
      y="32"
      fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="22"
      fill="#F1F5F9"
    >
      <tspan fontWeight="700">WaterQuality</tspan>
      <tspan fontWeight="400" fill="#0EA5E9">
        .Trading
      </tspan>
    </text>
  </svg>
);

// ── Data ────────────────────────────────────────────────

const SOLUTIONS_ITEMS = [
  { label: 'For Utilities', href: '/for-utilities' },
  { label: 'For Homeowners', href: '/for-homeowners' },
  { label: 'For Aggregators', href: '/for-aggregators' },
  { label: 'For Credit Generators', href: '/generate-credits' },
];

// ── Desktop Dropdown Component ──────────────────────────

function SolutionsDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <DropdownItem key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </DropdownItem>
          ))}
        </DropdownPanel>
      )}
    </DropdownWrapper>
  );
}

// ── Component ───────────────────────────────────────────

export function WebsiteNav({ onMenuClick: _onMenuClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { STATES } = useAppContext();
  const isSignedIn = !!STATES?.user?.uid;
  const ctaHref = isSignedIn ? '/marketplace' : '/login';
  const demoActive = isDemoMode();

  const handleDemoToggle = () => {
    setDemoMode(!demoActive);
    window.location.reload();
  };

  return (
    <>
      <NavOuter>
        <NavInner>
          <LogoLink href="/" aria-label="WaterQuality.Trading">
            <WQTLogoLight />
          </LogoLink>

          <NavLinks>
            <NavLink href="/marketplace">Marketplace</NavLink>
            <NavLink href="/how-it-works">How It Works</NavLink>
            <SolutionsDropdown />
            <NavLink href="/registry">Credit Registry</NavLink>
          </NavLinks>

          <RightGroup>
            <DemoToggleDark
              $active={demoActive}
              onClick={handleDemoToggle}
              aria-label={demoActive ? 'Disable demo mode' : 'Enable demo mode'}
              title={demoActive ? 'Demo mode ON — click to disable' : 'Click to enable demo mode'}
            >
              <DemoDot $active={demoActive} />
              Demo
            </DemoToggleDark>
            <CTALink href={ctaHref}>{isSignedIn ? 'Dashboard' : 'Sign In'}</CTALink>
            <MobileMenuBtn
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
            </MobileMenuBtn>
          </RightGroup>
        </NavInner>
      </NavOuter>

      <MobileMenu $open={mobileOpen}>
        <MobileNavLink href="/marketplace" onClick={() => setMobileOpen(false)}>
          Marketplace
        </MobileNavLink>
        <MobileNavLink href="/how-it-works" onClick={() => setMobileOpen(false)}>
          How It Works
        </MobileNavLink>

        <MobileSectionToggle
          type="button"
          onClick={() => setSolutionsOpen((p) => !p)}
          aria-expanded={solutionsOpen}
        >
          Solutions
          <ChevronIcon icon={faChevronDown} $open={solutionsOpen} />
        </MobileSectionToggle>
        <MobileSubLinks $open={solutionsOpen}>
          {SOLUTIONS_ITEMS.map((item) => (
            <MobileSubLink key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              {item.label}
            </MobileSubLink>
          ))}
        </MobileSubLinks>

        <MobileNavLink href="/registry" onClick={() => setMobileOpen(false)}>
          Credit Registry
        </MobileNavLink>

        <MobileCTA href={ctaHref} onClick={() => setMobileOpen(false)}>
          {isSignedIn ? 'Dashboard' : 'Get Started'}
        </MobileCTA>
      </MobileMenu>
    </>
  );
}
