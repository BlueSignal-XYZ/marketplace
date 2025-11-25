// /src/components/navigation/MarketplaceHeader.jsx
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logoImg from "../../assets/logo.png";
import { APP_NAME } from "../../constants/constants";

const HeaderOuter = styled.header`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
  background: ${({ theme }) => theme.colors.bg};
`;

const HeaderInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px;

  display: flex;
  justify-content: space-between;
  align-items: center; /* centers logo + burger vertically */

  @media (min-width: 1024px) {
    padding: 16px 0;
  }
`;

const LogoImg = styled.img`
  height: 56px;
  width: auto;
  display: block;

  @media (min-width: 768px) {
    height: 64px;
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
  font-size: 26px;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.primary500};
  }
`;

export function MarketplaceHeader({ onMenuClick }) {
  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoImg
          src={logoImg}
          alt={APP_NAME || "WaterQuality.Trading"}
        />
        <MenuButton onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </HeaderInner>
    </HeaderOuter>
  );
}