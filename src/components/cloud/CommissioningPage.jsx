// /src/components/cloud/CommissioningPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const DeviceTable = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    border: none;
    background: transparent;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  @media (max-width: 767px) {
    display: none;
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
    font-size: 12px;
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

const MobileDeviceCards = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const MobileDeviceCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 16px;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    font-weight: 600;
  }

  span {
    color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  }
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #ffffff;
  background: ${({ $status }) => {
    if ($status === "online") return "#16a34a";
    if ($status === "warning") return "#f97316";
    if ($status === "offline") return "#dc2626";
    return "#9ca3af";
  }};
`;

const CommissionStatusPill = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #ffffff;
  background: ${({ $status }) => {
    if ($status === "commissioned") return "#16a34a";
    if ($status === "failed") return "#dc2626";
    if ($status === "uncommissioned") return "#9ca3af";
    return "#9ca3af";
  }};
`;

const SignalBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $strength }) =>
    $strength >= 80 ? "#16a34a" : $strength >= 50 ? "#f97316" : "#dc2626"};
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
  background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 48px;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary100 || "#bae6fd"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 767px) {
    width: 100%;
    margin-top: 12px;
  }
`;

const ViewResultButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  background: #ffffff;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 48px;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }

  @media (max-width: 767px) {
    width: 100%;
    margin-top: 8px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};

  h2 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  }

  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  border: none;
  min-height: 48px;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: #06b6d4;
    color: #ffffff;
    &:hover {
      background: #0891b2;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const TestChecklist = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TestItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: ${({ $status }) => {
    if ($status === "running") return "#fef3c7";
    if ($status === "passed") return "#d1fae5";
    if ($status === "failed") return "#fee2e2";
    return "#f3f4f6";
  }};
  border: 1px solid
    ${({ $status }) => {
      if ($status === "running") return "#fbbf24";
      if ($status === "passed") return "#10b981";
      if ($status === "failed") return "#ef4444";
      return "#e5e7eb";
    }};
`;

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const TestIcon = styled.div`
  font-size: 18px;
`;

const TestName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
`;

const TestDuration = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  font-weight: 500;
`;

const TestDetails = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
`;

const OverallStatus = styled.div`
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 18px;
  background: ${({ $status }) =>
    $status === "passed" ? "#d1fae5" : $status === "failed" ? "#fee2e2" : "#e0f2ff"};
  color: ${({ $status }) =>
    $status === "passed" ? "#065f46" : $status === "failed" ? "#991b1b" : "#0369a1"};
  border: 2px solid
    ${({ $status }) =>
      $status === "passed" ? "#10b981" : $status === "failed" ? "#ef4444" : "#06b6d4"};
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

