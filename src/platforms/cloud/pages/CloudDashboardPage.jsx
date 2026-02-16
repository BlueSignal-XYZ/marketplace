/**
 * Cloud Dashboard — Apple-like device monitoring overview.
 * Clean cards, one-chart-at-a-time philosophy, status-first.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Tabs } from '../../../design-system/primitives/Tabs';

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatusRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

const DeviceCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 16px rgba(0, 102, 255, 0.06);
    transform: translateY(-1px);
  }
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const DeviceName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DeviceId = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Metric = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const MetricLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const MetricValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;
`;

const MetricUnit = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SparklineBox = styled.div`
  height: 48px;
  margin-top: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AlertBanner = styled.div`
  padding: 16px 20px;
  background: ${({ $type, theme }) =>
    $type === 'warning' ? 'rgba(255,176,32,0.08)' :
    $type === 'error' ? 'rgba(255,77,77,0.08)' :
    'rgba(0,196,140,0.08)'};
  border: 1px solid ${({ $type }) =>
    $type === 'warning' ? 'rgba(255,176,32,0.2)' :
    $type === 'error' ? 'rgba(255,77,77,0.2)' :
    'rgba(0,196,140,0.2)'};
  border-radius: ${({ theme }) => theme.radius.md}px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

// ── Placeholder data ──────────────────────────────────────

const DEVICES = [
  { id: 'BS-WQM-1042', name: 'James River Station A', status: 'online', battery: 92, signal: 'strong', ph: 7.2, tds: 342, turbidity: 4.1, temp: 18.3, uptime: '99.8%' },
  { id: 'BS-WQM-1043', name: 'Potomac Intake B', status: 'online', battery: 78, signal: 'good', ph: 7.5, tds: 298, turbidity: 3.8, temp: 17.1, uptime: '98.2%' },
  { id: 'BS-WQM-1044', name: 'York River Monitor', status: 'online', battery: 85, signal: 'strong', ph: 7.0, tds: 410, turbidity: 5.2, temp: 19.0, uptime: '99.5%' },
  { id: 'BS-WQM-1045', name: 'Chesapeake Bay Buoy', status: 'maintenance', battery: 34, signal: 'weak', ph: 7.8, tds: 520, turbidity: 6.1, temp: 16.5, uptime: '87.1%' },
  { id: 'BS-WQM-1046', name: 'Rappahannock Station', status: 'online', battery: 95, signal: 'strong', ph: 6.9, tds: 275, turbidity: 3.4, temp: 18.7, uptime: '99.9%' },
  { id: 'BS-WQM-1047', name: 'Shenandoah Outflow', status: 'offline', battery: 0, signal: 'none', ph: null, tds: null, turbidity: null, temp: null, uptime: '0%' },
];

const ALERTS = [
  { id: 'a1', type: 'warning', message: 'Chesapeake Bay Buoy — battery below 40%. Schedule maintenance.' },
  { id: 'a2', type: 'error', message: 'Shenandoah Outflow — device offline for 48+ hours.' },
];

export function CloudDashboardPage() {
  const navigate = useNavigate();
  const online = DEVICES.filter((d) => d.status === 'online').length;

  return (
    <Page>
      <Header>
        <Title>Devices</Title>
        <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
      </Header>

      {ALERTS.map((alert) => (
        <AlertBanner key={alert.id} $type={alert.type}>
          <span>{alert.type === 'error' ? '🔴' : '🟡'}</span>
          <span>{alert.message}</span>
        </AlertBanner>
      ))}

      <StatusRow>
        <DataCard label="Devices Online" value={`${online}`} unit={`of ${DEVICES.length}`} compact />
        <DataCard label="Avg Battery" value={Math.round(DEVICES.filter(d => d.battery > 0).reduce((s,d) => s + d.battery, 0) / DEVICES.filter(d => d.battery > 0).length).toString()} unit="%" compact />
        <DataCard label="Fleet Uptime" value="96.4" unit="%" compact />
        <DataCard label="Alerts" value={ALERTS.length.toString()} compact />
      </StatusRow>

      <Section>
        <SectionHeader>
          <SectionTitle>Fleet Overview</SectionTitle>
        </SectionHeader>
        <DeviceGrid>
          {DEVICES.map((device) => (
            <DeviceCard
              key={device.id}
              onClick={() => navigate(`/device/${device.id}`)}
            >
              <DeviceHeader>
                <div>
                  <DeviceName>{device.name}</DeviceName>
                  <DeviceId>{device.id}</DeviceId>
                </div>
                <Badge
                  variant={device.status === 'online' ? 'positive' : device.status === 'maintenance' ? 'warning' : 'negative'}
                  size="sm"
                  dot
                >
                  {device.status}
                </Badge>
              </DeviceHeader>
              {device.status !== 'offline' ? (
                <>
                  <MetricRow>
                    <Metric>
                      <MetricLabel>pH</MetricLabel>
                      <MetricValue>{device.ph}</MetricValue>
                    </Metric>
                    <Metric>
                      <MetricLabel>TDS</MetricLabel>
                      <MetricValue>{device.tds}<MetricUnit> ppm</MetricUnit></MetricValue>
                    </Metric>
                  </MetricRow>
                  <SparklineBox>▁▂▃▄▅▆▇█ — sparkline placeholder</SparklineBox>
                </>
              ) : (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#999', fontSize: 13 }}>
                  Device offline
                </div>
              )}
            </DeviceCard>
          ))}
        </DeviceGrid>
      </Section>
    </Page>
  );
}
