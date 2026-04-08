import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { isDemoMode } from '../utils/demoMode';
import { useAppContext } from '../context/AppContext';

const DEMO_BANNER_DISMISSED_KEY = 'demoBannerDismissed';

/** Permanent dismissal — never show again after user clicks X. */
function isBannerDismissed(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(DEMO_BANNER_DISMISSED_KEY) === 'true';
}

function setBannerDismissed(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DEMO_BANNER_DISMISSED_KEY, 'true');
  }
}

const BannerContainer = styled.div`
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 40px;
  padding: 10px 48px 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10; /* below nav (50) and dropdowns (100) */

  @media (max-width: 768px) {
    min-height: 48px;
    padding: 10px 40px 10px 14px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
`;

const BannerText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DemoIcon = styled.span`
  font-size: 14px;
  flex-shrink: 0;
`;

const SettingsLink = styled(Link)`
  color: rgba(255, 255, 255, 0.95);
  padding: 4px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 12px;
  transition: all 0.15s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: all 0.15s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    right: 8px;
  }
`;

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(() => isBannerDismissed());
  const { STATES } = useAppContext();
  const isLoggedIn = !!STATES?.user?.uid;

  const handleDismiss = () => {
    setBannerDismissed();
    setDismissed(true);
  };

  if (!isDemoMode() || dismissed) return null;

  const linkPath = isLoggedIn ? getSettingsPath() : '/login';
  const linkLabel = isLoggedIn ? 'Disable in Profile' : 'Sign in to disable';

  return (
    <BannerContainer>
      <BannerText>
        <DemoIcon>🔬</DemoIcon>
        <span>
          <strong>Demo Mode</strong> — Showing sample data
        </span>
      </BannerText>
      <SettingsLink to={linkPath}>{linkLabel}</SettingsLink>
      <CloseButton onClick={handleDismiss} aria-label="Dismiss demo banner">
        ×
      </CloseButton>
    </BannerContainer>
  );
}

/** Returns the correct profile/settings path based on hostname (WQT vs Cloud). */
function getSettingsPath(): string {
  if (typeof window === 'undefined') return '/cloud/profile';
  const host = window.location.hostname || '';
  if (host.includes('cloud.bluesignal') || host.includes('cloud-bluesignal')) {
    return '/cloud/profile';
  }
  return '/profile';
}
