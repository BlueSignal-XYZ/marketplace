import React from "react";
import styled from "styled-components";
import { APP_NAME } from "../../../constants/constants";

const StyledFooter = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 648px) {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
  .rights-reserved {
    color: ${({ theme }) => theme.colors.ui600};
    font-size: 12px;
    font-weight: 500;
  }

  .button-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  a {
    color: ${({ theme }) => theme.colors.primary500};
    font-size: 12px;
    font-weight: 500;
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <span className="rights-reserved">
        © 2024 WaterQuality.Trading — powered by BlueSignal LTD
      </span>
      <div className="button-wrap">
        <a
          rel="noreferrer"
          target="_blank"
          href="https://waterquality.trading/terms"
        >
          Terms & Conditions
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://waterquality.trading/privacy"
        >
          Privacy Policy
        </a>
      </div>
    </StyledFooter>
  );
}

export default Footer;
