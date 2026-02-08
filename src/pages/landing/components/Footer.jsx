import styled from 'styled-components';
import { trackCTA } from '../utils/analytics';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.w08};
`;

const FooterInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 64px 24px 0;

  ${({ theme }) => theme.media.md} {
    padding: 48px 16px 0;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr 1fr;
  }
  ${({ theme }) => theme.media.md} {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BrandCol = styled.div``;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

const LogoSvg = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 8 C8 5, 16 5, 24 8" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 14 C8 11, 16 11, 24 14" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M4 20 C8 17, 16 17, 24 20" stroke="#2d8cf0" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

const BrandTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;

const BrandDesc = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 300px;
  margin-bottom: 20px;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SocialBtn = styled.a`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.w04};
  border: 1px solid ${({ theme }) => theme.colors.w08};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.w50};
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.w08};
    color: ${({ theme }) => theme.colors.white};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LinkCol = styled.div``;

const ColTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 20px;
`;

const FooterLink = styled.a`
  display: block;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 12px;
  transition: color 0.2s;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  ${({ theme }) => theme.media.md} {
    padding: 6px 0;
    margin-bottom: 4px;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
`;

const SoonBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.w15};
  background: ${({ theme }) => theme.colors.w04};
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 6px;
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.w04};
  margin-top: 48px;
  padding: 20px 0;

  ${({ theme }) => theme.media.md} {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 24px 0;
  }
`;

const Copyright = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.w15};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LegalLink = styled.a`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.w15};
  text-decoration: none;
  transition: color 0.2s;
  padding: 4px 0;

  &:hover {
    color: ${({ theme }) => theme.colors.w50};
  }
`;

const Footer = () => (
  <FooterWrapper>
    <FooterInner>
      <FooterGrid>
        <BrandCol>
          <LogoRow>
            <LogoSvg />
            <BrandTitle>BlueSignal</BrandTitle>
          </LogoRow>
          <BrandDesc>
            Water quality monitoring hardware for tanks, ponds, and treatment systems. Built in&nbsp;Austin,&nbsp;TX.
          </BrandDesc>
          <SocialRow>
            <SocialBtn href="https://github.com/bluesignal" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </SocialBtn>
            <SocialBtn href="https://twitter.com/BlueSignalHQ" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </SocialBtn>
            <SocialBtn href="https://linkedin.com/company/bluesignal" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </SocialBtn>
          </SocialRow>
        </BrandCol>

        <LinkCol>
          <ColTitle>Product</ColTitle>
          <FooterLink href="#sensors">Sensor Channels</FooterLink>
          <FooterLink href="#architecture">Architecture</FooterLink>
          <FooterLink href="#specs">Specifications</FooterLink>
          <FooterLink href="#order">Order Dev Kit</FooterLink>
        </LinkCol>

        <LinkCol>
          <ColTitle>Platform</ColTitle>
          <FooterLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('external_cloud', 'Footer')}>Cloud Dashboard</FooterLink>
          <FooterLink href="https://github.com/BlueSignal" target="_blank" rel="noopener noreferrer">GitHub</FooterLink>
        </LinkCol>

        <LinkCol>
          <ColTitle>Services</ColTitle>
          <FooterLink href="#installation">Installation — Texas</FooterLink>
          <FooterLink href="#installation">Installation — Florida<SoonBadge>SOON</SoonBadge></FooterLink>
          <FooterLink href="#order">Volume Pricing</FooterLink>
          <FooterLink href="mailto:hello@bluesignal.xyz">Contact</FooterLink>
        </LinkCol>
      </FooterGrid>

      <BottomBar>
        <Copyright>&copy; 2026 BlueSignal. All rights reserved.</Copyright>
        <LegalLinks>
          <LegalLink href="/privacy">Privacy Policy</LegalLink>
          <LegalLink href="/terms">Terms of Service</LegalLink>
          <LegalLink href="/warranty">Warranty</LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterInner>
  </FooterWrapper>
);

export default Footer;
