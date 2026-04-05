// /workspaces/Marketplace/src/components/shared/Header/Header.jsx
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import logoImg from "../../../assets/logo.png";

const HeaderOuter = styled.header`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
  background: ${({ theme }) => theme.colors.bg};
`;

// Fixed-height flex bar, everything centered vertically
const HeaderInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;

  height: 80px; /* controls the bar height */
  display: flex;
  justify-content: space-between;
  align-items: center; /* centers logo + burger in the bar */

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const LogoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center; /* centers logo inside the bar */
`;

const LogoImg = styled.img`
  max-height: 64px; /* fits comfortably inside 80px bar */
  width: auto;
  display: block;
`;

const MenuButton = styled.button`
  height: 100%; /* same height as header bar */
  width: 48px;

  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;   /* centers icon vertically */
  justify-content: center;

  color: ${({ theme }) => theme.colors.ui900};
  font-size: 24px;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.primary500};
  }
`;

export default function Header({ onMenuClick }) {
  // Hide this legacy header on the WaterQuality.Trading domains.
  // We only want the new top header there.
  const host =
    typeof window !== "undefined" ? window.location.hostname : "";

  if (
    host === "waterquality.trading" ||
    host === "waterquality-trading.web.app" ||
    host.endsWith(".waterquality.trading")
  ) {
    return null;
  }

  // On any other host (old envs, dev, etc) this header still works.
  return (
    <HeaderOuter>
      <HeaderInner>
        <LogoWrapper>
          <LogoImg src={logoImg} alt="waterquality.trading" />
        </LogoWrapper>

        <MenuButton onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </HeaderInner>
    </HeaderOuter>
  );
}