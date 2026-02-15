/**
 * CloudShell — layout wrapper for the Cloud platform.
 * Header + main content + footer + menus.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CloudHeader } from '../../../components/navigation/CloudHeader';
import { CloudMenu } from '../../../components/navigation/CloudMenu';
import Footer from '../../../components/shared/Footer/Footer';
import LinkBadgePortal from '../../../components/LinkBadgePortal.jsx';
import { NotificationBar, SettingsMenu } from '../../../components';

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

export function CloudShell({ user, isAuthLanding, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'BlueSignal Cloud Monitoring';
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <AppContainer>
      {/* Header — hidden on auth landing */}
      {!isAuthLanding && (
        <CloudHeader onMenuClick={() => setMenuOpen((p) => !p)} />
      )}

      {/* Mobile menu */}
      <CloudMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
      />

      {/* Legacy globals (kept for backward compat until components migrated) */}
      <NotificationBar />
      <SettingsMenu />

      {/* Main content */}
      <MainContent>{children}</MainContent>

      {/* Footer */}
      <FooterWrapper>
        <Footer />
      </FooterWrapper>

      {/* Link badge */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}
