import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px);
  padding: 24px 16px 40px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors?.bg || '#f5f5f5'};

  @media (max-width: 600px) {
    padding: 16px 8px 32px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
  }

  p {
    margin: 0;
    font-size: 15px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
  }
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors?.primary600 || '#0284c7'};
  color: #ffffff;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || '#0369a1'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatusCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;

  .label {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};
    margin-bottom: 8px;
  }

  .value {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary700 || '#0369a1'};
    margin-bottom: 4px;
  }

  .subtext {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
  }
`;

const Section = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;

  h2 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
  }
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 640px) and (max-width: 899px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DeviceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 16px;
  background: #ffffff;

  .device-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .device-name {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
  }

  .device-meta {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
    line-height: 1.6;

    div {
      margin-bottom: 4px;
    }
  }

  .device-readings {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors?.ui100 || '#f3f4f6'};
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui700 || '#374151'};
  }
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ variant }) =>
    variant === 'warning'
      ? '#f97316'
      : variant === 'offline'
      ? '#dc2626'
      : '#16a34a'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || '#374151'};
    border-bottom: 2px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 14px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || '#f3f4f6'};
    color: ${({ theme }) => theme.colors?.ui800 || '#1f2937'};
  }

  tr:hover {
    background: ${({ theme }) => theme.colors?.ui50 || '#f9fafb'};
  }

  .priority-high {
    color: #dc2626;
    font-weight: 600;
  }

  .priority-medium {
    color: #f97316;
    font-weight: 500;
  }

  .btn-link {
    color: ${({ theme }) => theme.colors?.primary600 || '#0284c7'};
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};
  font-size: 14px;
`;

const ToolCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-radius: 12px;
  padding: 20px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease-out;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || '#22d3ee'};
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  }

  .tool-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .tool-name {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || '#0f172a'};
    margin-bottom: 6px;
  }

  .tool-desc {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || '#4b5563'};
    line-height: 1.4;
  }
