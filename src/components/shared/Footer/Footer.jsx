// /workspaces/Marketplace/src/components/shared/Footer/Footer.jsx
import React from "react";
import styled from "styled-components";
import { APP_NAME } from "../../../constants/constants";
import { isSalesMode, isCloudMode } from "../../../utils/modeDetection";

const StyledFooter = styled.footer`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;

  .footer-top {
    display: none;
  }

  @media (min-width: 648px) {
    text-align: left;

    .footer-top {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F0F1F3'};
    }
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
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

  .footer-col-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
    margin: 0 0 12px;
  }

  .footer-col-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .footer-col-links a {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
    text-decoration: none;
    transition: color 150ms;

    &:hover {
      color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    }
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
    : "/terms";

  const privacyUrl = isBlueSignalMode
    ? "https://bluesignal.xyz/privacy"
    : "/privacy";

  return (
    <StyledFooter>
      <div className="footer-bottom">
        <span className="rights-reserved">
          {copyrightText}
        </span>
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
      </div>
    </StyledFooter>
  );
}

export default Footer;
