/**
 * WQT Hero — premium dark hero for waterquality.trading.
 * Deregulated water quality trading platform messaging.
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

const Section = styled.section`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 16px 64px;
  background: #0B1120;
  color: #FFFFFF;
  text-align: center;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 100px 24px 80px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 140px 24px 120px;
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
  max-width: 780px;
  margin: 0 auto;
  z-index: 1;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.9);
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 999px;
  margin-bottom: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 12px;
    padding: 6px 16px;
    margin-bottom: 32px;
  }
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  display: inline-block;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(36px, 5.5vw, 60px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin: 0 0 24px;
  color: #FFFFFF;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #06B6D4 0%, #0052CC 50%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto 40px;
`;

const CTARow = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
  &:active { transform: translateY(0); }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 28px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    gap: 24px;
    margin-top: 56px;
  }
`;

const TrustItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
`;

const TrustDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  @media (max-width: 640px) { display: none; }
`;

export function HeroSection() {
  const handleLearnClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('credit-definitions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
        <TrustBadge>
          <StatusDot />
          Powered by BlueSignal
        </TrustBadge>
        <Title>
          Deregulated{' '}
          <GradientText>Water Quality Trading</GradientText>
        </Title>
        <Subtitle>
          A credit system for distributed water production.
          Two credit types, three layers of verification, and
          utility-controlled pricing across the United States.
        </Subtitle>
        <CTARow>
          <PrimaryBtn href="#credit-definitions" onClick={handleLearnClick}>
            How It Works
          </PrimaryBtn>
          <SecondaryBtn href="/for-utilities">
            For Utilities
          </SecondaryBtn>
        </CTARow>
        <TrustRow>
          <TrustItem>Sensor-Verified Credits</TrustItem>
          <TrustDot />
          <TrustItem>Three-Layer Verification</TrustItem>
          <TrustDot />
          <TrustItem>Utility-Controlled Pricing</TrustItem>
        </TrustRow>
      </Content>
    </Section>
  );
}
