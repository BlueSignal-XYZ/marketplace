// Installer Assignment Component - Assign installers to devices/orders
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DeviceAPI, OrderAPI, UserAPI } from "../../scripts/back_door";
import commissionService from "../../services/commissionService";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const DeviceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const InstallerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InstallerOption = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.selected ? "#eff6ff" : "#ffffff")};

  &:hover {
    border-color: ${(props) => (props.selected ? "#3b82f6" : "#9ca3af")};
  }
`;

const RadioCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#d1d5db")};
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(props) => (props.selected ? "#3b82f6" : "transparent")};
  }
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;

const InstallerInfo = styled.div`
  flex: 1;
`;

const InstallerName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

const InstallerMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
`;

const InstallerStats = styled.div`
  display: flex;
  gap: 16px;
  text-align: right;
`;

const StatItem = styled.div``;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-left: 12px;

  ${(props) =>
    props.status === "busy"
      ? `
    background: #fef3c7;
    color: #92400e;
  `
      : `
    background: #dcfce7;
    color: #166534;
  `}
`;

const NotesSection = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

const InstallerAssignment = () => {
  const navigate = useNavigate();
  const { orderId, deviceId } = useParams();
  const { ACTIONS } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [device, setDevice] = useState(null);
  const [order, setOrder] = useState(null);
  const [installers, setInstallers] = useState([]);
  const [installerStats, setInstallerStats] = useState({});
  const [selectedInstaller, setSelectedInstaller] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, [orderId, deviceId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load device and order info
      const [deviceData, orderData] = await Promise.all([
        deviceId ? DeviceAPI.getDeviceDetails(deviceId) : null,
        orderId ? OrderAPI.get(orderId) : null,
      ]);

      setDevice(deviceData);
      setOrder(orderData);

      // Load installers
      const users = await UserAPI.database.listByRole("installer");
      setInstallers(users || []);

      // Load stats for each installer
      const stats = {};
      for (const installer of users || []) {
        try {
          const { CommissionAPI } = await import("../../scripts/back_door");
          const commissions = await CommissionAPI.getByInstaller(installer.uid);
          const pendingJobs = commissions?.filter(c =>
            ["pending", "in_progress", "awaiting_tests"].includes(c.status)
          ).length || 0;
          const completedJobs = commissions?.filter(c =>
            ["passed", "failed"].includes(c.status)
          ).length || 0;

          stats[installer.uid] = {
            pending: pendingJobs,
            completed: completedJobs,
            status: pendingJobs > 2 ? "busy" : "available",
          };
        } catch (e) {
          stats[installer.uid] = { pending: 0, completed: 0, status: "available" };
        }
      }
      setInstallerStats(stats);

      // Pre-select current installer if already assigned
      if (deviceData?.assignedInstallerId) {
        setSelectedInstaller(deviceData.assignedInstallerId);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedInstaller) {
      setError("Please select an installer");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Initialize commission workflow
      await commissionService.initializeCommission(
        deviceId,
        orderId,
        selectedInstaller
      );

      // Update device with installer assignment
      await DeviceAPI.assignInstaller(deviceId, selectedInstaller, notes);

      ACTIONS?.logNotification?.("success", "Installer assigned successfully");
      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error("Failed to assign installer:", err);
      setError(err.message || "Failed to assign installer");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading...</LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate(-1)}>← Back</BackLink>
        <PageTitle>Assign Installer</PageTitle>
        <PageSubtitle>
          Select an installer for device commissioning
        </PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {device && (
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardBody>
            <DeviceInfo>
              <InfoItem>
                <InfoLabel>Device ID</InfoLabel>
                <InfoValue>{device.id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Model</InfoLabel>
                <InfoValue>{device.deviceType || device.model || "BlueSignal"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Order</InfoLabel>
                <InfoValue>{order?.id || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Site</InfoLabel>
                <InfoValue>{order?.siteName || device.siteName || "Not assigned"}</InfoValue>
              </InfoItem>
            </DeviceInfo>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Select Installer</CardTitle>
        </CardHeader>
        <CardBody>
          {installers.length === 0 ? (
            <EmptyState>No installers available</EmptyState>
          ) : (
            <InstallerList>
              {installers.map((installer) => {
                const stats = installerStats[installer.uid] || {};
                const isSelected = selectedInstaller === installer.uid;

                return (
                  <InstallerOption
                    key={installer.uid}
                    selected={isSelected}
                    onClick={() => setSelectedInstaller(installer.uid)}
                  >
                    <RadioCircle selected={isSelected} />
                    <Avatar>{getInitials(installer.displayName)}</Avatar>
                    <InstallerInfo>
                      <InstallerName>
                        {installer.displayName || "Unnamed"}
                        <StatusBadge status={stats.status}>
                          {stats.status === "busy" ? "Busy" : "Available"}
                        </StatusBadge>
                      </InstallerName>
                      <InstallerMeta>
                        {installer.email}
                        {installer.phone && ` • ${installer.phone}`}
                      </InstallerMeta>
                    </InstallerInfo>
                    <InstallerStats>
                      <StatItem>
                        <StatValue>{stats.pending || 0}</StatValue>
                        <StatLabel>Pending</StatLabel>
                      </StatItem>
                      <StatItem>
                        <StatValue>{stats.completed || 0}</StatValue>
                        <StatLabel>Done</StatLabel>
                      </StatItem>
                    </InstallerStats>
                  </InstallerOption>
                );
              })}
            </InstallerList>
          )}

          <NotesSection>
            <Label>Assignment Notes (optional)</Label>
            <TextArea
              placeholder="Special instructions for the installer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </NotesSection>
        </CardBody>
      </Card>

      <ButtonGroup>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={saving || !selectedInstaller}
        >
          {saving ? "Assigning..." : "Assign Installer"}
        </Button>
      </ButtonGroup>
    </PageContainer>
  );
};

export default InstallerAssignment;
