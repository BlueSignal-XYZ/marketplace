/**
 * Avatar — user/organization avatars.
 * Shows image or initials fallback. Theme-aware.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const sizeMap = { sm: 28, md: 36, lg: 48 };
const fontMap = { sm: 11, md: 13, lg: 16 };

// ── Styled ────────────────────────────────────────────────

const Wrapper = styled.div<{ $px: number }>`
  width: ${({ $px }) => $px}px;
  height: ${({ $px }) => $px}px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 600;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// ── Component ─────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
}) => {
  const px = sizeMap[size];
  const fs = fontMap[size];

  return (
    <Wrapper $px={px} className={className}>
      {src ? (
        <Img src={src} alt={alt || name || 'Avatar'} />
      ) : (
        <span style={{ fontSize: fs }}>{getInitials(name)}</span>
      )}
    </Wrapper>
  );
};
