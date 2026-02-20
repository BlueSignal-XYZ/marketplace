/**
 * MarketplaceHeader — sticky header for waterquality.trading.
 * Inline nav links for primary sections + hamburger for mobile.
 */

import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NotificationBell from "../shared/NotificationBell";
import logoImg from "../../assets/logo.png";
import { APP_NAME } from "../../constants/constants";

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
        <LogoWrapper href="/">
          <LogoImg src={logoImg} alt={APP_NAME || "WaterQuality.Trading"} />
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
