// /src/components/cloud/SiteDetailPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
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
  padding: 24px;

  h2 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
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

const DevicesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
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

const MapPlaceholder = styled.div`
  height: 300px;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border: 2px dashed ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  font-size: 14px;
  gap: 8px;
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

export default function SiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* Map Placeholder */}
        <Section>
          <h2>Location Map</h2>
          <MapPlaceholder>
            <div>Map integration coming soon</div>
            <div style={{ fontSize: "12px" }}>
              Will display site location on interactive map
            </div>
          </MapPlaceholder>
        </Section>

        {/* Devices at this Site */}
        <Section>
          <h2>Devices ({devices.length})</h2>
          {devices.length === 0 ? (
            <EmptyState>No devices at this site yet.</EmptyState>
          ) : (
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
