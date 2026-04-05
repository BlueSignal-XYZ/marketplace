// /workspaces/Marketplace/src/components/shared/Footer/Footer.jsx
import styled from 'styled-components';
import { isSalesMode, isCloudMode } from '../../../utils/modeDetection';

const StyledFooter = styled.footer`
  max-width: 1000px;
  margin: 0 auto;

  .footer-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.borderLight || '#F0F1F3'};
  }

  @media (min-width: 648px) {
    .footer-top {
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .rights-reserved {
    color: ${({ theme }) => theme.colors?.ui600 || theme.colors?.textSecondary || '#6B7280'};
    font-size: 13px;
    font-weight: 500;
  }

  .button-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  a {
    color: ${({ theme }) => theme.colors?.primary || theme.colors?.primary500 || '#0052CC'};
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: color 150ms;
    &:hover {
      opacity: 0.8;
    }
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
    font-size: 14px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
    text-decoration: none;
    transition: color 150ms;
    padding: 4px 0;

    &:hover {
      color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
    }
  }

  @media (max-width: 480px) {
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }
`;

function Footer() {
  // Check if we're in sales or cloud mode (BlueSignal branding)
  const isBlueSignalMode = isSalesMode() || isCloudMode();

  // Use BlueSignal branding for sales/cloud modes, WaterQuality.Trading for marketplace
  const copyrightText = isBlueSignalMode
    ? '© 2026 BlueSignal LTD'
    : '© 2026 WaterQuality.Trading — powered by BlueSignal LTD';

  const termsUrl = isBlueSignalMode ? 'https://bluesignal.xyz/terms' : '/terms';

  const privacyUrl = isBlueSignalMode ? 'https://bluesignal.xyz/privacy' : '/privacy';

  return (
    <StyledFooter>
      {!isBlueSignalMode && (
        <div className="footer-top">
          <div>
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-col-links">
              <li>
                <a href="/marketplace">Browse Credits</a>
              </li>
              <li>
                <a href="/registry">Registry</a>
              </li>
              <li>
                <a href="/map">Map</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-col-links">
              <li>
                <a href="/how-it-works">How It Works</a>
              </li>
              <li>
                <a href="/generate-credits">Generate Credits</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">For</h4>
            <ul className="footer-col-links">
              <li>
                <a href="/for-utilities">Utilities</a>
              </li>
              <li>
                <a href="/for-homeowners">Homeowners</a>
              </li>
              <li>
                <a href="/for-aggregators">Aggregators</a>
              </li>
            </ul>
          </div>
        </div>
      )}
      <div className="footer-bottom">
        <span className="rights-reserved">{copyrightText}</span>
        <div className="button-wrap">
          <a rel="noreferrer" target="_blank" href={termsUrl}>
            Terms & Conditions
          </a>
          <a rel="noreferrer" target="_blank" href={privacyUrl}>
            Privacy Policy
          </a>
        </div>
      </div>
    </StyledFooter>
  );
}

export default Footer;
