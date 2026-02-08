// SalesHeader - Simplified sticky header for the sales portal (no nav menu)
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { salesTheme } from "../styles/theme";

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

// White logo using SVG for crisp rendering
const LogoSvg = styled.svg`
  height: 38px;
  width: auto;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: 30px;
  }
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

export default function SalesHeader({
  onScrollToContact,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuoteClick = useCallback(() => {
    if (location.pathname !== '/') {
      navigate('/?section=contact');
    } else if (onScrollToContact) {
      onScrollToContact();
    }
  }, [onScrollToContact, navigate, location.pathname]);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    // Scroll to top if on main page, otherwise navigate home
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  }, [navigate, location.pathname]);

  return (
    <HeaderWrapper $scrolled={scrolled}>
      <HeaderContainer>
        <LogoLink
          href="/"
          onClick={handleLogoClick}
          aria-label="BlueSignal Home"
        >
          {/* White BlueSignal Logo */}
          <LogoSvg viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Three-wave icon */}
            <path d="M3 12 C8 8, 19 8, 29 12" stroke="#2d8cf0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M3 20 C8 16, 19 16, 29 20" stroke="#2d8cf0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M3 28 C8 24, 19 24, 29 28" stroke="#2d8cf0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* BlueSignal text */}
            <text
              x="38"
              y="28"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="22"
              fontWeight="700"
              fill="white"
              letterSpacing="-0.02em"
            >
              BlueSignal
            </text>
          </LogoSvg>
        </LogoLink>

        <QuoteButton onClick={handleQuoteClick} aria-label="Get a quote - scroll to contact form">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Get a Quote</span>
        </QuoteButton>
      </HeaderContainer>
    </HeaderWrapper>
  );
}
