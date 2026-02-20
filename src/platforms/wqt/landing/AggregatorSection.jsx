/**
 * AggregatorSection — the aggregator model that transforms
 * the system from a rebate program into a functioning market.
 */

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.surface};

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

const MainCard = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  color: #FFFFFF;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    padding: 28px 24px;
  }
`;

const MainDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.8;
  margin: 0 0 32px;
  max-width: 800px;
`;

const GreeksUsage = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const UsageItem = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

const UsageGreek = styled.div`
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 24px;
  color: ${({ $color }) => $color};
  margin-bottom: 8px;
`;

const UsageLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
`;

const UsageDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: border-color 200ms;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const FeatureTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const FeatureDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const GREEKS_USAGE = [
  { symbol: '\u0394', label: 'Delta', color: '#0052CC', desc: 'Price regional exposure' },
  { symbol: '\u0393', label: 'Gamma', color: '#8B5CF6', desc: 'Assess nonlinear risk' },
  { symbol: '\u0398', label: 'Theta', color: '#D97706', desc: 'Manage freshness' },
  { symbol: '\u03BD', label: 'Vega', color: '#10B981', desc: 'Hedge uncertainty' },
  { symbol: '\u03C1', label: 'Rho', color: '#06B6D4', desc: 'Optimize financing' },
];

const FEATURES = [
  {
    title: 'Simplified Utility Engagement',
    desc: 'Aggregators offer utilities a single bulk contract instead of managing thousands of individual homeowner relationships. This abstraction layer is what makes the system scalable.',
  },
  {
    title: 'Portfolio Diversification',
    desc: 'By managing credits from hundreds or thousands of Aquaria homeowners across regions, aggregators achieve natural diversification of both quantity and quality risk.',
  },
  {
    title: 'Structured Products',
    desc: 'The Greeks framework enables construction of structured positions on top of credit pools. As the market scales, financial products become viable on underlying credit portfolios.',
  },
  {
    title: 'Market Liquidity',
    desc: 'Aggregators create the liquidity necessary for a functioning market. Without them, the system remains a rebate program. With them, it becomes a tradeable market.',
  },
];

export function AggregatorSection() {
  return (
    <Section id="aggregators">
      <Inner>
        <SectionLabel>Aggregator Model</SectionLabel>
        <SectionTitle>From Rebate Program to Functioning Market</SectionTitle>
        <SectionSub>
          Aggregators purchase or manage credit portfolios from hundreds or thousands
          of Aquaria homeowners, absorbing the complexity of individual account
          management. This layer is what transforms the system.
        </SectionSub>

        <MainCard>
          <MainDesc>
            Aggregators use the Greeks to price, hedge, and structure their positions
            across regional portfolios. They offer utilities simplified, bulk contracts
            rather than thousands of individual relationships. The result is a market
            with institutional depth, not a collection of isolated rebate transactions.
          </MainDesc>

          <GreeksUsage>
            {GREEKS_USAGE.map((g) => (
              <UsageItem key={g.label}>
                <UsageGreek $color={g.color}>{g.symbol}</UsageGreek>
                <UsageLabel>{g.label}</UsageLabel>
                <UsageDesc>{g.desc}</UsageDesc>
              </UsageItem>
            ))}
          </GreeksUsage>
        </MainCard>

        <FeaturesGrid>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title}>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Inner>
    </Section>
  );
}
