/**
 * Cloud Dashboard — Apple-like device monitoring overview.
 * Fetches real device fleet + alerts from /v2/ APIs.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Activity, BellRing, TrendingUp, Plus, ChevronRight } from 'lucide-react';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Button } from '../../../design-system/primitives/Button';
import { useAppContext } from '../../../context/AppContext';
import { useDevicesQuery, useAlertsQuery } from '../../../shared/hooks/useApiQueries';
import { DemoHint } from '../../../components/DemoHint';
import { setDemoMode } from '../../../utils/demoMode';

/* ── Styled ─────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  overflow-x: hidden;

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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
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

const SectionTitle = styled.h2`
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
  align-items: stretch;

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
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
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

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
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
    $severity === 'critical'
      ? 'rgba(255,77,77,0.08)'
      : $severity === 'warning'
        ? 'rgba(255,176,32,0.08)'
        : 'rgba(0,196,140,0.08)'};
  border: 1px solid
    ${({ $severity }) =>
      $severity === 'critical'
        ? 'rgba(255,77,77,0.2)'
        : $severity === 'warning'
          ? 'rgba(255,176,32,0.2)'
          : 'rgba(0,196,140,0.2)'};
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
  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 12px 14px;
    gap: 8px;
    font-size: 13px;
  }
`;

const _ErrorBox = styled.div`
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

const _ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
`;

/* ── Empty State Styled ───────────────────────────────────── */

const EmptyWrap = styled.div`
  text-align: center;
  padding: 48px 0 32px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 64px 0 48px;
  }
`;

const EmptyTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 28px;
  }
`;

const EmptyDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 28px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
`;

const FeatureCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 840px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px 20px;
  text-align: left;
`;

const FeatureIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.primaryAlpha || 'rgba(0, 102, 255, 0.08)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 14px;
`;

const FeatureTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;
`;

const FeatureDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

/* ── Quick Actions Styled ─────────────────────────────────── */

const QuickActionsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const QuickAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryAlpha || 'rgba(0, 102, 255, 0.08)'};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryAlpha || 'rgba(0, 102, 255, 0.12)'};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

/* ── Latest Readings Styled ───────────────────────────────── */

const ReadingsScroll = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const ReadingCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px 20px;
  min-width: 240px;
  flex-shrink: 0;
`;

const ReadingDeviceName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const ReadingMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ReadingMetric = styled.div`
  padding: 6px 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const ReadingMetricLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ReadingMetricValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 1px;
`;

/* ── Skeletons ──────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <Page>
      <Header>
        <Skeleton width={180} height={32} />
        <div style={{ marginTop: 8 }}>
          <Skeleton width={280} height={14} />
        </div>
      </Header>
      <StatusRow>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={80} />
        ))}
      </StatusRow>
      <DeviceGrid>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={200} />
        ))}
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

/* ── Icons ─────────────────────────────────────────────── */

const DeviceEmptyIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect
      x="12"
      y="20"
      width="40"
      height="28"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.6"
    />
    <circle cx="32" cy="34" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
    <path
      d="M32 28v-4M32 42v4M26 34h-4M38 34h4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const DeviceErrorIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <rect
      x="14"
      y="22"
      width="36"
      height="24"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />
    <circle cx="32" cy="34" r="5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    <path
      d="M32 26v-3M32 44v2M24 34h-3M42 34h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M32 16l-4 6h8l-4 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
);

/* ── Sensor reading helpers ───────────────────────────────── */

const SENSOR_FIELDS = [
  { key: 'pH', label: 'pH', unit: '' },
  { key: 'tds', label: 'TDS', unit: ' ppm' },
  { key: 'turbidity', label: 'Turb', unit: ' NTU' },
  { key: 'temperature', label: 'Temp', unit: '°' },
];

function getSensorReadings(device) {
  // Try latestReading first, then sensors, then top-level fields
  const src = device.latestReading || device.sensors || device;
  const readings = [];
  for (const { key, label, unit } of SENSOR_FIELDS) {
    const val = src[key];
    if (val !== undefined && val !== null) {
      readings.push({ label, value: typeof val === 'number' ? val.toFixed(1) : String(val), unit });
    }
  }
  return readings;
}

/* ── Component ──────────────────────────────────────────── */

