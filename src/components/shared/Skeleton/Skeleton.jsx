// /src/components/shared/Skeleton/Skeleton.jsx
// Reusable skeleton loading components

import styled, { css } from "styled-components";
import { shimmer } from "../../../styles/animations";

// Base skeleton with shimmer animation
const SkeletonBase = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"} 25%,
    ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"} 50%,
    ${({ theme }) => theme.colors?.ui100 || "#F4F5F7"} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ $radius }) => $radius || "8px"};
`;

// Generic skeleton box
export const SkeletonBox = styled.div`
  ${SkeletonBase}
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "20px"};
`;

// Text line skeleton
export const SkeletonText = styled.div`
  ${SkeletonBase}
  height: ${({ $size }) => {
    if ($size === "sm") return "14px";
    if ($size === "lg") return "24px";
    if ($size === "xl") return "32px";
    return "16px";
  }};
  width: ${({ $width }) => $width || "100%"};
  border-radius: 4px;
`;

// Circle skeleton (for avatars)
export const SkeletonCircle = styled.div`
  ${SkeletonBase}
  width: ${({ $size }) => $size || "40px"};
  height: ${({ $size }) => $size || "40px"};
  border-radius: 50%;
  flex-shrink: 0;
`;

// Image/thumbnail skeleton
export const SkeletonImage = styled.div`
  ${SkeletonBase}
  width: 100%;
  padding-top: ${({ $ratio }) => {
    if ($ratio === "square") return "100%";
    if ($ratio === "video") return "56.25%";
    if ($ratio === "portrait") return "133%";
    return "75%"; // 4:3 default
  }};
  border-radius: ${({ $radius }) => $radius || "12px"};
`;

// Card skeleton - mimics a typical content card
export const SkeletonCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#E5E7EB"};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// Button skeleton
export const SkeletonButton = styled.div`
  ${SkeletonBase}
  height: 44px;
  width: ${({ $width }) => $width || "120px"};
  border-radius: 12px;
`;

// Composed skeleton for a listing card
export const ListingCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonImage $ratio="video" />
    <SkeletonText $size="lg" $width="70%" />
    <SkeletonText $width="50%" />
    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
      <SkeletonBox $width="60px" $height="24px" $radius="6px" />
      <SkeletonBox $width="80px" $height="24px" $radius="6px" />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
      <SkeletonText $size="xl" $width="100px" />
      <SkeletonButton $width="100px" />
    </div>
  </SkeletonCard>
);

// Composed skeleton for a table row
export const TableRowSkeleton = ({ columns = 4 }) => (
  <div style={{ display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid #E5E7EB" }}>
    {Array.from({ length: columns }).map((_, i) => (
      <SkeletonText key={i} $width={i === 0 ? "30%" : "20%"} />
    ))}
  </div>
);

// Composed skeleton for a dashboard metric card
export const MetricCardSkeleton = () => (
  <SkeletonCard>
    <SkeletonCircle $size="48px" />
    <SkeletonText $size="sm" $width="60%" />
    <SkeletonText $size="xl" $width="40%" />
  </SkeletonCard>
);

// Composed skeleton for device card
export const DeviceCardSkeleton = () => (
  <SkeletonCard>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <SkeletonCircle $size="40px" />
      <div style={{ flex: 1 }}>
        <SkeletonText $width="60%" style={{ marginBottom: "6px" }} />
        <SkeletonText $size="sm" $width="40%" />
      </div>
    </div>
    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
      <SkeletonBox $width="70px" $height="28px" $radius="6px" />
      <SkeletonBox $width="70px" $height="28px" $radius="6px" />
    </div>
  </SkeletonCard>
);

// Grid of skeleton cards
export const SkeletonGrid = ({ count = 6, CardComponent = ListingCardSkeleton }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <CardComponent key={i} />
    ))}
  </div>
);
