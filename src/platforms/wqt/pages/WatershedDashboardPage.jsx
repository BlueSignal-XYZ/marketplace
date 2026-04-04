/**
 * WQT Watershed Dashboard — aggregated water quality data per watershed.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Tabs } from '../../../design-system/primitives/Tabs';

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 640px) {
    padding: 20px 16px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const WatershedCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: 640px) {
    padding: 20px;
  }
`;

const WatershedName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const WatershedMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const WGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 24px;
`;

const DetailTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const Metric = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const MetricLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 2px;
`;

const MetricValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const MetricUnit = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 4px;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 16px;
`;

// ── Placeholder data ──────────────────────────────────────

const WATERSHEDS = [
  { id: 'james-river', name: 'James River Basin', state: 'Virginia', sensors: 4, area: '10,000 sq mi', health: 'good', totalCredits: 1250, avgPh: 7.2, avgTds: 342, avgTurbidity: 4.1 },
  { id: 'potomac', name: 'Potomac River Basin', state: 'Virginia / DC', sensors: 3, area: '14,670 sq mi', health: 'fair', totalCredits: 890, avgPh: 7.5, avgTds: 298, avgTurbidity: 3.8 },
  { id: 'chesapeake', name: 'Chesapeake Bay', state: 'Multi-state', sensors: 6, area: '64,000 sq mi', health: 'impaired', totalCredits: 3200, avgPh: 7.0, avgTds: 410, avgTurbidity: 6.1 },
  { id: 'york', name: 'York River Basin', state: 'Virginia', sensors: 2, area: '2,670 sq mi', health: 'good', totalCredits: 560, avgPh: 7.1, avgTds: 275, avgTurbidity: 3.4 },
];

export function WatershedDashboardPage() {
  useEffect(() => { document.title = 'Watershed Dashboard — WaterQuality.Trading'; }, []);
  const [selected, setSelected] = useState(null);
  const ws = selected ? WATERSHEDS.find((w) => w.id === selected) : null;

  const healthVariant = (h) =>
    h === 'good' ? 'positive' : h === 'fair' ? 'warning' : 'negative';

  return (
    <Page>
      <Title>Watersheds</Title>
      <Subtitle>Water quality data aggregated by watershed region.</Subtitle>

      <StatsRow>
        <DataCard label="Total Watersheds" value={WATERSHEDS.length.toString()} compact />
        <DataCard label="Active Sensors" value="15" compact />
        <DataCard label="Credits Generated" value="5,900" unit="kg" compact />
        <DataCard label="Avg Water Health" value="Good" compact />
      </StatsRow>

      <WGrid>
        {WATERSHEDS.map((w) => (
          <WatershedCard
            key={w.id}
            $active={selected === w.id}
            onClick={() => setSelected(selected === w.id ? null : w.id)}
          >
            <WatershedName>{w.name}</WatershedName>
            <WatershedMeta>{w.state} · {w.area} · {w.sensors} sensors</WatershedMeta>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge variant={healthVariant(w.health)} size="sm" dot>{w.health}</Badge>
              <Badge variant="info" size="sm">{w.totalCredits.toLocaleString()} credits</Badge>
            </div>
          </WatershedCard>
        ))}
      </WGrid>

      {ws && (
        <DetailSection>
          <DetailTitle>{ws.name} — Water Quality</DetailTitle>
          <MetricGrid>
            <Metric>
              <MetricLabel>Avg pH</MetricLabel>
              <MetricValue>{ws.avgPh}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Avg TDS</MetricLabel>
              <MetricValue>{ws.avgTds}<MetricUnit>ppm</MetricUnit></MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Avg Turbidity</MetricLabel>
              <MetricValue>{ws.avgTurbidity}<MetricUnit>NTU</MetricUnit></MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Health</MetricLabel>
              <MetricValue>
                <Badge variant={healthVariant(ws.health)} dot>{ws.health}</Badge>
              </MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Active Sensors</MetricLabel>
              <MetricValue>{ws.sensors}</MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>Credits Generated</MetricLabel>
              <MetricValue>{ws.totalCredits.toLocaleString()}<MetricUnit>kg</MetricUnit></MetricValue>
            </Metric>
          </MetricGrid>
          <ChartPlaceholder>
            📊 Time-series chart placeholder — wires to Chart.js TimeSeriesChart primitive
          </ChartPlaceholder>
        </DetailSection>
      )}
    </Page>
  );
}

export default WatershedDashboardPage;
