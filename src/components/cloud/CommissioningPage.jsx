// /src/components/cloud/CommissioningPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
`;

const FilterChip = styled.button`
  border-radius: 999px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary500 || "#06b6d4"
        : theme.colors?.ui200 || "#e5e7eb"};
  padding: 6px 14px;
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

const TableContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

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
  }

  td {
    padding: 14px 16px;
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

const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ $variant }) =>
    $variant === "completed"
      ? "#16a34a"
      : $variant === "in_progress"
      ? "#f97316"
      : $variant === "failed"
      ? "#dc2626"
      : "#9ca3af"};
`;

const ActionLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;

  &:hover {
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

export default function CommissioningPage() {
  const [commissioning, setCommissioning] = useState([]);
  const [filteredCommissioning, setFilteredCommissioning] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadCommissioning();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, commissioning]);

  const loadCommissioning = async () => {
    setLoading(true);
    try {
      const data = await CloudMockAPI.commissioning.getAll();
      setCommissioning(data);
    } catch (error) {
      console.error("Error loading commissioning data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...commissioning];

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCommissioning(filtered);
  };

  const handleOpenInGateway = (eventId) => {
    // TODO: Implement Gateway deep linking
    alert(`Opening commissioning event ${eventId} in Gateway app`);
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: "Completed",
      in_progress: "In Progress",
      pending: "Pending",
      failed: "Failed",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Commissioning"
        subtitle="Track device commissioning from Gateway app"
      >
        <Skeleton />
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Commissioning"
      subtitle="Track device commissioning from Gateway app"
    >
      <Controls>
        <Filters>
          <FilterChip
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </FilterChip>
          <FilterChip
            $active={statusFilter === "in_progress"}
            onClick={() => setStatusFilter("in_progress")}
          >
            In Progress
          </FilterChip>
          <FilterChip
            $active={statusFilter === "completed"}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </FilterChip>
          <FilterChip
            $active={statusFilter === "failed"}
            onClick={() => setStatusFilter("failed")}
          >
            Failed
          </FilterChip>
        </Filters>
      </Controls>

      <TableContainer>
        {filteredCommissioning.length === 0 ? (
          <EmptyState>
            <h3>No commissioning events found</h3>
            <p>
              {statusFilter !== "all"
                ? "Try adjusting your filters."
                : "No devices are currently being commissioned. Installers will see new jobs here as they're created in the Gateway app."}
            </p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Site</th>
                <th>Installer</th>
                <th>Status</th>
                <th>Source</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommissioning.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{event.deviceName}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {event.deviceId}
                    </div>
                  </td>
                  <td>{event.siteName}</td>
                  <td>{event.installer}</td>
                  <td>
                    <StatusPill $variant={event.status}>
                      {getStatusLabel(event.status)}
                    </StatusPill>
                  </td>
                  <td>{event.source}</td>
                  <td>
                    <div>{getRelativeTime(event.lastUpdated)}</div>
                    <div
                      style={{ fontSize: "11px", color: "#9ca3af" }}
                      title={new Date(event.lastUpdated).toLocaleString()}
                    >
                      {new Date(event.lastUpdated).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <ActionLink onClick={() => handleOpenInGateway(event.id)}>
                      Open in Gateway →
                    </ActionLink>
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
