/**
 * Cloud Device Detail — one chart at a time, tab switcher.
 * Fetches real device data + time-series metrics from /v2/ APIs.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { Button } from '../../../design-system/primitives/Button';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { getDevice, getDeviceMetrics, getDeviceAlerts, ApiError } from '../../../services/v2/api';
import { useRevenueGradeQuery, useSendCommandMutation } from '../../../shared/hooks/useApiQueries';

/* ── Styled ─────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 24px;
  }
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
  min-height: 44px;
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
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 28px;
    gap: 12px;
  }
`;

const DeviceIdText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px;
  margin-bottom: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 32px;
    margin-bottom: 32px;
  }
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
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 36px;
  }
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

const ChartArea = styled.div`
  height: 280px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  position: relative;
  overflow: hidden;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 100%;
  width: 100%;
  padding: 16px;
`;

const Bar = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.7;
  border-radius: 2px 2px 0 0;
  min-height: 4px;
`;

const RangePicker = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RangeBtn = styled.button`
  padding: 6px 14px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.colors.textOnPrimary : theme.colors.textSecondary)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  min-height: 36px;
  white-space: nowrap;
  flex-shrink: 0;
  &:hover { background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.background)}; }
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 16px;
  margin-bottom: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 24px;
    margin-bottom: 32px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) { grid-template-columns: 1fr; }
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

const AlertItem = styled.div`
  padding: 12px 16px;
  background: ${({ $severity }) =>
    $severity === 'critical' ? 'rgba(255,77,77,0.06)' :
    $severity === 'warning' ? 'rgba(255,176,32,0.06)' :
    'rgba(0,196,140,0.06)'};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-bottom: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorBox = styled.div`
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 48px 24px;
  text-align: center;
`;

const OfflineBanner = styled.div`
  background: rgba(255, 77, 77, 0.08);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 12px 14px;
  margin-bottom: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
  word-break: break-word;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 16px 20px;
    margin-bottom: 24px;
    font-size: 14px;
  }
`;

/* ── Constants ──────────────────────────────────────────── */

const METRIC_TABS = [
  { id: 'pH', label: 'pH', unit: '', normalRange: '6.5–8.5' },
  { id: 'TDS', label: 'TDS', unit: 'ppm', normalRange: '0–500' },
  { id: 'turbidity', label: 'Turbidity', unit: 'NTU', normalRange: '0–10' },
  { id: 'temperature', label: 'Temperature', unit: '°C', normalRange: '0–35' },
  { id: 'ORP', label: 'ORP', unit: 'mV', normalRange: '-200–800' },
];

const RANGES = ['24h', '7d', '30d', '90d'];

/* ── Skeletons ──────────────────────────────────────────── */

function DetailSkeleton() {
  return (
    <Page>
      <Skeleton width={140} height={14} />
      <div style={{ marginTop: 20 }}><Skeleton width={300} height={28} /></div>
      <div style={{ marginTop: 8 }}><Skeleton width={120} height={13} /></div>
      <StatsGrid style={{ marginTop: 32 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} height={80} />)}
      </StatsGrid>
      <Skeleton height={400} />
    </Page>
  );
}

/* ── Component ──────────────────────────────────────────── */

