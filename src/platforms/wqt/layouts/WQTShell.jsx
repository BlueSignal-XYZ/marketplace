/**
 * WQTShell — layout wrapper for the WQT platform.
 * Header + main content + footer + menus.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { MarketplaceHeader } from '../../../components/navigation/MarketplaceHeader';
import { MarketplaceMenu } from '../../../components/navigation/MarketplaceMenu';
import { WebsiteNav } from '../../../components/navigation/WebsiteNav';
import Footer from '../../../components/shared/Footer/Footer';
import LinkBadgePortal from '../../../components/LinkBadgePortal.jsx';
import { SettingsMenu } from '../../../components';
import { DemoBanner } from '../../../components/DemoBanner';

// Marketing/content pages that should use the dark WebsiteNav instead of the app header
const MARKETING_ROUTES = [
  '/contact',
  '/for-utilities',
  '/for-homeowners',
  '/for-aggregators',
  '/how-it-works',
  '/generate-credits',
  '/terms',
  '/privacy',
];

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FooterWrapper = styled.div`
  padding: 24px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  margin-top: auto;
`;

export function WQTShell({ user, isAuthLanding, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMarketingRoute = MARKETING_ROUTES.includes(location.pathname);

  // Set page title
  useEffect(() => {
    document.title = 'WaterQuality.Trading';
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <AppContainer>
      {/* Navigation: marketing pages get dark WebsiteNav, app pages get MarketplaceHeader */}
      {!isAuthLanding && isMarketingRoute && (
        <WebsiteNav />
      )}
      {!isAuthLanding && !isMarketingRoute && (
        <MarketplaceHeader onMenuClick={() => setMenuOpen((p) => !p)} />
      )}

      {/* Mobile menu (app pages only — WebsiteNav has its own mobile menu) */}
      {!isMarketingRoute && (
        <MarketplaceMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          user={user}
        />
      )}

      {/* Demo mode banner (same as Cloud) */}
      {!isAuthLanding && <DemoBanner />}

      {/* Legacy globals (kept for backward compat until components migrated) */}
      <SettingsMenu />

      {/* Main content */}
      <MainContent>{children}</MainContent>

      {/* Footer — hidden on landing page (landing has its own footer) */}
      {!isAuthLanding && (
        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      )}

      {/* Link badge */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}
