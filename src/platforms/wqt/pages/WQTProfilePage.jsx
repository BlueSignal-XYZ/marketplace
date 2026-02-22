/**
 * WQTProfilePage — minimal profile/settings page for WaterQuality.Trading.
 * Provides demo mode toggle (same as Cloud Profile). Used when "Disable in Settings"
 * is clicked from the demo banner on WQT.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { isDemoMode, setDemoMode } from '../../../utils/demoMode';

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints?.lg || 1024}px) {
    padding: 48px 32px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin: 0 0 32px;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors?.surface || 'white'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E2E4E9'};
  border-radius: ${({ theme }) => theme.radius?.lg || 16}px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin: 0 0 16px;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToggleLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  cursor: pointer;
`;

const Toggle = styled.button`
  width: 48px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: ${({ $on }) => ($on ? '#0052CC' : '#E5E7EB')};
  cursor: pointer;
  position: relative;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${({ $on }) => ($on ? '22px' : '2px')};
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const Hint = styled.p`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  margin: 12px 0 0;
  line-height: 1.5;
`;

const BackLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.primary || '#0052CC'};
  text-decoration: none;
  margin-bottom: 24px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
`;

export function WQTProfilePage() {
  const [demoEnabled, setDemoEnabled] = useState(isDemoMode());

  useEffect(() => {
    setDemoEnabled(isDemoMode());
  }, []);

  const handleToggle = () => {
    const next = !demoEnabled;
    setDemoMode(next);
    setDemoEnabled(next);
    window.location.reload();
  };

  return (
    <Page>
      <BackLink to="/marketplace">&larr; Back to Marketplace</BackLink>
      <Title>Profile & Settings</Title>
      <Subtitle>Manage your account and preferences</Subtitle>

      <Section>
        <SectionTitle>Demo Mode</SectionTitle>
        <ToggleRow>
          <ToggleLabel htmlFor="demo-toggle">Enable Demo Mode</ToggleLabel>
          <Toggle
            id="demo-toggle"
            type="button"
            role="switch"
            $on={demoEnabled}
            onClick={handleToggle}
            aria-label={demoEnabled ? 'Disable demo mode' : 'Enable demo mode'}
          />
        </ToggleRow>
        <Hint>
          {demoEnabled
            ? 'Demo mode is active. All data shown across the platform is sample data. Disable demo mode to see only your real devices and credits.'
            : 'Enable demo mode to explore the platform with sample data. Useful for presentations and testing.'}
        </Hint>
      </Section>
    </Page>
  );
}

export default WQTProfilePage;
