/**
 * Skeleton — content-shaped loading placeholders.
 * Replaces all Lottie loaders. Shimmer animation, theme-aware.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface SkeletonProps {
  /** Width — number (px) or string (e.g. '100%') */
  width?: number | string;
  /** Height — number (px) or string */
  height?: number | string;
  /** Border radius — number (px) or 'full' for circle */
  radius?: number | 'full';
  /** Display as inline-block instead of block */
  inline?: boolean;
  /** Number of repeated lines */
  lines?: number;
  /** Gap between lines (px) */
  gap?: number;
  className?: string;
}

// ── Animation ─────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ── Styled ────────────────────────────────────────────────

const Bar = styled.div<{
  $width: string;
  $height: string;
  $radius: string;
  $inline: boolean;
}>`
  display: ${({ $inline }) => ($inline ? 'inline-block' : 'block')};
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.components.skeletonBase} 25%,
    ${({ theme }) => theme.components.skeletonShimmer} 50%,
    ${({ theme }) => theme.components.skeletonBase} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

const Stack = styled.div<{ $gap: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
`;

// ── Helpers ───────────────────────────────────────────────

function toCss(val: number | string | undefined, fallback: string): string {
  if (val === undefined) return fallback;
  return typeof val === 'number' ? `${val}px` : val;
}

// ── Component ─────────────────────────────────────────────

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  radius,
  inline = false,
  lines,
  gap = 8,
  className,
}) => {
  const w = toCss(width, '100%');
  const h = toCss(height, '16px');
  const r = radius === 'full' ? '9999px' : toCss(radius, '6px');

  if (lines && lines > 1) {
    return (
      <Stack $gap={gap} className={className}>
        {Array.from({ length: lines }).map((_, i) => (
          <Bar
            key={i}
            $width={i === lines - 1 ? '60%' : w}
            $height={h}
            $radius={r}
            $inline={inline}
          />
        ))}
      </Stack>
    );
  }

  return <Bar $width={w} $height={h} $radius={r} $inline={inline} className={className} />;
};

// ── Preset shapes ─────────────────────────────────────────

export const SkeletonCircle: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Skeleton width={size} height={size} radius="full" />
);

export const SkeletonText: React.FC<{ lines?: number; width?: number | string }> = ({
  lines = 3,
  width = '100%',
}) => <Skeleton width={width} height={14} lines={lines} gap={10} />;

export const SkeletonCard: React.FC = () => (
  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Skeleton height={120} radius={12} />
    <Skeleton height={20} width="70%" />
    <Skeleton height={14} width="40%" />
  </div>
);
