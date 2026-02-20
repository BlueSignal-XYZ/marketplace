/**
 * SettlementSection — billing, rebate mechanics, and future demand response model.
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

const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
`;

const FlowStep = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 20px;
  padding: 28px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  align-items: start;

  &:last-child { border-bottom: none; }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 80px 1fr;
    gap: 32px;
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const StepDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const HighlightCard = styled.div`
  padding: 28px 32px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: 32px;
`;

const HighlightTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 8px;
`;

const HighlightText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const FutureCard = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  color: #FFFFFF;
`;

const FutureLabel = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.9);
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 6px;
  padding: 4px 10px;
  margin-bottom: 16px;
`;

const FutureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px;
`;

const FutureDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin: 0 0 20px;
  max-width: 800px;
`;

const FuturePointsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
`;

const FuturePoint = styled.div`
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

const FuturePointTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 4px;
`;

const FuturePointDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
`;

const FLOW_STEPS = [
  {
    num: '01',
    bg: 'rgba(0, 82, 204, 0.1)',
    color: '#0052CC',
    title: 'Credit Generation',
    desc: 'Your atmospheric water generator produces clean water and stores it on-site. Every gallon produced is metered by an inline flow sensor. BlueSignal\u2019s monitoring platform continuously verifies water quality. When production meets program thresholds, verified credits are automatically generated and registered on the platform.',
  },
  {
    num: '02',
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
    title: 'Utility Rebate',
    desc: 'Because you\u2019re producing your own water, you draw less from the municipal supply. Your utility recognizes this reduced demand and issues a rebate \u2014 it appears as a credit on your monthly water bill. The rebate rate is set by your utility based on their avoided cost of treatment and delivery.',
  },
  {
    num: '03',
    bg: 'rgba(139, 92, 246, 0.1)',
    color: '#8B5CF6',
    title: 'Platform Services',
    desc: 'The platform charges a small service fee for continuous monitoring, verification, and program management. This fee is transparent and deducted automatically \u2014 you always see your net rebate amount before opting in.',
  },
];

export function SettlementSection() {
  return (
    <Section id="settlement">
      <Inner>
        <SectionLabel>Billing & Settlement</SectionLabel>
        <SectionTitle>How Credits Become Revenue</SectionTitle>
        <SectionSub>
          Your system produces water. You use less from the city. Your utility pays you
          a rebate because that costs them less than delivering the water themselves.
        </SectionSub>

        <FlowContainer>
          {FLOW_STEPS.map((step) => (
            <FlowStep key={step.num}>
              <StepNumber $bg={step.bg} $color={step.color}>{step.num}</StepNumber>
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDesc>{step.desc}</StepDesc>
              </StepContent>
            </FlowStep>
          ))}
        </FlowContainer>

        <HighlightCard>
          <HighlightTitle>Why Utilities Pay</HighlightTitle>
          <HighlightText>
            It costs your utility more to treat and deliver one gallon of water
            than to rebate you for producing it yourself. Self-generation reduces strain
            on aging infrastructure, defers capital expenditure on new treatment plants,
            and helps utilities meet conservation mandates. The rebate is not charity —
            it's cheaper than the alternative.
          </HighlightText>
        </HighlightCard>

        <FutureCard>
          <FutureLabel>Future Phase</FutureLabel>
          <FutureTitle>Water Demand Response</FutureTitle>
          <FutureDesc>
            Earn incentives by reducing municipal water draw during peak demand — the same
            concept as electrical demand response, applied to water.
          </FutureDesc>
          <FutureDesc>
            During peak demand periods — summer heat, drought conditions, or system strain —
            municipal water infrastructure is under the most pressure. Homeowners with
            atmospheric water generators can be dispatched via API to increase local production,
            reducing their draw on city supply exactly when it matters most.
          </FutureDesc>
          <FutureDesc>
            The utility avoids costly peak infrastructure upgrades. The homeowner earns a small
            demand response incentive on top of their standard rebate. The platform coordinates
            dispatch signals and verifies reduced consumption through BlueSignal monitoring data.
          </FutureDesc>
          <FuturePointsGrid>
            <FuturePoint>
              <FuturePointTitle>Peak Dispatch</FuturePointTitle>
              <FuturePointDesc>Systems receive signals to ramp production during high-demand windows</FuturePointDesc>
            </FuturePoint>
            <FuturePoint>
              <FuturePointTitle>Verified Reduction</FuturePointTitle>
              <FuturePointDesc>BlueSignal devices confirm the homeowner drew less municipal water</FuturePointDesc>
            </FuturePoint>
            <FuturePoint>
              <FuturePointTitle>Stacked Incentive</FuturePointTitle>
              <FuturePointDesc>Demand response payments layer on top of standard generation rebates</FuturePointDesc>
            </FuturePoint>
            <FuturePoint>
              <FuturePointTitle>No Hardware Changes</FuturePointTitle>
              <FuturePointDesc>The same system, same monitoring — just smarter scheduling</FuturePointDesc>
            </FuturePoint>
          </FuturePointsGrid>
        </FutureCard>
      </Inner>
    </Section>
  );
}
