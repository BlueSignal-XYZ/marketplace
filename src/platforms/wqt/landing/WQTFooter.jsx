/**
 * WQTFooter — platform-specific footer for the WQT landing page.
 * Platform links, API docs, legal, BlueSignal hardware link.
 */

import React from 'react';
import styled from 'styled-components';

const FooterSection = styled.footer`
  padding: 64px 24px 32px;
  background: #0B1120;
  color: rgba(255, 255, 255, 0.7);
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`;

const Brand = styled.div``;

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
  margin: 0;
  max-width: 280px;
`;

const ColTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.4);
  margin: 0 0 16px;
`;

const ColLink = styled.a`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  padding: 4px 0;
  transition: color 150ms;
  &:hover { color: #FFFFFF; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
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
  color: rgba(255,255,255,0.4);
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SmallLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  &:hover { color: rgba(255,255,255,0.7); }
`;

export function WQTFooter() {
  return (
    <FooterSection>
      <Inner>
        <Grid>
          <Brand>
            <BrandName>WaterQuality.Trading</BrandName>
            <BrandDesc>
              The verified environmental credit exchange. Sensor-backed data,
              blockchain transparency, institutional-grade infrastructure.
            </BrandDesc>
          </Brand>
          <div>
            <ColTitle>Platform</ColTitle>
            <ColLink href="/marketplace">Marketplace</ColLink>
            <ColLink href="/registry">Registry</ColLink>
            <ColLink href="/map">Data Map</ColLink>
            <ColLink href="/programs">Trading Programs</ColLink>
            <ColLink href="/recent-removals">Recent Removals</ColLink>
          </div>
          <div>
            <ColTitle>Resources</ColTitle>
            <ColLink href="/developers">API Docs</ColLink>
            <ColLink href="/certificate/verify">Verify Certificate</ColLink>
            <ColLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal Hardware</ColLink>
          </div>
          <div>
            <ColTitle>Legal</ColTitle>
            <ColLink href="/terms">Terms of Service</ColLink>
            <ColLink href="/privacy">Privacy Policy</ColLink>
            <ColLink href="/contact">Contact</ColLink>
          </div>
        </Grid>
        <Divider />
        <Bottom>
          <Copyright>© {new Date().getFullYear()} WaterQuality.Trading. All rights reserved.</Copyright>
          <BottomLinks>
            <SmallLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal →</SmallLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </FooterSection>
  );
}
