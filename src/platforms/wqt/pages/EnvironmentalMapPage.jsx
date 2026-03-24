/**
 * WQT Environmental Map — public sensor feeds displayed on an interactive Mapbox map.
 * Plots sensor stations with color-coded markers by status.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { EmptyState } from '../../../design-system/primitives/EmptyState';

// Set Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const HAS_VALID_TOKEN = MAPBOX_TOKEN && MAPBOX_TOKEN.length > 50 && MAPBOX_TOKEN.startsWith('pk.');

if (HAS_VALID_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

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
  overflow: hidden;
  position: relative;
`;

const MapFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  padding: 24px;
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

const STATUS_COLORS = {
  online: '#00C48C',
  maintenance: '#FFB020',
  offline: '#FF4D4D',
};

export function EnvironmentalMapPage() {
  const [search, setSearch] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

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

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || !HAS_VALID_TOKEN || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-77.5, 37.9],
      zoom: 6.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      addMarkers(SENSORS);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
    addMarkers(filtered);

    if (filtered.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filtered.forEach((s) => bounds.extend([s.lng, s.lat]));
      mapRef.current.fitBounds(bounds, { padding: 60, maxZoom: 10 });
    }
  }, [filtered]);

  function addMarkers(sensors) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    sensors.forEach((sensor) => {
      const color = STATUS_COLORS[sensor.status] || '#6b7280';

      const el = document.createElement('div');
      el.style.width = '18px';
      el.style.height = '18px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '2.5px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.15s';
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.4)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

      const readings = sensor.status !== 'offline'
        ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;font-size:11px;color:#475569;">
            <span>pH: <strong>${sensor.ph}</strong></span>
            <span>TDS: <strong>${sensor.tds} ppm</strong></span>
            <span>Turb: <strong>${sensor.turbidity} NTU</strong></span>
            <span>Temp: <strong>${sensor.temp}°C</strong></span>
          </div>`
        : '<div style="margin-top:8px;font-size:12px;color:#999;">Device offline</div>';

      const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
        <div style="padding:4px;min-width:160px;">
          <div style="font-size:14px;font-weight:600;color:#1e293b;margin-bottom:2px;">${sensor.name}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:4px;">${sensor.region} · ${sensor.id}</div>
          <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;background:${color}18;color:${color};">${sensor.status}</span>
          ${readings}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([sensor.lng, sensor.lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }

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
        {HAS_VALID_TOKEN ? (
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <MapFallback>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Map unavailable</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                Configure VITE_MAPBOX_TOKEN to enable the interactive map.
                {SENSORS.length} stations ready to plot.
              </div>
            </div>
          </MapFallback>
        )}
      </MapContainer>

      <div style={{ marginBottom: 20 }}>
        <SearchBar
          placeholder="Search stations by name, ID, or region..."
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
