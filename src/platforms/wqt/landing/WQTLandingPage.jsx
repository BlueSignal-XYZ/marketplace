/**
 * WQTLandingPage — rebuilt marketing page for waterquality.trading.
 * Deregulated water quality trading platform.
 * All content traceable to the market mechanics document.
 */

import React from 'react';
import styled from 'styled-components';
import { HeroSection } from './HeroSection';
import { AudienceSection } from './AudienceSection';
import { VerificationSection } from './VerificationSection';
import { SettlementSection } from './SettlementSection';
import { CreditDefinitionsSection } from './CreditDefinitionsSection';
import { PricingSection } from './PricingSection';
import { WQTFooter } from './WQTFooter';

const CTASection = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  text-align: center;

  @media (max-width: 640px) {
    padding: 64px 20px;
  }
`;

const CTATitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

const CTASub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 auto 32px;
  max-width: 520px;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTABtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #0052CC 0%, #0066FF 100%);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4); }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CTABtnOutline = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  &:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.3); }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export function WQTLandingPage() {
  return (
    <>
      <HeroSection />
      <AudienceSection />
      <VerificationSection />
      <SettlementSection />
      <CreditDefinitionsSection />
      <PricingSection />
      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTASub>
          Whether you're a utility, homeowner, or aggregator — see how verified water credits work for you.
        </CTASub>
        <CTAButtons>
          <CTABtn href="/login">Create Your Account</CTABtn>
          <CTABtnOutline href="/registry">Browse Credit Registry</CTABtnOutline>
        </CTAButtons>
      </CTASection>
      <WQTFooter />
    </>
  );
}
