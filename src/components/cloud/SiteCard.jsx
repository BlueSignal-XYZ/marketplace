// /src/components/cloud/SiteCard.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors?.surface || "#FFFFFF"};
  border: 1px solid ${({ theme }) => theme.colors?.border || "#E5E7EB"};
  border-radius: ${({ theme }) => theme.radius?.lg || 16}px;
  padding: 20px;
  text-decoration: none;
  transition: all 0.15s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || "#0066FF"};
    box-shadow: 0 4px 16px rgba(0, 102, 255, 0.06);
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.sm || 640}px) {
    padding: 16px;
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
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || "#1A1A1A"};
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 12px;
  font-weight: 500;
  background: ${({ $variant }) =>
    $variant === "warning"
      ? "rgba(245,158,11,0.1)"
      : $variant === "offline"
      ? "rgba(239,68,68,0.1)"
      : "rgba(16,185,129,0.1)"};
  color: ${({ $variant }) =>
    $variant === "warning"
      ? "#D97706"
      : $variant === "offline"
      ? "#DC2626"
      : "#059669"};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.textSecondary || "#6B7280"};

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.text || "#1A1A1A"};
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.borderLight || "#F3F4F6"};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors?.textMuted || "#9CA3AF"};
  }

  .value {
    font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.primary || "#0066FF"};
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
          <strong>Customer:</strong> {site.customer ?? "—"}
        </MetaRow>
        <MetaRow>
          <strong>Location:</strong> {typeof site.location === "string" ? site.location : (site.location?.address || site.location?.city || "—")}
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
