// /src/components/cloud/DashboardMain.jsx
import React from "react";
import styled from "styled-components";

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 64px); /* header height-ish */
  padding: 24px 16px 32px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;

  background: ${({ theme }) => theme.colors?.bg || "#f5f5f5"};
`;

// Centered shell – this is what removes the big white left gutter
const Shell = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  padding: 24px;
  box-sizing: border-box;

  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.6fr);
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AppTitle = styled.h1`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const AppSubtitle = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const SectionLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin-bottom: 8px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.li`
  button {
    width: 100%;
    border: none;
    padding: 10px 14px;
    border-radius: 999px;
    text-align: left;
    font-size: 14px;
    cursor: pointer;

    background: ${({ active, theme }) =>
      active
        ? theme.colors?.primary50 || "#e0f2ff"
        : "#f9fafb"};

    color: ${({ active, theme }) =>
      active
        ? theme.colors?.primary700 || "#0369a1"
        : theme.colors?.ui800 || "#111827"};

    display: flex;
    align-items: center;
    gap: 10px;

    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: ${({ active, theme }) =>
        active
          ? theme.colors?.primary100 || "#dbeafe"
          : "#f3f4f6"};
    }
  }
`;

const NavDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors?.primary500 || "#0ea5e9"};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DevicesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const DevicesTitle = styled.div`
  h2 {
    margin: 0;
    font-size: 18px;
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

const DevicesList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
`;

const DeviceCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #ffffff;
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
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const MetaItem = styled.span``;

const FooterStrip = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
`;

export default function DashboardMain() {
  return (
    <Page>
      <Shell>
        <LeftColumn>
          <div>
            <AppTitle>BlueSignal Cloud Monitoring</AppTitle>
            <AppSubtitle>
              Your devices, signals, and water quality in one view.
              Add a gateway or probe to start streaming data into the cloud.
            </AppSubtitle>
          </div>

          <div>
            <SectionLabel>Views</SectionLabel>
            <NavList>
              <NavItem active>
                <button type="button">
                  <NavDot />
                  Environment
                </button>
              </NavItem>
              <NavItem>
                <button type="button">
                  <NavDot />
                  Marketplace
                </button>
              </NavItem>
              <NavItem>
                <button type="button">
                  <NavDot />
                  Finance
                </button>
              </NavItem>
              <NavItem>
                <button type="button">
                  <NavDot />
                  Dashboard
                </button>
              </NavItem>
            </NavList>
          </div>
        </LeftColumn>

        <RightColumn>
          <DevicesHeader>
            <DevicesTitle>
              <h2>Your Devices</h2>
              <p>Example layout until real devices are synced.</p>
            </DevicesTitle>
            <AddDeviceButton type="button">+ Add Device</AddDeviceButton>
          </DevicesHeader>

          <DevicesList>
            <DeviceCard>
              <DeviceHeader>
                <DeviceName>Lakefront Buoy #1</DeviceName>
                <StatusPill>Online</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <MetaItem>Type: Water Quality Buoy</MetaItem>
                <MetaItem>Location: North Shore Cove</MetaItem>
                <MetaItem>Temp: 18.4°C</MetaItem>
                <MetaItem>pH: 7.2</MetaItem>
                <MetaItem>DO: 8.1 mg/L</MetaItem>
              </DeviceMeta>
            </DeviceCard>

            <DeviceCard>
              <DeviceHeader>
                <DeviceName>East Field Soil Probe</DeviceName>
                <StatusPill variant="warning">Warning</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <MetaItem>Type: Soil NPK Probe</MetaItem>
                <MetaItem>Location: East Field – Row 12</MetaItem>
                <MetaItem>Moisture: 42%</MetaItem>
                <MetaItem>Nitrate: 18 ppm</MetaItem>
                <MetaItem>Phosphate: 7 ppm</MetaItem>
              </DeviceMeta>
            </DeviceCard>

            <DeviceCard>
              <DeviceHeader>
                <DeviceName>Algae Emitter — Dock</DeviceName>
                <StatusPill variant="offline">Offline</StatusPill>
              </DeviceHeader>
              <DeviceMeta>
                <MetaItem>Type: Ultrasonic Algae Control</MetaItem>
                <MetaItem>Location: Dock</MetaItem>
                <MetaItem>Last heartbeat: —</MetaItem>
              </DeviceMeta>
              <FooterStrip>No link · 0 devices</FooterStrip>
            </DeviceCard>
          </DevicesList>
        </RightColumn>
      </Shell>
    </Page>
  );
}