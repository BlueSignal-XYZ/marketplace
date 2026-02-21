/**
 * WQT Hero — premium dark hero for waterquality.trading.
 * Three audiences in under 4 seconds: homeowners, utility directors, aggregators.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(8px); }
`;

const Section = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-left: clamp(20px, 5vw, 48px);
  padding-right: clamp(20px, 5vw, 48px);
  background: #0B1120;
  color: #FFFFFF;
  box-sizing: border-box;

  @media (max-height: 700px) {
    justify-content: flex-start;
    padding-top: clamp(48px, 8vh, 80px);
  }

  @media (prefers-reduced-motion: reduce) {
    & * { animation: none !important; }
  }
`;

const GradientMesh = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0, 82, 204, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 80% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 90%, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
  animation: ${gradientShift} 20s ease-in-out infinite;
  background-size: 200% 200%;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${pulse} ${({ $d }) => $d || '6s'} ease-in-out infinite;
  animation-delay: ${({ $del }) => $del || '0s'};
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const Eyebrow = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 3vw + 1.25rem, 48px);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 clamp(16px, 1.5vw + 10px, 24px);
  max-width: min(600px, 90%);
  color: #FFFFFF;

  @media (max-height: 700px) {
    margin-bottom: 12px;
  }
`;

const Subheadline = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 0.5vw + 14px, 18px);
  font-weight: 400;
  line-height: 1.6;
  max-width: min(560px, 90%);
  margin: 0 0 clamp(24px, 1.5vw + 18px, 32px);
  color: rgba(255, 255, 255, 0.7);

  @media (max-height: 700px) {
    margin-bottom: 16px;
  }
`;

const CTARow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  text-decoration: none;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  white-space: nowrap;
  min-width: 180px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
  &:active { transform: translateY(0); }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  text-decoration: none;
  transition: all 200ms;
  white-space: nowrap;
  min-width: 180px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

const Pills = styled.div`
  margin-top: clamp(24px, 2.5vw + 14px, 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 6px;
  }

  @media (max-height: 700px) {
    margin-top: 16px;
  }
`;

const Pill = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
`;

const PillSeparator = styled.span`
  color: rgba(255, 255, 255, 0.25);
  user-select: none;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.4;
  animation: ${bounce} 2s ease infinite;
  pointer-events: none;

  @media (max-height: 700px) {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ChevronSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PILLS = [
  'Every credit sensor-verified',
  'Pricing set by your utility',
  'Three-layer independent verification',
];

export function HeroSection() {
  return (
    <Section>
      <GradientMesh />
      <GridOverlay />
      <GlowOrb
        $d="8s" $del="0s"
        style={{ top: '10%', left: '5%', width: 300, height: 300, background: 'rgba(0,82,204,0.08)' }}
      />
      <GlowOrb
        $d="10s" $del="2s"
        style={{ bottom: '10%', right: '5%', width: 250, height: 250, background: 'rgba(6,182,212,0.06)' }}
      />

      <Content>
        <Eyebrow>Sensor-Verified Water Credits</Eyebrow>
        <Headline>Your Water Has Value. Now You Can Prove It.</Headline>
        <Subheadline>
          Produce clean water. Earn utility rebates. Every gallon metered, every credit verified, every rebate on your bill.
        </Subheadline>
        <CTARow>
          <PrimaryBtn href="/#credit-definitions">See How Credits Work</PrimaryBtn>
          <SecondaryBtn href="/registry">View Credit Registry</SecondaryBtn>
        </CTARow>
        <Pills>
          {PILLS.map((text, i) => (
            <React.Fragment key={i}>
              {i > 0 && <PillSeparator>·</PillSeparator>}
              <Pill>{text}</Pill>
            </React.Fragment>
          ))}
        </Pills>
      </Content>
      <ScrollIndicator>
        <ChevronSvg />
      </ScrollIndicator>
    </Section>
  );
}
