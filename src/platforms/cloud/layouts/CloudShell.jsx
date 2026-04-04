/**
 * CloudShell — layout wrapper for the Cloud platform.
 * Persistent sidebar (desktop) + slide-out drawer (mobile) + slim top bar.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CloudTopBar } from '../components/CloudTopBar';
import { CloudSidebar } from '../components/CloudSidebar';
import { DemoBanner } from '../../../components/DemoBanner';
import Footer from '../../../components/shared/Footer/Footer';
import LinkBadgePortal from '../../../components/LinkBadgePortal.jsx';
import { SettingsMenu } from '../../../components';

const SIDEBAR_WIDTH = 240;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100vw;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || 768}px) {
    margin-left: ${({ $hasSidebar }) => ($hasSidebar ? `${SIDEBAR_WIDTH}px` : '0')};
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const FooterWrapper = styled.div`
  padding: 24px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  margin-top: auto;
`;

export function CloudShell({ user, isAuthLanding, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'BlueSignal Cloud Monitoring';
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const showNav = !isAuthLanding;

  return (
    <AppContainer>
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
        onFocus={(e) => { e.target.style.position = 'fixed'; e.target.style.left = '16px'; e.target.style.top = '16px'; e.target.style.width = 'auto'; e.target.style.height = 'auto'; e.target.style.overflow = 'visible'; e.target.style.background = '#0066FF'; e.target.style.color = '#fff'; e.target.style.padding = '8px 16px'; e.target.style.borderRadius = '4px'; e.target.style.textDecoration = 'none'; e.target.style.fontWeight = '600'; e.target.style.fontSize = '14px'; }}
        onBlur={(e) => { e.target.style.position = 'absolute'; e.target.style.left = '-9999px'; e.target.style.width = '1px'; e.target.style.height = '1px'; e.target.style.overflow = 'hidden'; }}
      >
        Skip to content
      </a>

      {/* Top bar — hidden on auth landing */}
      {showNav && (
        <CloudTopBar onMenuToggle={() => setMenuOpen((p) => !p)} />
      )}

      {/* Sidebar — persistent on desktop, drawer on mobile */}
      {showNav && (
        <CloudSidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Content area — offset by sidebar width on desktop */}
      <ContentWrapper $hasSidebar={showNav}>
        {/* Demo mode banner — full width beneath header */}
        {showNav && <DemoBanner />}

        {/* Legacy globals (kept for backward compat until components migrated) */}
        <SettingsMenu />

        {/* Main content */}
        <MainContent id="main-content">{children}</MainContent>

        {/* Footer */}
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </ContentWrapper>

      {/* Link badge */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}
