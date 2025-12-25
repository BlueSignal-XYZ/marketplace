/**
 * Location Capture Component
 * Captures device installation location via GPS, map, or address
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { auth } from "../../apis/firebase";
import configs from "../../../configs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 8px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${(props) => (props.active ? "rgba(0, 212, 255, 0.2)" : "transparent")};
  color: ${(props) => (props.active ? "#00d4ff" : "rgba(255, 255, 255, 0.6)")};
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.active ? "rgba(0, 212, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"};
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a2e;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.5rem;
  background: ${(props) => (props.primary ? "#00d4ff" : "transparent")};
  color: ${(props) => (props.primary ? "#000" : "#fff")};
  border: ${(props) => (props.primary ? "none" : "1px solid rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${(props) => (props.primary ? "#00b8e0" : "rgba(255, 255, 255, 0.1)")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CoordinatesDisplay = styled.div`
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #22c55e;
  font-family: monospace;
  text-align: center;
`;

const AddressDisplay = styled.div`
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #3b82f6;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
`;

const AccuracyIndicator = styled.span`
  font-size: 0.75rem;
  color: ${(props) =>
    props.accuracy < 10
      ? "#22c55e"
      : props.accuracy < 50
      ? "#f59e0b"
      : "#ef4444"};
  margin-left: 0.5rem;
`;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of US
};

// Google Maps libraries to load
const libraries = ["places"];

/**
 * Location Capture Component
 */
export function LocationCapture({ onLocationSet, initialLocation, googleMapsApiKey }) {
  const [method, setMethod] = useState("gps");
  const [coordinates, setCoordinates] = useState(initialLocation || null);
  const [address, setAddress] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const mapRef = useRef(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  /**
   * Capture GPS location
   */
  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const acc = position.coords.accuracy;

        setCoordinates(coords);
        setAccuracy(acc);
        setLoading(false);

        // Notify parent
        onLocationSet?.({
          coordinates: { ...coords, accuracy: acc },
          method: "gps",
        });

        // Reverse geocode to get address
        if (isLoaded && window.google) {
          reverseGeocodeLocal(coords);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied. Please allow location access.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("Unable to get location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [isLoaded, onLocationSet]);

  /**
   * Handle map click for pin placement
   */
  const handleMapClick = useCallback(
    (e) => {
      if (method !== "map_pin") return;

      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      setCoordinates(coords);
      setAccuracy(null);

      // Notify parent
      onLocationSet?.({
        coordinates: coords,
        method: "map_pin",
      });

      // Reverse geocode
      if (isLoaded && window.google) {
        reverseGeocodeLocal(coords);
      }
    },
    [method, isLoaded, onLocationSet]
  );

  /**
   * Handle marker drag
   */
  const handleMarkerDrag = useCallback(
    (e) => {
      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      setCoordinates(coords);

      // Notify parent
      onLocationSet?.({
        coordinates: coords,
        method: "map_pin",
      });

      // Reverse geocode
      if (isLoaded && window.google) {
        reverseGeocodeLocal(coords);
      }
    },
    [isLoaded, onLocationSet]
  );

  /**
   * Geocode address using Google Maps
   */
  const geocodeAddress = useCallback(async () => {
    if (!address.trim()) return;
    if (!isLoaded || !window.google) {
      setError("Google Maps not loaded");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error("Address not found"));
          }
        });
      });

      const location = result.geometry.location;
      const coords = {
        lat: location.lat(),
        lng: location.lng(),
      };

      setCoordinates(coords);
      setFormattedAddress(result.formatted_address);
      setAccuracy(null);

      // Notify parent
      onLocationSet?.({
        coordinates: coords,
        address: result.formatted_address,
        method: "address",
      });
    } catch (err) {
      setError(err.message || "Failed to find address");
    } finally {
      setLoading(false);
    }
  }, [address, isLoaded, onLocationSet]);

  /**
   * Reverse geocode coordinates locally
   */
  const reverseGeocodeLocal = useCallback(
    async (coords) => {
      if (!isLoaded || !window.google) return;

      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results.length > 0) {
              resolve(results[0]);
            } else {
              reject(new Error("Location not found"));
            }
          });
        });

        setFormattedAddress(result.formatted_address);
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    },
    [isLoaded]
  );

  /**
   * Center map on coordinates
   */
  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      if (coordinates) {
        map.panTo(coordinates);
        map.setZoom(15);
      }
    },
    [coordinates]
  );

  // Auto-capture GPS on mount if method is GPS
  useEffect(() => {
    if (method === "gps" && !coordinates) {
      captureGPS();
    }
  }, []);

  if (loadError) {
    return <ErrorMessage>Failed to load Google Maps</ErrorMessage>;
  }

  return (
    <Container>
      {/* Method Tabs */}
      <TabContainer>
        <Tab active={method === "gps"} onClick={() => setMethod("gps")}>
          GPS
        </Tab>
        <Tab active={method === "map_pin"} onClick={() => setMethod("map_pin")}>
          Map Pin
        </Tab>
        <Tab active={method === "address"} onClick={() => setMethod("address")}>
          Address
        </Tab>
      </TabContainer>

      {/* GPS Method */}
      {method === "gps" && (
        <Button primary onClick={captureGPS} disabled={loading}>
          {loading ? "Getting Location..." : "Capture Current Location"}
        </Button>
      )}

      {/* Address Method */}
      {method === "address" && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Input
            placeholder="Enter address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && geocodeAddress()}
          />
          <Button primary onClick={geocodeAddress} disabled={loading || !address.trim()}>
            {loading ? "..." : "Find"}
          </Button>
        </div>
      )}

      {/* Map Display */}
      {(method === "map_pin" || coordinates) && (
        <MapContainer>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={coordinates || defaultCenter}
              zoom={coordinates ? 15 : 4}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
              options={{
                mapTypeId: "hybrid",
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {coordinates && (
                <Marker
                  position={coordinates}
                  draggable={method === "map_pin"}
                  onDragEnd={handleMarkerDrag}
                />
              )}
            </GoogleMap>
          ) : (
            <LoadingOverlay>Loading map...</LoadingOverlay>
          )}
        </MapContainer>
      )}

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Coordinates Display */}
      {coordinates && (
        <CoordinatesDisplay>
          Lat: {coordinates.lat.toFixed(6)} | Lng: {coordinates.lng.toFixed(6)}
          {accuracy !== null && (
            <AccuracyIndicator accuracy={accuracy}>
              (Accuracy: {accuracy.toFixed(0)}m)
            </AccuracyIndicator>
          )}
        </CoordinatesDisplay>
      )}

      {/* Formatted Address */}
      {formattedAddress && <AddressDisplay>{formattedAddress}</AddressDisplay>}

      {/* Map Pin Instructions */}
      {method === "map_pin" && !coordinates && (
        <div
          style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center", fontSize: "0.875rem" }}
        >
          Click on the map to place a pin at the installation location
        </div>
      )}
    </Container>
  );
}

export default LocationCapture;
