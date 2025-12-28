import styled from "styled-components";
import { creditTypeColors } from "../../../styles/colors";

export const Badge = styled.button`
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  font-size: 14px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background: ${({ theme }) => theme.colors.ui50};
  color: ${({ theme }) => theme.colors.ui800};
  text-transform: capitalize;
`;

// Credit type badge for WaterQuality.Trading marketplace
// Types: nitrogen, phosphorus, thermal, stormwater
const getCreditTypeColors = (type) => {
  const normalizedType = type?.toLowerCase() || "";
  return creditTypeColors[normalizedType] || {
    bg: "#f3f4f6",
    text: "#6b7280",
    border: "#e5e7eb",
  };
};

export const CreditTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  background: ${({ $type }) => getCreditTypeColors($type).bg};
  color: ${({ $type }) => getCreditTypeColors($type).text};
  border: 1px solid ${({ $type }) => getCreditTypeColors($type).border};
  transition: all 0.15s ease-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

// Credit type icon component
export const CreditTypeIcon = ({ type }) => {
  const icons = {
    nitrogen: "🧪",
    phosphorus: "🌿",
    thermal: "🌡️",
    stormwater: "💧",
  };
  return icons[type?.toLowerCase()] || "📊";
};
