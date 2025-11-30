// /src/components/cloud/SiteCard.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled(Link)`
  display: block;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const SiteName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
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

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  }

  .value {
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  }
`;

const getStatusVariant = (status) => {
  if (status === "offline") return "offline";
  if (status === "warning") return "warning";
  return "online";
};

const getStatusLabel = (status) => {
  if (status === "offline") return "Offline";
  if (status === "warning") return "Warning";
  return "Online";
};

export default function SiteCard({ site }) {
  return (
    <Card to={`/cloud/sites/${site.id}`}>
      <Header>
        <SiteName>{site.name}</SiteName>
        <StatusPill $variant={getStatusVariant(site.status)}>
          {getStatusLabel(site.status)}
        </StatusPill>
      </Header>

      <MetaInfo>
        <MetaRow>
          <strong>Customer:</strong> {site.customer}
        </MetaRow>
        <MetaRow>
          <strong>Location:</strong> {site.location}
        </MetaRow>
        {site.coordinates && (
          <MetaRow>
            <strong>Coordinates:</strong> {site.coordinates.lat.toFixed(4)},{" "}
            {site.coordinates.lng.toFixed(4)}
          </MetaRow>
        )}
      </MetaInfo>

      <StatsRow>
        <Stat>
          <div className="label">Devices</div>
          <div className="value">{site.deviceCount}</div>
        </Stat>
        <Stat>
          <div className="label">Status</div>
          <div className="value">{getStatusLabel(site.status)}</div>
        </Stat>
      </StatsRow>
    </Card>
  );
}
