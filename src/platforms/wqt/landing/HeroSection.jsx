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
  max-width: 18ch;
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

  @media (max-width: 680px) {
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

  @media (max-width: 680px) {
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
  'Rebates on Your Bill',
  'No Municipal Water Needed',
];

const MOBILE_STEPS = [
  { icon: '💧', bg: 'rgba(6, 182, 212, 0.15)', label: 'AWG Harvests Water From Air' },
  { icon: '📡', bg: 'rgba(59, 130, 246, 0.15)', label: 'Sensor Verifies Every Drop' },
  { icon: '📊', bg: 'rgba(139, 92, 246, 0.15)', label: 'Credits Earned Automatically' },
  { icon: '💵', bg: 'rgba(16, 185, 129, 0.15)', label: 'You Get Paid on Your Bill' },
];

/* ── Desktop flow SVG component ────────────────────────── */

function DemandResponseFlow() {
  const STEPS = [
    { x: 0, label: 'Harvest', sub: 'AWG Makes Water', color: '#06B6D4', detail: '12 gal/day' },
    { x: 152, label: 'Verify', sub: 'Sensor Confirms', color: '#3B82F6', detail: 'pH · TDS · ORP' },
    { x: 304, label: 'Report', sub: 'Data to Utility', color: '#8B5CF6', detail: 'Encrypted · 24/7' },
    { x: 456, label: 'Earn', sub: 'Credits Generated', color: '#A855F7', detail: 'N/P · Quantity' },
    { x: 608, label: 'Get Paid', sub: 'On Your Bill', color: '#10B981', detail: 'Automated' },
  ];

  return (
    <FlowSvg viewBox="0 0 760 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
          <stop offset="75%" stopColor="#A855F7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
        </linearGradient>
        <pattern id="heroGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="rgba(255,255,255,0.03)" />
        </pattern>
      </defs>

      {/* Subtle dot grid */}
      <rect width="760" height="200" fill="url(#heroGrid)" />

      {/* Horizontal connector line */}
      <line x1="76" y1="56" x2="684" y2="56" stroke="url(#flowGrad)" strokeWidth="2" />
      {/* Animated flow overlay */}
      <line className="flow-line" x1="76" y1="56" x2="684" y2="56"
        stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

      {/* Step nodes */}
      {STEPS.map((step, i) => (
        <g key={i}>
          {/* Ambient glow */}
          <circle cx={step.x + 76} cy="56" r="40" fill={step.color} fillOpacity="0.04" />

          {/* Outer ring */}
          <circle cx={step.x + 76} cy="56" r="28" fill="rgba(255,255,255,0.02)"
            stroke={step.color} strokeWidth="1.5" strokeOpacity="0.3" />
          {/* Inner filled circle */}
          <circle cx={step.x + 76} cy="56" r="18" fill={step.color} fillOpacity="0.12" />
          {/* Step number */}
          <text x={step.x + 76} y="61" textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace" fontSize="13" fontWeight="700" fill={step.color}>
            {String(i + 1).padStart(2, '0')}
          </text>

          {/* Label */}
          <text x={step.x + 76} y="104" textAnchor="middle"
            fontFamily="'Outfit', sans-serif" fontSize="14" fontWeight="600" fill="#FFFFFF">
            {step.label}
          </text>
          {/* Subtitle */}
          <text x={step.x + 76} y="120" textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill="rgba(255,255,255,0.4)">
            {step.sub}
          </text>

          {/* Detail tag */}
          <rect x={step.x + 76 - 36} y="130" width="72" height="20" rx="10"
            fill={step.color} fillOpacity="0.08" stroke={step.color} strokeWidth="0.5" strokeOpacity="0.2" />
          <text x={step.x + 76} y="144" textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="500" fill={step.color} fillOpacity="0.7">
            {step.detail}
          </text>
        </g>
      ))}

      {/* Data flow arrows between nodes */}
      {[0, 1, 2, 3].map(i => {
        const x1 = STEPS[i].x + 76 + 30;
        const x2 = STEPS[i + 1].x + 76 - 30;
        const mid = (x1 + x2) / 2;
        return (
          <g key={`arrow-${i}`}>
            <path d={`M${mid - 4} 51 l8 5 -8 5`} fill="none"
              stroke={STEPS[i + 1].color} strokeWidth="1" strokeOpacity="0.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* Bottom label */}
      <text x="380" y="185" textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace" fontSize="10" fill="rgba(255,255,255,0.15)"
        letterSpacing="0.1em">
        HARVEST → VERIFY → EARN → GET PAID
      </text>
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
        <Eyebrow>Earn Money From Water</Eyebrow>
        <Headline>
          Get Paid to Harvest Water <GradientSpan>From the Air.</GradientSpan>
        </Headline>
        <Subheadline>
          Your atmospheric water generator produces clean water. Our sensor
          verifies it. Your utility pays you — automatically, on your
          water&nbsp;bill.
        </Subheadline>
        <CTARow>
          <PrimaryBtn href="#demand-response">See How It Works</PrimaryBtn>
          <SecondaryBtn href="/for-utilities">I'm a Utility</SecondaryBtn>
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
