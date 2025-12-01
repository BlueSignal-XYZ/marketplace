// /src/components/cloud/AlertsPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

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
        ? theme.colors?.primary500 || "#06b6d4"
        : theme.colors?.ui200 || "#e5e7eb"};
  padding: 10px 16px;
  min-height: 44px;
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

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  @media (max-width: 768px) {
    min-width: 900px;
  }

  thead {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  }

  th {
    text-align: left;
    padding: 14px 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;

    @media (max-width: 768px) {
      padding: 12px;
      font-size: 12px;
    }
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};

    @media (max-width: 768px) {
      padding: 12px;
      font-size: 13px;
    }
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
      const data = await CloudMockAPI.alerts.getAll();
      setAlerts(data);
    } catch (error) {
      console.error("Error loading alerts:", error);
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

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
          <EmptyState>
            <h3>No alerts found</h3>
            <p>
              {severityFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "All clear! No alerts at this time."}
            </p>
          </EmptyState>
        ) : (
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
                      <DeviceLink to={`/cloud/devices/${alert.deviceId}`}>
                        {alert.deviceName}
                      </DeviceLink>
                    </div>
                  </td>
                  <td>
                    <AlertLink to={`/cloud/alerts/${alert.id}`}>
                      {alert.message}
                    </AlertLink>
                  </td>
                  <td>
                    <div>{getRelativeTime(alert.firstSeen)}</div>
                    <div
                      style={{ fontSize: "11px", color: "#9ca3af" }}
                      title={new Date(alert.firstSeen).toLocaleString()}
                    >
                      {new Date(alert.firstSeen).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div>{getRelativeTime(alert.lastSeen)}</div>
                    <div
                      style={{ fontSize: "11px", color: "#9ca3af" }}
                      title={new Date(alert.lastSeen).toLocaleString()}
                    >
                      {new Date(alert.lastSeen).toLocaleString()}
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
                          <ActionButton
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={updatingAlerts.has(alert.id)}
                          >
                            {updatingAlerts.has(alert.id) ? "..." : "Ack"}
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleResolve(alert.id)}
                            disabled={updatingAlerts.has(alert.id)}
                          >
                            {updatingAlerts.has(alert.id) ? "..." : "Resolve"}
                          </ActionButton>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <ActionButton
                          onClick={() => handleResolve(alert.id)}
                          disabled={updatingAlerts.has(alert.id)}
                        >
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
        )}
      </TableContainer>
    </CloudPageLayout>
  );
}
