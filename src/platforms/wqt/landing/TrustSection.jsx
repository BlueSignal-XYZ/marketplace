/**
 * TrustSection — verification quality, blockchain transparency,
 * trust badges, and BlueSignal ecosystem connection.
 */

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 640px) {
    padding: 64px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

const SectionSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 560px;
  margin: 0 auto 64px;
  line-height: 1.6;
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 48px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const TrustCard = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: border-color 200ms;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const CardIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const EcosystemBanner = styled.div`
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 48px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px 24px;
    text-align: center;
  }
`;

const EcoCard = styled.div`
  text-align: center;
`;

const EcoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 auto 12px;
`;

const EcoTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

const EcoDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin-bottom: 12px;
`;

const EcoLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: #06B6D4;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const EcoArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 24px;
  @media (max-width: 768px) {
    transform: rotate(90deg);
    font-size: 20px;
  }
`;

const TRUST_CARDS = [
  {
    icon: '📡',
    bg: 'rgba(6, 182, 212, 0.1)',
    title: 'Sensor-Verified Data',
    desc: 'Credits backed by continuous IoT sensor measurements — not self-reported estimates. Real data, real outcomes.',
  },
  {
    icon: '⛓',
    bg: 'rgba(139, 92, 246, 0.1)',
    title: 'Blockchain Transparency',
    desc: 'Every credit minted as an ERC-1155 token on Polygon. Verify any certificate on Polygonscan in seconds.',
  },
  {
    icon: '🛡',
    bg: 'rgba(245, 158, 11, 0.1)',
    title: '85-95% Rejection Rate',
    desc: "We maintain the highest quality standards. Most submissions don't make the cut. That's the point.",
  },
  {
    icon: '📊',
    bg: 'rgba(16, 185, 129, 0.1)',
    title: 'Full Credit Lineage',
    desc: 'Track every credit from generation through verification, listing, purchase, and retirement. Complete audit trail.',
  },
];

export function TrustSection() {
  return (
    <Section>
      <Inner>
        <SectionLabel>Why Trust WQT</SectionLabel>
        <SectionTitle>Quality is the Brand</SectionTitle>
        <SectionSub>
          Every credit verified, every transaction traceable,
          every outcome measurable. Built for the standard that matters.
        </SectionSub>

        <TrustGrid>
          {TRUST_CARDS.map((c) => (
            <TrustCard key={c.title}>
              <CardIconWrap $bg={c.bg}>{c.icon}</CardIconWrap>
              <CardTitle>{c.title}</CardTitle>
              <CardDesc>{c.desc}</CardDesc>
            </TrustCard>
          ))}
        </TrustGrid>

        <EcosystemBanner>
          <EcoCard>
            <EcoIcon $bg="rgba(6, 182, 212, 0.15)">🔧</EcoIcon>
            <EcoTitle>BlueSignal Hardware</EcoTitle>
            <EcoDesc>WQM-1 monitoring devices. The sensor network powering verified credits.</EcoDesc>
            <EcoLink href="https://bluesignal.xyz" target="_blank" rel="noopener">bluesignal.xyz ↗</EcoLink>
          </EcoCard>
          <EcoCard>
            <EcoIcon $bg="rgba(0, 102, 255, 0.15)">☁️</EcoIcon>
            <EcoTitle>BlueSignal Cloud</EcoTitle>
            <EcoDesc>Device management, real-time data, and fleet monitoring dashboard.</EcoDesc>
            <EcoLink href="https://cloud.bluesignal.xyz" target="_blank" rel="noopener">cloud.bluesignal.xyz ↗</EcoLink>
          </EcoCard>
          <EcoCard>
            <EcoIcon $bg="rgba(0, 82, 204, 0.15)">⇄</EcoIcon>
            <EcoTitle>WQT Exchange</EcoTitle>
            <EcoDesc>The marketplace where verified credits are listed, traded, and retired.</EcoDesc>
            <EcoLink href="/marketplace">Enter Marketplace →</EcoLink>
          </EcoCard>
        </EcosystemBanner>
      </Inner>
    </Section>
  );
}
