/**
 * WQTFooter — dark footer matching the hero.
 * Platform links, ecosystem, legal, and email capture.
 */

import React, { useState } from 'react';
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

const EmailForm = styled.form`
  display: flex;
  gap: 8px;
  max-width: 320px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  outline: none;
  &::placeholder { color: rgba(255, 255, 255, 0.3); }
  &:focus { border-color: rgba(6, 182, 212, 0.4); }
`;

const EmailBtn = styled.button`
  padding: 10px 16px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  background: rgba(0, 82, 204, 0.8);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 200ms;
  &:hover { background: rgba(0, 82, 204, 1); }
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
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <FooterSection>
      <Inner>
        <TopRow>
          <BrandCol>
            <BrandName>WaterQuality.Trading</BrandName>
            <BrandDesc>
              The verified environmental credit exchange. Sensor-backed data,
              blockchain transparency, institutional-grade infrastructure.
            </BrandDesc>
            <EmailForm onSubmit={handleSubmit}>
              <EmailInput
                type="email"
                placeholder="Get notified about new listings"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <EmailBtn type="submit">Subscribe</EmailBtn>
            </EmailForm>
          </BrandCol>

          <div>
            <ColTitle>Platform</ColTitle>
            <ColLink href="/marketplace">Marketplace</ColLink>
            <ColLink href="/registry">Credit Registry</ColLink>
            <ColLink href="/map">Project Map</ColLink>
            <ColLink href="/programs">Trading Programs</ColLink>
            <ColLink href="/recent-removals">Recent Removals</ColLink>
          </div>

          <div>
            <ColTitle>Ecosystem</ColTitle>
            <ColLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener">Cloud Monitoring ↗</ColLink>
            <ColLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal Hardware ↗</ColLink>
            <ColLink href="/developers">API Documentation</ColLink>
            <ColLink href="/certificate/verify">Verify Certificate</ColLink>
          </div>

          <div>
            <ColTitle>Legal</ColTitle>
            <ColLink href="/terms">Terms of Service</ColLink>
            <ColLink href="/privacy">Privacy Policy</ColLink>
            <ColLink href="/contact">Contact</ColLink>
          </div>
        </TopRow>

        <Divider />

        <Bottom>
          <Copyright>
            © {new Date().getFullYear()} WaterQuality.Trading — powered by BlueSignal LTD
          </Copyright>
          <BottomLinks>
            <SmallLink href="https://bluesignal.xyz" target="_blank" rel="noopener">BlueSignal ↗</SmallLink>
            <SmallLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener">Cloud ↗</SmallLink>
          </BottomLinks>
        </Bottom>
      </Inner>
    </FooterSection>
  );
}
