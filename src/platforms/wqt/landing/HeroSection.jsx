/**
 * WQT Hero — "The Water Quality Exchange."
 * Subtle animated data viz background. CTAs: Enter Platform, Connect Wallet.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
`;

const Section = styled.section`
  position: relative;
  overflow: hidden;
  padding: 120px 24px 100px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 50%, #091428 100%);
  color: #FFFFFF;
  text-align: center;

  @media (max-width: 640px) {
    padding: 80px 20px 60px;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,82,204,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,82,204,0.05) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const DataDots = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Dot = styled.div`
  position: absolute;
  width: ${({ $s }) => $s || 4}px;
  height: ${({ $s }) => $s || 4}px;
  border-radius: 50%;
  background: ${({ $c }) => $c || '#0052CC'};
  animation: ${float} ${({ $d }) => $d || '4s'} ease-in-out infinite;
  animation-delay: ${({ $del }) => $del || '0s'};
`;

const Content = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  z-index: 1;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #06B6D4;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 999px;
  margin-bottom: 28px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 20px;
`;

const Accent = styled.span`
  background: linear-gradient(135deg, #06B6D4, #0052CC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
  max-width: 580px;
  margin: 0 auto 40px;
`;

const CTARow = styled.div`
  display: flex;
  gap: 12px;
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
  padding: 14px 28px;
  min-height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: #0052CC;
  border-radius: 8px;
  text-decoration: none;
  transition: background 200ms;
  &:hover { background: #003D99; }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  min-height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  text-decoration: none;
  transition: background 200ms;
  &:hover { background: rgba(255,255,255,0.1); }
`;

export function HeroSection() {
  return (
    <Section>
      <GridOverlay />
      <DataDots>
        <Dot $s={6} $c="#0052CC" $d="5s" $del="0s" style={{ top: '15%', left: '12%' }} />
        <Dot $s={4} $c="#06B6D4" $d="6s" $del="1s" style={{ top: '25%', right: '18%' }} />
        <Dot $s={5} $c="#10B981" $d="4s" $del="0.5s" style={{ top: '60%', left: '8%' }} />
        <Dot $s={3} $c="#8B5CF6" $d="7s" $del="2s" style={{ top: '70%', right: '10%' }} />
        <Dot $s={4} $c="#0052CC" $d="5.5s" $del="1.5s" style={{ top: '40%', left: '25%' }} />
        <Dot $s={5} $c="#06B6D4" $d="4.5s" $del="0.8s" style={{ bottom: '20%', right: '25%' }} />
      </DataDots>
      <Content>
        <Badge>Verified Environmental Credits</Badge>
        <Title>
          The Water Quality<br />
          <Accent>Exchange</Accent>
        </Title>
        <Subtitle>
          Buy and sell verified nutrient credits backed by real sensor data
          and blockchain transparency. The trusted marketplace for environmental outcomes.
        </Subtitle>
        <CTARow>
          <PrimaryBtn href="/marketplace">Enter Platform →</PrimaryBtn>
          <SecondaryBtn href="/registry">Explore Registry</SecondaryBtn>
        </CTARow>
      </Content>
    </Section>
  );
}
