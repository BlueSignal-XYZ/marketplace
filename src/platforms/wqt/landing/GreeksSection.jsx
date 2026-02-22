/**
 * GreeksSection — market risk framework adapted from options pricing.
 * Targets aggregators and investors specifically.
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
  max-width: 640px;
  margin: 0 auto 20px;
  line-height: 1.6;
`;

const FramingNote = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  max-width: 640px;
  margin: 48px auto 0;
  line-height: 1.6;
  font-style: italic;
`;

const GreeksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    gap: 20px;
  }
`;

const GreekCard = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 24px;
  padding: 28px 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: border-color 200ms;
  align-items: start;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GreekSymbolWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  @media (max-width: 640px) {
    flex-direction: row;
    gap: 12px;
  }
`;

const GreekSymbol = styled.span`
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 36px;
  font-weight: 400;
  color: ${({ $color }) => $color};
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const GreekName = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const GreekContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GreekTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

const GreekDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const GreekExample = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  line-height: 1.5;
`;

const GREEKS = [
  {
    symbol: '\u0394',
    name: 'Delta',
    color: '#0052CC',
    title: 'Price Sensitivity',
    desc: 'How much credit value changes when the underlying water price or treatment cost shifts. A utility in dry West Texas will show a higher delta than one in water-rich East Texas.',
    example: 'Helps aggregators understand how regional water economics affect portfolio value.',
  },
  {
    symbol: '\u0393',
    name: 'Gamma',
    color: '#8B5CF6',
    title: 'Acceleration of Price Sensitivity',
    desc: 'How fast delta itself is changing. When a drought hits and prices spike, gamma shows how quickly credit values are accelerating. High gamma means risk is growing faster than expected.',
    example: 'Important for aggregators deciding whether positions can be hedged effectively.',
  },
  {
    symbol: '\u0398',
    name: 'Theta',
    color: '#D97706',
    title: 'Time Decay',
    desc: 'Water quality credits lose value over time. A credit from today is worth more than one from six months ago because conditions change — filters age, seasonal contamination shifts, and system performance drifts.',
    example: 'Keeps the market fresh and prevents credit hoarding. Credits have expiration windows tied to how recently they were verified.',
  },
  {
    symbol: '\u03BD',
    name: 'Vega',
    color: '#10B981',
    title: 'Volatility Sensitivity',
    desc: 'How credit value responds to changes in market uncertainty. During regulatory shifts, contamination events, or infrastructure failures, vega spikes.',
    example: 'Helps aggregators understand their exposure to uncertainty, separate from price direction.',
  },
  {
    symbol: '\u03C1',
    name: 'Rho',
    color: '#06B6D4',
    title: 'Cost of Carry',
    desc: 'How sensitive credit value is to the cost of money over time. For aggregators financing credit portfolios, rho captures the difference between annual vs. monthly rebate structures and the cost of holding credits before settlement.',
    example: 'Becomes especially relevant as the market grows and financial products are built on credit pools.',
  },
];

export function GreeksSection() {
  return (
    <Section id="risk-framework">
      <Inner>
        <SectionLabel>Market Risk Framework</SectionLabel>
        <SectionTitle>The Greeks</SectionTitle>
        <SectionSub>
          A healthy market needs tools to measure and price risk. This framework
          adapts the Greeks from options pricing to water quality credits, helping
          aggregators, utilities, and investors understand their exposure and
          make informed decisions.
        </SectionSub>

        <GreeksGrid>
          {GREEKS.map((greek) => (
            <GreekCard key={greek.name}>
              <GreekSymbolWrap>
                <GreekSymbol $color={greek.color}>{greek.symbol}</GreekSymbol>
                <GreekName>{greek.name}</GreekName>
              </GreekSymbolWrap>
              <GreekContent>
                <GreekTitle>{greek.title}</GreekTitle>
                <GreekDesc>{greek.desc}</GreekDesc>
                <GreekExample>{greek.example}</GreekExample>
              </GreekContent>
            </GreekCard>
          ))}
        </GreeksGrid>

        <FramingNote>
          For Institutional Participants: The following risk framework applies to
          aggregators and institutional portfolios managing diversified credit
          positions. Homeowners participating in rebate programs do not need to
          understand these metrics — your rebate is straightforward and guaranteed
          by your utility agreement.
        </FramingNote>
      </Inner>
    </Section>
  );
}
