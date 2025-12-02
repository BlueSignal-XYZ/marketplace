// /src/components/cloud/DevicesListPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

const AddDeviceButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

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

const SearchBar = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
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

const DeviceLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
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
    $variant === "warning"
      ? "#f97316"
      : $variant === "offline"
      ? "#dc2626"
      : "#16a34a"};
`;

const BatteryIndicator = styled.span`
  font-weight: 500;
  color: ${({ $level }) =>
    $level < 20 ? "#dc2626" : $level < 50 ? "#f97316" : "#16a34a"};
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

export default function DevicesListPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, typeFilter, devices]);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await CloudMockAPI.devices.getAll();
      setDevices(data);
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...devices];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.siteName.toLowerCase().includes(query) ||
          d.deviceType.toLowerCase().includes(query) ||
          d.customer.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.deviceType === typeFilter);
    }

    setFilteredDevices(filtered);
  };

  const getStatusVariant = (status) => {
    if (status === "offline") return "offline";
    if (status === "warning") return "warning";
    return "online";
  };

  const uniqueTypes = [...new Set(devices.map((d) => d.deviceType))];

  if (loading) {
    return (
      <CloudPageLayout
        title="Devices"
        subtitle="Monitor and manage all deployed devices"
      >
        <Skeleton $height="400px" />
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Devices"
      subtitle="Monitor and manage all deployed devices"
      actions={
        <AddDeviceButton onClick={() => navigate("/cloud/devices/new")}>
          + Add Device
        </AddDeviceButton>
      }
    >
      <Controls>
        <SearchBar
          type="text"
          placeholder="Search devices, sites, types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filters>
          <FilterChip
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={statusFilter === "online"}
            onClick={() => setStatusFilter("online")}
          >
            Online
          </FilterChip>
          <FilterChip
            $active={statusFilter === "warning"}
            onClick={() => setStatusFilter("warning")}
          >
            Warning
          </FilterChip>
          <FilterChip
            $active={statusFilter === "offline"}
            onClick={() => setStatusFilter("offline")}
          >
            Offline
          </FilterChip>
        </Filters>
      </Controls>

      {typeFilter === "all" && uniqueTypes.length > 1 && (
        <Filters style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: "#6b7280", marginRight: "8px" }}>
            Type:
          </span>
          <FilterChip
            $active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
          >
            All Types
          </FilterChip>
          {uniqueTypes.map((type) => (
            <FilterChip
              key={type}
              $active={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </FilterChip>
          ))}
        </Filters>
      )}

      <TableContainer>
        {filteredDevices.length === 0 ? (
          <EmptyState>
            <h3>No devices found</h3>
            <p>
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters or search query."
                : "No devices have been connected yet. Commission your first device via the Gateway app."}
            </p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Site / Customer</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th>Gateway</th>
                <th>Battery</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id}>
                  <td>
                    <DeviceLink to={`/cloud/devices/${device.id}`}>
                      {device.name}
                    </DeviceLink>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span>{device.siteName}</span>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {device.customer}
                      </span>
                    </div>
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
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span>{getRelativeTime(device.lastContact)}</span>
                      <span
                        style={{ fontSize: "11px", color: "#9ca3af" }}
                        title={new Date(device.lastContact).toLocaleString()}
                      >
                        {new Date(device.lastContact).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px" }}>
                      <div>{device.gatewayName}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                        {device.gatewayId}
                      </div>
                    </div>
                  </td>
                  <td>
                    <BatteryIndicator $level={device.batteryLevel}>
                      {device.batteryLevel}%
                    </BatteryIndicator>
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
