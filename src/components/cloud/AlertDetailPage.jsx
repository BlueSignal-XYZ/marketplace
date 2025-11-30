// /src/components/cloud/AlertDetailPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useParams, useNavigate } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  margin-bottom: 24px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertMessage = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SeverityPill = styled.span`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
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
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $status }) =>
    $status === "open" ? "#991b1b" : $status === "acknowledged" ? "#9a3412" : "#065f46"};
  background: ${({ $status }) =>
    $status === "open" ? "#fef2f2" : $status === "acknowledged" ? "#fff7ed" : "#f0fdf4"};
  border: 1px solid
    ${({ $status }) =>
      $status === "open" ? "#fca5a5" : $status === "acknowledged" ? "#fdba74" : "#86efac"};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  background: ${({ $variant }) =>
    $variant === "primary" ? "#0284c7" : "#ffffff"};
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "#0284c7")};
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "primary" ? "#0369a1" : "#e0f2ff"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 24px;

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

const DeviceLink = styled(Link)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DetailSection = styled.div`
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
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

export default function AlertDetailPage() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlertData();
  }, [alertId]);

  const loadAlertData = async () => {
    setLoading(true);
    try {
      const alerts = await CloudMockAPI.alerts.getAll();
      const alertData = alerts.find((a) => a.id === alertId);
      setAlert(alertData);
    } catch (error) {
      console.error("Error loading alert data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = () => {
    // TODO: Implement actual API call to acknowledge alert
    setAlert({ ...alert, status: "acknowledged" });
    console.log("Alert acknowledged:", alertId);
  };

  const handleResolve = () => {
    // TODO: Implement actual API call to resolve alert
    setAlert({ ...alert, status: "resolved" });
    console.log("Alert resolved:", alertId);
  };

  const handleReopen = () => {
    // TODO: Implement actual API call to reopen alert
    setAlert({ ...alert, status: "open" });
    console.log("Alert reopened:", alertId);
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

  if (loading) {
    return (
      <CloudPageLayout
        title="Alert Details"
        breadcrumbs={
          <>
            <Link to="/cloud/alerts">Alerts</Link>
            <span className="separator">/</span>
            <span>Loading...</span>
          </>
        }
      >
        <Skeleton $height="500px" />
      </CloudPageLayout>
    );
  }

  if (!alert) {
    return (
      <CloudPageLayout
        title="Alert Not Found"
        breadcrumbs={
          <>
            <Link to="/cloud/alerts">Alerts</Link>
            <span className="separator">/</span>
            <span>Not Found</span>
          </>
        }
      >
        <EmptyState>
          <h3>Alert not found</h3>
          <p>
            The alert you're looking for doesn't exist or has been removed.
          </p>
        </EmptyState>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Alert Details"
      breadcrumbs={
        <>
          <Link to="/cloud/alerts">Alerts</Link>
          <span className="separator">/</span>
          <span>{alert.id}</span>
        </>
      }
    >
      <ContentWrapper>
        <Header>
          <HeaderInfo>
            <AlertMessage>{alert.message}</AlertMessage>
            <BadgeRow>
              <SeverityPill $severity={alert.severity}>
                {getSeverityLabel(alert.severity)}
              </SeverityPill>
              <StatusPill $status={alert.status}>
                {getStatusLabel(alert.status)}
              </StatusPill>
            </BadgeRow>
          </HeaderInfo>

          <ActionButtons>
            {alert.status === "open" && (
              <>
                <Button onClick={handleAcknowledge}>Acknowledge</Button>
                <Button $variant="primary" onClick={handleResolve}>
                  Resolve
                </Button>
              </>
            )}
            {alert.status === "acknowledged" && (
              <Button $variant="primary" onClick={handleResolve}>
                Resolve
              </Button>
            )}
            {alert.status === "resolved" && (
              <Button onClick={handleReopen}>Reopen</Button>
            )}
          </ActionButtons>
        </Header>

        <InfoSection>
          <InfoCard>
            <div className="label">Site</div>
            <div className="value">{alert.siteName}</div>
          </InfoCard>

          <InfoCard>
            <div className="label">Device</div>
            <div className="value">
              <DeviceLink to={`/cloud/devices/${alert.deviceId}`}>
                {alert.deviceName}
              </DeviceLink>
            </div>
          </InfoCard>

          <InfoCard>
            <div className="label">Alert ID</div>
            <div className="value">{alert.id}</div>
          </InfoCard>

          <InfoCard>
            <div className="label">First Seen</div>
            <div className="value">{getRelativeTime(alert.firstSeen)}</div>
            <div className="subvalue">
              {new Date(alert.firstSeen).toLocaleString()}
            </div>
          </InfoCard>

          <InfoCard>
            <div className="label">Last Seen</div>
            <div className="value">{getRelativeTime(alert.lastSeen)}</div>
            <div className="subvalue">
              {new Date(alert.lastSeen).toLocaleString()}
            </div>
          </InfoCard>

          <InfoCard>
            <div className="label">Severity</div>
            <div className="value">{getSeverityLabel(alert.severity)}</div>
          </InfoCard>
        </InfoSection>

        <DetailSection>
          <h3>Alert Context</h3>
          <p>
            This alert was triggered for device <strong>{alert.deviceName}</strong> at{" "}
            <strong>{alert.siteName}</strong>. The condition was first detected{" "}
            {getRelativeTime(alert.firstSeen)} and was last observed{" "}
            {getRelativeTime(alert.lastSeen)}.
          </p>
        </DetailSection>

        {alert.status === "resolved" && (
          <DetailSection>
            <h3>Resolution Notes</h3>
            <p>
              This alert has been marked as resolved. If the condition persists or
              reoccurs, a new alert will be generated.
            </p>
          </DetailSection>
        )}
      </ContentWrapper>
    </CloudPageLayout>
  );
}
