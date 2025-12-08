// /src/components/cloud/SiteDetailPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, Polygon } from "@react-google-maps/api";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 16px;

  @media (min-width: 600px) {
    padding: 24px;
  }

  h2 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};

    @media (min-width: 600px) {
      font-size: 18px;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  }

  .value {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  .subvalue {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ $variant }) =>
    $variant === "warning"
      ? "#f97316"
      : $variant === "offline"
      ? "#dc2626"
      : "#16a34a"};
`;

// Desktop table - hidden on mobile
const DevicesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  display: none;

  @media (min-width: 768px) {
    display: table;
  }

  thead {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    text-align: left;
    padding: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  }

  tbody tr {
    transition: background 0.15s ease-out;

    &:hover {
      background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

// Mobile card layout - shown only on mobile
const DeviceCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const DeviceCard = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 10px;
  padding: 14px;
`;

const DeviceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const DeviceCardName = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DeviceCardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 13px;
`;

const DeviceCardMetaItem = styled.div`
  .label {
    font-size: 11px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .value {
    font-weight: 500;
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  }
`;

const DeviceLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const AlertsSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlertRow = styled.div`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ $severity }) =>
      $severity === "critical"
        ? "#fca5a5"
        : $severity === "warning"
        ? "#fdba74"
        : "#e5e7eb"};
  background: ${({ $severity }) =>
    $severity === "critical"
      ? "#fef2f2"
      : $severity === "warning"
      ? "#fff7ed"
      : "#f9fafb"};
  font-size: 13px;

  .alert-message {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .alert-meta {
    font-size: 11px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  }
`;

const MapContainer = styled.div`
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};

  @media (min-width: 600px) {
    height: 300px;
  }

  @media (min-width: 1024px) {
    height: 400px;
  }
`;

const MapLoading = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  font-size: 14px;
  gap: 8px;
`;