const WebUILink = styled.a`
  display: inline-block;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #0284c7;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease-out;

  &:hover {
    background: #e5e7eb;
    text-decoration: underline;
  }
`;

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function CommissioningPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissioningDevice, setCommissioningDevice] = useState(null);
  const [tests, setTests] = useState([]);
  const [commissionResult, setCommissionResult] = useState(null);
  const [viewingResult, setViewingResult] = useState(null);

  useEffect(() => {
    loadDevices();
  }, []);

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

  const handleStartCommissioning = async (device) => {
    setCommissioningDevice(device);
    setTests([]);
    setCommissionResult(null);

    try {
      const result = await CloudMockAPI.commissioning.runCommission(
        device.id,
        (updatedTests) => {
          setTests([...updatedTests]);
        }
      );

      setCommissionResult(result);
      await loadDevices(); // Reload to update commission status
    } catch (error) {
      console.error("Commissioning failed:", error);
    }
  };

  const handleViewLastCommission = async (device) => {
    try {
      const result = await CloudMockAPI.commissioning.getLastCommission(device.id);
      if (result) {
        setViewingResult({ device, result });
      } else {
        alert(`No commissioning history found for ${device.alias || device.name}`);
      }
    } catch (error) {
      console.error("Error loading commission result:", error);
    }
  };

  const handleCloseCommissioning = () => {
    setCommissioningDevice(null);
    setTests([]);
    setCommissionResult(null);
  };

  const handleCloseViewResult = () => {
    setViewingResult(null);
  };

  const handleDownloadReport = (result, device) => {
    const report = {
      device: {
        id: device.id,
        name: device.name,
        alias: device.alias,
        site: device.siteName,
      },
      commission: result,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commission-${device.id}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTestIcon = (status) => {
    if (status === "passed") return "✅";
    if (status === "failed") return "❌";
    if (status === "running") return "⏳";
    return "⏸️";
  };

  const formatDuration = (ms) => {
    if (!ms) return "—";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Commissioning"
        subtitle="Field-ready device commissioning wizard"
      >
        <Skeleton />
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Commissioning"
      subtitle="Field-ready device commissioning wizard"
    >
      {/* Device Selector Table */}
      <DeviceTable>
        <Table>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Alias</th>
              <th>Site</th>
              <th>Status</th>
              <th>Last Seen</th>
              <th>Signal</th>
              <th>Commission Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{device.id}</div>
                </td>
                <td>{device.alias || device.name}</td>
                <td>{device.siteName}</td>
                <td>
                  <StatusPill $status={device.status}>{device.status}</StatusPill>
                </td>
                <td>{getRelativeTime(device.lastContact)}</td>
                <td>
                  <SignalBar $strength={device.signalStrength}>
                    {device.signalStrength}%
                  </SignalBar>
                </td>
                <td>
                  <CommissionStatusPill $status={device.commissionStatus}>
                    {device.commissionStatus || "uncommissioned"}
                  </CommissionStatusPill>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <ActionButton onClick={() => handleStartCommissioning(device)}>
                      Commission
                    </ActionButton>
                    {device.lastCommissioned && (
                      <ViewResultButton
                        onClick={() => handleViewLastCommission(device)}
                      >
                        View Result
                      </ViewResultButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Mobile Cards */}
        <MobileDeviceCards>
          {devices.map((device) => (
            <MobileDeviceCard key={device.id}>
              <MobileCardRow>
                <strong>Device ID:</strong>
                <span>{device.id}</span>
              </MobileCardRow>
              <MobileCardRow>
                <strong>Alias:</strong>
                <span>{device.alias || device.name}</span>
              </MobileCardRow>
              <MobileCardRow>
                <strong>Site:</strong>
                <span>{device.siteName}</span>
              </MobileCardRow>
              <MobileCardRow>
                <strong>Status:</strong>
                <StatusPill $status={device.status}>{device.status}</StatusPill>
              </MobileCardRow>
              <MobileCardRow>
                <strong>Signal:</strong>
                <SignalBar $strength={device.signalStrength}>
                  {device.signalStrength}%
                </SignalBar>
              </MobileCardRow>
              <MobileCardRow>
                <strong>Commission:</strong>
                <CommissionStatusPill $status={device.commissionStatus}>
                  {device.commissionStatus || "uncommissioned"}
                </CommissionStatusPill>
              </MobileCardRow>
              <ActionButton onClick={() => handleStartCommissioning(device)}>
                Commission Device
              </ActionButton>
              {device.lastCommissioned && (
                <ViewResultButton onClick={() => handleViewLastCommission(device)}>
                  View Last Result
                </ViewResultButton>
              )}
            </MobileDeviceCard>
          ))}
        </MobileDeviceCards>
      </DeviceTable>

      {/* Commissioning Modal */}
      {commissioningDevice && (
        <Modal onClick={(e) => e.target === e.currentTarget && commissionResult && handleCloseCommissioning()}>
          <ModalContent>
            <ModalHeader>
              <h2>
                Commissioning: {commissioningDevice.alias || commissioningDevice.name}
              </h2>
              <p>Device ID: {commissioningDevice.id}</p>
              {commissioningDevice.gatewayIp && (
                <WebUILink
                  href={`http://${commissioningDevice.gatewayIp}:8080`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open PGP Web UI →
                </WebUILink>
              )}
            </ModalHeader>

            <ModalBody>
              {commissionResult && (
                <OverallStatus $status={commissionResult.status}>
                  {commissionResult.status === "passed"
                    ? "✅ Commissioning Passed"
                    : "❌ Commissioning Failed"}
                </OverallStatus>
              )}

              <TestChecklist>
                {tests.map((test) => (
                  <div key={test.id}>
                    <TestItem $status={test.status}>
                      <TestInfo>
                        <TestIcon>{getTestIcon(test.status)}</TestIcon>
                        <TestName>{test.name}</TestName>
                      </TestInfo>
                      <TestDuration>{formatDuration(test.duration)}</TestDuration>
                    </TestItem>
                    {test.details && test.status === "failed" && (
                      <TestDetails>Error: {test.details}</TestDetails>
                    )}
                  </div>
                ))}
              </TestChecklist>
            </ModalBody>

            <ModalFooter>
              {commissionResult && (
                <ModalButton
                  onClick={() =>
                    handleDownloadReport(commissionResult, commissioningDevice)
                  }
                >
                  Download JSON Report
                </ModalButton>
              )}
              <ModalButton
                $variant="primary"
                onClick={handleCloseCommissioning}
                disabled={!commissionResult}
              >
                {commissionResult ? "Close" : "Commissioning..."}
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* View Result Modal */}
      {viewingResult && (
        <Modal onClick={(e) => e.target === e.currentTarget && handleCloseViewResult()}>
          <ModalContent>
            <ModalHeader>
              <h2>
                Commission Result: {viewingResult.device.alias || viewingResult.device.name}
              </h2>
              <p>Device ID: {viewingResult.device.id}</p>
              <p style={{ fontSize: "13px", marginTop: "8px" }}>
                Commissioned: {new Date(viewingResult.result.completedAt).toLocaleString()}
              </p>
            </ModalHeader>

            <ModalBody>
              <OverallStatus $status={viewingResult.result.status}>
                {viewingResult.result.status === "passed"
                  ? "✅ Commissioning Passed"
                  : "❌ Commissioning Failed"}
              </OverallStatus>

              <TestChecklist>
                {viewingResult.result.tests.map((test) => (
                  <div key={test.id}>
                    <TestItem $status={test.status}>
                      <TestInfo>
                        <TestIcon>{getTestIcon(test.status)}</TestIcon>
                        <TestName>{test.name}</TestName>
                      </TestInfo>
                      <TestDuration>{formatDuration(test.duration)}</TestDuration>
                    </TestItem>
                    {test.details && (
                      <TestDetails>{test.details}</TestDetails>
                    )}
                  </div>
                ))}
              </TestChecklist>
            </ModalBody>

            <ModalFooter>
              <ModalButton
                onClick={() =>
                  handleDownloadReport(viewingResult.result, viewingResult.device)
                }
              >
                Download JSON Report
              </ModalButton>
              <ModalButton $variant="primary" onClick={handleCloseViewResult}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </CloudPageLayout>
  );
}
