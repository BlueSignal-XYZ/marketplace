/**
 * Cloud Dashboard — Apple-like device monitoring overview.
 * Fetches real device fleet + alerts from /v2/ APIs.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Button } from '../../../design-system/primitives/Button';
import { useAppContext } from '../../../context/AppContext';
import { useDevicesQuery, useAlertsQuery } from '../../../shared/hooks/useApiQueries';
import { DemoBanner } from '../../../components/DemoBanner';
import { DemoHint } from '../../../components/DemoHint';

/* ── Styled ─────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 28px 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 48px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatusRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }
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
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(3, 1fr);
  }
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

const DeviceIdText = styled.div`
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
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 20px;
  }
`;

const MetricUnit = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AlertBanner = styled.div`
  padding: 16px 20px;
  background: ${({ $severity }) =>
    $severity === 'critical' ? 'rgba(255,77,77,0.08)' :
    $severity === 'warning' ? 'rgba(255,176,32,0.08)' :
    'rgba(0,196,140,0.08)'};
  border: 1px solid ${({ $severity }) =>
    $severity === 'critical' ? 'rgba(255,77,77,0.2)' :
    $severity === 'warning' ? 'rgba(255,176,32,0.2)' :
    'rgba(0,196,140,0.2)'};
  border-radius: ${({ theme }) => theme.radius.md}px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  cursor: pointer;
  word-break: break-word;
  min-height: 44px;
  &:hover { opacity: 0.9; }

  @media (max-width: 640px) {
    padding: 12px 14px;
    gap: 8px;
    font-size: 13px;
  }
`;

const ErrorBox = styled.div`
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
`;

/* ── Skeletons ──────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <Page>
      <Header>
        <Skeleton width={180} height={32} />
        <div style={{ marginTop: 8 }}><Skeleton width={280} height={14} /></div>
      </Header>
      <StatusRow>
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} height={80} />)}
      </StatusRow>
      <DeviceGrid>
        {[1, 2, 3].map((i) => <Skeleton key={i} height={200} />)}
      </DeviceGrid>
    </Page>
  );
}

/* ── Helpers ────────────────────────────────────────────── */

function statusVariant(onlineStatus) {
  if (onlineStatus === 'online') return 'positive';
  if (onlineStatus === 'offline') return 'negative';
  return 'warning';
}

function severityIcon(severity) {
  if (severity === 'critical') return '🔴';
  if (severity === 'warning') return '🟡';
  return '🔵';
}

/* ── Component ──────────────────────────────────────────── */

export function CloudDashboardPage() {
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;

  const { data: devices = [], isLoading: devicesLoading, error: devicesError, refetch: refetchDevices } = useDevicesQuery(user?.uid);
  const { data: alerts = [], isLoading: alertsLoading } = useAlertsQuery(user?.uid);

  const loading = devicesLoading || alertsLoading;
  const error = devicesError?.message || null;

  if (loading) return <DashboardSkeleton />;

  if (error && devices.length === 0) {
    return (
      <Page>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
        </Header>
        <EmptyState
          title="Unable to Load Devices"
          description="We couldn't connect to the device service. This may be a temporary issue."
          action={{ label: 'Retry', onClick: () => refetchDevices() }}
        />
      </Page>
    );
  }

  if (devices.length === 0) {
    return (
      <Page>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
        </Header>
        <EmptyState
          title="No Devices Yet"
          description="No devices registered yet. Add your first device or enable Demo Mode to explore the platform with sample data."
          action={{ label: 'Commission Your First Device', onClick: () => navigate('/commission') }}
        />
      </Page>
    );
  }

  const online = devices.filter((d) => d.onlineStatus === 'online').length;
  const offline = devices.filter((d) => d.onlineStatus === 'offline').length;
  const warning = devices.filter((d) => d.status === 'maintenance' || d.onlineStatus === 'unknown').length;
  const avgBattery = devices.filter((d) => d.battery > 0).length > 0
    ? Math.round(devices.filter((d) => d.battery > 0).reduce((s, d) => s + d.battery, 0) / devices.filter((d) => d.battery > 0).length)
    : 0;
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <Page>
      <DemoBanner />
      <Header>
        <Title>Dashboard <DemoHint screenName="cloud-dashboard" /></Title>
        <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
      </Header>

      {activeAlerts.slice(0, 5).map((alert) => (
        <AlertBanner
          key={alert.id}
          $severity={alert.severity}
          onClick={() => navigate(`/device/${alert.deviceId}`)}
        >
          <span>{severityIcon(alert.severity)}</span>
          <span>{alert.deviceName ? `${alert.deviceName} — ` : ''}{alert.message}</span>
        </AlertBanner>
      ))}

      <StatusRow>
        <DataCard label="Total Devices" value={`${devices.length}`} icon={<span style={{ fontSize: 16 }}>📊</span>} compact />
        <DataCard label="Online" value={`${online}`} unit={`of ${devices.length}`} icon={<span style={{ color: '#10B981', fontSize: 16 }}>●</span>} compact />
        <DataCard label="Warning" value={`${warning}`} icon={<span style={{ color: '#F59E0B', fontSize: 16 }}>●</span>} compact />
        <DataCard label="Offline" value={`${offline}`} icon={<span style={{ color: '#EF4444', fontSize: 16 }}>●</span>} compact />
        <DataCard label="Avg Battery" value={`${avgBattery}`} unit="%" icon={<span style={{ fontSize: 16 }}>🔋</span>} compact />
      </StatusRow>

      <Section>
        <SectionHeader>
          <SectionTitle>Fleet Overview</SectionTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/commission')}>
            + Add Device
          </Button>
        </SectionHeader>
        <DeviceGrid>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              onClick={() => navigate(`/device/${device.id}`)}
            >
              <DeviceHeader>
                <div>
                  <DeviceName>{device.name}</DeviceName>
                  <DeviceIdText>{device.id}</DeviceIdText>
                </div>
                <Badge
                  variant={statusVariant(device.onlineStatus)}
                  size="sm"
                  dot
                >
                  {device.onlineStatus}
                </Badge>
              </DeviceHeader>
              {device.onlineStatus !== 'offline' ? (
                <MetricRow>
                  <Metric>
                    <MetricLabel>Battery</MetricLabel>
                    <MetricValue>{device.battery}<MetricUnit>%</MetricUnit></MetricValue>
                  </Metric>
                  <Metric>
                    <MetricLabel>Credits</MetricLabel>
                    <MetricValue>{device.creditsGenerated}<MetricUnit> kg</MetricUnit></MetricValue>
                  </Metric>
                </MetricRow>
              ) : (
                <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, fontFamily: 'inherit' }}>
                  <span style={{ color: '#9CA3AF' }}>
                    Device offline{device.lastReadingAt ? ` · Last seen ${new Date(device.lastReadingAt).toLocaleDateString()}` : ''}
                  </span>
                </div>
              )}
            </DeviceCard>
          ))}
        </DeviceGrid>
      </Section>
    </Page>
  );
}

export default CloudDashboardPage;
