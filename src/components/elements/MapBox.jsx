import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { MapsAPI } from "../../scripts/back_door";

const MapContainer = styled.div`
height: 400px;
width: 100%;


  border-radius: 10px;
  /* Hide the links at the bottom of the map */
  .gm-style > div:nth-child(1) > a {
    display: none !important;
  }

  /* Hide the Google logo */
  .gm-style .gm-style-cc {
    display: none !important;
  }
`;

function MapBox() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the API key from backend
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const key = await MapsAPI.getKey();
        if (key) {
          setApiKey(key);
        } else {
          setError("Could not load map API key");
        }
      } catch (err) {
        console.error("Failed to fetch Maps API key:", err);
        setError("Failed to load map configuration");
      } finally {
        setLoading(false);
      }
    };
    fetchKey();
  }, []);

  // Load Google Maps script only after we have the API key
  useEffect(() => {
    if (!apiKey) return;

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      initializeMap();
    };

    script.onerror = () => {
      setError("Failed to load Google Maps");
    };

    return () => {
      if (window.google && window.google.maps && map) {
        window.google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [apiKey]);

  const initializeMap = () => {
    if (mapContainerRef.current) {
      setMap(
        new google.maps.Map(mapContainerRef.current, {
          center: { lat: 48.8036, lng: -95.0969 },
          zoom: 13,
          disableDefaultUI: true,
          gestureHandling: "none",
          mapTypeId: "satellite",
        })
      );
    }
  };

  if (loading) {
    return <MapContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>Loading map...</MapContainer>;
  }

  if (error) {
    return <MapContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', color: '#991b1b' }}>{error}</MapContainer>;
  }

  return <MapContainer ref={mapContainerRef} />;
}

export default MapBox;
