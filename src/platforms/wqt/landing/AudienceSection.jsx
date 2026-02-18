/**
 * AudienceSection — For Buyers / For Sellers / For Developers.
 * Tabbed layout with data panel showing value props for each audience.
 */

import React, { useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 640px) {
    padding: 64px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1000px;
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
  margin: 0 0 48px;
  letter-spacing: -0.02em;
`;

const TabRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 48px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 4px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 20px;
  min-height: 44px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.surface : 'transparent')};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms;
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none')};
  white-space: nowrap;
`;

const Panel = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const PanelTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
  letter-spacing: -0.01em;
`;

const PanelDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 24px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const FeatureCheck = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  margin-top: 2px;
`;

const FeatureText = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const DataPanel = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 28px;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child { border-bottom: none; }
`;

const DataLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DataValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const AUDIENCES = [
  {
    id: 'buyers',
    tabLabel: 'For Buyers',
    title: 'Offset with Confidence',
    desc: 'Purchase sensor-verified nutrient credits from a transparent marketplace. Full provenance on every credit, from generation to retirement.',
    features: [
      'Browse verified credits with full provenance',
      'Pay with card (Stripe) or crypto wallet',
      'On-chain certificate of retirement',
      'Downloadable impact reports for ESG filings',
    ],
    data: [
      { label: 'Avg. verification time', value: '< 24h' },
      { label: 'Sensor-verified credits', value: '94%' },
      { label: 'Quality rejection rate', value: '85-95%' },
      { label: 'Certificate format', value: 'ERC-1155' },
    ],
  },
  {
    id: 'sellers',
    tabLabel: 'For Sellers',
    title: 'Monetize Improvements',
    desc: 'Turn environmental improvements into tradeable assets. BlueSignal device owners get automatic credit generation. Third-party sellers can submit for review.',
    features: [
      'Automatic credit generation from BS-WQM sensors',
      'Third-party submission pipeline',
      'Set your own prices, manage listings',
      'Real-time dashboard with P&L tracking',
    ],
    data: [
      { label: 'Avg. N credit price', value: '$8.42/kg' },
      { label: 'Avg. P credit price', value: '$12.67/kg' },
      { label: 'Settlement', value: 'T+1 day' },
      { label: 'Seller fee', value: '2.5%' },
    ],
  },
  {
    id: 'developers',
    tabLabel: 'For Developers',
    title: 'Build on Open Data',
    desc: 'Access public environmental data feeds, integrate credit trading into your applications, and build on top of the WQT exchange infrastructure.',
    features: [
      'RESTful API for market data and sensor feeds',
      'Webhook notifications for trades and listings',
      'Polygon smart contract integration',
      'Comprehensive API documentation',
    ],
    data: [
      { label: 'API format', value: 'REST + JSON' },
      { label: 'Blockchain', value: 'Polygon' },
      { label: 'Public endpoints', value: '12+' },
      { label: 'Rate limit', value: '100 req/min' },
    ],
  },
];

export function AudienceSection() {
  const [active, setActive] = useState('buyers');
  const audience = AUDIENCES.find((a) => a.id === active);

  return (
    <Section>
      <Inner>
        <SectionLabel>Who It's For</SectionLabel>
        <SectionTitle>Built for Every Participant</SectionTitle>
        <TabRow>
          {AUDIENCES.map((a) => (
            <Tab key={a.id} $active={active === a.id} onClick={() => setActive(a.id)}>
              {a.tabLabel}
            </Tab>
          ))}
        </TabRow>
        {audience && (
          <Panel>
            <div>
              <PanelTitle>{audience.title}</PanelTitle>
              <PanelDesc>{audience.desc}</PanelDesc>
              <FeatureList>
                {audience.features.map((f) => (
                  <FeatureItem key={f}>
                    <FeatureCheck>✓</FeatureCheck>
                    <FeatureText>{f}</FeatureText>
                  </FeatureItem>
                ))}
              </FeatureList>
            </div>
            <DataPanel>
              {audience.data.map((d) => (
                <DataRow key={d.label}>
                  <DataLabel>{d.label}</DataLabel>
                  <DataValue>{d.value}</DataValue>
                </DataRow>
              ))}
            </DataPanel>
          </Panel>
        )}
      </Inner>
    </Section>
  );
}
