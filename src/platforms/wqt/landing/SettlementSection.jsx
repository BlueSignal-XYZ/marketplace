/**
 * SettlementSection — billing, rebate mechanics, and future VPP model.
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
  margin: 0;
  max-width: 800px;
`;

const FLOW_STEPS = [
  {
    num: '01',
    bg: 'rgba(0, 82, 204, 0.1)',
    color: '#0052CC',
    title: 'Credit Generation',
    desc: 'Water generators produce water. BlueSignal devices monitor quality. Credits are created based on verified quantity and quality data from both systems.',
  },
  {
    num: '02',
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
    title: 'Rebate Issuance',
    desc: 'The system issues a rebate \u2014 delivered via check \u2014 to the utility. The rebate amount is calculated from verified credit generation across all participating homeowners.',
  },
  {
    num: '03',
    bg: 'rgba(139, 92, 246, 0.1)',
    color: '#8B5CF6',
    title: 'Homeowner Credit',
    desc: 'The utility credits homeowner accounts based on device readings and verified credit generation. The utility may pass the full rebate value or keep a portion as an administrative fee.',
  },
];

export function SettlementSection() {
  return (
    <Section id="settlement">
      <Inner>
        <SectionLabel>Billing & Settlement</SectionLabel>
        <SectionTitle>Rebate-Based Settlement</SectionTitle>
        <SectionSub>
          Credits are settled through a rebate that works with existing utility
          billing systems — no replacement or migration needed.
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
          <HighlightTitle>Zero Infrastructure Changes</HighlightTitle>
          <HighlightText>
            Rebates flow through existing billing channels and homeowner credits
            appear on their regular utility accounts. The utility's agreement
            determines whether the full rebate value passes to the homeowner or
            a portion is kept as an administrative fee.
          </HighlightText>
        </HighlightCard>

        <FutureCard>
          <FutureLabel>Future Phase</FutureLabel>
          <FutureTitle>Water Virtual Power Plant (VPP)</FutureTitle>
          <FutureDesc>
            A future phase introduces a water VPP model where homeowners can pump
            locally generated water back into treatment facilities or municipal water
            tanks. This creates a secondary revenue stream for utilities and a
            long-term reason to participate beyond credits alone, transforming
            distributed water production into a grid-level resource.
          </FutureDesc>
        </FutureCard>
      </Inner>
    </Section>
  );
}
