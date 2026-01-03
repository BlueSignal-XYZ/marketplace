// /workspaces/Marketplace/src/components/shared/Footer/Footer.jsx
import React from "react";
import styled from "styled-components";
import { APP_NAME } from "../../../constants/constants";
import { isSalesMode, isCloudMode } from "../../../utils/modeDetection";

const StyledFooter = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 648px) {
    display: flex;
    justify-content: space-between;
    text-align: left;
    gap: 80px; /* large horizontal gap between left + right */
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

  .footer-spacer {
    flex: 1;
  }

  a {
    color: ${({ theme }) => theme.colors.primary500};
    font-size: 12px;
    font-weight: 500;
  }
`;

function Footer() {
  // Check if we're in sales or cloud mode (BlueSignal branding)
  const isBlueSignalMode = isSalesMode() || isCloudMode();

  // Use BlueSignal branding for sales/cloud modes, WaterQuality.Trading for marketplace
  const copyrightText = isBlueSignalMode
    ? "© 2026 BlueSignal LTD"
    : "© 2026 WaterQuality.Trading — powered by BlueSignal LTD";

  const termsUrl = isBlueSignalMode
    ? "https://bluesignal.xyz/terms"
    : "https://waterquality.trading/terms";

  const privacyUrl = isBlueSignalMode
    ? "https://bluesignal.xyz/privacy"
    : "https://waterquality.trading/privacy";

  return (
    <StyledFooter>
      <span className="rights-reserved">
        {copyrightText}
      </span>

      {/* spacer pushes Terms/Privacy to the right on desktop */}
      <div className="footer-spacer" />

      <div className="button-wrap">
        <a
          rel="noreferrer"
          target="_blank"
          href={termsUrl}
        >
          Terms & Conditions
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          href={privacyUrl}
        >
          Privacy Policy
        </a>
      </div>
    </StyledFooter>
  );
}

export default Footer;
