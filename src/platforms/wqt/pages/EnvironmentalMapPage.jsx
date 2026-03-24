/**
 * WQT Environmental Map — public sensor feeds displayed on an interactive map.
 * Uses placeholder data until v2 data endpoints are wired.
 */

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { EmptyState } from '../../../design-system/primitives/EmptyState';

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
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
  margin: 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 480px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MapDot = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#0052CC'};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
  &:hover {
    transform: scale(1.5);
    z-index: 10;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const SensorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

const SensorCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 82, 204, 0.08);
  }
`;

const SensorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const SensorName = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SensorLocation = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const SensorStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const Stat = styled.div`
  padding: 8px 10px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

// ── Placeholder data ──────────────────────────────────────

const SENSORS = [
  { id: 'BS-WQM-1042', name: 'James River Station A', region: 'Virginia - James River', lat: 37.54, lng: -77.43, status: 'online', ph: 7.2, tds: 342, turbidity: 4.1, temp: 18.3 },
  { id: 'BS-WQM-1043', name: 'Potomac Intake B', region: 'Virginia - Potomac', lat: 38.89, lng: -77.05, status: 'online', ph: 7.5, tds: 298, turbidity: 3.8, temp: 17.1 },
  { id: 'BS-WQM-1044', name: 'York River Monitor', region: 'Virginia - York', lat: 37.25, lng: -76.50, status: 'online', ph: 7.0, tds: 410, turbidity: 5.2, temp: 19.0 },
  { id: 'BS-WQM-1045', name: 'Chesapeake Bay Buoy 1', region: 'Chesapeake Bay', lat: 37.00, lng: -76.30, status: 'maintenance', ph: 7.8, tds: 520, turbidity: 6.1, temp: 16.5 },
  { id: 'BS-WQM-1046', name: 'Rappahannock Station', region: 'Virginia - Rappahannock', lat: 38.30, lng: -77.46, status: 'online', ph: 6.9, tds: 275, turbidity: 3.4, temp: 18.7 },
  { id: 'BS-WQM-1047', name: 'Shenandoah Valley Outflow', region: 'Virginia - Shenandoah', lat: 38.45, lng: -78.87, status: 'offline', ph: null, tds: null, turbidity: null, temp: null },
];

export function EnvironmentalMapPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return SENSORS;
    const q = search.toLowerCase();
    return SENSORS.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  }, [search]);

  const online = SENSORS.filter((s) => s.status === 'online').length;

  return (
    <Page>
      <Header>
        <Title>Environmental Data</Title>
        <Subtitle>Live sensor feeds from monitoring stations across Virginia waterways.</Subtitle>
      </Header>

      <StatsRow>
        <DataCard label="Active Sensors" value={online.toString()} unit={`of ${SENSORS.length}`} compact />
        <DataCard label="Avg pH" value="7.3" compact />
        <DataCard label="Avg TDS" value="369" unit="ppm" compact />
        <DataCard label="Data Coverage" value="96.2" unit="%" compact />
      </StatsRow>

      <MapContainer>
        <MapPlaceholder>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Map loading...</div>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>Connecting to map service. Check that VITE_GOOGLE_MAPS_API_KEY is configured.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{SENSORS.length} stations ready</div>
        </MapPlaceholder>
        {/* Scatter dots as rough position indicators */}
        {SENSORS.map((s, i) => (
          <MapDot
            key={s.id}
            $color={s.status === 'online' ? '#00C48C' : s.status === 'maintenance' ? '#FFB020' : '#FF4D4D'}
            style={{ top: `${20 + i * 12}%`, left: `${15 + i * 13}%` }}
            title={`${s.name} (${s.status})`}
          />
        ))}
      </MapContainer>

      <div style={{ marginBottom: 20 }}>
        <SearchBar
          placeholder="Search stations by name, ID, or region…"
          value={search}
          onChange={setSearch}
        />
      </div>

      <SensorsGrid>
        {filtered.map((sensor) => (
          <SensorCard key={sensor.id}>
            <SensorHeader>
              <div>
                <SensorName>{sensor.name}</SensorName>
                <SensorLocation>{sensor.region} · {sensor.id}</SensorLocation>
              </div>
              <Badge
                variant={sensor.status === 'online' ? 'positive' : sensor.status === 'maintenance' ? 'warning' : 'negative'}
                size="sm"
                dot
              >
                {sensor.status}
              </Badge>
            </SensorHeader>
            {sensor.status !== 'offline' ? (
              <SensorStats>
                <Stat><StatLabel>pH</StatLabel><StatValue>{sensor.ph}</StatValue></Stat>
                <Stat><StatLabel>TDS</StatLabel><StatValue>{sensor.tds} ppm</StatValue></Stat>
                <Stat><StatLabel>Turbidity</StatLabel><StatValue>{sensor.turbidity} NTU</StatValue></Stat>
                <Stat><StatLabel>Temp</StatLabel><StatValue>{sensor.temp}°C</StatValue></Stat>
              </SensorStats>
            ) : (
              <div style={{ padding: '16px 0', textAlign: 'center', color: '#999', fontSize: 13 }}>
                Device offline — no current data
              </div>
            )}
          </SensorCard>
        ))}
        {filtered.length === 0 && (
          <EmptyState title="No stations found" description="Try a different search term." />
        )}
      </SensorsGrid>
    </Page>
  );
}

export default EnvironmentalMapPage;
