// /src/components/navigation/MarketplaceHeader.jsx
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

const LogoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors?.success50 || "#ECFDF5"} 0%, ${({ theme }) => theme.colors?.success100 || "#D1FAE5"} 100%);
  color: ${({ theme }) => theme.colors?.success700 || "#047857"};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.success200 || "#A7F3D0"};

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
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  font-size: 20px;
  line-height: 1;
  transition: all 0.2s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
    background: ${({ theme }) => theme.colors?.primary50 || "#E6F7F8"};
    border-color: ${({ theme }) => theme.colors?.primary200 || "#8FDADB"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
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
        <LogoWrapper>
          <LogoImg src={logoImg} alt={APP_NAME || "WaterQuality.Trading"} />
          <ModeBadge>Marketplace</ModeBadge>
        </LogoWrapper>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NotificationBell />
          <MenuButton onClick={handleClick} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MenuButton>
        </div>
      </HeaderInner>
    </HeaderOuter>
  );
}