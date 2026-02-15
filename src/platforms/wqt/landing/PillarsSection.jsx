/**
 * PillarsSection — Monitor → Trade → Impact.
 * Three value propositions with connecting arrows.
 */

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.background};
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
  font-size: 36px;
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
  max-width: 600px;
  margin: 0 auto 64px;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
`;

const Pillar = styled.div`
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: box-shadow 200ms, border-color 200ms;
  &:hover {
    box-shadow: ${({ theme }) => theme.elevation.cardHover};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PillarIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 20px;
`;

const PillarTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 10px;
`;

const PillarDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 16px;
`;

const PillarFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Feature = styled.li`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-left: 20px;
  position: relative;
  &::before {
    content: '→';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const PILLARS = [
  {
    icon: '◉',
    iconBg: 'rgba(6, 182, 212, 0.1)',
    title: 'Monitor',
    desc: 'Real-time environmental intelligence from sensor-verified data sources across watersheds.',
    features: ['1,200+ active sensors', 'Watershed quality indices', 'Public data feeds', 'Interactive map explorer'],
  },
  {
    icon: '⇄',
    iconBg: 'rgba(0, 82, 204, 0.1)',
    title: 'Trade',
    desc: 'Buy and sell nutrient credits on a transparent exchange with institutional-grade infrastructure.',
    features: ['Nitrogen & phosphorus credits', 'Card or wallet payments', 'Blockchain settlement', 'Sortable marketplace tables'],
  },
  {
    icon: '✓',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    title: 'Impact',
    desc: 'Every credit verified, every retirement traceable. Proof of environmental outcomes on-chain.',
    features: ['ERC-1155 certificate NFTs', 'Polygonscan verification', 'Impact reports', 'Retirement registry'],
  },
];

export function PillarsSection() {
  return (
    <Section>
      <Inner>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>From Sensors to Settlements</SectionTitle>
        <SectionSub>
          A complete pipeline from environmental monitoring to verified credit trading —
          powered by IoT sensors, validated by data, and settled on blockchain.
        </SectionSub>
        <Grid>
          {PILLARS.map((p) => (
            <Pillar key={p.title}>
              <PillarIcon $bg={p.iconBg}>{p.icon}</PillarIcon>
              <PillarTitle>{p.title}</PillarTitle>
              <PillarDesc>{p.desc}</PillarDesc>
              <PillarFeatures>
                {p.features.map((f) => <Feature key={f}>{f}</Feature>)}
              </PillarFeatures>
            </Pillar>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
