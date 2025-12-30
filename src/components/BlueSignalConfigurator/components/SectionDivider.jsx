// SectionDivider - Smooth transitions between sections
import React from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";

// Angled divider - creates a slanted edge between sections
const AngledDividerWrapper = styled.div`
  position: relative;
  height: ${props => props.$height || '80px'};
  margin-top: ${props => props.$overlap ? `-${props.$height || '80px'}` : '0'};
  overflow: hidden;
  pointer-events: none;
`;

const AngledSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Gradient fade divider - smooth color transition
const GradientDividerWrapper = styled.div`
  height: ${props => props.$height || '120px'};
  background: linear-gradient(
    180deg,
    ${props => props.$fromColor || salesTheme.colors.bgPrimary} 0%,
    ${props => props.$toColor || salesTheme.colors.bgSurface} 100%
  );
`;

// Wave divider - organic wavy edge
const WaveDividerWrapper = styled.div`
  position: relative;
  height: ${props => props.$height || '60px'};
  overflow: hidden;
`;

const WaveSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Curved divider - smooth curve transition
const CurvedDividerWrapper = styled.div`
  position: relative;
  height: ${props => props.$height || '100px'};
  overflow: hidden;
`;

const CurvedSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Export various divider types
export function AngledDivider({
  fromColor = salesTheme.colors.bgPrimary,
  toColor = salesTheme.colors.bgSurface,
  height = '80px',
  direction = 'left', // 'left' or 'right'
  overlap = false,
}) {
  const points = direction === 'left'
    ? '0,0 100,100 0,100'
    : '0,100 100,0 100,100';

  return (
    <AngledDividerWrapper $height={height} $overlap={overlap}>
      <AngledSvg viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon fill={fromColor} points="0,0 100,0 100,100 0,100" />
        <polygon fill={toColor} points={points} />
      </AngledSvg>
    </AngledDividerWrapper>
  );
}

export function GradientDivider({
  fromColor = salesTheme.colors.bgPrimary,
  toColor = salesTheme.colors.bgSurface,
  height = '120px',
}) {
  return (
    <GradientDividerWrapper
      $fromColor={fromColor}
      $toColor={toColor}
      $height={height}
    />
  );
}

export function WaveDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '60px',
  flip = false,
}) {
  return (
    <WaveDividerWrapper $height={height} style={{ background: bgColor }}>
      <WaveSvg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ transform: flip ? 'rotate(180deg)' : 'none' }}
      >
        <path
          fill={color}
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        />
      </WaveSvg>
    </WaveDividerWrapper>
  );
}

export function CurvedDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '100px',
  flip = false,
}) {
  return (
    <CurvedDividerWrapper $height={height} style={{ background: bgColor }}>
      <CurvedSvg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ transform: flip ? 'rotate(180deg)' : 'none' }}
      >
        <path
          fill={color}
          d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
        />
      </CurvedSvg>
    </CurvedDividerWrapper>
  );
}

// Default export - most commonly used angled divider with gradient overlay
export default function SectionDivider({
  type = 'curved', // 'angled', 'gradient', 'wave', 'curved'
  fromColor,
  toColor,
  height,
  ...props
}) {
  switch (type) {
    case 'angled':
      return <AngledDivider fromColor={fromColor} toColor={toColor} height={height} {...props} />;
    case 'gradient':
      return <GradientDivider fromColor={fromColor} toColor={toColor} height={height} {...props} />;
    case 'wave':
      return <WaveDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'curved':
    default:
      return <CurvedDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
  }
}