export function DeviceDetailPage() {
  useEffect(() => { document.title = 'Device Detail — BlueSignal Cloud'; }, []);
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMetric, setActiveMetric] = useState('pH');
  const [range, setRange] = useState('24h');
  const [metricsData, setMetricsData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [deviceAlerts, setDeviceAlerts] = useState([]);

  // Fetch device detail
  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [dev, alerts] = await Promise.all([
          getDevice(deviceId),
          getDeviceAlerts(deviceId).catch(() => []),
        ]);
        if (!cancelled) {
          setDevice(dev);
          setDeviceAlerts(alerts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load device.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [deviceId]);

  // Fetch metrics when metric or range changes
  const fetchMetrics = useCallback(async () => {
    if (!deviceId) return;
    setMetricsLoading(true);
    try {
      const data = await getDeviceMetrics(deviceId, activeMetric, range);
      setMetricsData(data);
    } catch {
      setMetricsData(null);
    } finally {
      setMetricsLoading(false);
    }
  }, [deviceId, activeMetric, range]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  if (loading) return <DetailSkeleton />;

  if (error || !device) {
    return (
      <Page>
        <Back to="/v2/dashboard">← Back to Dashboard</Back>
        <ErrorBox>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Device Not Found</h2>
          <p style={{ margin: '0 0 16px', color: '#888', fontSize: 14 }}>{error || `No device found with ID "${deviceId}".`}</p>
          <Button onClick={() => navigate('/v2/dashboard')}>Back to Dashboard</Button>
        </ErrorBox>
      </Page>
    );
  }

  const tabs = METRIC_TABS.map((m) => ({ id: m.id, label: m.label }));
  const metricConfig = METRIC_TABS.find((m) => m.id === activeMetric) || METRIC_TABS[0];

  // Find current value from latestReadings
  const currentReading = device.latestReadings?.find((r) => r.type === activeMetric);
  const currentValue = currentReading?.value ?? '—';
  const lastUpdated = currentReading?.timestamp
    ? new Date(currentReading.timestamp).toLocaleString()
    : device.lastReadingAt
      ? new Date(device.lastReadingAt).toLocaleString()
      : 'Unknown';

  const isOffline = device.onlineStatus === 'offline';
  const chartPoints = metricsData?.points || [];
  const maxVal = chartPoints.length > 0 ? Math.max(...chartPoints.map((p) => p.value)) : 1;

  return (
    <Page>
      <Back to="/v2/dashboard">← Back to Dashboard</Back>

      {isOffline && (
        <OfflineBanner>
          <span>🔴</span>
          <span>
            Device is offline.
            {device.lastReadingAt && ` Last seen: ${new Date(device.lastReadingAt).toLocaleString()}`}
          </span>
        </OfflineBanner>
      )}

      <Header>
        <div>
          <Title>
            {device.name}
            <Badge
              variant={isOffline ? 'negative' : device.status === 'maintenance' ? 'warning' : 'positive'}
              size="sm"
              dot
            >
              {device.onlineStatus}
            </Badge>
          </Title>
          <DeviceIdText>{device.serialNumber || device.id}</DeviceIdText>
        </div>
      </Header>

      <StatsGrid>
        <DataCard label="Battery" value={`${device.battery}`} unit="%" compact />
        <DataCard label="Status" value={device.status} compact />
        <DataCard label="Firmware" value={device.firmwareVersion || '—'} compact />
        <DataCard label="Last Reading" value={device.lastReadingAt ? timeAgo(device.lastReadingAt) : '—'} compact />
        <DataCard label="Credits Generated" value={`${device.creditsGenerated}`} unit="kg" compact />
        <DataCard label="Alerts" value={`${deviceAlerts.filter((a) => a.status === 'active').length}`} compact />
      </StatsGrid>

      <Tabs tabs={tabs} activeTab={activeMetric} onTabChange={setActiveMetric} />

      <ChartContainer>
        <ChartTitle>{metricConfig.label}</ChartTitle>
        <ChartValue>
          {currentValue}
          <ChartUnit>{metricConfig.unit}</ChartUnit>
        </ChartValue>
        <ChartRange>Normal range: {metricConfig.normalRange} · {lastUpdated}</ChartRange>

        <RangePicker>
          {RANGES.map((r) => (
            <RangeBtn key={r} $active={range === r} onClick={() => setRange(r)}>
              {r}
            </RangeBtn>
          ))}
        </RangePicker>

        <ChartArea>
          {metricsLoading ? (
            <Skeleton width="90%" height="80%" />
          ) : chartPoints.length > 0 ? (
            <BarChart>
              {chartPoints.slice(-60).map((p, i) => (
                <Bar key={i} style={{ height: `${Math.max((p.value / maxVal) * 100, 4)}%` }} title={`${p.value} at ${p.timestamp}`} />
              ))}
            </BarChart>
          ) : (
            <span>No data for this period</span>
          )}
        </ChartArea>
      </ChartContainer>

      {deviceAlerts.length > 0 && (
        <InfoSection>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Alert History ({deviceAlerts.length})
          </div>
          {deviceAlerts.slice(0, 10).map((alert) => (
            <AlertItem key={alert.id} $severity={alert.severity}>
              <span>{alert.message}</span>
              <Badge variant={alert.severity === 'critical' ? 'negative' : alert.severity === 'warning' ? 'warning' : 'neutral'} size="sm">
                {alert.severity}
              </Badge>
            </AlertItem>
          ))}
        </InfoSection>
      )}

      {/* Relay Control */}
      <RelayControlSection deviceId={deviceId} device={device} />

      {/* Revenue Grade */}
      <RevenueGradeSection deviceId={deviceId} device={device} />

      <InfoSection>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
          Device Information
        </div>
        <InfoGrid>
          <InfoRow><InfoLabel>Device ID</InfoLabel><InfoValue>{device.id}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Serial</InfoLabel><InfoValue>{device.serialNumber}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Model</InfoLabel><InfoValue>{device.model}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Firmware</InfoLabel><InfoValue>{device.firmwareVersion}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Location</InfoLabel><InfoValue>{device.location?.latitude?.toFixed(4)}, {device.location?.longitude?.toFixed(4)}</InfoValue></InfoRow>
          <InfoRow><InfoLabel>Public Sharing</InfoLabel><InfoValue>{device.isPublicSharing ? 'Yes' : 'No'}</InfoValue></InfoRow>
          {device.calibration?.lastCalibrated && (
            <InfoRow><InfoLabel>Last Calibrated</InfoLabel><InfoValue>{new Date(device.calibration.lastCalibrated).toLocaleDateString()}</InfoValue></InfoRow>
          )}
          {device.siteId && (
            <InfoRow><InfoLabel>Site</InfoLabel><InfoValue>{device.siteId}</InfoValue></InfoRow>
          )}
        </InfoGrid>
      </InfoSection>
    </Page>
  );
}

/* ── Relay Control Section ──────────────────────────────── */

function RelayControlSection({ deviceId, device }) {
  const navigate = useNavigate();
  const commandMutation = useSendCommandMutation();
  const [duration, setDuration] = useState('');
  const relayOn = device?.relayState || false;

  const handleRelay = (state) => {
    const cmd = { type: 'relay', state: state ? 1 : 0 };
    if (duration && state) cmd.duration_seconds = parseInt(duration) || undefined;
    commandMutation.mutate({ deviceId, command: cmd });
  };

  return (
    <InfoSection>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Relay Control</div>
        <Badge variant={relayOn ? 'positive' : 'neutral'} size="sm" dot>
          {relayOn ? 'On' : 'Off'}
        </Badge>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant={relayOn ? 'outline' : 'primary'}
          onClick={() => handleRelay(!relayOn)}
          disabled={commandMutation.isPending}
        >
          {commandMutation.isPending ? 'Sending...' : relayOn ? 'Turn Off' : 'Turn On'}
        </Button>
        <input
          type="number"
          placeholder="Duration (sec)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd',
            width: 120, fontSize: 13, fontFamily: 'inherit',
          }}
        />
      </div>
      {commandMutation.isSuccess && (
        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          ⏱ {commandMutation.data?.message || 'Command queued — will be delivered on next uplink.'}
        </div>
      )}
    </InfoSection>
  );
}

