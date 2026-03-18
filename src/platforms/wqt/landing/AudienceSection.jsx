/**
 * AudienceSection — three-audience gateway for Utilities, Homeowners, and Aggregators.
 * Each card links to a dedicated page.
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
  max-width: 620px;
  margin: 0 auto 64px;
  line-height: 1.6;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
  }
`;

const AudienceCard = styled.a`
  padding: 36px 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  text-decoration: none;
  transition: all 200ms;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.elevation.cardHover};
    transform: translateY(-2px);
  }
`;

const AudienceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const IconSvg = styled.svg`
  width: 24px;
  height: 24px;
`;

const AudienceTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
  letter-spacing: -0.01em;
`;

const AudienceDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 20px;
  flex: 1;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeatureItem = styled.li`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  padding-left: 18px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $accent }) => $accent};
  }
`;

const CardLink = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: auto;
`;

const AUDIENCES = [
  {
    href: '/for-utilities',
    bg: 'rgba(0, 82, 204, 0.1)',
    accent: '#0052CC',
    title: 'For Utilities & Municipalities',
    desc: 'Reduce treatment costs through distributed water production with utility-controlled pricing and no changes to your billing systems.',
    features: [
      'Set your own buyback rates and quality multipliers',
      'No modification to existing billing systems',
      'Rebate-based settlement mechanics',
      'Future demand response incentive opportunity',
    ],
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    href: '/for-homeowners',
    bg: 'rgba(16, 185, 129, 0.1)',
    accent: '#10B981',
    title: 'For Homeowners',
    desc: 'Produce your own clean water, reduce your utility bill, and earn rebates. Your system generates verified credits automatically \u2014 rebates appear as credits on your monthly water bill.',
    features: [
      'Earn both quantity and quality credits',
      'ROI calculator based on your utility\'s rates',
      'Fully automated verification process',
      'Credits appear as rebates on your utility bill',
    ],
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/for-aggregators',
    bg: 'rgba(139, 92, 246, 0.1)',
    accent: '#8B5CF6',
    title: 'For Aggregators & Investors',
    desc: 'Build and manage diversified water credit portfolios. Aggregate supply from distributed producers, apply institutional risk frameworks, and access utility-scale demand.',
    features: [
      'Portfolio management across regions and credit types',
      'Risk framework (the Greeks) for pricing and hedging',
      'Single-contract utility engagement at scale',
      'Market infrastructure for tradeable credit positions',
    ],
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

export function AudienceSection() {
  return (
    <Section id="audiences">
      <Inner>
        <SectionLabel>Who Is This For?</SectionLabel>
        <SectionTitle>Find Your Role in the Market</SectionTitle>
        <SectionSub>
          Three participants, three clear value propositions. Choose your path.
        </SectionSub>

        <CardsGrid>
          {AUDIENCES.map((a) => (
            <AudienceCard key={a.title} href={a.href}>
              <AudienceIcon $bg={a.bg}>
                <IconSvg viewBox="0 0 24 24" fill="none" stroke={a.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={a.iconPath} />
                </IconSvg>
              </AudienceIcon>
              <AudienceTitle>{a.title}</AudienceTitle>
              <AudienceDesc>{a.desc}</AudienceDesc>
              <FeatureList>
                {a.features.map((f) => (
                  <FeatureItem key={f} $accent={a.accent}>{f}</FeatureItem>
                ))}
              </FeatureList>
              <CardLink>Learn more →</CardLink>
            </AudienceCard>
          ))}
        </CardsGrid>
      </Inner>
    </Section>
  );
}
