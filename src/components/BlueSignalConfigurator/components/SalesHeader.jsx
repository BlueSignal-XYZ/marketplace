// SalesHeader - Unified sticky header for the sales portal
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bluesignalLogo from "../../../assets/bluesignal-logo.png";
import { salesTheme } from "../styles/theme";

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${salesTheme.zIndex.sticky};
  background: ${props => props.$scrolled
    ? 'rgba(15, 23, 42, 0.98)'
    : 'rgba(15, 23, 42, 0.85)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${props => props.$scrolled
    ? salesTheme.colors.borderDark
    : 'transparent'};
  transition: all ${salesTheme.transitions.normal};
`;

const HeaderContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 0 16px;
    height: 64px;
  }
`;

const LogoLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  height: 36px;
  width: auto;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: 28px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: ${props => props.$active
    ? 'rgba(255, 255, 255, 0.1)'
    : 'transparent'};
  border: none;
  border-radius: ${salesTheme.borderRadius.md};
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active
    ? salesTheme.colors.textPrimary
    : salesTheme.colors.textSecondary};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${salesTheme.colors.textPrimary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const QuoteButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  border: none;
  border-radius: ${salesTheme.borderRadius.md};
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${salesTheme.colors.bgPrimary};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${salesTheme.shadows.glow};
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const QuoteBadge = styled.span`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${salesTheme.borderRadius.full};
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 700;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid ${salesTheme.colors.borderDark};
  border-radius: ${salesTheme.borderRadius.md};
  padding: 8px;
  color: ${salesTheme.colors.textSecondary};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${salesTheme.colors.textPrimary};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: ${salesTheme.colors.bgPrimary};
  border-bottom: 1px solid ${salesTheme.colors.borderDark};
  padding: 16px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    gap: 8px;
  }
`;

const MobileNavLink = styled.button`
  background: ${props => props.$active
    ? 'rgba(255, 255, 255, 0.1)'
    : 'transparent'};
  border: none;
  border-radius: ${salesTheme.borderRadius.md};
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.$active
    ? salesTheme.colors.textPrimary
    : salesTheme.colors.textSecondary};
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all ${salesTheme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${salesTheme.colors.textPrimary};
  }
`;

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'calculator', label: 'ROI Calculator' },
  { id: 'benchmark', label: 'Benchmark' },
];

export default function SalesHeader({
  activeSection = 'hero',
  onNavigate,
  quoteItemCount = 0,
  onOpenQuote,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <>
      <HeaderWrapper $scrolled={scrolled}>
        <HeaderContainer>
          <LogoLink
            href="https://bluesignal.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LogoImage src={bluesignalLogo} alt="BlueSignal" />
          </LogoLink>

          <Nav>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                $active={activeSection === item.id}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </NavLink>
            ))}
          </Nav>

          <HeaderActions>
            <QuoteButton onClick={onOpenQuote}>
              Get a Quote
              {quoteItemCount > 0 && (
                <QuoteBadge>{quoteItemCount}</QuoteBadge>
              )}
            </QuoteButton>

            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
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

      <MobileMenu $isOpen={mobileMenuOpen}>
        {navItems.map((item) => (
          <MobileNavLink
            key={item.id}
            $active={activeSection === item.id}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </>
  );
}
