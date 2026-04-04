// /src/components/cloud/AlertsPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import { getRelativeTime } from "../../services/cloudMockAPI";
import { AlertsAPI } from "../../scripts/back_door";
import { EmptyState as DSEmptyState } from "../../design-system/primitives/EmptyState";
import { isDemoMode } from "../../utils/demoMode";


// Realistic demo alerts based on WQM-1 sensor specs
const DEMO_ALERTS = [
  {
    id: 'demo-alert-1',
    severity: 'critical',
    status: 'open',
    siteName: 'Demo Pond',
    siteId: 'demo-site-1',
    deviceName: 'WQM-1 #001',
    deviceId: 'pgw-demo-001',
    message: 'pH threshold exceeded — 9.2 pH detected (threshold: > 9.0)',
    firstSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-alert-2',
    severity: 'warning',
    status: 'open',
    siteName: 'Demo Lake North',
    siteId: 'demo-site-2',
    deviceName: 'WQM-1 #003',
    deviceId: 'pgw-demo-003',
    message: 'Turbidity elevated — 85 NTU (threshold: > 100 NTU approaching)',
    firstSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-alert-3',
    severity: 'critical',
    status: 'acknowledged',
    siteName: 'Demo Farm Runoff',
    siteId: 'demo-site-3',
    deviceName: 'WQM-1 #005',
    deviceId: 'pgw-demo-005',
    message: 'TDS spike — 920 ppm detected (threshold: > 800 ppm)',
    firstSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-alert-4',
    severity: 'warning',
    status: 'open',
    siteName: 'Demo Creek',
    siteId: 'demo-site-1',
    deviceName: 'WQM-1 #002',
    deviceId: 'pgw-demo-002',
    message: 'ORP low — 140 mV detected (threshold: < 150 mV)',
    firstSeen: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-alert-5',
    severity: 'info',
    status: 'resolved',
    siteName: 'Demo Pond',
    siteId: 'demo-site-1',
    deviceName: 'WQM-1 #001',
    deviceId: 'pgw-demo-001',
    message: 'Temperature returned to normal range — 28°C (was 36°C)',
    firstSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];


const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const FilterChip = styled.button`
  border-radius: 999px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary || "#0066FF"
        : theme.colors?.border || "#E5E7EB"};
  padding: 8px 16px;
  min-height: 36px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-out;

  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary || "#0066FF" : theme.colors?.surface || "#FFFFFF"};
  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.textOnPrimary || "#FFFFFF"
      : theme.colors?.textSecondary || "#6B7280"};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || "#0066FF"};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 13px;
    white-space: nowrap;
  }
`;

const TableContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 1023px) {
    overflow: visible;
  }

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  @media (max-width: 1023px) {
    display: none;
  }

  thead {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  }

  th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    &:nth-child(1) { width: 90px; min-width: 90px; }   /* Severity */
    &:nth-child(2) { width: 140px; min-width: 140px; }  /* Site/Device */
    &:nth-child(3) { min-width: 0; }                    /* Message - flex */
    &:nth-child(4) { width: 100px; min-width: 100px; } /* First Seen */
    &:nth-child(5) { width: 100px; min-width: 100px; } /* Last Seen */
    &:nth-child(6) { width: 100px; min-width: 100px; } /* Status */
    &:nth-child(7) { width: 120px; min-width: 120px; }  /* Actions */
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
    vertical-align: middle;

    &:nth-child(1) { width: 90px; }
    &:nth-child(2) { width: 140px; }
    &:nth-child(6) { width: 100px; }
    &:nth-child(7) { width: 120px; }
  }

  tbody tr {
    transition: background 0.15s ease-out;

    &:hover {
      background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
      cursor: pointer;
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

const AlertCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const AlertCard = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

const AlertCardMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  line-height: 1.6;
`;

const AlertCardMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const AlertCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

const SeverityPill = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ $severity }) =>
    $severity === "critical"
      ? "#dc2626"
      : $severity === "warning"
      ? "#f97316"
      : "#06b6d4"};
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $status }) =>
    $status === "open" ? "#991b1b" : $status === "acknowledged" ? "#9a3412" : "#065f46"};
  background: ${({ $status }) =>
    $status === "open" ? "#fef2f2" : $status === "acknowledged" ? "#fff7ed" : "#f0fdf4"};
  border: 1px solid
    ${({ $status }) =>
      $status === "open" ? "#fca5a5" : $status === "acknowledged" ? "#fdba74" : "#86efac"};
`;

const DeviceLink = styled(Link)`
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionButton = styled.button`
  border: none;
  background: none;
  padding: 4px 8px;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const AlertLink = styled(Link)`
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
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
  height: 400px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function AlertsPage() {
  useEffect(() => { document.title = 'Alerts — BlueSignal Cloud'; }, []);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingAlerts, setUpdatingAlerts] = useState(new Set());

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [severityFilter, statusFilter, alerts]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      // Fetch all alerts from the API
      const [activeResult, acknowledgedResult, resolvedResult] = await Promise.all([
        AlertsAPI.getActive({ status: "active" }).catch(() => null),
        AlertsAPI.getActive({ status: "acknowledged" }).catch(() => null),
        AlertsAPI.getActive({ status: "resolved" }).catch(() => null),
      ]);

      const all = [
        ...(activeResult?.alerts || []),
        ...(acknowledgedResult?.alerts || []),
        ...(resolvedResult?.alerts || []),
      ];

      // If no real alerts and demo mode is on, show demo alerts
      if (all.length === 0 && isDemoMode()) {
        setAlerts(DEMO_ALERTS);
      } else {
        setAlerts(all);
      }
    } catch (error) {
      console.error("Error loading alerts:", error);
      // Fall back to demo alerts in demo mode
      if (isDemoMode()) {
        setAlerts(DEMO_ALERTS);
      } else {
        setAlerts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alerts];

    if (severityFilter !== "all") {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      critical: "Critical",
      warning: "Warning",
      info: "Info",
    };
    return labels[severity] || severity;
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: "Open",
      acknowledged: "Acknowledged",
      resolved: "Resolved",
    };
    return labels[status] || status;
  };

  const handleAcknowledge = async (alertId) => {
    setUpdatingAlerts((prev) => new Set(prev).add(alertId));
    try {
      await AlertsAPI.acknowledge(alertId);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, status: "acknowledged" } : a
        )
      );
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    } finally {
      setUpdatingAlerts((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  const handleResolve = async (alertId) => {
    setUpdatingAlerts((prev) => new Set(prev).add(alertId));
    try {
      await AlertsAPI.resolve(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a))
      );
    } catch (error) {
      console.error("Error resolving alert:", error);
    } finally {
      setUpdatingAlerts((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Alerts"
        subtitle="Monitor and manage device alerts"
      >
        <Skeleton />
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Alerts"
      subtitle="Monitor and manage device alerts"
    >
      <Controls>
        <Filters>
          <span style={{ fontSize: "13px", color: "#6b7280", marginRight: "8px" }}>
            Severity:
          </span>
          <FilterChip
            $active={severityFilter === "all"}
            onClick={() => setSeverityFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={severityFilter === "critical"}
            onClick={() => setSeverityFilter("critical")}
          >
            Critical
          </FilterChip>
          <FilterChip
            $active={severityFilter === "warning"}
            onClick={() => setSeverityFilter("warning")}
          >
            Warning
          </FilterChip>
          <FilterChip
            $active={severityFilter === "info"}
            onClick={() => setSeverityFilter("info")}
          >
            Info
          </FilterChip>
        </Filters>

        <Filters>
          <span style={{ fontSize: "13px", color: "#6b7280", marginRight: "8px" }}>
            Status:
          </span>
          <FilterChip
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={statusFilter === "open"}
            onClick={() => setStatusFilter("open")}
          >
            Open
          </FilterChip>
          <FilterChip
            $active={statusFilter === "acknowledged"}
            onClick={() => setStatusFilter("acknowledged")}
          >
            Acknowledged
          </FilterChip>
          <FilterChip
            $active={statusFilter === "resolved"}
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </FilterChip>
        </Filters>
      </Controls>

      <TableContainer>
        {filteredAlerts.length === 0 ? (
          <DSEmptyState
            icon={
              severityFilter !== "all" || statusFilter !== "all"
                ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            }
            title={
              severityFilter !== "all" || statusFilter !== "all"
                ? "No alerts found"
                : "No Alerts"
            }
            description={
              severityFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "No alerts. Alerts will appear here when your devices detect threshold events."
            }
          />
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Site / Device</th>
                  <th>Message</th>
                  <th>First Seen</th>
                  <th>Last Seen</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <SeverityPill $severity={alert.severity}>
                        {getSeverityLabel(alert.severity)}
                      </SeverityPill>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span>{alert.siteName}</span>
                        <DeviceLink to={`/cloud/devices/${alert.deviceId}`} onClick={(e) => e.stopPropagation()}>
                          {alert.deviceName}
                        </DeviceLink>
                      </div>
                    </td>
                    <td>
                      <AlertLink to={`/cloud/alerts/${alert.id}`} onClick={(e) => e.stopPropagation()}>
                        {alert.message}
                      </AlertLink>
                    </td>
                    <td>
                      <div>{getRelativeTime(alert.firstSeen)}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }} title={alert.firstSeen ? new Date(alert.firstSeen).toLocaleString() : "—"}>
                        {alert.firstSeen ? new Date(alert.firstSeen).toLocaleString() : "—"}
                      </div>
                    </td>
                    <td>
                      <div>{getRelativeTime(alert.lastSeen)}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }} title={alert.lastSeen ? new Date(alert.lastSeen).toLocaleString() : "—"}>
                        {alert.lastSeen ? new Date(alert.lastSeen).toLocaleString() : "—"}
                      </div>
                    </td>
                    <td>
                      <StatusPill $status={alert.status}>
                        {getStatusLabel(alert.status)}
                      </StatusPill>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {alert.status === "open" && (
                          <>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleAcknowledge(alert.id); }} disabled={updatingAlerts.has(alert.id)}>
                              {updatingAlerts.has(alert.id) ? "..." : "Ack"}
                            </ActionButton>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }} disabled={updatingAlerts.has(alert.id)}>
                              {updatingAlerts.has(alert.id) ? "..." : "Resolve"}
                            </ActionButton>
                          </>
                        )}
                        {alert.status === "acknowledged" && (
                          <ActionButton onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }} disabled={updatingAlerts.has(alert.id)}>
                            {updatingAlerts.has(alert.id) ? "..." : "Resolve"}
                          </ActionButton>
                        )}
                        <ActionButton as={Link} to={`/cloud/alerts/${alert.id}`}>
                          View
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <AlertCards>
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id}>
                  <AlertCardHeader>
                    <SeverityPill $severity={alert.severity}>
                      {getSeverityLabel(alert.severity)}
                    </SeverityPill>
                    <StatusPill $status={alert.status}>
                      {getStatusLabel(alert.status)}
                    </StatusPill>
                  </AlertCardHeader>
                  <AlertCardMeta>
                    {alert.siteName} · <DeviceLink to={`/cloud/devices/${alert.deviceId}`}>{alert.deviceName}</DeviceLink>
                  </AlertCardMeta>
                  <AlertCardMessage>
                    <AlertLink to={`/cloud/alerts/${alert.id}`}>{alert.message}</AlertLink>
                  </AlertCardMessage>
                  <AlertCardMeta>
                    {getRelativeTime(alert.firstSeen)} — {getRelativeTime(alert.lastSeen)}
                  </AlertCardMeta>
                  <AlertCardActions>
                    {alert.status === "open" && (
                      <>
                        <ActionButton onClick={() => handleAcknowledge(alert.id)} disabled={updatingAlerts.has(alert.id)}>
                          {updatingAlerts.has(alert.id) ? "..." : "Ack"}
                        </ActionButton>
                        <ActionButton onClick={() => handleResolve(alert.id)} disabled={updatingAlerts.has(alert.id)}>
                          {updatingAlerts.has(alert.id) ? "..." : "Resolve"}
                        </ActionButton>
                      </>
                    )}
                    {alert.status === "acknowledged" && (
                      <ActionButton onClick={() => handleResolve(alert.id)} disabled={updatingAlerts.has(alert.id)}>
                        {updatingAlerts.has(alert.id) ? "..." : "Resolve"}
                      </ActionButton>
                    )}
                    <ActionButton as={Link} to={`/cloud/alerts/${alert.id}`}>
                      View
                    </ActionButton>
                  </AlertCardActions>
                </AlertCard>
              ))}
            </AlertCards>
          </>
        )}
      </TableContainer>
    </CloudPageLayout>
  );
}
