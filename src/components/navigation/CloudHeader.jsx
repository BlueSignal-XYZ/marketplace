// /src/components/navigation/CloudHeader.jsx
import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// Adjust this path if your logo lives somewhere else
import bluesignalLogo from "../../assets/bluesignal-logo.png";

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
  height: 64px;  /* BlueSignal brand anchor – tweak as needed */
  width: auto;
  display: block;
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

export function CloudHeader({ onMenuClick }) {
  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoImg src={bluesignalLogo} alt="BlueSignal Cloud" />
        <MenuButton onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </HeaderInner>
    </HeaderOuter>
  );
}