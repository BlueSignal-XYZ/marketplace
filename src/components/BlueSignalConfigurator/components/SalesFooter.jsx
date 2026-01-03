// SalesFooter - Unified footer for the sales portal
import React, { useState } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";
import bluesignalLogo from "../../../assets/bluesignal-logo.png";
import useFormSubmit from "../hooks/useFormSubmit";

const FooterWrapper = styled.footer`
  background: ${salesTheme.colors.bgPrimary};
  color: ${salesTheme.colors.textSecondary};
  padding: 80px 24px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px 24px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr;
  gap: 48px;
  margin-bottom: 64px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const BrandColumn = styled.div`
  @media (max-width: 1100px) {
    grid-column: span 3;
    max-width: 400px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-column: span 2;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-column: span 1;
    max-width: none;
  }
`;

const LogoLink = styled.a`
  display: inline-block;
  margin-bottom: 20px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  img {
    height: 36px;
    width: auto;
  }
`;

const BrandTagline = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
  max-width: 320px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    max-width: none;
    margin-left: auto;
    margin-right: auto;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
    color: ${salesTheme.colors.accentPrimary};
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FooterColumn = styled.div`
  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    text-align: center;
  }
`;

const ColumnTitle = styled.h4`
  color: ${salesTheme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 20px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: ${salesTheme.colors.accentPrimary};
    transform: translateX(2px);
  }

  svg {
    width: 12px;
    height: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover svg {
    opacity: 1;
  }
`;

const NewsletterColumn = styled.div`
  @media (max-width: 1100px) {
    grid-column: span 3;
    max-width: 400px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-column: span 2;
    max-width: 100%;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-column: span 1;
    max-width: none;
  }
`;

const NewsletterTitle = styled.h4`
  color: ${salesTheme.colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 12px;
`;

const NewsletterDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 16px;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 100%;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 44px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 14px;
  color: ${salesTheme.colors.textPrimary};
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex: 1 1 auto;
    min-width: 180px;
  }
`;

const NewsletterButton = styled.button`
  height: 44px;
  padding: 0 24px;
  background: ${salesTheme.gradients.greenCta};
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex: 0 0 auto;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const NewsletterSuccess = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${salesTheme.colors.accentPrimary};
  font-size: 14px;
  font-weight: 500;
  padding: 12px 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NewsletterError = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
`;

const TrustSection = styled.div`
  padding: 32px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 32px;
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    gap: 20px;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.05);
    border-color: rgba(16, 185, 129, 0.15);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${salesTheme.colors.accentPrimary};
    flex-shrink: 0;
  }

  span {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    padding: 10px 16px;

    svg {
      width: 18px;
      height: 18px;
    }

    span {
      font-size: 12px;
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    justify-content: center;
    gap: 16px;
  }
`;

const LegalLink = styled.a`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export default function SalesFooter({ onNavigate }) {
  const [email, setEmail] = useState('');
  const { formState, submitForm, reset } = useFormSubmit('newsletter_subscribers');

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      return;
    }

    const success = await submitForm({ email });
    if (success) {
      setEmail('');
      // Auto-reset after 5 seconds
      setTimeout(reset, 5000);
    }
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterTop>
          <BrandColumn>
            <LogoLink
              href="https://bluesignal.xyz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={bluesignalLogo} alt="BlueSignal" />
            </LogoLink>
            <BrandTagline>
              Transform your water quality data into tradeable credits with professional-grade monitoring solutions.
            </BrandTagline>
            <SocialLinks>
              <SocialLink
                href="https://github.com/bluesignal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </SocialLink>
              <SocialLink
                href="https://twitter.com/bluesignal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialLink>
              <SocialLink
                href="https://linkedin.com/company/bluesignal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </SocialLink>
              <SocialLink
                href="https://youtube.com/@bluesignal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </SocialLink>
            </SocialLinks>
          </BrandColumn>

          <FooterColumn>
            <ColumnTitle>Products</ColumnTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="#products" onClick={(e) => handleNavClick(e, 'products')}>
                  Shore Monitor AC
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#products" onClick={(e) => handleNavClick(e, 'products')}>
                  Shore Monitor Solar
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#products" onClick={(e) => handleNavClick(e, 'products')}>
                  Smart Buoy Series
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#products" onClick={(e) => handleNavClick(e, 'products')}>
                  All Products
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Developer</ColumnTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="/developers">
                  Documentation
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="https://github.com/NeptuneChain-Inc/bluesignal-firmware" target="_blank" rel="noopener noreferrer">
                  Firmware Source
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="https://github.com/NeptuneChain-Inc/bluesignal-hardware" target="_blank" rel="noopener noreferrer">
                  Hardware Designs
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#calculator" onClick={(e) => handleNavClick(e, 'calculator')}>
                  ROI Calculator
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink href="#about" onClick={(e) => handleNavClick(e, 'about')}>
                  About Us
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>
                  Contact
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="#faq" onClick={(e) => handleNavClick(e, 'faq')}>
                  FAQ
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink href="https://waterquality.trading" target="_blank" rel="noopener noreferrer">
                  Marketplace
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>

          <NewsletterColumn>
            <NewsletterTitle>Stay Updated</NewsletterTitle>
            <NewsletterDescription>
              Get the latest on water quality monitoring innovations and credit opportunities.
            </NewsletterDescription>
            {formState.status === 'success' ? (
              <NewsletterSuccess>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Subscribed! Check your inbox.
              </NewsletterSuccess>
            ) : (
              <>
                <NewsletterForm onSubmit={handleNewsletterSubmit}>
                  <NewsletterInput
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address for newsletter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formState.status === 'submitting'}
                    required
                  />
                  <NewsletterButton
                    type="submit"
                    disabled={formState.status === 'submitting'}
                  >
                    {formState.status === 'submitting' ? 'Sending...' : 'Subscribe'}
                  </NewsletterButton>
                </NewsletterForm>
                {formState.status === 'error' && (
                  <NewsletterError>{formState.error}</NewsletterError>
                )}
              </>
            )}
          </NewsletterColumn>
        </FooterTop>

        <TrustSection>
          <TrustBadges>
            <Badge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>EPA Compliant</span>
            </Badge>
            <Badge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Registry Verified</span>
            </Badge>
            <Badge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2-Year Warranty</span>
            </Badge>
            <Badge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Secure Checkout</span>
            </Badge>
            <Badge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Data Protected</span>
            </Badge>
          </TrustBadges>
        </TrustSection>

        <FooterBottom>
          <Copyright>
            &copy; {new Date().getFullYear()} BlueSignal Technologies. All rights reserved.
          </Copyright>

          <LegalLinks>
            <LegalLink href="/privacy">
              Privacy Policy
            </LegalLink>
            <LegalLink href="/terms">
              Terms of Service
            </LegalLink>
            <LegalLink href="/warranty">
              Warranty Info
            </LegalLink>
            <LegalLink href="/accessibility">
              Accessibility
            </LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
}
