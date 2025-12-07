// Installer List Component - List and manage installers
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserAPI } from "../../scripts/back_door";
import { CommissionAPI } from "../../scripts/back_door";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const InstallerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const InstallerCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const InstallerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

const InstallerInfo = styled.div`
  flex: 1;
`;

const InstallerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const InstallerEmail = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;

  ${(props) =>
    props.status === "active"
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : props.status === "busy"
      ? `
    background: #fef3c7;
    color: #92400e;
  `
      : `
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const InstallerStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const MiniStat = styled.div`
  text-align: center;
`;

const MiniStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const MiniStatLabel = styled.div`
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
`;

const RegionTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin: 4px 4px 0 0;
  font-size: 11px;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  border-radius: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: #374151;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "busy", label: "Busy" },
  { value: "inactive", label: "Inactive" },
];

const InstallerList = () => {
  const navigate = useNavigate();
  const [installers, setInstallers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [installerStats, setInstallerStats] = useState({});

  useEffect(() => {
    loadInstallers();
  }, []);

  const loadInstallers = async () => {
    setLoading(true);
    try {
      // Get users with installer role
      const users = await UserAPI.database.listByRole("installer");
      setInstallers(users || []);

      // Load stats for each installer
      const stats = {};
      for (const installer of users || []) {
        try {
          const commissions = await CommissionAPI.getByInstaller(installer.uid);
          const pendingJobs = commissions?.filter(c =>
            ["pending", "in_progress", "awaiting_tests"].includes(c.status)
          ).length || 0;
          const completedJobs = commissions?.filter(c =>
            ["passed", "failed"].includes(c.status)
          ).length || 0;
          const passRate = completedJobs > 0
            ? Math.round((commissions?.filter(c => c.status === "passed").length || 0) / completedJobs * 100)
            : 0;

          stats[installer.uid] = {
            pending: pendingJobs,
            completed: completedJobs,
            passRate,
            status: pendingJobs > 2 ? "busy" : pendingJobs > 0 ? "active" : "active",
          };
        } catch (e) {
          stats[installer.uid] = { pending: 0, completed: 0, passRate: 0, status: "active" };
        }
      }
      setInstallerStats(stats);
    } catch (err) {
      console.error("Failed to load installers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstallers = installers.filter((installer) => {
    const matchesSearch =
      !search ||
      installer.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      installer.email?.toLowerCase().includes(search.toLowerCase());

    const stats = installerStats[installer.uid] || {};
    const matchesStatus = !statusFilter || stats.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const overallStats = {
    total: installers.length,
    active: Object.values(installerStats).filter(s => s.status === "active").length,
    busy: Object.values(installerStats).filter(s => s.status === "busy").length,
    totalJobs: Object.values(installerStats).reduce((sum, s) => sum + s.completed, 0),
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleCardClick = (installerId) => {
    navigate(`/installers/${installerId}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Installers</PageTitle>
      </PageHeader>

      <Stats>
        <StatCard>
          <StatValue>{overallStats.total}</StatValue>
          <StatLabel>Total Installers</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.active}</StatValue>
          <StatLabel>Available</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.busy}</StatValue>
          <StatLabel>Busy (3+ Jobs)</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{overallStats.totalJobs}</StatValue>
          <StatLabel>Total Completed</StatLabel>
        </StatCard>
      </Stats>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search installers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </FilterSelect>
      </SearchBar>

      {loading ? (
        <LoadingState>Loading installers...</LoadingState>
      ) : filteredInstallers.length === 0 ? (
        <EmptyState>
          <h3>No installers found</h3>
          <p>
            {search || statusFilter
              ? "Try adjusting your search or filters"
              : "No installers registered yet"}
          </p>
        </EmptyState>
      ) : (
        <InstallerGrid>
          {filteredInstallers.map((installer) => {
            const stats = installerStats[installer.uid] || {};
            return (
              <InstallerCard
                key={installer.uid}
                onClick={() => handleCardClick(installer.uid)}
              >
                <InstallerHeader>
                  <Avatar>{getInitials(installer.displayName)}</Avatar>
                  <InstallerInfo>
                    <InstallerName>{installer.displayName || "Unnamed"}</InstallerName>
                    <InstallerEmail>{installer.email}</InstallerEmail>
                  </InstallerInfo>
                  <StatusBadge status={stats.status}>
                    {stats.status === "busy" ? "Busy" : "Available"}
                  </StatusBadge>
                </InstallerHeader>

                {installer.regions?.length > 0 && (
                  <div>
                    {installer.regions.map((region) => (
                      <RegionTag key={region}>{region}</RegionTag>
                    ))}
                  </div>
                )}

                <InstallerStats>
                  <MiniStat>
                    <MiniStatValue>{stats.pending || 0}</MiniStatValue>
                    <MiniStatLabel>Pending</MiniStatLabel>
                  </MiniStat>
                  <MiniStat>
                    <MiniStatValue>{stats.completed || 0}</MiniStatValue>
                    <MiniStatLabel>Completed</MiniStatLabel>
                  </MiniStat>
                  <MiniStat>
                    <MiniStatValue>{stats.passRate || 0}%</MiniStatValue>
                    <MiniStatLabel>Pass Rate</MiniStatLabel>
                  </MiniStat>
                </InstallerStats>
              </InstallerCard>
            );
          })}
        </InstallerGrid>
      )}
    </PageContainer>
  );
};

export default InstallerList;
