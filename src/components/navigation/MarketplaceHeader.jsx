/**
 * MarketplaceHeader — sticky header for waterquality.trading.
 * Inline nav links for primary sections + hamburger for mobile.
 */

import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NotificationBell from "../shared/NotificationBell";
import { APP_NAME } from "../../constants/constants";

// Inline SVG logo component for crisp rendering at all sizes
const WQTLogo = ({ height = 36 }) => {
  const scale = height / 48;
  const width = 320 * scale;
  return (
    <svg width={width} height={height} viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M24 4C24 4 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 4 24 4Z" fill="#0F4C81"/>
        <path d="M16 30L20 26L24 32L28 24L32 28" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M20 34L23 37L29 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      <text x="50" y="32" fontFamily="'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="22" fill="#0F4C81">
        <tspan fontWeight="700">WaterQuality</tspan><tspan fontWeight="400" fill="#0EA5E9">.Trading</tspan>
      </text>
    </svg>
  );
};

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

const LogoSvgWrapper = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-out;

  &:hover {
    transform: scale(1.02);
  }

  svg {
    display: block;
  }
`;

const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 4px;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.textSecondary || '#64748B'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 150ms;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    background: ${({ theme }) => theme.colors?.hover || 'rgba(0,82,204,0.04)'};
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
    color: ${({ theme }) => theme.colors?.primary || "#0052CC"};
    background: ${({ theme }) => theme.colors?.hover || "rgba(0,82,204,0.04)"};
    border-color: ${({ theme }) => theme.colors?.border || "#E2E4E9"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary || "#0052CC"};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export function MarketplaceHeader({ onMenuClick }) {
  const handleClick = () => {
    if (onMenuClick) onMenuClick();
  };

  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoWrapper href="/" aria-label={APP_NAME || "WaterQuality.Trading"}>
          <LogoSvgWrapper>
            <WQTLogo height={36} />
          </LogoSvgWrapper>
        </LogoWrapper>

        <NavLinks>
          <NavLink href="/#credit-definitions">How It Works</NavLink>
          <NavLink href="/for-utilities">For Utilities</NavLink>
          <NavLink href="/for-homeowners">For Homeowners</NavLink>
          <NavLink href="/for-aggregators">For Aggregators</NavLink>
          <NavLink href="/registry">Credit Registry</NavLink>
        </NavLinks>

        <RightGroup>
          <NotificationBell />
          <MenuButton onClick={handleClick} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MenuButton>
        </RightGroup>
      </HeaderInner>
    </HeaderOuter>
  );
}
