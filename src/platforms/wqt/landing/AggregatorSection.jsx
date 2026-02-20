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

const TopCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
`;

const TopCard = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  color: #FFFFFF;

  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const TopCardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 10px;
`;

const TopCardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin: 0;
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

const TOP_CARDS = [
  {
    title: 'Bundled Supply',
    desc: 'Individual homeowner credits are pooled into regional portfolios. Utilities purchase from the portfolio \u2014 one contract, one relationship \u2014 instead of managing thousands of individual accounts.',
  },
  {
    title: 'Diversified Risk',
    desc: 'Credits from different regions, climates, and system types are combined. Geographic and seasonal diversity means the portfolio produces reliably even when individual systems fluctuate.',
  },
  {
    title: 'Market Depth',
    desc: 'Aggregators create the liquidity that makes this a real market. Without them, it\u2019s a rebate program. With them, credits are tradeable, priceable, and financeable.',
  },
];

const FEATURES = [
  {
    title: 'Simplified Utility Engagement',
    desc: 'One aggregator, one contract, one invoice. Utilities get verified water credits at scale without managing individual homeowner relationships. This abstraction layer is what makes the system work at municipal scale.',
  },
  {
    title: 'Portfolio Diversification',
    desc: 'By managing credits across hundreds of homeowners in different regions, aggregators achieve natural diversification of both quantity and quality risk. The Greeks framework (see Risk section above) gives them the tools to price and hedge that portfolio.',
  },
];

export function AggregatorSection() {
  return (
    <Section id="aggregators">
      <Inner>
        <SectionLabel>Aggregator Model</SectionLabel>
        <SectionTitle>From Rebate Program to Functioning Market</SectionTitle>
        <SectionSub>
          Aggregators bundle credits from hundreds or thousands of homeowners into
          portfolios that utilities can purchase through a single contract — turning
          distributed water production into a scalable, tradeable resource.
        </SectionSub>

        <TopCardsGrid>
          {TOP_CARDS.map((card) => (
            <TopCard key={card.title}>
              <TopCardTitle>{card.title}</TopCardTitle>
              <TopCardDesc>{card.desc}</TopCardDesc>
            </TopCard>
          ))}
        </TopCardsGrid>

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
