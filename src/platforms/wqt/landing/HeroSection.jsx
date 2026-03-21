/**
 * WQT Hero — premium dark hero for waterquality.trading.
 * Demand Response Platform positioning.
 * Desktop: animated SVG flow diagram. Mobile: simplified vertical pipeline.
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

/* ── Keyframes ─────────────────────────────────────────── */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%      { transform: translateX(-50%) translateY(8px); }
`;

const flowDash = keyframes`
  to { stroke-dashoffset: -20; }
`;

const SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ── Layout ────────────────────────────────────────────── */

const Section = styled.section`
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px clamp(20px, 5vw, 48px) 48px;
  background: #0B1120;
  color: #FFFFFF;
  box-sizing: border-box;

  @media (max-height: 500px) {
    justify-content: flex-start;
    padding-top: clamp(32px, 6vh, 60px);
  }

  @media (prefers-reduced-motion: reduce) {
    & * { animation-duration: 0.01ms !important; }
  }
`;

const GradientMesh = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0, 82, 204, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 80% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 50% 90%, rgba(16, 185, 129, 0.08) 0%, transparent 60%);
  animation: ${gradientShift} 20s ease-in-out infinite;
  background-size: 200% 200%;
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
`;

const GlowOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${pulse} ${({ $d }) => $d || '6s'} ease-in-out infinite;
  animation-delay: ${({ $del }) => $del || '0s'};
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 860px;
  width: 100%;
  z-index: 1;
`;

/* ── Typography ────────────────────────────────────────── */

const Eyebrow = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.9);
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.9s ${SPRING} 0.1s both;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin: 0 0 24px;
  max-width: 14ch;
  color: #FFFFFF;
  text-wrap: balance;
  animation: ${fadeUp} 0.9s ${SPRING} 0.25s both;
`;

const GradientSpan = styled.span`
  background: linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subheadline = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: 400;
  line-height: 1.65;
  max-width: 560px;
  margin: 0 0 36px;
  color: rgba(255, 255, 255, 0.6);
  text-wrap: pretty;
  animation: ${fadeUp} 0.9s ${SPRING} 0.4s both;

  @media (max-width: 480px) {
    line-height: 1.8;
  }
`;

/* ── CTAs ──────────────────────────────────────────────── */

const CTARow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.9s ${SPRING} 0.55s both;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 28px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  white-space: nowrap;
  min-width: 180px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
  &:active { transform: translateY(0); }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 28px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  white-space: nowrap;
  min-width: 180px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

/* ── Pill bar ──────────────────────────────────────────── */

const Pills = styled.div`
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.9s ${SPRING} 0.65s both;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const Pill = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
`;

const PillDot = styled.span`
  color: rgba(255, 255, 255, 0.2);
  user-select: none;
  @media (max-width: 480px) { display: none; }
`;

/* ── Desktop SVG visual ────────────────────────────────── */

const DesktopViz = styled.div`
  margin-top: 56px;
  width: 100%;
  max-width: 760px;
  animation: ${fadeUp} 0.9s ${SPRING} 0.75s both;

  @media (max-width: 768px) {
    display: none;
  }
`;

const FlowSvg = styled.svg`
  width: 100%;
  height: auto;

  .flow-line {
    stroke-dasharray: 8 6;
    animation: ${flowDash} 1.2s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .flow-line { animation: none; }
  }
`;

/* ── Mobile visual ─────────────────────────────────────── */

const MobileViz = styled.div`
  display: none;
  margin-top: 40px;
  width: 100%;
  max-width: 320px;
  animation: ${fadeUp} 0.9s ${SPRING} 0.7s both;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
`;

const MobileStep = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  width: 100%;
`;

const MobileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
`;

const MobileLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const MobileConnector = styled.div`
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.1));
  margin: 0 auto;
`;

/* ── Scroll indicator ──────────────────────────────────── */

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.4;
  animation: ${bounce} 2s ease infinite;
  pointer-events: none;

  @media (max-height: 700px) { display: none; }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* ── Data ──────────────────────────────────────────────── */

const PILLS = [
  'Sensor-Verified',
  'Utility-Controlled',
  'Quality + Quantity',
];

