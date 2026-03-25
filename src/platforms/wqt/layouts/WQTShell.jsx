/**
 * WQTShell — layout wrapper for the WQT platform.
 * Marketing routes use WebsiteNav; app routes use the new sidebar/topbar/bottom-tabs nav.
 * Landing and login pages get no chrome.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { WebsiteNav } from '../../../components/navigation/WebsiteNav';
import { MarketplaceMenu } from '../../../components/navigation/MarketplaceMenu';
import Footer from '../../../components/shared/Footer/Footer';
import { DemoBanner } from '../../../components/DemoBanner';
import { WQTTopBar } from '../components/WQTTopBar';
import { WQTSidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_TABLET } from '../components/WQTSidebar';
import { WQTBottomTabs, TAB_BAR_HEIGHT } from '../components/WQTBottomTabs';

// Marketing/content pages that should use the dark WebsiteNav instead of the app header
const MARKETING_ROUTES = [
  '/contact',
  '/for-utilities',
  '/for-homeowners',
  '/for-aggregators',
  '/how-it-works',
  '/generate-credits',
];

// Legal pages get a minimal header (logo + back link only)
const LEGAL_ROUTES = ['/terms', '/privacy'];

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: ${({ $dark, theme }) => $dark ? '#0B1120' : theme.colors.background};
`;

const AppBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  ${({ $appRoute }) => $appRoute && `
    /* Mobile: offset by bottom tabs height + safe area */
    @media (max-width: 767px) {
      padding-bottom: ${TAB_BAR_HEIGHT}px;
    }

    /* Tablet: offset by narrow sidebar */
    @media (min-width: 768px) {
      margin-left: ${SIDEBAR_WIDTH_TABLET}px;
    }

    /* Desktop: offset by full sidebar */
    @media (min-width: 1024px) {
      margin-left: ${SIDEBAR_WIDTH}px;
    }
  `}
`;

const LegalNav = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: rgba(11, 17, 32, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const LegalNavInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

const LegalBackLink = styled.a`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
  }
`;

const FooterWrapper = styled.div`
  padding: 24px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  margin-top: auto;

  ${({ $appRoute }) => $appRoute && `
    @media (min-width: 768px) {
      margin-left: ${SIDEBAR_WIDTH_TABLET}px;
    }
    @media (min-width: 1024px) {
      margin-left: ${SIDEBAR_WIDTH}px;
    }
  `}
`;

export function WQTShell({ user, isAuthLanding, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMarketingRoute = MARKETING_ROUTES.includes(location.pathname);
  const isLegalRoute = LEGAL_ROUTES.includes(location.pathname);
  const isAuthPage = location.pathname === '/login';
  const hideChrome = isAuthLanding || isAuthPage;
  const isAppRoute = !hideChrome && !isMarketingRoute && !isLegalRoute;

  // Set page title
  useEffect(() => {
    document.title = 'WaterQuality.Trading';
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <AppContainer $dark={hideChrome}>
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: 9999,
        }}
        onFocus={(e) => { e.target.style.position = 'fixed'; e.target.style.left = '16px'; e.target.style.top = '16px'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; e.target.style.overflow = 'visible'; e.target.style.background = '#0052CC'; e.target.style.color = '#fff'; e.target.style.padding = '8px 16px'; e.target.style.borderRadius = '4px'; e.target.style.textDecoration = 'none'; e.target.style.fontWeight = '600'; e.target.style.fontSize = '14px'; }}
        onBlur={(e) => { e.target.style.position = 'absolute'; e.target.style.left = '-9999px'; e.target.style.width = '1px'; e.target.style.height = '1px'; e.target.style.overflow = 'hidden'; }}
      >
        Skip to content
      </a>

      {/* Navigation: landing/login get nothing, legal pages get minimal nav, marketing pages get dark WebsiteNav, app pages get new nav */}
      {!hideChrome && isLegalRoute && (
        <LegalNav>
          <LegalNavInner>
            <a href="/" aria-label="WaterQuality.Trading" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <svg width="180" height="28" viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z" fill="#3B82F6" />
                  <path d="M16 30L20 26L24 32L28 24L32 28" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M20 34L23 37L29 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
                <text x="50" y="32" fontFamily="'Outfit', 'Inter', sans-serif" fontSize="22" fill="#F1F5F9">
                  <tspan fontWeight="700">WaterQuality</tspan>
                  <tspan fontWeight="400" fill="#0EA5E9">.Trading</tspan>
                </text>
              </svg>
            </a>
            <LegalBackLink href="/">&larr; Back to home</LegalBackLink>
          </LegalNavInner>
        </LegalNav>
      )}
      {!hideChrome && isMarketingRoute && (
        <WebsiteNav onMenuClick={() => setMenuOpen((p) => !p)} />
      )}
      {isAppRoute && <WQTTopBar />}
      {isAppRoute && <WQTSidebar />}

      {/* Mobile menu for marketing routes */}
      {isMarketingRoute && (
        <MarketplaceMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={user}
        />
      )}

      {/* Demo mode banner (same as Cloud) */}
      {!hideChrome && <DemoBanner />}

      {/* Main content */}
      <MainContent id="main-content" $appRoute={isAppRoute}>
        {children}
      </MainContent>

      {/* Bottom tabs for mobile on app routes */}
      {isAppRoute && <WQTBottomTabs />}

      {/* Footer — hidden on landing page and login page */}
      {!hideChrome && (
        <FooterWrapper $appRoute={isAppRoute}>
          <Footer />
        </FooterWrapper>
      )}
    </AppContainer>
  );
}
