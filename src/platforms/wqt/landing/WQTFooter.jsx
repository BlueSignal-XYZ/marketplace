/**
 * WQTFooter — dark footer for waterquality.trading.
 * Updated navigation, ecosystem links, and legal.
 */

import React from 'react';
import styled from 'styled-components';

const FooterSection = styled.footer`
  padding: 72px 24px 32px;
  background: #0B1120;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 640px) {
    padding: 48px 20px 24px;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const BrandCol = styled.div``;

const BrandName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const BrandDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 280px;
  color: rgba(255, 255, 255, 0.5);
`;

const ColTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 16px;
`;

const ColLink = styled.a`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  padding: 5px 0;
  transition: color 150ms;
  &:hover { color: #FFFFFF; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin: 0 0 24px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Copyright = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SmallLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  &:hover { color: rgba(255, 255, 255, 0.6); }
`;

export function WQTFooter() {
  return (
    <FooterSection>
      <Inner>
        <TopRow>
          <BrandCol>
            <BrandName>WaterQuality.Trading</BrandName>
            <BrandDesc>
              A deregulated water quality trading system for distributed water
              production. Dual-credit architecture, three-layer verification,
              and utility-controlled pricing.
            </BrandDesc>
          </BrandCol>

          <div>
            <ColTitle>How It Works</ColTitle>
            <ColLink href="/#credit-definitions">Credit Definitions</ColLink>
            <ColLink href="/#verification">Verification</ColLink>
            <ColLink href="/#pricing">Pricing Mechanics</ColLink>
            <ColLink href="/#settlement">Settlement</ColLink>
            <ColLink href="/#risk-framework">Risk Framework</ColLink>
          </div>

          <div>
            <ColTitle>For</ColTitle>
            <ColLink href="/for-utilities">Utilities & Municipalities</ColLink>
            <ColLink href="/for-homeowners">Homeowners</ColLink>
            <ColLink href="/for-aggregators">Aggregators & Investors</ColLink>
            <ColLink href="/registry">Credit Registry</ColLink>
          </div>

          <div>
            <ColTitle>Ecosystem</ColTitle>
            <ColLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener">Cloud Monitoring</ColLink>
            <ColLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal Hardware</ColLink>
            <ColLink href="/contact">Contact</ColLink>
          </div>
        </TopRow>

        <Divider />

        <Bottom>
          <Copyright>
            &copy; {new Date().getFullYear()} WaterQuality.Trading &mdash; Powered by BlueSignal LTD
          </Copyright>
          <BottomLinks>
            <SmallLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal</SmallLink>
            <SmallLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener">Cloud</SmallLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </FooterSection>
  );
}
