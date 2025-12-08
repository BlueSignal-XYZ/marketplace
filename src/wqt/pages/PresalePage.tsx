import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  mockPresaleProjects,
  PresaleProject,
  getPresalesByStatus,
  getPresalesByCreditType,
  getCreditTypeColor,
  getStatusColor,
  formatStatus
} from '../../data/mockPresaleData';
import { DemoHint } from '../../components/DemoHint';
import SEOHead from '../../components/seo/SEOHead';
import { createBreadcrumbSchema } from '../../components/seo/schemas';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYmx1ZXNpZ25hbCIsImEiOiJjbG0wMTIzNDUwMTIzM2RtZnJ5dXJ5dXJ5In0.dGVzdA';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 80px 20px 40px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

  @media (max-width: 768px) {
    padding: 70px 16px 24px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;
    gap: 24px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ active: boolean; color?: string }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? (props.color || '#667eea') : 'rgba(255,255,255,0.2)'};
  background: ${props => props.active ? (props.color || '#667eea') : 'rgba(255,255,255,0.05)'};
  color: ${props => props.active ? 'white' : '#cbd5e1'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? (props.color || '#5568d3') : 'rgba(255,255,255,0.1)'};
    border-color: ${props => props.color || 'rgba(255,255,255,0.3)'};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 20px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:not(:last-child) {
    border-right: 1px solid rgba(255,255,255,0.2);
  }

  &:hover {
    background: ${props => props.active ? '#5568d3' : 'rgba(255,255,255,0.1)'};
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: #1e293b;
  position: relative;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;

  .mapboxgl-popup {
    max-width: 320px;
  }

  .mapboxgl-popup-content {
    padding: 0;
    border-radius: 12px;
    background: #1e293b;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .mapboxgl-popup-close-button {
    font-size: 20px;
    padding: 8px 12px;
    color: #94a3b8;
  }

  .mapboxgl-popup-tip {
    border-top-color: #1e293b;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PresaleCard = styled.div<{ status: string }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => getStatusColor(props.status as PresaleProject['status'])};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
`;

const CardLocation = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => getStatusColor(props.status as PresaleProject['status'])}20;
  color: ${props => getStatusColor(props.status as PresaleProject['status'])};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CreditTypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => getCreditTypeColor(props.type)}20;
  color: ${props => getCreditTypeColor(props.type)};
  text-transform: capitalize;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #cbd5e1;
  margin: 0 0 16px 0;
  line-height: 1.6;
`;

const CardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PriceTag = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #10b981;

  span {
    font-size: 14px;
    font-weight: 400;
    color: #64748b;
  }
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.disabled ? '#475569' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FeatureTag = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border-radius: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #94a3b8;
  margin: 0;
`;

type ViewMode = 'map' | 'cards';

export function PresalePage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [creditFilter, setCreditFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filteredProjects, setFilteredProjects] = useState<PresaleProject[]>(mockPresaleProjects);

  useEffect(() => {
    let result = mockPresaleProjects;

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (creditFilter !== 'all') {
      result = result.filter(p => p.creditType === creditFilter);
    }

    setFilteredProjects(result);
  }, [statusFilter, creditFilter]);

  useEffect(() => {
    if (!mapContainer.current || viewMode !== 'map') return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-95.7129, 37.0902],
        zoom: 3.5,
      });

      map.current.on('load', () => {
        setLoading(false);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for filtered projects
    filteredProjects.forEach(project => {
      const markerColor = getCreditTypeColor(project.creditType);
      const statusColor = getStatusColor(project.status);

      const el = document.createElement('div');
      el.className = 'presale-marker';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerColor;
      el.style.border = `4px solid ${statusColor}`;
      el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popupContent = `
        <div style="padding: 16px; color: #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">
              ${project.name}
            </h3>
            <span style="
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              background: ${statusColor}30;
              color: ${statusColor};
              text-transform: uppercase;
            ">
              ${formatStatus(project.status)}
            </span>
          </div>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8;">
            ${project.location}
          </p>
          <div style="
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            background: ${markerColor}30;
            color: ${markerColor};
            text-transform: capitalize;
            margin-bottom: 12px;
          ">
            ${project.creditType}
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #64748b;">Available:</span>
            <span style="font-size: 14px; font-weight: 600; color: #ffffff;">
              ${project.availableSupply.toLocaleString()} credits
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 12px; color: #64748b;">Price:</span>
            <span style="font-size: 14px; font-weight: 600; color: #10b981;">
              $${project.pricePerCredit}/credit
            </span>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([project.lng, project.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit bounds if we have projects
    if (filteredProjects.length > 0 && map.current.isStyleLoaded()) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredProjects.forEach(project => {
        bounds.extend([project.lng, project.lat]);
      });
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 8 });
    }
  }, [filteredProjects, viewMode]);

  const presaleSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Pre-Sale', url: 'https://waterquality.trading/presale' },
  ]);

  return (
    <PageContainer>
      <SEOHead
        title="Pre-Sale Water Credits | Early Access Offerings"
        description="Discover upcoming water credit offerings. Secure early access to nitrogen, phosphorus, stormwater, and thermal credits from verified projects."
        canonical="/presale"
        keywords="pre-sale water credits, early access, nutrient credits, water quality investment"
        jsonLd={presaleSchema}
      />
      <ContentWrapper>
        <Header>
          <TitleRow>
            <Title>Pre-Sale Offerings</Title>
            <DemoHint screenName="wqt-presale" customHint="Early access to upcoming water credit projects" />
          </TitleRow>
          <Subtitle>Secure early access to verified water quality credit projects</Subtitle>
        </Header>

        <ControlsRow>
          <FilterSection>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterChipsContainer>
                <FilterChip
                  active={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </FilterChip>
                <FilterChip
                  active={statusFilter === 'coming-soon'}
                  color="#f59e0b"
                  onClick={() => setStatusFilter('coming-soon')}
                >
                  Coming Soon
                </FilterChip>
                <FilterChip
                  active={statusFilter === 'active'}
                  color="#10b981"
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                </FilterChip>
                <FilterChip
                  active={statusFilter === 'closed'}
                  color="#6b7280"
                  onClick={() => setStatusFilter('closed')}
                >
                  Closed
                </FilterChip>
              </FilterChipsContainer>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Credit Type</FilterLabel>
              <FilterChipsContainer>
                <FilterChip
                  active={creditFilter === 'all'}
                  onClick={() => setCreditFilter('all')}
                >
                  All Types
                </FilterChip>
                <FilterChip
                  active={creditFilter === 'nitrogen'}
                  color="#3b82f6"
                  onClick={() => setCreditFilter('nitrogen')}
                >
                  Nitrogen
                </FilterChip>
                <FilterChip
                  active={creditFilter === 'phosphorus'}
                  color="#10b981"
                  onClick={() => setCreditFilter('phosphorus')}
                >
                  Phosphorus
                </FilterChip>
                <FilterChip
                  active={creditFilter === 'stormwater'}
                  color="#06b6d4"
                  onClick={() => setCreditFilter('stormwater')}
                >
                  Stormwater
                </FilterChip>
                <FilterChip
                  active={creditFilter === 'thermal'}
                  color="#f97316"
                  onClick={() => setCreditFilter('thermal')}
                >
                  Thermal
                </FilterChip>
              </FilterChipsContainer>
            </FilterGroup>
          </FilterSection>

          <ViewToggle>
            <ViewButton active={viewMode === 'cards'} onClick={() => setViewMode('cards')}>
              Cards
            </ViewButton>
            <ViewButton active={viewMode === 'map'} onClick={() => setViewMode('map')}>
              Map
            </ViewButton>
          </ViewToggle>
        </ControlsRow>

        {viewMode === 'map' && (
          <MapContainer>
            {loading && (
              <LoadingOverlay>
                <Spinner />
              </LoadingOverlay>
            )}
            <MapElement ref={mapContainer} />
          </MapContainer>
        )}

        {filteredProjects.length === 0 ? (
          <EmptyState>
            <EmptyIcon>No presale offerings</EmptyIcon>
            <EmptyTitle>No pre-sale offerings found</EmptyTitle>
            <EmptyText>Try adjusting your filter criteria to see more offerings</EmptyText>
          </EmptyState>
        ) : (
          <CardGrid>
            {filteredProjects.map(project => (
              <PresaleCard key={project.id} status={project.status}>
                <CardHeader>
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardLocation>{project.location}</CardLocation>
                  </div>
                  <StatusBadge status={project.status}>
                    {formatStatus(project.status)}
                  </StatusBadge>
                </CardHeader>

                <div style={{ marginBottom: '12px' }}>
                  <CreditTypeBadge type={project.creditType}>
                    {project.creditType}
                  </CreditTypeBadge>
                </div>

                <CardDescription>{project.description}</CardDescription>

                <FeaturesList>
                  {project.features.map((feature, idx) => (
                    <FeatureTag key={idx}>{feature}</FeatureTag>
                  ))}
                </FeaturesList>

                <CardStats>
                  <StatItem>
                    <StatValue>{project.availableSupply.toLocaleString()}</StatValue>
                    <StatLabel>Available</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{project.totalLandArea.toLocaleString()}</StatValue>
                    <StatLabel>Acres</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{project.minimumPurchase}</StatValue>
                    <StatLabel>Min Purchase</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{project.verifier.split(' ')[0]}</StatValue>
                    <StatLabel>Verifier</StatLabel>
                  </StatItem>
                </CardStats>

                <CardFooter>
                  <PriceTag>
                    ${project.pricePerCredit}<span>/credit</span>
                  </PriceTag>
                  <ActionButton disabled={project.status === 'closed'}>
                    {project.status === 'coming-soon' ? 'Notify Me' :
                     project.status === 'active' ? 'Purchase' : 'Closed'}
                  </ActionButton>
                </CardFooter>
              </PresaleCard>
            ))}
          </CardGrid>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}
