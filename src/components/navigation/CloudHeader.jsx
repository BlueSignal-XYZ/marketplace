// /src/components/navigation/CloudHeader.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NotificationBell from "../shared/NotificationBell";
import { isDemoMode, setDemoMode } from "../../utils/demoMode";

import blueSignalLogo from "../../assets/bluesignal-logo.png";

// Always show demo toggle — demo mode is now managed via localStorage from Profile page
const SHOW_DEMO_TOGGLE = true;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: ${fadeIn} 0.3s ease-out;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
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

const LogoWrapper = styled.a`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const LogoImg = styled.img`
  height: 36px;
  width: auto;
  display: block;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.02);
  }

  @media (min-width: 768px) {
    height: 44px;
  }

  @media (min-width: 1024px) {
    height: 52px;
  }
`;

const ModeBadge = styled.span`
  display: none;
  padding: 4px 10px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  background: ${({ theme }) => theme.colors?.primaryLight || "#E8F0FE"};
  color: ${({ theme }) => theme.colors?.primary || "#0066FF"};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.border || "#E5E7EB"};

  @media (min-width: 768px) {
    display: inline-flex;
  }
`;

const MenuButton = styled.button`
  height: 44px;
  width: 44px;
  border-radius: 12px;
  background: transparent;
  border: 1.5px solid transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors?.text || "#1A1A1A"};
  font-size: 20px;
  line-height: 1;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || "#0066FF"};
    background: ${({ theme }) => theme.colors?.hover || "rgba(0,102,255,0.04)"};
    border-color: ${({ theme }) => theme.colors?.border || "#E5E7EB"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || "#0066FF"};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DemoToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? '#0066FF' : '#E5E7EB')};
  background: ${({ $active }) => ($active ? '#0066FF' : '#FAFAFA')};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#9CA3AF')};
  cursor: pointer;
  transition: all 0.2s ease-out;
  white-space: nowrap;
  min-height: 28px;

  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const DemoDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#FFFFFF' : '#D1D5DB')};
  transition: background 0.2s;
`;

export function CloudHeader({ onMenuClick }) {
  const demoActive = isDemoMode();

  const handleDemoToggle = () => {
    setDemoMode(!demoActive);
    window.location.reload();
  };

  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoWrapper href="/dashboard/main" aria-label="BlueSignal Cloud — Go to dashboard">
          <LogoImg src={blueSignalLogo} alt="BlueSignal Cloud Monitoring" />
          <ModeBadge>Cloud</ModeBadge>
        </LogoWrapper>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {SHOW_DEMO_TOGGLE && (
            <DemoToggle
              $active={demoActive}
              onClick={handleDemoToggle}
              aria-label={demoActive ? 'Disable demo mode' : 'Enable demo mode'}
              title={demoActive ? 'Demo mode ON — click to disable' : 'Click to enable demo mode'}
            >
              <DemoDot $active={demoActive} />
              Demo
            </DemoToggle>
          )}
          <NotificationBell />
          <MenuButton onClick={onMenuClick} aria-label="Open cloud menu">
            <FontAwesomeIcon icon={faBars} />
          </MenuButton>
        </div>
      </HeaderInner>
    </HeaderOuter>
  );
}
