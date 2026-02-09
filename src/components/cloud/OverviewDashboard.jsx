// /src/components/cloud/OverviewDashboard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";
import { DeviceAPI, AlertsAPI, SiteAPI } from "../../scripts/back_door";
import { DemoHint } from "../DemoHint";
import SEOHead from "../seo/SEOHead";
import VirtualDeviceSimulator from "./VirtualDeviceSimulator";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== "false";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const MetricCard = styled(Link)`
  display: block;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 14px;
  padding: 22px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;

  /* Subtle inner glow */
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  /* Decorative gradient accent on top */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors?.primary400 || "#38BDBE"} 0%,
      ${({ theme }) => theme.colors?.primary600 || "#196061"} 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease-out;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary300 || "#5DC9CC"};
    box-shadow:
      0 8px 24px rgba(29, 112, 114, 0.12),
      0 4px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-3px);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29, 112, 114, 0.08);
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    margin-bottom: 10px;
  }

  .value {
    font-size: clamp(26px, 5vw, 34px);
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
    margin-bottom: 6px;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .subtext {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 900px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 14px;
  padding: 24px;
  position: relative;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  h2 {
    margin: 0 0 20px;
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: -0.01em;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#f4f5f7"};
  }

  .view-all {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SiteRow = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-color: ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  }

  .site-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .site-name {
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    }

    .site-meta {
      font-size: 12px;
      color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    }
  }

  .site-status {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
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

const CommissioningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommissioningRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  font-size: 13px;

  .event-info {
    display: flex;
    flex-direction: column;
    gap: 3px;

    .device-name {
      font-weight: 600;
      color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    }

    .site-name {
      font-size: 12px;
      color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    }
  }

  .event-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;

    .time {
      font-size: 11px;
      color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    }
  }
`;

const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TaskRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid
    ${({ $priority }) =>
      $priority === "critical"
        ? "#fca5a5"
        : $priority === "high"
        ? "#fdba74"
        : "#e5e7eb"};
  background: ${({ $priority }) =>
    $priority === "critical"
      ? "#fef2f2"
      : $priority === "high"
      ? "#fff7ed"
      : "#ffffff"};
  font-size: 13px;

  .task-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .task-title {
      font-weight: 600;
      color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    }

    .task-type {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    }
  }

  .task-time {
    font-size: 12px;
    font-weight: 600;
    color: ${({ $priority }) =>
      $priority === "critical"
        ? "#dc2626"
        : $priority === "high"
        ? "#f97316"
        : "#6b7280"};
    white-space: nowrap;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  font-size: 14px;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 20px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  .welcome-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;

    .welcome-icon {
      font-size: 18px;
    }

    p {
      font-size: 14px;
      margin: 0;
      font-weight: 500;

      @media (max-width: 600px) {
        font-size: 13px;
      }
    }
  }

  .welcome-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 14px 16px;
  }
`;

const WelcomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease-out;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const WelcomePrimaryButton = styled(WelcomeButton)`
  background: #ffffff;
  color: #0369a1;
  border-color: #ffffff;

  &:hover {
    background: #f0f9ff;
  }
`;

const DismissButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.15s ease-out;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const HealthSummary = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;

  .health-status {
    display: flex;
    align-items: center;
    gap: 16px;

    .health-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      background: ${({ $status }) =>
        $status === "excellent"
          ? "#dcfce7"
          : $status === "good"
          ? "#fef9c3"
          : "#fee2e2"};
    }

    .health-text {
      h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 4px;
        color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
      }

      p {
        font-size: 13px;
        margin: 0;
        color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
      }
    }
  }

  .health-metrics {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    align-items: center;

    .metric {
      text-align: center;

      .value {
        font-size: 24px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
      }

      .label {
        font-size: 12px;
        color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
`;

const HealthCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${({ $variant }) =>
    $variant === "warning" ? "#fef3c7" : "#fee2e2"};
  color: ${({ $variant }) =>
    $variant === "warning" ? "#92400e" : "#991b1b"};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.15s ease-out;
  white-space: nowrap;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "warning" ? "#fde68a" : "#fecaca"};
    transform: translateY(-1px);
  }
`;

const CrossSiteLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  }

  .link-icon {
    font-size: 24px;
  }

  .link-content {
    flex: 1;

    .link-title {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .link-subtitle {
      font-size: 13px;
      opacity: 0.9;
    }
  }

  .link-arrow {
    font-size: 18px;
    opacity: 0.8;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  border: 1px solid ${({ theme }) => theme.colors?.primary300 || "#7dd3fc"};
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary50 || "#e0f2fe"};
    transform: translateY(-1px);
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
  height: ${({ $height }) => $height || "60px"};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function OverviewDashboard() {
  const [stats, setStats] = useState(null);
  const [sites, setSites] = useState([]);
  const [recentCommissioning, setRecentCommissioning] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show welcome banner if user hasn't dismissed it
    return !localStorage.getItem("cloud_welcome_dismissed");
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem("cloud_welcome_dismissed", "true");
    setShowWelcome(false);
  };

  // Calculate fleet health status
  const getFleetHealth = () => {
    if (!stats || stats.totalDevices === 0) {
      return { status: "none", message: "No devices configured", icon: "📡" };
    }

    const onlinePercent = (stats.onlineDevices / stats.totalDevices) * 100;
    const hasAlerts = stats.openAlerts > 0;

    if (onlinePercent >= 95 && !hasAlerts) {
      return {
        status: "excellent",
        message: "All systems operational",
        icon: "✓",
      };
    } else if (onlinePercent >= 80) {
      return {
        status: "good",
        message: hasAlerts
          ? `${stats.openAlerts} alert${stats.openAlerts > 1 ? "s" : ""} need attention`
          : "Most devices online",
        icon: "●",
      };
    } else {
      return {
        status: "warning",
        message: "Multiple devices need attention",
        icon: "!",
      };
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        // Mock data path (demo/development)
        const [statsData, sitesData, commissioningData, tasksData] =
          await Promise.all([
            CloudMockAPI.overview.getStats(),
            CloudMockAPI.sites.getAll(),
            CloudMockAPI.overview.getRecentCommissioning(),
            CloudMockAPI.overview.getTodayTasks(),
          ]);

        setStats(statsData);
        setSites(sitesData);
        setRecentCommissioning(commissioningData);
        setTodayTasks(tasksData);
      } else {
        // Real API path
        const [devicesResult, alertsResult, sitesResult, commissioningData, tasksData] =
          await Promise.all([
            DeviceAPI.getDevices().catch(() => null),
            AlertsAPI.getActive().catch(() => null),
            SiteAPI.list().catch(() => null),
            CloudMockAPI.overview.getRecentCommissioning(), // still mock until commissioning API is wired
            CloudMockAPI.overview.getTodayTasks(),          // still mock until tasks API is wired
          ]);

        // Compute stats from real device/alert data
        const devices = devicesResult?.devices || [];
        const alerts = alertsResult?.alerts || [];
        const sitesData = sitesResult?.sites || [];

        const onlineDevices = devices.filter(
          (d) => d.health?.lastSeen && Date.now() - d.health.lastSeen < 30 * 60 * 1000
        );

        setStats({
          totalDevices: devices.length,
          onlineDevices: onlineDevices.length,
          offlineDevices: devices.length - onlineDevices.length,
          openAlerts: alerts.length,
          totalSites: sitesData.length,
        });

        setSites(sitesData);
        setRecentCommissioning(commissioningData);
        setTodayTasks(tasksData);
      }
    } catch (error) {
      console.error("Error loading overview dashboard:", error);
      // Fall back to mock data on error
      try {
        const [statsData, sitesData] = await Promise.all([
          CloudMockAPI.overview.getStats(),
          CloudMockAPI.sites.getAll(),
        ]);
        setStats(statsData);
        setSites(sitesData);
      } catch (fallbackError) {
        console.error("Mock fallback also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    if (status === "offline") return "offline";
    if (status === "warning") return "warning";
    return "online";
  };

  const getCommissioningStatusPill = (status) => {
    const variants = {
      completed: "online",
      in_progress: "warning",
      pending: "warning",
      failed: "offline",
    };
    return variants[status] || "warning";
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Overview"
        subtitle="Monitor your BlueSignal fleet at a glance"
      >
        <Grid>
          <Skeleton $height="100px" />
          <Skeleton $height="100px" />
          <Skeleton $height="100px" />
          <Skeleton $height="100px" />
        </Grid>
        <Skeleton $height="300px" />
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Overview
          <DemoHint screenName="cloud-dashboard" />
        </div>
      }
      subtitle="Monitor your BlueSignal fleet at a glance"
    >
      <SEOHead
        title="Dashboard Overview | BlueSignal Cloud"
        description="Monitor your BlueSignal water quality monitoring fleet. View device status, alerts, and site performance at a glance."
        canonical="/dashboard/main"
        noindex={true}
      />

      {/* First-time user welcome banner - compact single-line */}
      {showWelcome && (
        <WelcomeBanner>
          <div className="welcome-content">
            <span className="welcome-icon">👋</span>
            <p>Welcome to BlueSignal Cloud — monitor devices, manage sites, and track performance.</p>
          </div>
          <div className="welcome-actions">
            <WelcomePrimaryButton to="/cloud/onboarding">
              Get Started
            </WelcomePrimaryButton>
            <DismissButton onClick={dismissWelcome}>
              Dismiss
            </DismissButton>
          </div>
        </WelcomeBanner>
      )}

      {/* Fleet Health Summary */}
      {stats && stats.totalDevices > 0 && (
        <HealthSummary $status={getFleetHealth().status}>
          <div className="health-status">
            <div className="health-icon">{getFleetHealth().icon}</div>
            <div className="health-text">
              <h3>Fleet Health</h3>
              <p>{getFleetHealth().message}</p>
            </div>
          </div>
          <div className="health-metrics">
            <div className="metric">
              <div className="value">
                {stats.totalDevices > 0
                  ? Math.round((stats.onlineDevices / stats.totalDevices) * 100)
                  : 0}
                %
              </div>
              <div className="label">Uptime</div>
            </div>
            <div className="metric">
              <div className="value">{stats.onlineDevices}</div>
              <div className="label">Online</div>
            </div>
            <div className="metric">
              <div className="value">{stats.openAlerts}</div>
              <div className="label">Alerts</div>
            </div>
            {(stats.openAlerts > 0 || stats.devicesNeedingAttention > 0) && (
              <HealthCTA
                to="/cloud/alerts?status=open"
                $variant={getFleetHealth().status === "good" ? "warning" : "error"}
              >
                View issues →
              </HealthCTA>
            )}
          </div>
        </HealthSummary>
      )}

      {/* Cross-site link to WQT for credit generation */}
      {stats && stats.onlineDevices > 0 && (
        <CrossSiteLink
          href="https://waterquality.trading/marketplace"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="link-icon">💧</div>
          <div className="link-content">
            <div className="link-title">Generate Water Quality Credits</div>
            <div className="link-subtitle">
              Turn your device data into tradeable credits on the marketplace
            </div>
          </div>
          <div className="link-arrow">→</div>
        </CrossSiteLink>
      )}

      {/* Virtual Device Simulator (dev mode) */}
      <VirtualDeviceSimulator />

      {/* Quick Action Buttons */}
      <QuickActions>
        <CTAButton to="/cloud/commissioning/new">
          + Commission Device
        </CTAButton>
        <SecondaryButton to="/cloud/devices/add">
          + Add Device
        </SecondaryButton>
        <SecondaryButton to="/cloud/sites/new">
          + Add Site
        </SecondaryButton>
        <SecondaryButton to="/cloud/devices">
          View All Devices
        </SecondaryButton>
      </QuickActions>

      {/* Top Metrics Row */}
      <Grid>
        <MetricCard to="/cloud/devices?status=online">
          <div className="label">Devices Online</div>
          <div className="value">
            {stats?.onlineDevices || 0}
          </div>
          <div className="subtext">{stats?.totalDevices || 0} total</div>
        </MetricCard>

        <MetricCard to="/cloud/sites">
          <div className="label">Sites Monitored</div>
          <div className="value">{stats?.sitesMonitored || 0}</div>
          <div className="subtext">Active locations</div>
        </MetricCard>

        <MetricCard to="/cloud/alerts?status=open">
          <div className="label">Open Alerts</div>
          <div className="value">{stats?.openAlerts || 0}</div>
          <div className="subtext">Need attention</div>
        </MetricCard>

        <MetricCard to="/cloud/devices?status=warning">
          <div className="label">Devices Needing Attention</div>
          <div className="value">{stats?.devicesNeedingAttention || 0}</div>
          <div className="subtext">Offline or warning</div>
        </MetricCard>
      </Grid>

      {/* Middle Row: Sites + Recent Commissioning */}
      <TwoColumnGrid>
        <Section>
          <h2>
            Sites
            <Link to="/cloud/sites" className="view-all">
              View All →
            </Link>
          </h2>
          {sites.length === 0 ? (
            <EmptyState>No sites configured yet.</EmptyState>
          ) : (
            <SitesList>
              {sites.slice(0, 5).map((site) => (
                <SiteRow key={site.id} to={`/cloud/sites/${site.id}`}>
                  <div className="site-info">
                    <div className="site-name">{site.name}</div>
                    <div className="site-meta">
                      {site.deviceCount} devices · {site.location}
                    </div>
                  </div>
                  <div className="site-status">
                    <StatusPill $variant={getStatusVariant(site.status)}>
                      {site.status === "online"
                        ? "Online"
                        : site.status === "warning"
                        ? "Warning"
                        : "Offline"}
                    </StatusPill>
                  </div>
                </SiteRow>
              ))}
            </SitesList>
          )}
        </Section>

        <Section>
          <h2>
            Recent Commissioning
            <Link to="/cloud/commissioning" className="view-all">
              View All →
            </Link>
          </h2>
          {recentCommissioning.length === 0 ? (
            <EmptyState>No recent commissioning events.</EmptyState>
          ) : (
            <CommissioningList>
              {recentCommissioning.map((event) => (
                <CommissioningRow key={event.id}>
                  <div className="event-info">
                    <div className="device-name">{event.deviceName}</div>
                    <div className="site-name">{event.siteName}</div>
                  </div>
                  <div className="event-status">
                    <StatusPill
                      $variant={getCommissioningStatusPill(event.status)}
                    >
                      {event.status.replace("_", " ")}
                    </StatusPill>
                    <div className="time">
                      {getRelativeTime(event.lastUpdated)}
                    </div>
                  </div>
                </CommissioningRow>
              ))}
            </CommissioningList>
          )}
        </Section>
      </TwoColumnGrid>

      {/* Bottom Row: Today's Tasks */}
      <Section>
        <h2>Today's Tasks</h2>
        {todayTasks.length === 0 ? (
          <EmptyState>
            No tasks scheduled for today. You're all caught up!
          </EmptyState>
        ) : (
          <TasksList>
            {todayTasks.map((task) => (
              <TaskRow key={task.id} $priority={task.priority}>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-type">{task.type}</div>
                </div>
                <div className="task-time">{task.dueTime}</div>
              </TaskRow>
            ))}
          </TasksList>
        )}
      </Section>
    </CloudPageLayout>
  );
}
