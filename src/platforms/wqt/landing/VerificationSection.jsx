/**
 * VerificationSection — three-layer verification architecture.
 * Vertical flow diagram layout.
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
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
`;

const FlowNode = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;

  @media (max-width: 480px) {
    gap: 14px;
    padding: 20px;
  }
`;

const FlowIcon = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
`;

const FlowBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const FlowLayerTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

const FlowDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const LayerType = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  padding: 3px 8px;
  border-radius: 5px;
  display: inline-block;
  width: fit-content;
`;

const Connector = styled.div`
  width: 2px;
  height: 32px;
  background: ${({ theme }) => theme.colors.borderLight};
  margin: 0 auto;
  position: relative;
  &::after {
    content: '\u25BC';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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
    title: 'Inline Flow Metering',
    icon: '\u2B21',
    type: 'Quantity',
    typeColor: '#0052CC',
    typeBg: 'rgba(0, 82, 204, 0.1)',
    iconBg: 'rgba(0, 82, 204, 0.08)',
    desc: 'Inline flow sensor records every gallon produced, cross-referenced against the property water meter.',
  },
  {
    title: 'BlueSignal Continuous Monitoring',
    icon: '\u25C9',
    type: 'Quality',
    typeColor: '#10B981',
    typeBg: 'rgba(16, 185, 129, 0.1)',
    iconBg: 'rgba(16, 185, 129, 0.08)',
    desc: 'WQM-1 reads water quality 24/7 and transmits to the cloud. Every anomaly flagged in real time.',
  },
  {
    title: 'Independent Third-Party Sampling',
    icon: '\u2697',
    type: 'Validation',
    typeColor: '#8B5CF6',
    typeBg: 'rgba(139, 92, 246, 0.1)',
    iconBg: 'rgba(139, 92, 246, 0.08)',
    desc: '25% of active sites physically sampled annually by an independent contractor.',
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

        <FlowContainer>
          {LAYERS.map((layer, i) => (
            <React.Fragment key={layer.title}>
              {i > 0 && <Connector />}
              <FlowNode>
                <FlowIcon $bg={layer.iconBg}>{layer.icon}</FlowIcon>
                <FlowBody>
                  <FlowLayerTitle>{layer.title}</FlowLayerTitle>
                  <LayerType $color={layer.typeColor} $bg={layer.typeBg}>
                    {layer.type}
                  </LayerType>
                  <FlowDesc>{layer.desc}</FlowDesc>
                </FlowBody>
              </FlowNode>
            </React.Fragment>
          ))}
        </FlowContainer>

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
