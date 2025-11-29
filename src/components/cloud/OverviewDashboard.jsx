// /src/components/cloud/OverviewDashboard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI, { getRelativeTime } from "../../services/cloudMockAPI";

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

const MetricCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.15s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  }

  .label {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
    margin-bottom: 4px;
  }

  .subtext {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
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
  border-radius: 12px;
  padding: 24px;

  h2 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .view-all {
    font-size: 13px;
    font-weight: 500;
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Error loading overview dashboard:", error);
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
      title="Overview"
      subtitle="Monitor your BlueSignal fleet at a glance"
    >
      {/* Top Metrics Row */}
      <Grid>
        <MetricCard>
          <div className="label">Devices Online</div>
          <div className="value">
            {stats?.onlineDevices || 0}
          </div>
          <div className="subtext">{stats?.totalDevices || 0} total</div>
        </MetricCard>

        <MetricCard>
          <div className="label">Sites Monitored</div>
          <div className="value">{stats?.sitesMonitored || 0}</div>
          <div className="subtext">Active locations</div>
        </MetricCard>

        <MetricCard>
          <div className="label">Open Alerts</div>
          <div className="value">{stats?.openAlerts || 0}</div>
          <div className="subtext">Need attention</div>
        </MetricCard>

        <MetricCard>
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
