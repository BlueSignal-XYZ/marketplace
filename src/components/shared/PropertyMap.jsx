// src/components/shared/PropertyMap.jsx
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token
mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiYmx1ZXNpZ25hbCIsImEiOiJjbG0wMTIzNDUwMTIzM2RtZnJ5dXJ5dXJ5In0.dGVzdA";

const MapWrapper = styled.div`
  width: 100%;
  height: ${(props) => props.$height || "300px"};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: #f1f5f9;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;

  .mapboxgl-ctrl-attrib {
    font-size: 10px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(241, 245, 249, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #64748b;
`;

/**
 * Get boundary polygon fill color based on pollutant type
 */
function getBoundaryColor(pollutant) {
  const colors = {
    N: "#3b82f6", // Nitrogen - blue
    P: "#10b981", // Phosphorus - green
    TSS: "#06b6d4", // Sediment - cyan
    Temp: "#f59e0b", // Thermal - amber
  };
  return colors[pollutant] || "#667eea";
}

/**
 * PropertyMap - Interactive Mapbox map showing property location and boundary
 *
 * @param {Object} props
 * @param {number} props.lat - Center latitude
 * @param {number} props.lng - Center longitude
 * @param {Object} props.boundary - GeoJSON Polygon object with coordinates
 * @param {string} props.pollutant - Pollutant type for boundary coloring (N, P, TSS, Temp)
 * @param {string} props.propertyName - Name to show in popup
 * @param {string} props.height - CSS height value (default: "300px")
 * @param {number} props.zoom - Initial zoom level (default: auto-fit to boundary)
 * @param {string} props.mapStyle - Mapbox style (default: outdoors-v12)
 */
export function PropertyMap({
  lat,
  lng,
  boundary,
  pollutant,
  propertyName,
  height = "300px",
  zoom,
  mapStyle = "mapbox://styles/mapbox/outdoors-v12",
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!lat || !lng) {
      setError("No coordinates available");
      setLoading(false);
      return;
    }

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [lng, lat],
        zoom: zoom || 14,
        attributionControl: true,
      });

      mapRef.current = map;

      map.on("load", () => {
        setLoading(false);

        // Add boundary polygon if available
        if (boundary && boundary.coordinates) {
          const boundaryColor = getBoundaryColor(pollutant);

          // Add the boundary as a source
          map.addSource("property-boundary", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: boundary,
              properties: {
                name: propertyName,
              },
            },
          });

          // Add fill layer
          map.addLayer({
            id: "property-boundary-fill",
            type: "fill",
            source: "property-boundary",
            paint: {
              "fill-color": boundaryColor,
              "fill-opacity": 0.25,
            },
          });

          // Add outline layer
          map.addLayer({
            id: "property-boundary-outline",
            type: "line",
            source: "property-boundary",
            paint: {
              "line-color": boundaryColor,
              "line-width": 3,
              "line-opacity": 0.8,
            },
          });

          // Fit map to boundary bounds
          const coordinates = boundary.coordinates[0];
          const bounds = coordinates.reduce(
            (bounds, coord) => bounds.extend(coord),
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          );

          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 16,
          });
        }

        // Add center marker
        const markerEl = document.createElement("div");
        markerEl.style.width = "24px";
        markerEl.style.height = "24px";
        markerEl.style.borderRadius = "50%";
        markerEl.style.backgroundColor = getBoundaryColor(pollutant);
        markerEl.style.border = "3px solid white";
        markerEl.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";

        new mapboxgl.Marker(markerEl).setLngLat([lng, lat]).addTo(map);

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        setError("Failed to load map");
        setLoading(false);
      });
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
      setLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, boundary, pollutant, propertyName, zoom, mapStyle]);

  return (
    <MapWrapper $height={height}>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}
      {error && (
        <ErrorMessage>
          <ErrorTitle>Map unavailable</ErrorTitle>
          <ErrorText>{error}</ErrorText>
        </ErrorMessage>
      )}
      <MapContainer ref={mapContainerRef} />
    </MapWrapper>
  );
}

export default PropertyMap;