`;

const InstallerDashboard = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.uid]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API calls
      // const userDevices = await DeviceAPI.getInstallerDevices(user.uid);
      // const userJobs = await JobsAPI.getPending(user.uid);

      // Mock data
      setDevices([
        {
          id: 'd1',
          name: 'Lakefront Buoy #3',
          type: 'Water Quality Buoy',
          location: 'Deep Creek Lake',
          status: 'online',
          lastPing: '2 min ago',
          readings: 'Temp: 18.4°C · pH 7.2 · DO 8.1 mg/L',
        },
        {
          id: 'd2',
          name: 'East Field Probe',
          type: 'Soil NPK Probe',
          location: 'Johnson Farm — Field 2',
          status: 'warning',
          lastPing: '45 min ago',
          readings: 'Moisture: 42% · N: 18 ppm · P: 7 ppm',
        },
        {
          id: 'd3',
          name: 'Algae Emitter — Dock B',
          type: 'Ultrasonic Algae Control',
          location: 'Harbor Marina',
          status: 'offline',
          lastPing: '3 hours ago',
          readings: 'No data',
        },
      ]);

      setJobs([
        {
          id: 'j1',
          site: 'Johnson Farm',
          task: 'Install soil probe array (6 units)',
          priority: 'high',
          deadline: '2025-11-30',
        },
        {
          id: 'j2',
          site: 'Deep Creek Lake',
          task: 'Replace buoy sensor module',
          priority: 'medium',
          deadline: '2025-12-05',
        },
        {
          id: 'j3',
          site: 'Harbor Marina',
          task: 'Commission algae emitter + gateway',
          priority: 'high',
          deadline: '2025-12-01',
        },
      ]);
    } catch (error) {
      console.error('Error loading installer dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = () => {
    // TODO: Navigate to add device flow
    alert('Add Device feature coming soon');
  };

  const handleViewDevice = (deviceId) => {
    navigate(`/dashboard/${deviceId}`);
  };

  const handleViewJob = (jobId) => {
    // TODO: Navigate to job detail
    alert(`View job ${jobId}`);
  };

  if (loading) {
    return (
      <Page>
        <Shell>
          <EmptyState>Loading your dashboard...</EmptyState>
        </Shell>
      </Page>
    );
  }

  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const warningDevices = devices.filter((d) => d.status === 'warning').length;
  const offlineDevices = devices.filter((d) => d.status === 'offline').length;
  const highPriorityJobs = jobs.filter((j) => j.priority === 'high').length;

  return (
    <Page>
      <Shell>
        <Header>
          <div>
            <h1>Installer Dashboard</h1>
            <p>
              Monitor deployed devices, manage installation jobs, and track site status.
            </p>
          </div>
          <ActionButton onClick={handleAddDevice}>+ Add Device</ActionButton>
        </Header>

        <Grid>
          <StatusCard>
            <div className="label">Online Devices</div>
            <div className="value">{onlineDevices}</div>
            <div className="subtext">{devices.length} total</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Warnings</div>
            <div className="value">{warningDevices}</div>
            <div className="subtext">Need attention</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Offline</div>
            <div className="value">{offlineDevices}</div>
            <div className="subtext">Immediate action</div>
          </StatusCard>

          <StatusCard>
            <div className="label">Urgent Jobs</div>
            <div className="value">{highPriorityJobs}</div>
            <div className="subtext">{jobs.length} total jobs</div>
          </StatusCard>
        </Grid>

        <Section>
          <h2>Your Devices</h2>
          {devices.length === 0 ? (
            <EmptyState>
              <p>No devices registered yet.</p>
              <p style={{ marginTop: '12px' }}>
                <ActionButton onClick={handleAddDevice}>
                  Add Your First Device
                </ActionButton>
              </p>
            </EmptyState>
          ) : (
            <DeviceGrid>
              {devices.map((device) => (
                <DeviceCard key={device.id}>
                  <div className="device-header">
                    <div className="device-name">{device.name}</div>
                    <StatusPill variant={device.status}>
                      {device.status === 'online'
                        ? 'Online'
                        : device.status === 'warning'
                        ? 'Warning'
                        : 'Offline'}
                    </StatusPill>
                  </div>
                  <div className="device-meta">
                    <div>
                      <strong>Type:</strong> {device.type}
                    </div>
                    <div>
                      <strong>Location:</strong> {device.location}
                    </div>
                    <div>
                      <strong>Last ping:</strong> {device.lastPing}
                    </div>
                  </div>
                  <div className="device-readings">{device.readings}</div>
                </DeviceCard>
              ))}
            </DeviceGrid>
          )}
        </Section>

        <Section>
          <h2>Pending Installation Jobs</h2>
          {jobs.length === 0 ? (
            <EmptyState>
              <p>No pending jobs.</p>
              <p style={{ marginTop: '8px', fontSize: '13px' }}>
                All installations are up to date.
              </p>
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 500 }}>{job.site}</td>
                    <td>{job.task}</td>
                    <td
                      className={
                        job.priority === 'high'
                          ? 'priority-high'
                          : 'priority-medium'
                      }
                    >
                      {job.priority.toUpperCase()}
                    </td>
                    <td>{job.deadline}</td>
                    <td>
                      <span
                        className="btn-link"
                        onClick={() => handleViewJob(job.id)}
                      >
                        View Details
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Section>

        <Section>
          <h2>Quick Tools</h2>
          <DeviceGrid>
            <ToolCard onClick={() => navigate('/cloud/tools/upload-media')}>
              <div className="tool-icon">📸</div>
              <div className="tool-name">Upload Media</div>
              <div className="tool-desc">
                Document site with photos or videos
              </div>
            </ToolCard>

            <ToolCard onClick={() => navigate('/cloud/tools/live')}>
              <div className="tool-icon">📡</div>
              <div className="tool-name">Live Stream</div>
              <div className="tool-desc">
                Stream live video from site
              </div>
            </ToolCard>

            <ToolCard onClick={() => navigate('/cloud/tools/verification')}>
              <div className="tool-icon">✓</div>
              <div className="tool-name">Verification</div>
              <div className="tool-desc">
                Verify device installation
              </div>
            </ToolCard>
          </DeviceGrid>
        </Section>

        <Section>
          <h2>Recently Commissioned Devices</h2>
          {devices.filter((d) => d.status === 'online').length === 0 ? (
            <EmptyState>
              <p>No recently commissioned devices yet.</p>
            </EmptyState>
          ) : (
            <DeviceGrid>
              {devices
                .filter((d) => d.status === 'online')
                .slice(0, 3)
                .map((device) => (
                  <DeviceCard key={device.id}>
                    <div className="device-header">
                      <div className="device-name">{device.name}</div>
                      <StatusPill variant={device.status}>
                        Online
                      </StatusPill>
                    </div>
                    <div className="device-meta">
                      <div>
                        <strong>Type:</strong> {device.type}
                      </div>
                      <div>
                        <strong>Location:</strong> {device.location}
                      </div>
                      <div>
                        <strong>Last ping:</strong> {device.lastPing}
                      </div>
                    </div>
                    <div className="device-readings">{device.readings}</div>
                  </DeviceCard>
                ))}
            </DeviceGrid>
          )}
        </Section>
      </Shell>
    </Page>
  );
};

export default InstallerDashboard;
