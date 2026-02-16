/**
 * Cloud Device Detail — one chart at a time, tab switcher.
 * Apple-like: clean, focused, one metric in view at a time.
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { Button } from '../../../design-system/primitives/Button';

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Back = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeviceId = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
  margin-bottom: 32px;
`;

const ChartTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ChartValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ChartUnit = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 4px;
`;

const ChartRange = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 24px;
`;

const ChartPlaceholder = styled.div`
  height: 280px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RangePicker = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
`;

const RangeBtn = styled.button`
  padding: 4px 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.colors.textOnPrimary : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  &:hover { background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.background)}; }
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const InfoLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

// ── Metric configurations ─────────────────────────────────

const METRICS = [
  { id: 'ph', label: 'pH', value: 7.2, unit: '', range: '6.5–8.5' },
  { id: 'tds', label: 'TDS', value: 342, unit: 'ppm', range: '0–500' },
  { id: 'turbidity', label: 'Turbidity', value: 4.1, unit: 'NTU', range: '0–10' },
  { id: 'temperature', label: 'Temperature', value: 18.3, unit: '°C', range: '0–35' },
  { id: 'do', label: 'Dissolved O₂', value: 8.1, unit: 'mg/L', range: '5–14' },
  { id: 'conductivity', label: 'Conductivity', value: 485, unit: 'µS/cm', range: '0–1500' },
];

const RANGES = ['1H', '6H', '24H', '7D', '30D'];

export function DeviceDetailPage() {
  const { deviceId } = useParams();
  const [activeMetric, setActiveMetric] = useState('ph');
  const [range, setRange] = useState('24H');

  const metric = METRICS.find((m) => m.id === activeMetric) || METRICS[0];

  const tabs = METRICS.map((m) => ({
    id: m.id,
    label: m.label,
  }));

  return (
    <Page>
      <Back to="/dashboard/main">← Back to Dashboard</Back>

      <Header>
        <div>
          <Title>
            James River Station A
            <Badge variant="positive" size="sm" dot>online</Badge>
          </Title>
          <DeviceId>{deviceId || 'BS-WQM-1042'}</DeviceId>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm">Configure</Button>
          <Button variant="outline" size="sm">Export Data</Button>
        </div>
      </Header>

      <StatsGrid>
        <DataCard label="Battery" value="92" unit="%" compact />
        <DataCard label="Signal" value="Strong" compact />
        <DataCard label="Uptime" value="99.8" unit="%" compact />
        <DataCard label="Last Reading" value="2 min ago" compact />
        <DataCard label="Data Points" value="1.2M" compact />
        <DataCard label="Credits Generated" value="150" unit="kg" compact />
      </StatsGrid>

      <Tabs tabs={tabs} activeTab={activeMetric} onTabChange={setActiveMetric} />

      <ChartContainer>
        <ChartTitle>{metric.label}</ChartTitle>
        <ChartValue>
          {metric.value}
          <ChartUnit>{metric.unit}</ChartUnit>
        </ChartValue>
        <ChartRange>Normal range: {metric.range} · Updated 2 min ago</ChartRange>

        <RangePicker>
          {RANGES.map((r) => (
            <RangeBtn key={r} $active={range === r} onClick={() => setRange(r)}>
              {r}
            </RangeBtn>
          ))}
        </RangePicker>

        <ChartPlaceholder>
          📈 {metric.label} time-series chart ({range}) — wires to TimeSeriesChart primitive
        </ChartPlaceholder>
      </ChartContainer>

      <InfoSection>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: 'inherit', color: 'inherit' }}>
          Device Information
        </div>
        <InfoGrid>
          <InfoRow><InfoLabel>Device ID</InfoLabel><InfoValue>{deviceId || 'BS-WQM-1042'}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Model</InfoLabel><InfoValue>WQM-1</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Firmware</InfoLabel><InfoValue>v2.4.1</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Location</InfoLabel><InfoValue>37.5407, -77.4360</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Installed</InfoLabel><InfoValue>2025-03-15</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Last Maintenance</InfoLabel><InfoValue>2025-10-01</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Network</InfoLabel><InfoValue>LTE-M</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Sampling Rate</InfoLabel><InfoValue>Every 5 min</InfoValue></InfoRow>
        </InfoGrid>
      </InfoSection>
    </Page>
  );
}
