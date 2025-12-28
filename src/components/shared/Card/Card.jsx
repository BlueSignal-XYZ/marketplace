// /src/components/shared/Card/Card.jsx
import styled, { css } from "styled-components";

// Base Card with modern styling
export const Card = styled.div`
  background: #FFFFFF;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "16px"};
  padding: ${({ $padding }) => $padding || "24px"};
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;

  /* Subtle inner shadow for depth */
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        border-color: ${({ theme }) => theme.colors?.primary300 || "#5DC9CC"};
        box-shadow:
          0 8px 24px rgba(29, 112, 114, 0.12),
          0 4px 8px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
        transform: translateY(-3px);
      }

      &:active {
        transform: translateY(-1px);
        box-shadow:
          0 4px 12px rgba(29, 112, 114, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
      }
    `}

  ${({ $elevated }) =>
    $elevated &&
    css`
      border: none;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.06),
        0 2px 4px rgba(0, 0, 0, 0.03),
        0 0 0 1px rgba(0, 0, 0, 0.02);

      &:hover {
        box-shadow:
          0 12px 32px rgba(0, 0, 0, 0.1),
          0 4px 8px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(0, 0, 0, 0.02);
        transform: translateY(-2px);
      }
    `}

  ${({ $glass }) =>
    $glass &&
    css`
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    `}

  /* Featured/highlighted card variant */
  ${({ $featured }) =>
    $featured &&
    css`
      border: 2px solid ${({ theme }) => theme.colors?.primary300 || "#5DC9CC"};
      background: linear-gradient(
        180deg,
        rgba(56, 189, 190, 0.03) 0%,
        rgba(255, 255, 255, 1) 100%
      );
      box-shadow:
        0 4px 16px rgba(29, 112, 114, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);

      &::before {
        content: "";
        position: absolute;
        top: -1px;
        left: 20px;
        right: 20px;
        height: 3px;
        background: linear-gradient(90deg, #38BDBE 0%, #1D7072 100%);
        border-radius: 0 0 3px 3px;
      }
    `}

  /* Success variant */
  ${({ $success }) =>
    $success &&
    css`
      border-color: ${({ theme }) => theme.colors?.success300 || "#86EFAC"};
      background: linear-gradient(
        180deg,
        rgba(16, 185, 129, 0.03) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    `}

  /* Warning variant */
  ${({ $warning }) =>
    $warning &&
    css`
      border-color: ${({ theme }) => theme.colors?.warning300 || "#FCD34D"};
      background: linear-gradient(
        180deg,
        rgba(245, 158, 11, 0.03) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    `}

  /* Danger variant */
  ${({ $danger }) =>
    $danger &&
    css`
      border-color: ${({ theme }) => theme.colors?.red300 || "#FCA5A5"};
      background: linear-gradient(
        180deg,
        rgba(239, 68, 68, 0.03) 0%,
        rgba(255, 255, 255, 1) 100%
      );
    `}
`;

// Card Header
export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: ${({ $noDivider }) => ($noDivider ? "16px" : "20px")};
  padding-bottom: ${({ $noDivider }) => ($noDivider ? "0" : "16px")};
  border-bottom: ${({ $noDivider, theme }) =>
    $noDivider ? "none" : `1px solid ${theme.colors?.ui100 || "#F4F5F7"}`};
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  letter-spacing: -0.01em;
`;

export const CardSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
  line-height: 1.5;
`;

export const CardHeaderContent = styled.div`
  flex: 1;
`;

export const CardHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

// Card Body
export const CardBody = styled.div`
  ${({ $scrollable }) =>
    $scrollable &&
    css`
      max-height: ${$scrollable};
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    `}
`;

// Card Footer
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => $align || "flex-end"};
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};

  ${({ $noDivider }) =>
    $noDivider &&
    css`
      border-top: none;
      padding-top: 0;
    `}
`;

