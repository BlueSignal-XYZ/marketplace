import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockMapProjects, MapProject, getProjectsByType, getCreditTypeColor } from '../../data/mockMapData';
import { DemoHint } from '../../components/DemoHint';
import SEOHead from '../../components/seo/SEOHead';
import { createBreadcrumbSchema } from '../../components/seo/schemas';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYmx1ZXNpZ25hbCIsImEiOiJjbG0wMTIzNDUwMTIzM2RtZnJ5dXJ5dXJ5In0.dGVzdA';

// Track boundary layer IDs for cleanup
const BOUNDARY_LAYER_PREFIX = 'project-boundary';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 80px 20px 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

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
  color: #1a202c;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? '#667eea' : '#cbd5e1'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#475569'};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#5568d3' : '#f8fafc'};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  overflow: hidden;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 20px;
  border: none;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#475569'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:not(:last-child) {
    border-right: 1px solid #cbd5e1;
  }

  &:hover {
    background: ${props => props.active ? '#5568d3' : '#f8fafc'};
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;

  @media (max-width: 768px) {
    height: 500px;
  }
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;

  .mapboxgl-popup {
    max-width: 300px;
  }

  .mapboxgl-popup-content {
    padding: 16px;
    border-radius: 8px;
  }

  .mapboxgl-popup-close-button {
    font-size: 20px;
    padding: 4px 8px;
  }
`;

const EmptyMapOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
`;

const ListView = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProjectCard = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const ProjectMetaItem = styled.span`
  font-size: 13px;
  color: #475569;
`;

const CreditTypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    const colors: Record<string, string> = {
      nitrogen: '#dbeafe',
      phosphorus: '#d1fae5',
      stormwater: '#cffafe',
      thermal: '#fed7aa',
    };
    return colors[props.type] || '#f3f4f6';
  }};
  color: ${props => {
    const colors: Record<string, string> = {
      nitrogen: '#1e40af',
      phosphorus: '#065f46',
      stormwater: '#155e75',
      thermal: '#9a3412',
    };
    return colors[props.type] || '#374151';
  }};
  text-transform: capitalize;
  margin-right: 4px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

type ViewMode = 'map' | 'list';

