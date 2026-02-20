/**
 * PricingSection — utility-controlled pricing mechanics.
 * Buyback rates, quality multipliers, and ROI visibility.
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`;

const Card = styled.div`
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: border-color 200ms;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
  letter-spacing: -0.01em;
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 24px;
`;

const RateTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  overflow: hidden;
`;

const RateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: ${({ $highlighted, theme }) => $highlighted ? theme.colors.background : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child { border-bottom: none; }
`;

const RateLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RateValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const RateBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const NoteCard = styled.div`
  margin-top: 24px;
  padding: 24px 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  grid-column: 1 / -1;
`;

const NoteTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const NoteDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

export function PricingSection() {
  return (
    <Section id="pricing">
      <Inner>
        <SectionLabel>Pricing Mechanics</SectionLabel>
        <SectionTitle>Utility-Controlled Pricing</SectionTitle>
        <SectionSub>
          Pricing is controlled by the utility or municipality. The system
          provides a configurable template and the utility sets values that
          reflect their local costs.
        </SectionSub>

        <ContentGrid>
          <Card>
            <CardTitle>Quantity Buyback Rate</CardTitle>
            <CardDesc>
              The utility sets the rate at which they compensate homeowners per
              gallon produced. The rate reflects the utility's view of what
              distributed water production is worth to their system.
            </CardDesc>
            <RateTable>
              <RateRow>
                <RateLabel>Quarter Rate</RateLabel>
                <RateBadge $bg="rgba(245, 158, 11, 0.1)" $color="#D97706">0.25 : 1</RateBadge>
              </RateRow>
              <RateRow>
                <RateLabel>Half Rate</RateLabel>
                <RateBadge $bg="rgba(0, 82, 204, 0.1)" $color="#0052CC">0.50 : 1</RateBadge>
              </RateRow>
              <RateRow>
                <RateLabel>Full Parity</RateLabel>
                <RateBadge $bg="rgba(16, 185, 129, 0.1)" $color="#10B981">1.00 : 1</RateBadge>
              </RateRow>
            </RateTable>
          </Card>

          <Card>
            <CardTitle>Quality Multiplier</CardTitle>
            <CardDesc>
              The utility sets the quality multiplier based on their environmental
              goals for their service area. A higher multiplier rewards homeowners
              producing cleaner water, reflecting real treatment cost savings.
            </CardDesc>
            <RateTable>
              <RateRow>
                <RateLabel>Multiplier Authority</RateLabel>
                <RateValue>Utility / Municipality</RateValue>
              </RateRow>
              <RateRow>
                <RateLabel>Basis</RateLabel>
                <RateValue>Regional N/P treatment costs</RateValue>
              </RateRow>
              <RateRow>
                <RateLabel>Recommendations</RateLabel>
                <RateValue>BlueSignal</RateValue>
              </RateRow>
              <RateRow>
                <RateLabel>Final Decision</RateLabel>
                <RateValue>Utility</RateValue>
              </RateRow>
            </RateTable>
          </Card>

          <NoteCard>
            <NoteTitle>Homeowner ROI Visibility</NoteTitle>
            <NoteDesc>
              A calculator tool lets homeowners see their projected return based on
              the rates their utility has chosen. This transparency helps drive adoption
              and makes enrollment simple. Utilities already track their costs per
              kilogram of N/P removal, so quality credits are easy for their teams
              to understand and evaluate.
            </NoteDesc>
          </NoteCard>
        </ContentGrid>
      </Inner>
    </Section>
  );
}