// Metric Card - for displaying stats/KPIs
export const MetricCard = styled(Card)`
  text-align: ${({ $centered }) => ($centered ? "center" : "left")};

  .metric-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${({ $color, theme }) => {
      if ($color === "success") return theme.colors?.success50 || "#ECFDF5";
      if ($color === "warning") return theme.colors?.warning50 || "#FFFBEB";
      if ($color === "danger") return theme.colors?.red50 || "#FEF2F2";
      return theme.colors?.primary50 || "#E6F7F8";
    }};
    color: ${({ $color, theme }) => {
      if ($color === "success") return theme.colors?.success600 || "#059669";
      if ($color === "warning") return theme.colors?.warning600 || "#D97706";
      if ($color === "danger") return theme.colors?.red600 || "#DC2626";
      return theme.colors?.primary600 || "#196061";
    }};
    margin-bottom: 12px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .metric-label {
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    margin-bottom: 4px;
  }

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .metric-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 6px;

    &.positive {
      color: ${({ theme }) => theme.colors?.success600 || "#059669"};
      background: ${({ theme }) => theme.colors?.success50 || "#ECFDF5"};
    }

    &.negative {
      color: ${({ theme }) => theme.colors?.red600 || "#DC2626"};
      background: ${({ theme }) => theme.colors?.red50 || "#FEF2F2"};
    }
  }

  .metric-subtitle {
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    margin-top: 4px;
  }
`;

// List Card - for displaying lists of items
export const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

export const ListCardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#111827"};
  }
`;

export const ListCardItem = styled.div`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: background 0.15s ease-out;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"};

  &:last-child {
    border-bottom: none;
  }

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;

      &:hover {
        background: ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"};
      }
    `}
`;

// Card Grid for layouts
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $minWidth }) => $minWidth || "280px"}, 1fr));
  gap: ${({ $gap }) => $gap || "16px"};
`;

// Empty State Card
export const EmptyCard = styled(Card)`
  text-align: center;
  padding: 56px 32px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"} 0%,
    rgba(255, 255, 255, 1) 100%
  );
  border-style: dashed;
  border-width: 2px;

  .empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"} 0%,
      ${({ theme }) => theme.colors?.ui50 || "#FAFAFA"} 100%
    );
    color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
    margin-bottom: 20px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.04),
      inset 0 -2px 4px rgba(0, 0, 0, 0.02);

    svg {
      width: 32px;
      height: 32px;
    }
  }

  .empty-title {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }

  .empty-description {
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6B7280"};
    margin: 0 0 24px;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

// Section Divider with optional label
export const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: ${({ $margin }) => $margin || "32px 0"};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"} 50%,
      transparent 100%
    );
  }

  ${({ $label }) =>
    !$label &&
    css`
      &::before {
        background: ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
      }
      &::after {
        display: none;
      }
    `}
`;

export const SectionDividerLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors?.ui400 || "#9CA3AF"};
  white-space: nowrap;
`;

// Status Dot indicator
export const StatusDot = styled.span`
  display: inline-block;
  width: ${({ $size }) => $size || "8px"};
  height: ${({ $size }) => $size || "8px"};
  border-radius: 50%;
  background: ${({ $status, theme }) => {
    switch ($status) {
      case "online":
      case "success":
        return theme.colors?.success500 || "#10B981";
      case "warning":
        return theme.colors?.warning500 || "#F59E0B";
      case "offline":
      case "error":
        return theme.colors?.red500 || "#EF4444";
      default:
        return theme.colors?.ui400 || "#9CA3AF";
    }
  }};
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);

  ${({ $pulse }) =>
    $pulse &&
    css`
      animation: statusPulse 2s ease-in-out infinite;

      @keyframes statusPulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.1);
        }
      }
    `}
`;

// Decorative accent line for section headers
export const AccentBar = styled.div`
  width: ${({ $width }) => $width || "48px"};
  height: 4px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors?.primary400 || "#38BDBE"} 0%,
    ${({ theme }) => theme.colors?.primary600 || "#196061"} 100%
  );
  border-radius: 2px;
  margin-bottom: ${({ $margin }) => $margin || "16px"};
`;
