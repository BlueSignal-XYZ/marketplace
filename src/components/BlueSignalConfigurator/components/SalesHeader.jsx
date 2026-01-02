// SalesHeader - Unified sticky header for the sales portal
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import bluesignalLogo from "../../../assets/bluesignal-logo.png";
import { salesTheme } from "../styles/theme";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${salesTheme.zIndex.sticky};
  background: ${props => props.$scrolled
    ? 'rgba(15, 23, 42, 0.98)'
    : 'rgba(15, 23, 42, 0.9)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${props => props.$scrolled
    ? 'rgba(255, 255, 255, 0.08)'
    : 'transparent'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$scrolled
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : 'none'};
`;

const HeaderContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    gap: 24px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 0 16px;
    height: 68px;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const LogoImage = styled.img`
  height: 38px;
  width: auto;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: 30px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active
    ? salesTheme.colors.accentPrimary
    : 'rgba(255, 255, 255, 0.7)'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$active
      ? salesTheme.colors.accentPrimary
      : 'rgba(255, 255, 255, 0.95)'};
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuoteButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);

    &::before {
      transform: translateX(100%);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: 3px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 10px 18px;
    font-size: 13px;
    border-radius: 10px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 10px 14px;

    span {
      display: none;
    }
  }
`;

const QuoteBadge = styled.span`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 800;
  min-width: 24px;
  text-align: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${salesTheme.colors.textPrimary};
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: 2px;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const MobileMenuOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  top: 68px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: ${salesTheme.zIndex.sticky - 1};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: block;
    ${props => props.$isOpen && `
      opacity: 1;
      pointer-events: auto;
    `}
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  background: ${salesTheme.colors.bgPrimary};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  z-index: ${salesTheme.zIndex.sticky};
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: flex;
    flex-direction: column;
    gap: 6px;

    ${props => props.$isOpen && `
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
      animation: ${slideDown} 0.3s ease-out;
    `}
  }
`;

const MobileNavLink = styled.button`
  background: ${props => props.$active
    ? 'rgba(16, 185, 129, 0.12)'
    : 'transparent'};
  border: none;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.$active
    ? salesTheme.colors.accentPrimary
    : 'rgba(255, 255, 255, 0.75)'};
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active
      ? 'rgba(16, 185, 129, 0.18)'
      : 'rgba(255, 255, 255, 0.06)'};
    color: ${props => props.$active
      ? salesTheme.colors.accentPrimary
      : 'rgba(255, 255, 255, 0.95)'};
  }

  &:focus-visible {
    outline: 2px solid ${salesTheme.colors.accentPrimary};
    outline-offset: -2px;
  }
`;

const MobileMenuDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 8px 0;
`;

const MobileQuoteInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 12px;
  margin-top: 8px;
`;

const MobileQuoteText = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const MobileQuoteCount = styled.span`
  font-size: 14px;
  color: ${salesTheme.colors.accentPrimary};
  font-weight: 700;
`;

const navItems = [
  { id: 'hero', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/?section=products' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'faq', label: 'FAQ', href: '/faq' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export default function SalesHeader({
  activeSection = 'hero',
  onNavigate,
  quoteItemCount = 0,
  onOpenQuote,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine active nav item based on current route
  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path === '/about') return 'about';
    if (path === '/faq') return 'faq';
    if (path === '/contact') return 'contact';
    // On main page, use section-based active state
    return activeSection;
  };

  const currentActive = getActiveNavItem();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = useCallback((item) => {
    setMobileMenuOpen(false);

    // Check if this is a route navigation or section scroll
    if (item.href && (item.href.startsWith('/about') || item.href.startsWith('/faq') || item.href.startsWith('/contact'))) {
      navigate(item.href);
    } else if (item.id === 'hero' || item.id === 'products') {
      // For home and products, navigate to main page with section
      if (location.pathname !== '/') {
        navigate(item.href || '/');
      } else if (onNavigate) {
        onNavigate(item.id);
      }
    } else if (onNavigate) {
      onNavigate(item.id);
    }
  }, [onNavigate, navigate, location.pathname]);

  const handleQuoteClick = useCallback(() => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/?quote=true');
    } else if (onOpenQuote) {
      onOpenQuote();
    }
  }, [onOpenQuote, navigate, location.pathname]);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    navigate('/');
  }, [navigate]);

  return (
    <>
      <HeaderWrapper $scrolled={scrolled}>
        <HeaderContainer>
          <LogoLink
            href="/"
            onClick={handleLogoClick}
            aria-label="BlueSignal Home"
          >
            <LogoImage src={bluesignalLogo} alt="BlueSignal" />
          </LogoLink>

          <Nav role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                $active={currentActive === item.id}
                onClick={() => handleNavClick(item)}
                aria-current={currentActive === item.id ? 'page' : undefined}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <HeaderActions>
            <QuoteButton onClick={handleQuoteClick} aria-label={`View quote with ${quoteItemCount} items`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span>Get a Quote</span>
              {quoteItemCount > 0 && (
                <QuoteBadge>{quoteItemCount}</QuoteBadge>
              )}
            </QuoteButton>

            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </MobileMenuButton>
          </HeaderActions>
        </HeaderContainer>
      </HeaderWrapper>

      <MobileMenuOverlay
        $isOpen={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
      />

      <MobileMenu $isOpen={mobileMenuOpen} role="navigation" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <MobileNavLink
            key={item.id}
            $active={currentActive === item.id}
            onClick={() => handleNavClick(item)}
            aria-current={currentActive === item.id ? 'page' : undefined}
          >
            {item.label}
          </MobileNavLink>
        ))}

        {quoteItemCount > 0 && (
          <>
            <MobileMenuDivider />
            <MobileQuoteInfo onClick={handleQuoteClick} style={{ cursor: 'pointer' }}>
              <MobileQuoteText>Items in your quote</MobileQuoteText>
              <MobileQuoteCount>{quoteItemCount} item{quoteItemCount !== 1 ? 's' : ''}</MobileQuoteCount>
            </MobileQuoteInfo>
          </>
        )}
      </MobileMenu>
    </>
  );
}
