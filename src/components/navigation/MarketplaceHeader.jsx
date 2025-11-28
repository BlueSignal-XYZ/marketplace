// /src/components/navigation/MarketplaceHeader.jsx
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logoImg from "../../assets/logo.png";
import { APP_NAME } from "../../constants/constants";

const HeaderOuter = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
  background: ${({ theme }) => theme.colors.bg || "#ffffff"};
`;

const HeaderInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;

  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    height: 72px;
  }

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const LogoImg = styled.img`
  height: 40px;
  width: auto;
  display: block;

  @media (min-width: 768px) {
    height: 48px;
  }

  @media (min-width: 1024px) {
    height: 56px;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.ui900};
  font-size: 24px;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.primary500};
  }
`;

export function MarketplaceHeader({ onMenuClick }) {
  const handleClick = () => {
    console.log("[MarketplaceHeader] burger clicked");
    if (onMenuClick) onMenuClick();
  };

  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoImg src={logoImg} alt={APP_NAME || "WaterQuality.Trading"} />
        <MenuButton onClick={handleClick} aria-label="Open menu">
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </HeaderInner>
    </HeaderOuter>
  );
}