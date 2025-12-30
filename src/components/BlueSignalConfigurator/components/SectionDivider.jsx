// SectionDivider - Smooth transitions between sections
import React from "react";
import styled, { keyframes } from "styled-components";
import { salesTheme } from "../styles/theme";

const flowAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Base wrapper styles
const DividerBase = styled.div`
  position: relative;
  overflow: hidden;
  pointer-events: none;
  width: 100%;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: ${props => {
      const baseHeight = parseInt(props.$height) || 80;
      return `${Math.max(baseHeight * 0.6, 40)}px`;
    }};
  }
`;

// Angled divider - creates a slanted edge between sections
const AngledDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '80px'};
  margin-top: ${props => props.$overlap ? `-${props.$height || '80px'}` : '0'};
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

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    height: ${props => {
      const baseHeight = parseInt(props.$height) || 120;
      return `${Math.max(baseHeight * 0.6, 60)}px`;
    }};
  }
`;

// Wave divider - organic wavy edge
const WaveDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '60px'};
`;

const WaveSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Curved divider - smooth curve transition
const CurvedDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '100px'};
`;

const CurvedSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Layered wave divider - multiple overlapping waves
const LayeredDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '150px'};
`;

const LayeredSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

// Flowing wave divider with animation
const FlowingDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '80px'};
`;

const FlowingSvgContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  animation: ${flowAnimation} 25s linear infinite;
`;

const FlowingSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

// Tilt/slant divider - simple angled line
const TiltDividerWrapper = styled(DividerBase)`
  height: ${props => props.$height || '60px'};
`;

const TiltSvg = styled.svg`
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
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
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

export function LayeredDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '150px',
  flip = false,
}) {
  // Calculate layer colors with decreasing opacity
  const layer1 = color;
  const layer2Opacity = 0.7;
  const layer3Opacity = 0.4;

  return (
    <LayeredDividerWrapper $height={height} style={{ background: bgColor }}>
      <LayeredSvg
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        style={{ transform: flip ? 'rotate(180deg)' : 'none' }}
      >
        {/* Back layer */}
        <path
          fill={color}
          fillOpacity={layer3Opacity}
          d="M0,100 C200,120 400,80 600,100 C800,120 1000,80 1200,100 L1200,150 L0,150 Z"
        />
        {/* Middle layer */}
        <path
          fill={color}
          fillOpacity={layer2Opacity}
          d="M0,120 C150,100 350,140 550,110 C750,80 950,130 1200,110 L1200,150 L0,150 Z"
        />
        {/* Front layer */}
        <path
          fill={layer1}
          d="M0,130 C300,110 500,150 700,120 C900,90 1100,140 1200,130 L1200,150 L0,150 Z"
        />
      </LayeredSvg>
    </LayeredDividerWrapper>
  );
}

export function FlowingDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '80px',
  animate = true,
}) {
  return (
    <FlowingDividerWrapper $height={height} style={{ background: bgColor }}>
      <FlowingSvgContainer style={{ animationPlayState: animate ? 'running' : 'paused' }}>
        <FlowingSvg viewBox="0 0 2400 80" preserveAspectRatio="none">
          <path
            fill={color}
            d="M0,40 Q300,10 600,40 T1200,40 T1800,40 T2400,40 L2400,80 L0,80 Z"
          />
        </FlowingSvg>
      </FlowingSvgContainer>
    </FlowingDividerWrapper>
  );
}

export function TiltDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '60px',
  direction = 'right', // 'left' or 'right'
}) {
  const path = direction === 'right'
    ? 'M0,0 L1200,60 L1200,60 L0,60 Z'
    : 'M0,60 L1200,0 L1200,60 L0,60 Z';

  return (
    <TiltDividerWrapper $height={height} style={{ background: bgColor }}>
      <TiltSvg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path fill={color} d={path} />
      </TiltSvg>
    </TiltDividerWrapper>
  );
}

// Asymmetric curved divider - modern aesthetic
export function AsymmetricDivider({
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
          d="M0,0 C300,100 600,20 900,80 C1050,110 1150,90 1200,60 L1200,120 L0,120 Z"
        />
      </CurvedSvg>
    </CurvedDividerWrapper>
  );
}

// Blob/organic divider
export function BlobDivider({
  color = salesTheme.colors.bgSurface,
  bgColor = salesTheme.colors.bgPrimary,
  height = '120px',
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
          d="M0,60 C150,100 300,20 450,60 C600,100 750,20 900,60 C1050,100 1150,40 1200,60 L1200,120 L0,120 Z"
        />
      </CurvedSvg>
    </CurvedDividerWrapper>
  );
}

// Default export - unified section divider component
export default function SectionDivider({
  type = 'curved', // 'angled', 'gradient', 'wave', 'curved', 'layered', 'flowing', 'tilt', 'asymmetric', 'blob'
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
    case 'layered':
      return <LayeredDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'flowing':
      return <FlowingDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'tilt':
      return <TiltDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'asymmetric':
      return <AsymmetricDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'blob':
      return <BlobDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
    case 'curved':
    default:
      return <CurvedDivider color={toColor} bgColor={fromColor} height={height} {...props} />;
  }
}
