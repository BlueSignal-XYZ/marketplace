/**
 * CreditDefinitionsSection — presents the two credit types (QC + KC)
 * and their interaction mechanics.
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

const CreditsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
`;

const CreditCard = styled.div`
  padding: 36px 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  transition: border-color 200ms;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const CreditBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const CreditSymbol = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 700;
`;

const CreditTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
  letter-spacing: -0.01em;
`;

const CreditUnit = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 16px;
  font-weight: 500;
`;

const CreditDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 20px;
`;

const VerificationNote = styled.div`
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const VerificationLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const InteractionCard = styled.div`
  margin-top: 32px;
  padding: 36px 32px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  color: #FFFFFF;
`;

const InteractionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 16px;
  letter-spacing: -0.01em;
`;

const InteractionDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 800px;
`;

const InteractionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const InteractionItem = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

const InteractionItemLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
`;

const InteractionItemValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
`;

export function CreditDefinitionsSection() {
  return (
    <Section id="credit-definitions">
      <Inner>
        <SectionLabel>Credit Architecture</SectionLabel>
        <SectionTitle>Two Credits. One Verified Value.</SectionTitle>
        <SectionSub>
          The system uses two credit types that work together.
          Quantity measures how much water is produced. Quality measures
          environmental benefit. Together they reflect both output and purity.
        </SectionSub>

        <CreditsGrid>
          <CreditCard>
            <CreditBadge $bg="rgba(0, 82, 204, 0.1)" $color="#0052CC">
              <CreditSymbol>QC</CreditSymbol>
              Quantity Credit
            </CreditBadge>
            <CreditTitle>Quantity Credit</CreditTitle>
            <CreditUnit>1 QC = 1 gallon produced</CreditUnit>
            <CreditDesc>
              One quantity credit equals one gallon of water produced by your
              atmospheric water generator. The baseline unit of the credit system.
            </CreditDesc>
            <VerificationNote>
              <VerificationLabel>Verification: </VerificationLabel>
              Two-source metering via an inline flow sensor cross-referenced
              with the property water meter. Two independent data sources for
              every gallon, creating a clear chain of custody.
            </VerificationNote>
          </CreditCard>

          <CreditCard>
            <CreditBadge $bg="rgba(16, 185, 129, 0.1)" $color="#10B981">
              <CreditSymbol>KC</CreditSymbol>
              Quality Credit
            </CreditBadge>
            <CreditTitle>Quality Credit</CreditTitle>
            <CreditUnit>1 KC = 1 kg N/P offset or removed</CreditUnit>
            <CreditDesc>
              One quality credit equals one kilogram of nitrogen or phosphorus
              offset or removed. KCs represent the environmental value and relate
              directly to utility treatment cost savings.
            </CreditDesc>
            <VerificationNote>
              <VerificationLabel>Verification: </VerificationLabel>
              Continuous monitoring via BlueSignal WQM-1 devices measuring water
              quality around the clock, validated by independent third-party sampling
              of at least 25% of active sites each year.
            </VerificationNote>
          </CreditCard>
        </CreditsGrid>

        <InteractionCard>
          <InteractionTitle>Credit Interaction</InteractionTitle>
          <InteractionDesc>
            Quantity credits increase or decrease based on quality credits. A homeowner
            producing 100 gallons per day of very clean water earns both QCs and KCs at
            the same time — their output carries a quality bonus. If water quality drops,
            quality credits decline and the value of quantity credits decreases too.
            This creates a built-in incentive: maintaining your system directly
            impacts your earnings.
          </InteractionDesc>
          <InteractionGrid>
            <InteractionItem>
              <InteractionItemLabel>High Quality</InteractionItemLabel>
              <InteractionItemValue>
                Very clean water boosts QC value through a KC bonus.
                Maximum combined credit earning.
              </InteractionItemValue>
            </InteractionItem>
            <InteractionItem>
              <InteractionItemLabel>Baseline</InteractionItemLabel>
              <InteractionItemValue>
                Standard water quality produces QCs at base rate.
                KC contribution is neutral.
              </InteractionItemValue>
            </InteractionItem>
            <InteractionItem>
              <InteractionItemLabel>Degraded</InteractionItemLabel>
              <InteractionItemValue>
                Filter aging or system drift reduces KC output.
                Effective QC value decreases proportionally.
              </InteractionItemValue>
            </InteractionItem>
          </InteractionGrid>
        </InteractionCard>
      </Inner>
    </Section>
  );
}
