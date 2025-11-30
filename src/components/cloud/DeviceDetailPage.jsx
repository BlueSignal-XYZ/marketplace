// /src/components/cloud/DeviceDetailPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  overflow: hidden;
`;

const DeviceHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeviceName = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
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

const MetaRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;

    strong {
      font-weight: 600;
      color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
    }
  }
`;

const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  background: #ffffff;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  overflow-x: auto;
`;

const Tab = styled.button`
  border: none;
  background: none;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui600 || "#4b5563"};
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors?.primary600 || "#0284c7" : "transparent"};
  transition: all 0.15s ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  }
`;

const TabContent = styled.div`
  padding: 24px;
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

const AlertsList = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

  .alert-time {
    font-size: 11px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  }
`;

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;

  h4 {
    margin: 0 0 16px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }

  .chart-wrapper {
    position: relative;
    height: 250px;
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TimeRangeButton = styled.button`
  border-radius: 6px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary500 || "#06b6d4"
        : theme.colors?.ui200 || "#e5e7eb"};
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-out;

  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};
  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui700 || "#374151"};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#22d3ee"};
  }
`;

const LogsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  }
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

// Helper function to format PGP sensor field names for display
const formatSensorLabel = (fieldName) => {
  const labels = {
    temp_c: "Temperature (°C)",
    ph: "pH Level",
    ntu: "Turbidity (NTU)",
    tds_ppm: "TDS (ppm)",
    npk_n: "Nitrogen (ppm)",
    npk_p: "Phosphorus (ppm)",
    npk_k: "Potassium (ppm)",
  };
  return labels[fieldName] || fieldName;
};

export default function DeviceDetailPage() {
  const { deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    loadDeviceData();
  }, [deviceId]);

  useEffect(() => {
    if (activeTab === "livedata") {
      loadTimeSeriesData();
    }
  }, [activeTab, timeRange, deviceId]);

  const loadDeviceData = async () => {
    setLoading(true);
    try {
      const [deviceData, alertsData, logsData] = await Promise.all([
        CloudMockAPI.devices.getById(deviceId),
        CloudMockAPI.alerts.getByDevice(deviceId),
        CloudMockAPI.devices.getLogs(deviceId),
      ]);

      setDevice(deviceData);
      setAlerts(alertsData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error loading device data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSeriesData = async () => {
    setLoadingChart(true);
    try {
      const data = await CloudMockAPI.devices.getTimeSeriesData(
        deviceId,
        timeRange
      );
      setTimeSeriesData(data);
    } catch (error) {
      console.error("Error loading time series data:", error);
    } finally {
      setLoadingChart(false);
    }
  };

  const createChartData = (dataKey, label, color) => {
    if (!timeSeriesData) return null;

    return {
      labels: timeSeriesData.map((point) => {
        const date = new Date(point.timestamp);
        if (timeRange === "24h") {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else if (timeRange === "7d") {
          return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
        } else {
          return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });
        }
      }),
      datasets: [
        {
          label,
          data: timeSeriesData.map((point) => point[dataKey]),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: timeRange === "24h" ? 2 : 0,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "#f3f4f6",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 20,
        },
      },
    },
  };

  const getStatusVariant = (status) => {
    if (status === "offline") return "offline";
    if (status === "warning") return "warning";
    return "online";
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Device Details"
        breadcrumbs={
          <>
            <Link to="/cloud/devices">Devices</Link>
            <span className="separator">/</span>
            <span>Loading...</span>
          </>
        }
      >
        <Skeleton $height="500px" />
      </CloudPageLayout>
    );
  }

  if (!device) {
    return (
      <CloudPageLayout
        title="Device Not Found"
        breadcrumbs={
          <>
            <Link to="/cloud/devices">Devices</Link>
            <span className="separator">/</span>
            <span>Not Found</span>
          </>
        }
      >
        <EmptyState>
          <h3>Device not found</h3>
          <p>
            The device you're looking for doesn't exist or has been removed.
          </p>
        </EmptyState>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title={device.name}
      breadcrumbs={
        <>
          <Link to="/cloud/devices">Devices</Link>
          <span className="separator">/</span>
          <span>{device.name}</span>
        </>
      }
    >
      <ContentWrapper>
        <DeviceHeader>
          <HeaderInfo>
            <HeaderRow>
              <DeviceName>{device.name}</DeviceName>
              <StatusPill $variant={getStatusVariant(device.status)}>
                {device.status === "online"
                  ? "Online"
                  : device.status === "warning"
                  ? "Warning"
                  : "Offline"}
              </StatusPill>
            </HeaderRow>
            <MetaRow>
              <div className="meta-item">
                <strong>Site:</strong> {device.siteName}
              </div>
              <div className="meta-item">
                <strong>Type:</strong> {device.deviceType}
              </div>
              <div className="meta-item">
                <strong>Coordinates:</strong> {device.coordinates.lat},{" "}
                {device.coordinates.lng}
              </div>
            </MetaRow>
          </HeaderInfo>
          {device.gatewayWebUrl && (
            <ActionButton
              as="a"
              href={device.gatewayWebUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PGP Web UI →
            </ActionButton>
          )}
        </DeviceHeader>

        <Tabs>
          <Tab
            $active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Tab>
          <Tab
            $active={activeTab === "livedata"}
            onClick={() => setActiveTab("livedata")}
          >
            Live Data
          </Tab>
          <Tab
            $active={activeTab === "configuration"}
            onClick={() => setActiveTab("configuration")}
          >
            Configuration
          </Tab>
          <Tab
            $active={activeTab === "logs"}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </Tab>
        </Tabs>

        <TabContent>
          {activeTab === "overview" && (
            <>
              <InfoGrid>
                <InfoCard>
                  <div className="label">Last Contact</div>
                  <div className="value">
                    {getRelativeTime(device.lastContact)}
                  </div>
                  <div className="subvalue">
                    {new Date(device.lastContact).toLocaleString()}
                  </div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Signal Strength</div>
                  <div className="value">{device.signalStrength}%</div>
                  <div className="subvalue">
                    {device.signalStrength > 80
                      ? "Excellent"
                      : device.signalStrength > 50
                      ? "Good"
                      : "Poor"}
                  </div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Battery</div>
                  <div className="value">{device.batteryLevel}%</div>
                  <div className="subvalue">
                    {device.batteryLevel > 50
                      ? "Good"
                      : device.batteryLevel > 20
                      ? "Low"
                      : "Critical"}
                  </div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Gateway</div>
                  <div className="value">{device.gatewayName}</div>
                  <div className="subvalue">{device.gatewayId}</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Firmware Version</div>
                  <div className="value">{device.firmwareVersion}</div>
                  <div className="subvalue">Up to date</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Customer</div>
                  <div className="value">{device.customer}</div>
                  <div className="subvalue">Site owner</div>
                </InfoCard>
              </InfoGrid>

              {device.latestReadings && (
                <>
                  <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>
                    Latest Sensor Readings (from PGP)
                  </h3>
                  <InfoGrid>
                    {Object.entries(device.latestReadings)
                      .filter(([key, value]) => value !== null) // Filter out null values (sensor not applicable)
                      .map(([key, value]) => (
                        <InfoCard key={key}>
                          <div className="label">{formatSensorLabel(key)}</div>
                          <div className="value">
                            {typeof value === "number"
                              ? value.toFixed(2)
                              : value}
                          </div>
                        </InfoCard>
                      ))}
                  </InfoGrid>
                </>
              )}

              {alerts.length > 0 && (
                <>
                  <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>
                    Recent Alerts
                  </h3>
                  <AlertsList>
                    {alerts.slice(0, 5).map((alert) => (
                      <AlertRow key={alert.id} $severity={alert.severity}>
                        <div className="alert-message">{alert.message}</div>
                        <div className="alert-time">
                          {getRelativeTime(alert.firstSeen)}
                        </div>
                      </AlertRow>
                    ))}
                  </AlertsList>
                </>
              )}
            </>
          )}

          {activeTab === "livedata" && (
            <>
              <TimeRangeSelector>
                <TimeRangeButton
                  $active={timeRange === "24h"}
                  onClick={() => setTimeRange("24h")}
                >
                  Last 24 Hours
                </TimeRangeButton>
                <TimeRangeButton
                  $active={timeRange === "7d"}
                  onClick={() => setTimeRange("7d")}
                >
                  Last 7 Days
                </TimeRangeButton>
                <TimeRangeButton
                  $active={timeRange === "30d"}
                  onClick={() => setTimeRange("30d")}
                >
                  Last 30 Days
                </TimeRangeButton>
              </TimeRangeSelector>

              {loadingChart ? (
                <Skeleton $height="300px" />
              ) : (
                <>
                  {device.latestReadings && (
                    <>
                      {device.latestReadings.temp_c !== null && (
                        <ChartContainer>
                          <h4>Temperature (°C)</h4>
                          <div className="chart-wrapper">
                            <Line
                              data={createChartData(
                                "temp_c",
                                "Temperature",
                                "#06b6d4"
                              )}
                              options={chartOptions}
                            />
                          </div>
                        </ChartContainer>
                      )}

                      {device.latestReadings.ph !== null && (
                        <ChartContainer>
                          <h4>pH Level</h4>
                          <div className="chart-wrapper">
                            <Line
                              data={createChartData("ph", "pH", "#8b5cf6")}
                              options={chartOptions}
                            />
                          </div>
                        </ChartContainer>
                      )}

                      {device.latestReadings.ntu !== null && (
                        <ChartContainer>
                          <h4>Turbidity (NTU)</h4>
                          <div className="chart-wrapper">
                            <Line
                              data={createChartData(
                                "ntu",
                                "Turbidity",
                                "#f59e0b"
                              )}
                              options={chartOptions}
                            />
                          </div>
                        </ChartContainer>
                      )}

                      {device.latestReadings.tds_ppm !== null && (
                        <ChartContainer>
                          <h4>Total Dissolved Solids (ppm)</h4>
                          <div className="chart-wrapper">
                            <Line
                              data={createChartData(
                                "tds_ppm",
                                "TDS",
                                "#10b981"
                              )}
                              options={chartOptions}
                            />
                          </div>
                        </ChartContainer>
                      )}

                      {device.latestReadings.npk_n !== null && (
                        <>
                          <ChartContainer>
                            <h4>Nitrogen (ppm)</h4>
                            <div className="chart-wrapper">
                              <Line
                                data={createChartData(
                                  "npk_n",
                                  "Nitrogen",
                                  "#3b82f6"
                                )}
                                options={chartOptions}
                              />
                            </div>
                          </ChartContainer>

                          <ChartContainer>
                            <h4>Phosphorus (ppm)</h4>
                            <div className="chart-wrapper">
                              <Line
                                data={createChartData(
                                  "npk_p",
                                  "Phosphorus",
                                  "#ec4899"
                                )}
                                options={chartOptions}
                              />
                            </div>
                          </ChartContainer>

                          <ChartContainer>
                            <h4>Potassium (ppm)</h4>
                            <div className="chart-wrapper">
                              <Line
                                data={createChartData(
                                  "npk_k",
                                  "Potassium",
                                  "#14b8a6"
                                )}
                                options={chartOptions}
                              />
                            </div>
                          </ChartContainer>
                        </>
                      )}
                    </>
                  )}

                  <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>
                    Current Readings
                  </h3>
                  {device.latestReadings && (
                    <InfoGrid>
                      {Object.entries(device.latestReadings)
                        .filter(([key, value]) => value !== null)
                        .map(([key, value]) => (
                          <InfoCard key={key}>
                            <div className="label">{formatSensorLabel(key)}</div>
                            <div className="value">
                              {typeof value === "number"
                                ? value.toFixed(2)
                                : value}
                            </div>
                          </InfoCard>
                        ))}
                    </InfoGrid>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "configuration" && (
            <>
              <InfoGrid>
                <InfoCard>
                  <div className="label">Device ID</div>
                  <div className="value">{device.id}</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Device Type</div>
                  <div className="value">{device.deviceType}</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Firmware Version</div>
                  <div className="value">{device.firmwareVersion}</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Gateway</div>
                  <div className="value">{device.gatewayId}</div>
                </InfoCard>

                <InfoCard>
                  <div className="label">Coordinates</div>
                  <div className="value">
                    {device.coordinates.lat}, {device.coordinates.lng}
                  </div>
                </InfoCard>
              </InfoGrid>

              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "#fff7ed",
                  border: "1px solid #fdba74",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#9a3412",
                }}
              >
                <strong>Note:</strong> Device configuration can only be edited
                through Pollution Gateway Pro web-commission interface. Cloud is
                read-only.
              </div>

              {device.gatewayWebUrl && (
                <ActionButton
                  as="a"
                  href={device.gatewayWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: "16px" }}
                >
                  Open PGP Web UI →
                </ActionButton>
              )}
            </>
          )}

          {activeTab === "logs" && (
            <>
              {logs.length === 0 ? (
                <EmptyState>No logs available for this device.</EmptyState>
              ) : (
                <LogsTable>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{getRelativeTime(log.timestamp)}</td>
                        <td>{log.event}</td>
                        <td>{log.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </LogsTable>
              )}
            </>
          )}
        </TabContent>
      </ContentWrapper>
    </CloudPageLayout>
  );
}