/* ── Revenue Grade Section ─────────────────────────────── */

function RevenueGradeSection({ deviceId, device }) {
  const navigate = useNavigate();
  const { data: rgStatus, isLoading } = useRevenueGradeQuery(deviceId);

  if (isLoading) return (
    <InfoSection>
      <Skeleton width={200} height={20} />
      <div style={{ marginTop: 16 }}><Skeleton height={100} /></div>
    </InfoSection>
  );

  if (!rgStatus?.enabled) {
    return (
      <InfoSection>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Credit Generation</div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
          Status: <span style={{ fontWeight: 600 }}>Not Enabled</span>
        </div>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 1.6 }}>
          Enable revenue-grade monitoring to generate tradeable water quality credits
          on WaterQuality.Trading.
        </div>
        <Button size="sm" onClick={() => navigate(`/cloud/devices/${deviceId}/revenue-grade/setup`)}>
          Enable Revenue Grade
        </Button>
      </InfoSection>
    );
  }

  const calStatus = rgStatus.calibrationStatus || {};
  const statusIcon = (s) => s === 'valid' ? '✓' : s === 'expiring_soon' ? '⚠️' : s === 'expired' ? '✗' : '—';
  const statusColor = (s) => s === 'valid' ? '#10B981' : s === 'expiring_soon' ? '#F59E0B' : s === 'expired' ? '#EF4444' : '#888';

  return (
    <InfoSection>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Credit Generation</div>
        <Badge variant={rgStatus.baselineComplete ? 'positive' : 'warning'} size="sm">
          {rgStatus.baselineComplete ? 'Active' : 'Pending Baseline'}
        </Badge>
      </div>

      {rgStatus.wqtProjectId && (
        <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
          WQT Project: {rgStatus.wqtProjectId}
        </div>
      )}

      {/* Baseline */}
      <div style={{ fontSize: 14, marginBottom: 12 }}>
        <strong>Baseline:</strong>{' '}
        {rgStatus.baselineType === 'monitoring' ? 'Monitoring' :
         rgStatus.baselineType === 'regulatory' ? 'Regulatory (NPDES permit)' : 'Historical'}
        {rgStatus.baselineProgress && !rgStatus.baselineComplete && (
          <span style={{ color: '#888' }}>
            {' '}— Day {rgStatus.baselineProgress.daysCurrent} of {rgStatus.baselineProgress.daysTotal}
            {' '}({rgStatus.baselineProgress.percentComplete}%)
          </span>
        )}
      </div>

      {/* Calibration Status */}
      <div style={{ fontSize: 14, marginBottom: 12 }}>
        <strong>Calibration:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 6 }}>
          {['ph', 'tds', 'turbidity', 'orp'].map((probe) => (
            <div key={probe} style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: statusColor(calStatus[probe]) }}>{statusIcon(calStatus[probe])}</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{probe}</span>
              <span style={{ color: '#888' }}>{calStatus[probe] || 'unknown'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Uptime */}
      {rgStatus.uptime30d !== null && (
        <div style={{ fontSize: 14, marginBottom: 12 }}>
          <strong>Data Continuity:</strong>{' '}
          <span style={{ color: rgStatus.uptime30d >= 95 ? '#10B981' : '#F59E0B' }}>
            {rgStatus.uptime30d}% (30-day)
          </span>
          {rgStatus.uptime30d >= 95 ? ' ✓' : ' ⚠️'}
        </div>
      )}

      {/* Credits */}
      {Object.keys(rgStatus.creditTotals || {}).length > 0 && (
        <div style={{ fontSize: 14, marginBottom: 12 }}>
          <strong>Credits:</strong>
          {Object.entries(rgStatus.creditTotals).map(([type, amount]) => (
            <div key={type} style={{ fontSize: 13, color: '#666', marginLeft: 8 }}>
              {type}: {amount} lbs
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {rgStatus.wqtProjectId && (
          <Button size="sm" variant="outline" onClick={() => window.open('https://waterquality.trading/portfolio', '_blank')}>
            View on WQT →
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => navigate(`/cloud/devices/${deviceId}/revenue-grade/setup`)}>
          Recalibrate Probes
        </Button>
      </div>
    </InfoSection>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default DeviceDetailPage;
