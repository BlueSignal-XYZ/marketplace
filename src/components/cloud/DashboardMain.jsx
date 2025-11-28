// /src/components/cloud/DashboardMain.jsx
import React from "react";
import styled from "styled-components";

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 72px); /* subtract header */
  padding: 24px 16px 40px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;

  background: ${({ theme }) => theme.colors?.bg || "#f5f5f5"};

  @media (max-width: 600px) {
    padding: 16px 8px 32px;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  padding: 24px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px 24px;
    border-radius: 16px;
  }
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const ViewsStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ViewChip = styled.button`
  border-radius: 999px;
  border: 1px solid
    ${({ active, theme }) =>
      active
        ? theme.colors?.primary300 || "#7dd3fc"
        : theme.colors?.ui200 || "#e5e7eb"};
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: default;

  background: ${({ active, theme }) =>
    active ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};
  color: ${({ active, theme }) =>
    active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui800 || "#111827"};
`;

const DevicesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DevicesTitle = styled.div`
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const AddDeviceButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  background: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  color: #ffffff;

  &:hover {
    background: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  }
`;

const DevicesGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 640px) and (max-width: 899px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const DeviceCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  padding: 14px 16px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeviceName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const StatusPill = styled.span`
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ variant }) =>
    variant === "warning"
      ? "#f97316"
      : variant === "offline"
      ? "#dc2626"
      : "#16a34a"};
`;

const DeviceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const FooterStrip = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
`;

export default function DashboardMain() {
  return (
    <Page>
      <Shell>
        <HeaderBlock>
          <Title>BlueSignal Cloud Monitoring</Title>
          <Subtitle>
            Your devices, signals, and water quality in one view. Add a gateway
            or probe to start streaming real-time data into the cloud.
          </Subtitle>
        </HeaderBlock>

        <ViewsStrip>
          <ViewChip active>Environment</ViewChip>
          <ViewChip>Marketplace</ViewChip>
          <ViewChip>Finance</ViewChip>
          <ViewChip>Dashboard</ViewChip>
        </ViewsStrip>

        <div>
          <DevicesHeader>
            <DevicesTitle>
              <h2>Your Devices</h2>
              <p>Example layout until real devices are synced.</p>
            </DevicesTitle>
            <AddDeviceButton type="button">+ Add Device</AddDeviceButton>
          </DevicesHeader>

          <DevicesGrid>
            <DeviceCard>
              <DeviceHeader>
                <DeviceName>Lakefront Buoy #1</DeviceName>
                <StatusPill>Online</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <span>Type: Water Quality Buoy</span>
                <span>Location: North Shore Cove</span>
                <span>Temp: 18.4°C · pH 7.2 · DO 8.1 mg/L</span>
              </DeviceMeta>
            </DeviceCard>

            <DeviceCard>
              <DeviceHeader>
                <DeviceName>East Field Soil Probe</DeviceName>
                <StatusPill variant="warning">Warning</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <span>Type: Soil NPK Probe</span>
                <span>Location: East Field — Row 12</span>
                <span>Moisture: 42% · Nitrate: 18 ppm · Phosphate: 7 ppm</span>
              </DeviceMeta>
            </DeviceCard>

            <DeviceCard>
              <DeviceHeader>
                <DeviceName>Algae Emitter — Dock</DeviceName>
                <StatusPill variant="offline">Offline</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <span>Type: Ultrasonic Algae Control</span>
                <span>Location: Dock</span>
                <span>Last heartbeat: —</span>
              </DeviceMeta>
              <FooterStrip>No link · 0 devices</FooterStrip>
            </DeviceCard>
          </DevicesGrid>
        </div>
      </Shell>
    </Page>
  );
}