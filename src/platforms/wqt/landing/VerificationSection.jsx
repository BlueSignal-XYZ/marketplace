/**
 * VerificationSection — three-layer verification architecture.
 * Replaces old "How It Works" flow.
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

const LayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Layer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 32px;

  &:first-child {
    border-radius: ${({ theme }) => theme.radius.lg}px ${({ theme }) => theme.radius.lg}px 0 0;
  }
  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.radius.lg}px ${({ theme }) => theme.radius.lg}px;
  }
  &:not(:last-child) {
    border-bottom: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 200px 1fr;
    gap: 32px;
    padding: 40px;
  }
`;

const LayerMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    margin-bottom: 0;
    border-right: 1px solid ${({ theme }) => theme.colors.borderLight};
    padding-right: 32px;
  }
`;

const LayerNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const LayerTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

const LayerType = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
`;

const LayerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LayerDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const LayerDetail = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border-left: 3px solid ${({ $accent }) => $accent || '#0052CC'};
`;

const TrustStatement = styled.div`
  margin-top: 32px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  text-align: center;
`;

const TrustText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const TrustHighlight = styled.span`
  color: #06B6D4;
  font-weight: 600;
`;

const LAYERS = [
  {
    number: 'Layer 01',
    title: 'Inline Flow Metering',
    type: 'Quantity',
    typeColor: '#0052CC',
    typeBg: 'rgba(0, 82, 204, 0.1)',
    accent: '#0052CC',
    desc: 'Inline flow sensor records every gallon produced, cross-referenced against the property water meter. Two independent measurements per gallon.',
    detail: 'Discrepancies trigger automatic flags. No single data source can validate production alone.',
  },
  {
    number: 'Layer 02',
    title: 'BlueSignal Continuous Monitoring',
    type: 'Quality',
    typeColor: '#10B981',
    typeBg: 'rgba(16, 185, 129, 0.1)',
    accent: '#10B981',
    desc: 'BlueSignal WQM-1 reads water quality 24/7 and transmits to the cloud. Controls anti-fouling to maintain system performance.',
    detail: 'Every unit monitored, every signal recorded, every anomaly flagged in real time.',
  },
  {
    number: 'Layer 03',
    title: 'Independent Third-Party Sampling',
    type: 'Validation',
    typeColor: '#8B5CF6',
    typeBg: 'rgba(139, 92, 246, 0.1)',
    accent: '#8B5CF6',
    desc: '25% of active sites physically sampled annually by an independent contractor with no ties to the hardware manufacturer or homeowner.',
    detail: 'Lab results check continuous monitoring data. Discrepancies trigger investigation and credit adjustment.',
  },
];

export function VerificationSection() {
  return (
    <Section id="verification">
      <Inner>
        <SectionLabel>Verification Architecture</SectionLabel>
        <SectionTitle>Three Layers of Independent Trust</SectionTitle>
        <SectionSub>
          No single party — not the homeowner, not the manufacturer, not BlueSignal —
          can validate credits on their own. This three-layer system is the
          trust foundation of the entire market.
        </SectionSub>

        <LayersContainer>
          {LAYERS.map((layer) => (
            <Layer key={layer.number}>
              <LayerMeta>
                <LayerNumber>{layer.number}</LayerNumber>
                <LayerTitle>{layer.title}</LayerTitle>
                <LayerType $color={layer.typeColor} $bg={layer.typeBg}>
                  {layer.type}
                </LayerType>
              </LayerMeta>
              <LayerContent>
                <LayerDesc>{layer.desc}</LayerDesc>
                <LayerDetail $accent={layer.accent}>{layer.detail}</LayerDetail>
              </LayerContent>
            </Layer>
          ))}
        </LayersContainer>

        <TrustStatement>
          <TrustText>
            <TrustHighlight>Three independent verification layers</TrustHighlight> are designed so
            that every credit traded on the system carries a complete, auditable chain of
            evidence from generation through settlement. No shortcuts, no self-reporting,
            no single points of trust failure.
          </TrustText>
        </TrustStatement>
      </Inner>
    </Section>
  );
}