const MOBILE_STEPS = [
  { icon: '💧', bg: 'rgba(6, 182, 212, 0.15)', label: 'Sensor Monitors Water' },
  { icon: '📊', bg: 'rgba(0, 82, 204, 0.15)', label: 'Credits Auto-Generated' },
  { icon: '💵', bg: 'rgba(16, 185, 129, 0.15)', label: 'Rebate on Your Bill' },
];

/* ── Desktop flow SVG component ────────────────────────── */

function DemandResponseFlow() {
  return (
    <FlowSvg viewBox="0 0 760 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Step boxes */}
      {[
        { x: 0, label: 'Sensor', sub: 'WQM-1', color: '#06B6D4' },
        { x: 190, label: 'Monitor', sub: '24/7 Data', color: '#3B82F6' },
        { x: 380, label: 'Verify', sub: 'Credits', color: '#8B5CF6' },
        { x: 570, label: 'Rebate', sub: 'On Your Bill', color: '#10B981' },
      ].map((step, i) => (
        <g key={i}>
          <rect x={step.x} y="20" width="160" height="100" rx="12"
            fill="rgba(255,255,255,0.03)" stroke={step.color} strokeWidth="1" strokeOpacity="0.3" />
          {/* Icon circle */}
          <circle cx={step.x + 80} cy="56" r="16" fill={step.color} fillOpacity="0.15" />
          <text x={step.x + 80} y="62" textAnchor="middle"
            fontFamily="'Outfit', sans-serif" fontSize="14" fontWeight="600" fill={step.color}>
            {String(i + 1).padStart(2, '0')}
          </text>
          {/* Labels */}
          <text x={step.x + 80} y="92" textAnchor="middle"
            fontFamily="'Outfit', sans-serif" fontSize="14" fontWeight="600" fill="#FFFFFF">
            {step.label}
          </text>
          <text x={step.x + 80} y="110" textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill="rgba(255,255,255,0.45)">
            {step.sub}
          </text>
        </g>
      ))}
      {/* Connecting flow lines */}
      {[160, 350, 540].map((x, i) => (
        <line key={i} className="flow-line"
          x1={x + 10} y1="70" x2={x + 20} y2="70"
          stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      ))}
    </FlowSvg>
  );
}

/* ── Component ─────────────────────────────────────────── */

export function HeroSection() {
  return (
    <Section>
      <GradientMesh />
      <GridOverlay />
      <GlowOrb $d="8s" $del="0s"
        style={{ top: '10%', left: '5%', width: 300, height: 300, background: 'rgba(0,82,204,0.08)' }}
      />
      <GlowOrb $d="10s" $del="2s"
        style={{ bottom: '10%', right: '5%', width: 250, height: 250, background: 'rgba(6,182,212,0.06)' }}
      />

      <Content>
        <Eyebrow>Water Demand Response Platform</Eyebrow>
        <Headline>
          One Sensor. <GradientSpan>Two Problems</GradientSpan> Solved.
        </Headline>
        <Subheadline>
          Help utilities launch sensor-verified rebate programs that reward
          water conservation and quality improvement — all from one device.
        </Subheadline>
        <CTARow>
          <PrimaryBtn href="/for-utilities">For Utilities</PrimaryBtn>
          <SecondaryBtn href="/for-homeowners">For Participants</SecondaryBtn>
        </CTARow>
        <Pills>
          {PILLS.map((text, i) => (
            <React.Fragment key={i}>
              {i > 0 && <PillDot>·</PillDot>}
              <Pill>{text}</Pill>
            </React.Fragment>
          ))}
        </Pills>

        {/* Desktop: animated flow diagram */}
        <DesktopViz>
          <DemandResponseFlow />
        </DesktopViz>

        {/* Mobile: simplified vertical pipeline */}
        <MobileViz>
          {MOBILE_STEPS.map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <MobileConnector />}
              <MobileStep>
                <MobileIcon $bg={step.bg}>
                  <span style={{ fontSize: 18 }}>{step.icon}</span>
                </MobileIcon>
                <MobileLabel>{step.label}</MobileLabel>
              </MobileStep>
            </React.Fragment>
          ))}
        </MobileViz>
      </Content>

      <ScrollIndicator>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </ScrollIndicator>
    </Section>
  );
}
