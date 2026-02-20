/**
 * ForAggregatorsPage — dedicated page for aggregators and investors.
 * Covers Greeks framework, portfolio management, and market structure.
 */

import React from 'react';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 80px 24px 64px;
  background: #0B1120;
  color: #FFFFFF;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 120px 24px 96px;
  }
`;

const HeroInner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Breadcrumb = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  margin-bottom: 24px;
  display: inline-block;
  &:hover { color: rgba(255, 255, 255, 0.6); }
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 20px;
`;

const HeroSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 620px;
  margin: 0;
`;

const Section = styled.section`
  padding: 80px 24px;
  background: ${({ $alt, theme }) => $alt ? theme.colors.surface : theme.colors.background};

  @media (max-width: 640px) {
    padding: 56px 20px;
  }
`;

const SectionInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
  letter-spacing: -0.02em;
`;

const SectionDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 32px;
  max-width: 700px;
`;

const GreeksTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GreekRow = styled.div`
  display: grid;
  grid-template-columns: 60px 160px 1fr;
  gap: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const GreekSymbol = styled.span`
  font-family: 'Times New Roman', 'Georgia', serif;
  font-size: 32px;
  color: ${({ $color }) => $color};
  line-height: 1;
`;

const GreekName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const GreekSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const GreekDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const CardAlt = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
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

const ComparisonNote = styled.div`
  margin-top: 32px;
  padding: 28px 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const ComparisonTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const ComparisonDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const CTASection = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  text-align: center;
`;

const CTATitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
`;

const CTADesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 auto 32px;
  max-width: 520px;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
`;

const GREEKS = [
  {
    symbol: '\u0394',
    color: '#0052CC',
    name: 'Delta',
    sub: 'Price Sensitivity',
    desc: 'Sensitivity of credit value to underlying water price or treatment cost changes. Arid-region portfolios exhibit higher delta. Use delta to assess how regional water economics impact portfolio value and structure positions accordingly.',
  },
  {
    symbol: '\u0393',
    color: '#8B5CF6',
    name: 'Gamma',
    sub: 'Acceleration',
    desc: 'Rate of change of delta. When droughts spike water prices, gamma indicates how rapidly credit values accelerate. High gamma signals nonlinear risk exposure — critical for determining whether positions can be hedged effectively.',
  },
  {
    symbol: '\u0398',
    color: '#D97706',
    name: 'Theta',
    sub: 'Time Decay',
    desc: 'Credits degrade over time as filters age, seasonal contamination patterns shift, and verification data becomes stale. Theta enforces portfolio freshness and prevents credit hoarding. Credits carry expiration windows tied to verification recency.',
  },
  {
    symbol: '\u03BD',
    color: '#10B981',
    name: 'Vega',
    sub: 'Volatility Sensitivity',
    desc: 'Measures credit value response to changes in market uncertainty. Spikes during regulatory shifts, contamination events, or infrastructure failures. Use vega to understand exposure to uncertainty as a variable independent of price direction.',
  },
  {
    symbol: '\u03C1',
    color: '#06B6D4',
    name: 'Rho',
    sub: 'Cost of Carry',
    desc: 'Sensitivity to the time value of money. Captures the difference between annual versus monthly rebate structures and the carrying cost of holding credits before settlement. Increasingly relevant as financial products are built on credit pools.',
  },
];

export default function ForAggregatorsPage() {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb href="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Build and Manage Water Credit Portfolios at Scale</HeroTitle>
          <HeroSub>
            The Greeks framework enables sophisticated pricing, hedging, and
            structured market participation. This is where a rebate program
            becomes a functioning market.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>The Greeks Framework</SectionTitle>
          <SectionDesc>
            A mature market requires instruments to measure and price risk. The
            following framework adapts the Greeks of options pricing to water
            quality credits, enabling quantified exposure assessment and informed
            portfolio decisions.
          </SectionDesc>
          <GreeksTable>
            {GREEKS.map((g) => (
              <GreekRow key={g.name}>
                <GreekSymbol $color={g.color}>{g.symbol}</GreekSymbol>
                <div>
                  <GreekName>{g.name}</GreekName>
                  <GreekSub>{g.sub}</GreekSub>
                </div>
                <GreekDesc>{g.desc}</GreekDesc>
              </GreekRow>
            ))}
          </GreeksTable>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>Portfolio Management</SectionTitle>
          <SectionDesc>
            Aggregators purchase or manage credit portfolios from hundreds or
            thousands of Aquaria homeowners across regions. This layer absorbs
            the complexity of individual account management and offers utilities
            simplified, bulk contracts.
          </SectionDesc>
          <Grid>
            <CardAlt>
              <CardTitle>Regional Diversification</CardTitle>
              <CardDesc>
                By managing credits across geographies, aggregators achieve natural
                diversification of both quantity risk (production variance) and quality
                risk (environmental conditions). Delta varies by region — build portfolios
                that reflect this variance.
              </CardDesc>
            </CardAlt>
            <CardAlt>
              <CardTitle>Utility Simplification</CardTitle>
              <CardDesc>
                Instead of managing thousands of individual homeowner relationships,
                utilities engage a single aggregator contract. This abstraction layer
                is what makes the system scalable at the institutional level.
              </CardDesc>
            </CardAlt>
            <CardAlt>
              <CardTitle>Hedging Strategies</CardTitle>
              <CardDesc>
                Use gamma to assess nonlinear risk during events like droughts.
                Use vega to price uncertainty exposure. Use theta to manage portfolio
                freshness. The Greeks provide the quantitative foundation for structured
                hedging across credit pools.
              </CardDesc>
            </CardAlt>
            <CardAlt>
              <CardTitle>Financial Products</CardTitle>
              <CardDesc>
                As the market scales, the Greeks enable construction of structured
                products on top of credit pools. Rho captures the cost of carry across
                different rebate structures, creating the basis for financing instruments.
              </CardDesc>
            </CardAlt>
          </Grid>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>Market Structure</SectionTitle>
          <SectionDesc>
            The water quality credit market shares structural analogies with
            solar REC and carbon credit markets, while remaining earlier stage
            and less standardized. This represents both opportunity and risk.
          </SectionDesc>
          <Grid>
            <Card>
              <CardTitle>Credit Architecture</CardTitle>
              <CardDesc>
                Two standardized credit types (quantity and quality) that interact
                to create a composite value signal. This dual-credit structure provides
                richer risk decomposition than single-credit systems.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Verification Infrastructure</CardTitle>
              <CardDesc>
                Three-layer verification (Aquaria metering, BlueSignal continuous
                monitoring, independent third-party sampling) creates an institutional-grade
                trust layer. No single party can unilaterally validate credits.
              </CardDesc>
            </Card>
          </Grid>

          <ComparisonNote>
            <ComparisonTitle>Structural Analogies</ComparisonTitle>
            <ComparisonDesc>
              The solar REC and carbon credit markets provide useful structural analogies
              for market development trajectory. However, water quality credit markets are
              at an earlier stage and less standardized. Water quality trading programs
              exist under the Clean Water Act, primarily through the EPA's Water Quality
              Trading Policy (2003) and various state-level programs. The system is designed
              to align with these existing regulatory frameworks.
            </ComparisonDesc>
          </ComparisonNote>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Interested in Aggregation?</CTATitle>
        <CTADesc>
          Contact us to discuss portfolio construction, regional availability,
          and market access for institutional participants.
        </CTADesc>
        <CTAButton href="/contact">Contact Us</CTAButton>
      </CTASection>
    </Page>
  );
}