export function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [filteredProjects, setFilteredProjects] = useState<MapProject[]>(mockMapProjects);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredProjects(mockMapProjects);
    } else {
      setFilteredProjects(getProjectsByType(filterType));
    }
  }, [filterType]);

  useEffect(() => {
    if (!mapContainer.current || viewMode !== 'map') return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-76.6122, 39.7],
        zoom: 7.5,
      });

      map.current.on('load', () => {
        setLoading(false);
        addBoundaryLayers();
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } else if (map.current.isStyleLoaded()) {
      // Update boundaries when filter changes
      addBoundaryLayers();
    }

    function addBoundaryLayers() {
      if (!map.current) return;

      // Remove ALL existing boundary layers and sources (check up to 20 possible indices)
      for (let idx = 0; idx < 20; idx++) {
        const layerFillId = `${BOUNDARY_LAYER_PREFIX}-fill-${idx}`;
        const layerOutlineId = `${BOUNDARY_LAYER_PREFIX}-outline-${idx}`;
        const sourceId = `${BOUNDARY_LAYER_PREFIX}-${idx}`;

        if (map.current!.getLayer(layerFillId)) {
          map.current!.removeLayer(layerFillId);
        }
        if (map.current!.getLayer(layerOutlineId)) {
          map.current!.removeLayer(layerOutlineId);
        }
        if (map.current!.getSource(sourceId)) {
          map.current!.removeSource(sourceId);
        }
      }

      // Add boundary layers for each project
      filteredProjects.forEach((project, idx) => {
        if (!project.boundary) return;

        const color = project.creditTypes.length > 0
          ? getCreditTypeColor(project.creditTypes[0])
          : '#6b7280';

        const sourceId = `${BOUNDARY_LAYER_PREFIX}-${idx}`;
        const layerFillId = `${BOUNDARY_LAYER_PREFIX}-fill-${idx}`;
        const layerOutlineId = `${BOUNDARY_LAYER_PREFIX}-outline-${idx}`;

        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: project.boundary,
            properties: { name: project.name },
          },
        });

        map.current!.addLayer({
          id: layerFillId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': color,
            'fill-opacity': 0.2,
          },
        });

        map.current!.addLayer({
          id: layerOutlineId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': color,
            'line-width': 2,
            'line-opacity': 0.7,
          },
        });
      });
    }

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    filteredProjects.forEach(project => {
      const markerColor = project.creditTypes.length > 0
        ? getCreditTypeColor(project.creditTypes[0])
        : '#6b7280';

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerColor;
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const acreageInfo = project.acreage
        ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">${project.acreage} acres</p>`
        : '';

      const popupContent = `
        <div style="padding: 4px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">
            ${project.name}
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
            ${project.description}
          </p>
          <div style="margin-bottom: 8px;">
            ${project.creditTypes.map(type => `
              <span style="
                display: inline-block;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                margin-right: 4px;
                background: ${getCreditTypeColor(type)}20;
                color: ${getCreditTypeColor(type)};
              ">
                ${type}
              </span>
            `).join('')}
          </div>
          <p style="margin: 0; font-size: 13px; color: #475569;">
            <strong>${project.totalCredits.toLocaleString()}</strong> total credits
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
            ${project.owner}
          </p>
          ${acreageInfo}
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([project.lng, project.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    if (filteredProjects.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredProjects.forEach(project => {
        bounds.extend([project.lng, project.lat]);
      });
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 10 });
    }
  }, [filteredProjects, viewMode]);

  const mapSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Map', url: 'https://waterquality.trading/map' },
  ]);

  return (
    <PageContainer>
      <SEOHead
        title="Water Credit Project Map"
        description="Interactive map of water quality credit projects. Explore nitrogen, phosphorus, stormwater, and thermal credit generating facilities by location."
        canonical="/map"
        keywords="water credit map, project locations, nutrient credit projects, water quality facilities, geographic view"
        jsonLd={mapSchema}
      />
      <ContentWrapper>
        <Header>
          <TitleRow>
            <Title>Project Map</Title>
            <DemoHint screenName="wqt-map" customHint="Interactive map showing geographic distribution of credit-generating projects" />
          </TitleRow>
          <Subtitle>Geographic view of projects generating water quality credits</Subtitle>
        </Header>

        <ControlsRow>
          <FilterChipsContainer>
            <FilterChip active={filterType === 'all'} onClick={() => setFilterType('all')}>
              All Projects
            </FilterChip>
            <FilterChip active={filterType === 'nitrogen'} onClick={() => setFilterType('nitrogen')}>
              Nitrogen
            </FilterChip>
            <FilterChip active={filterType === 'phosphorus'} onClick={() => setFilterType('phosphorus')}>
              Phosphorus
            </FilterChip>
            <FilterChip active={filterType === 'stormwater'} onClick={() => setFilterType('stormwater')}>
              Stormwater
            </FilterChip>
            <FilterChip active={filterType === 'thermal'} onClick={() => setFilterType('thermal')}>
              Thermal
            </FilterChip>
          </FilterChipsContainer>

          <ViewToggle>
            <ViewButton active={viewMode === 'map'} onClick={() => setViewMode('map')}>
              Map View
            </ViewButton>
            <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')}>
              List View
            </ViewButton>
          </ViewToggle>
        </ControlsRow>

        {viewMode === 'map' ? (
          <MapContainer>
            {loading && (
              <LoadingOverlay>
                <Spinner />
              </LoadingOverlay>
            )}
            {filteredProjects.length === 0 ? (
              <EmptyMapOverlay>
                <EmptyIcon>📍</EmptyIcon>
                <EmptyTitle>No projects to display</EmptyTitle>
                <EmptyText>Try adjusting your filter criteria</EmptyText>
              </EmptyMapOverlay>
            ) : null}
            <MapElement ref={mapContainer} />
          </MapContainer>
        ) : (
          <ListView>
            {filteredProjects.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyTitle>No projects found</EmptyTitle>
                <EmptyText>Try adjusting your filter criteria</EmptyText>
              </div>
            ) : (
              filteredProjects.map(project => (
                <ProjectCard key={project.id}>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <ProjectMeta>
                    {project.creditTypes.map(type => (
                      <CreditTypeBadge key={type} type={type}>
                        {type}
                      </CreditTypeBadge>
                    ))}
                    <ProjectMetaItem>
                      <strong>{project.totalCredits.toLocaleString()}</strong> credits
                    </ProjectMetaItem>
                    <ProjectMetaItem style={{ color: '#94a3b8' }}>
                      {project.owner}
                    </ProjectMetaItem>
                  </ProjectMeta>
                </ProjectCard>
              ))
            )}
          </ListView>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}
