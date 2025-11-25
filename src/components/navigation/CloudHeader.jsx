// /src/components/navigation/CloudHeader.jsx
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import blueSignalLogo from "../../assets/bluesignal-logo.png";

const HeaderOuter = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
  position: relative;
  z-index: 20;
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;

  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  max-height: 44px;
  width: auto;
  display: block;
`;

const MenuButton = styled.button`
  height: 100%;
  width: 48px;

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

export function CloudHeader({ onMenuClick }) {
  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoWrapper>
          <LogoImg src={blueSignalLogo} alt="BlueSignal Cloud Monitoring" />
        </LogoWrapper>

        <MenuButton onClick={onMenuClick} aria-label="Open cloud menu">
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </HeaderInner>
    </HeaderOuter>
  );
}