const MapError = styled.div`
  height: 100%;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  font-size: 14px;
  gap: 8px;
  text-align: center;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  font-size: 14px;
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;
  height: ${({ $height }) => $height || "400px"};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Google Maps API key from environment
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Map styling
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#a3ccff" }],
    },
  ],
};

export default function SiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Google Maps
  const { isLoaded: mapsLoaded, loadError: mapsError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Map center - memoized to prevent re-renders
  const mapCenter = useMemo(() => {
    if (site?.coordinates) {
      return { lat: site.coordinates.lat, lng: site.coordinates.lng };
    }
    return { lat: 39.5, lng: -79.3 }; // Default center
  }, [site?.coordinates]);

  useEffect(() => {
    loadSiteData();
  }, [siteId]);

  const loadSiteData = async () => {
    setLoading(true);
    try {
      const [siteData, devicesData, alertsData] = await Promise.all([
        CloudMockAPI.sites.getById(siteId),
        CloudMockAPI.devices.getBySite(siteId),
        CloudMockAPI.alerts.getAll(),
      ]);

      setSite(siteData);
      setDevices(devicesData);
      // Filter alerts for this site's devices
      const siteDeviceIds = devicesData.map((d) => d.id);
      const siteAlerts = alertsData.filter((a) =>
        siteDeviceIds.includes(a.deviceId)
      );
      setAlerts(siteAlerts);
    } catch (error) {
      console.error("Error loading site data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    if (status === "offline") return "offline";
    if (status === "warning") return "warning";
    return "online";
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Site Details"
        breadcrumbs={
          <>
            <Link to="/cloud/sites">Sites</Link>
            <span className="separator">/</span>
            <span>Loading...</span>
          </>
        }
      >
        <Skeleton $height="500px" />
      </CloudPageLayout>
    );
  }

  if (!site) {
    return (
      <CloudPageLayout
        title="Site Not Found"
        breadcrumbs={
          <>
            <Link to="/cloud/sites">Sites</Link>
            <span className="separator">/</span>
            <span>Not Found</span>
          </>
        }
      >
        <EmptyState>
          <h3>Site not found</h3>
          <p>
            The site you're looking for doesn't exist or has been removed.
          </p>
        </EmptyState>
      </CloudPageLayout>
    );
  }

  const onlineDevices = devices.filter((d) => d.status === "online").length;
  const openAlerts = alerts.filter((a) => a.status === "open").length;

  return (
    <CloudPageLayout
      title={site.name}
      breadcrumbs={
        <>
          <Link to="/cloud/sites">Sites</Link>
          <span className="separator">/</span>
          <span>{site.name}</span>
        </>
      }
    >
      <ContentWrapper>
        {/* Site Overview */}
        <Section>
          <h2>Site Overview</h2>
          <InfoGrid>
            <InfoCard>
              <div className="label">Customer</div>
              <div className="value">{site.customer}</div>
            </InfoCard>

            <InfoCard>
              <div className="label">Location</div>
              <div className="value">{site.location}</div>
              {site.coordinates && (
                <div className="subvalue">
                  {site.coordinates.lat.toFixed(4)},{" "}
                  {site.coordinates.lng.toFixed(4)}
                </div>
              )}
            </InfoCard>

            <InfoCard>
              <div className="label">Status</div>
              <div className="value">
                <StatusPill $variant={getStatusVariant(site.status)}>
                  {site.status === "online"
                    ? "Online"
                    : site.status === "warning"
                    ? "Warning"
                    : "Offline"}
                </StatusPill>
              </div>
            </InfoCard>

            <InfoCard>
              <div className="label">Total Devices</div>
              <div className="value">{site.deviceCount}</div>
              <div className="subvalue">
                {onlineDevices} online, {site.deviceCount - onlineDevices}{" "}
                offline
              </div>
            </InfoCard>

            <InfoCard>
              <div className="label">Open Alerts</div>
              <div className="value">{openAlerts}</div>
              <div className="subvalue">
                {openAlerts === 0 ? "All clear" : "Need attention"}
              </div>
            </InfoCard>

            <InfoCard>
              <div className="label">Last Update</div>
              <div className="value">{getRelativeTime(site.lastUpdate)}</div>
              <div className="subvalue">
                {new Date(site.lastUpdate).toLocaleString()}
              </div>
            </InfoCard>
          </InfoGrid>
        </Section>

        {/* Location Map */}
        <Section>
          <h2>Location Map</h2>
          <MapContainer>
            {mapsError ? (
              <MapError>
                <div>Failed to load map</div>
                <div style={{ fontSize: "12px" }}>Please check your internet connection</div>
              </MapError>
            ) : !mapsLoaded ? (
              <MapLoading>
                <div>Loading map...</div>
              </MapLoading>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
                options={mapOptions}
              >
                {/* Site marker */}
                {site?.coordinates && (
                  <Marker
                    position={{ lat: site.coordinates.lat, lng: site.coordinates.lng }}
                    title={site.name}
                    icon={{
                      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#0284c7">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      `),
                      scaledSize: { width: 32, height: 32 },
                    }}
                  />
                )}
                {/* Device markers */}
                {devices.map((device) =>
                  device.coordinates ? (
                    <Marker
                      key={device.id}
                      position={{ lat: device.coordinates.lat, lng: device.coordinates.lng }}
                      title={device.name}
                      icon={{
                        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${
                            device.status === "online" ? "#16a34a" : device.status === "warning" ? "#f97316" : "#dc2626"
                          }">
                            <circle cx="12" cy="12" r="8"/>
                          </svg>
                        `),
                        scaledSize: { width: 16, height: 16 },
                        anchor: { x: 8, y: 8 },
                      }}
                    />
                  ) : null
                )}
                {/* Property boundary polygon if available */}
                {site?.boundary && (
                  <Polygon
                    paths={site.boundary}
                    options={{
                      fillColor: "#0284c7",
                      fillOpacity: 0.1,
                      strokeColor: "#0284c7",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </MapContainer>
        </Section>

        {/* Devices at this Site */}
        <Section>
          <h2>Devices ({devices.length})</h2>
          {devices.length === 0 ? (
            <EmptyState>No devices at this site yet.</EmptyState>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <DeviceCardList>
                {devices.map((device) => (
                  <DeviceCard key={device.id}>
                    <DeviceCardHeader>
                      <DeviceCardName to={`/cloud/devices/${device.id}`}>
                        {device.name}
                      </DeviceCardName>
                      <StatusPill $variant={getStatusVariant(device.status)}>
                        {device.status === "online"
                          ? "Online"
                          : device.status === "warning"
                          ? "Warning"
                          : "Offline"}
                      </StatusPill>
                    </DeviceCardHeader>
                    <DeviceCardMeta>
                      <DeviceCardMetaItem>
                        <div className="label">Type</div>
                        <div className="value">{device.deviceType}</div>
                      </DeviceCardMetaItem>
                      <DeviceCardMetaItem>
                        <div className="label">Battery</div>
                        <div className="value">{device.batteryLevel}%</div>
                      </DeviceCardMetaItem>
                      <DeviceCardMetaItem style={{ gridColumn: "1 / -1" }}>
                        <div className="label">Last Contact</div>
                        <div className="value">{getRelativeTime(device.lastContact)}</div>
                      </DeviceCardMetaItem>
                    </DeviceCardMeta>
                  </DeviceCard>
                ))}
              </DeviceCardList>

              {/* Desktop Table Layout */}
              <DevicesTable>
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Last Contact</th>
                    <th>Battery</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id}>
                      <td>
                        <DeviceLink to={`/cloud/devices/${device.id}`}>
                          {device.name}
                        </DeviceLink>
                      </td>
                      <td>{device.deviceType}</td>
                      <td>
                        <StatusPill $variant={getStatusVariant(device.status)}>
                          {device.status === "online"
                            ? "Online"
                            : device.status === "warning"
                            ? "Warning"
                            : "Offline"}
                        </StatusPill>
                      </td>
                      <td>{getRelativeTime(device.lastContact)}</td>
                      <td>{device.batteryLevel}%</td>
                    </tr>
                  ))}
                </tbody>
              </DevicesTable>
            </>
          )}
        </Section>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <Section>
            <h2>Recent Alerts ({alerts.length})</h2>
            <AlertsSection>
              {alerts.slice(0, 5).map((alert) => (
                <AlertRow key={alert.id} $severity={alert.severity}>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-meta">
                    Device: {alert.deviceName} · {getRelativeTime(alert.firstSeen)}
                  </div>
                </AlertRow>
              ))}
            </AlertsSection>
            {alerts.length > 5 && (
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <Link
                  to="/cloud/alerts"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#0284c7",
                    textDecoration: "none",
                  }}
                >
                  View all alerts →
                </Link>
              </div>
            )}
          </Section>
        )}
      </ContentWrapper>
    </CloudPageLayout>
  );
}
