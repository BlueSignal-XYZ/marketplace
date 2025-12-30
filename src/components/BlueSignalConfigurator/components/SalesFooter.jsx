// SalesFooter - Unified footer for the sales portal
import React from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";

const FooterWrapper = styled.footer`
  background: ${salesTheme.colors.bgPrimary};
  color: ${salesTheme.colors.textSecondary};
  padding: 48px 24px 24px;
  border-top: 1px solid ${salesTheme.colors.borderDark};
`;

const FooterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 48px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  h4 {
    color: ${salesTheme.colors.textPrimary};
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 16px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: ${salesTheme.colors.textSecondary};
    text-decoration: none;
    font-size: 14px;
    transition: color ${salesTheme.transitions.fast};

    &:hover {
      color: ${salesTheme.colors.accentPrimary};
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid ${salesTheme.colors.borderDark};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 13px;
  color: ${salesTheme.colors.textMuted};
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    color: ${salesTheme.colors.textSecondary};
    transition: color ${salesTheme.transitions.fast};

    &:hover {
      color: ${salesTheme.colors.accentPrimary};
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};

  svg {
    width: 16px;
    height: 16px;
    color: ${salesTheme.colors.accentPrimary};
  }
`;

export default function SalesFooter() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterGrid>
          <FooterColumn>
            <h4>Products</h4>
            <ul>
              <li><a href="#products">Shore Monitor AC</a></li>
              <li><a href="#products">Shore Monitor Solar</a></li>
              <li><a href="#products">Shore Monitor Lite</a></li>
              <li><a href="#products">Smart Buoy</a></li>
              <li><a href="#products">Smart Buoy XL</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h4>Resources</h4>
            <ul>
              <li><a href="https://docs.bluesignal.xyz" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              <li><a href="https://github.com/bluesignal" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#calculator">ROI Calculator</a></li>
              <li><a href="#benchmark">Benchmark Data</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h4>Company</h4>
            <ul>
              <li><a href="https://bluesignal.xyz" target="_blank" rel="noopener noreferrer">About</a></li>
              <li><a href="https://bluesignal.xyz/contact" target="_blank" rel="noopener noreferrer">Contact</a></li>
              <li><a href="https://bluesignal.xyz/support" target="_blank" rel="noopener noreferrer">Support</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h4>Legal</h4>
            <ul>
              <li><a href="https://bluesignal.xyz/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://bluesignal.xyz/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
              <li><a href="https://bluesignal.xyz/warranty" target="_blank" rel="noopener noreferrer">Warranty Info</a></li>
            </ul>
          </FooterColumn>
        </FooterGrid>

        <TrustBadges>
          <Badge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            EPA Compliant
          </Badge>
          <Badge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Registry Verified
          </Badge>
          <Badge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            2-Year Warranty
          </Badge>
          <Badge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Secure Checkout
          </Badge>
        </TrustBadges>

        <FooterBottom>
          <Copyright>
            &copy; {new Date().getFullYear()} BlueSignal. All rights reserved.
          </Copyright>

          <SocialLinks>
            <a href="https://github.com/bluesignal" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://twitter.com/bluesignal" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/bluesignal" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </SocialLinks>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
}