export function CloudDashboardPage() {
  useEffect(() => {
    document.title = 'Dashboard — BlueSignal Cloud';
  }, []);
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;

  const {
    data: devices = [],
    isLoading: devicesLoading,
    error: devicesError,
    refetch: refetchDevices,
  } = useDevicesQuery(user?.uid);
  const { data: alerts = [], isLoading: alertsLoading } = useAlertsQuery(user?.uid);

  const loading = devicesLoading || alertsLoading;
  const error = devicesError?.message || null;

  const handleEnableDemo = () => {
    setDemoMode(true);
    window.location.reload();
  };

  if (loading) return <DashboardSkeleton />;

  if (error && devices.length === 0) {
    return (
      <Page>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
        </Header>
        <EmptyState
          icon={<DeviceErrorIcon />}
          title="Unable to Connect"
          description="Unable to connect to the device service. Check your connection and try again. Or enable Demo Mode in Profile to explore."
          action={{ label: 'Retry', onClick: () => refetchDevices() }}
        />
      </Page>
    );
  }

  /* ── Empty state: onboarding experience ─────────────────── */

  if (devices.length === 0) {
    return (
      <Page>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
        </Header>
        <EmptyWrap>
          <DeviceEmptyIcon />
          <EmptyTitle>Welcome to BlueSignal Cloud</EmptyTitle>
          <EmptyDescription>
            Register your WQM-1 to start monitoring water quality.
          </EmptyDescription>
          <EmptyActions>
            <Button onClick={() => navigate('/cloud/commissioning')}>
              Register Device <ChevronRight size={16} />
            </Button>
            <Button variant="outline" onClick={handleEnableDemo}>
              Try Demo Mode <ChevronRight size={16} />
            </Button>
          </EmptyActions>
          <FeatureCardsGrid>
            <FeatureCard>
              <FeatureIconWrap>
                <Activity size={20} />
              </FeatureIconWrap>
              <FeatureTitle>Real-time Monitoring</FeatureTitle>
              <FeatureDesc>
                Monitor pH, TDS, turbidity, ORP &amp; temperature in real time
              </FeatureDesc>
            </FeatureCard>
            <FeatureCard>
              <FeatureIconWrap>
                <BellRing size={20} />
              </FeatureIconWrap>
              <FeatureTitle>Threshold Alerts</FeatureTitle>
              <FeatureDesc>
                Set custom thresholds and get instant alerts when readings exceed limits
              </FeatureDesc>
            </FeatureCard>
            <FeatureCard>
              <FeatureIconWrap>
                <TrendingUp size={20} />
              </FeatureIconWrap>
              <FeatureTitle>Credit Generation</FeatureTitle>
              <FeatureDesc>
                Your device generates verified AWG credits on WaterQuality.Trading
              </FeatureDesc>
            </FeatureCard>
          </FeatureCardsGrid>
        </EmptyWrap>
      </Page>
    );
  }

  /* ── Active state ───────────────────────────────────────── */

  const online = devices.filter((d) => d.onlineStatus === 'online').length;
  const offline = devices.filter((d) => d.onlineStatus === 'offline').length;
  const warning = devices.filter(
    (d) => d.status === 'maintenance' || d.onlineStatus === 'unknown'
  ).length;
  const avgBattery =
    devices.filter((d) => d.battery > 0).length > 0
      ? Math.round(
          devices.filter((d) => d.battery > 0).reduce((s, d) => s + d.battery, 0) /
            devices.filter((d) => d.battery > 0).length
        )
      : 0;
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  // Collect devices that have any sensor readings for the Latest Readings section
  const devicesWithReadings = devices
    .map((d) => ({ device: d, readings: getSensorReadings(d) }))
    .filter(({ readings }) => readings.length > 0);

  return (
    <Page>
      <Header>
        <HeaderRow>
          <div>
            <Title>
              Dashboard <DemoHint screenName="cloud-dashboard" />
            </Title>
            <Subtitle>Monitor your BlueSignal WQM-1 fleet in real time.</Subtitle>
          </div>
          <QuickActionsRow>
            <QuickAction onClick={() => navigate('/cloud/devices/add')}>
              <Plus size={14} /> Add Device
            </QuickAction>
            <QuickAction onClick={() => navigate('/cloud/alerts')}>
              <BellRing size={14} /> View All Alerts
            </QuickAction>
            <QuickAction onClick={() => navigate('/cloud/sites')}>
              <Activity size={14} /> Manage Sites
            </QuickAction>
          </QuickActionsRow>
        </HeaderRow>
      </Header>

      {activeAlerts
        .sort((a, b) => {
          const order = { critical: 0, warning: 1, info: 2 };
          return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
        })
        .slice(0, 5)
        .map((alert) => (
          <AlertBanner
            key={alert.id}
            $severity={alert.severity}
            onClick={() => navigate(`/device/${alert.deviceId}`)}
            role="alert"
            aria-live={alert.severity === 'critical' ? 'assertive' : 'polite'}
          >
            <span>{severityIcon(alert.severity)}</span>
            <span>
              {alert.deviceName ? `${alert.deviceName} — ` : ''}
              {alert.message}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                opacity: 0.6,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              View →
            </span>
          </AlertBanner>
        ))}

      <StatusRow>
        <DataCard
          label="Total Devices"
          value={`${devices.length}`}
          icon={<span style={{ fontSize: 16 }}>📊</span>}
          compact
        />
        <DataCard
          label="Online"
          value={`${online}`}
          unit={`of ${devices.length}`}
          icon={<span style={{ color: '#10B981', fontSize: 16 }}>●</span>}
          compact
        />
        <DataCard
          label="Warning"
          value={`${warning}`}
          unit={`of ${devices.length}`}
          icon={<span style={{ color: '#F59E0B', fontSize: 16 }}>●</span>}
          compact
        />
        <DataCard
          label="Offline"
          value={`${offline}`}
          unit={`of ${devices.length}`}
          icon={<span style={{ color: '#EF4444', fontSize: 16 }}>●</span>}
          compact
        />
        <DataCard
          label="Avg Battery"
          value={`${avgBattery}`}
          unit={`% (${devices.filter((d) => d.battery > 0).length} devices)`}
          icon={<span style={{ fontSize: 16 }}>🔋</span>}
          compact
        />
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
              tabIndex={0}
              role="link"
              aria-label={`View device ${device.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/device/${device.id}`);
                }
              }}
            >
              <DeviceHeader>
                <div>
                  <DeviceName>{device.name}</DeviceName>
                  <DeviceIdText>{device.id}</DeviceIdText>
                </div>
                <Badge variant={statusVariant(device.onlineStatus)} size="sm" dot>
                  {device.onlineStatus}
                </Badge>
              </DeviceHeader>
              <MetricRow>
                <Metric>
                  <MetricLabel>Battery</MetricLabel>
                  <MetricValue>
                    {device.onlineStatus !== 'offline' ? device.battery : '—'}
                    <MetricUnit>{device.onlineStatus !== 'offline' ? '%' : ''}</MetricUnit>
                  </MetricValue>
                </Metric>
                <Metric>
                  <MetricLabel title="Nutrient credits (kg)">Credits</MetricLabel>
                  <MetricValue>
                    {device.onlineStatus !== 'offline' ? device.creditsGenerated : '—'}
                    <MetricUnit>{device.onlineStatus !== 'offline' ? ' kg' : ''}</MetricUnit>
                  </MetricValue>
                </Metric>
              </MetricRow>
              {device.onlineStatus === 'offline' && device.lastReadingAt && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                  Last seen{' '}
                  {new Date(device.lastReadingAt).toLocaleString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </div>
              )}
            </DeviceCard>
          ))}
        </DeviceGrid>
      </Section>

      {devicesWithReadings.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Latest Readings</SectionTitle>
          </SectionHeader>
          <ReadingsScroll>
            {devicesWithReadings.map(({ device, readings }) => (
              <ReadingCard key={device.id}>
                <ReadingDeviceName>{device.name}</ReadingDeviceName>
                <ReadingMetrics>
                  {readings.map((r) => (
                    <ReadingMetric key={r.label}>
                      <ReadingMetricLabel>{r.label}</ReadingMetricLabel>
                      <ReadingMetricValue>
                        {r.value}
                        {r.unit}
                      </ReadingMetricValue>
                    </ReadingMetric>
                  ))}
                </ReadingMetrics>
              </ReadingCard>
            ))}
          </ReadingsScroll>
        </Section>
      )}
    </Page>
  );
}

export default CloudDashboardPage;
