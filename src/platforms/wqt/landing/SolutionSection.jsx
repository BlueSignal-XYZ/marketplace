/**
 * SolutionSection — the Demand Response Program flow.
 * Renders audience-specific 3-step content when `content` prop provided,
 * otherwise falls back to the default 5-step lifecycle.
 */

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import RevealOnScroll from './RevealOnScroll';

const flowPulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.7; }
`;

const Section = styled.section`
  padding: 48px clamp(16px, 5vw, 48px);
  background: #0b1120;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 64px clamp(20px, 5vw, 48px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 100px clamp(20px, 5vw, 48px);
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(6, 182, 212, 0.9);
  margin-bottom: 12px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin: 0 0 16px;
  letter-spacing: -0.03em;
  text-wrap: balance;
`;

const SectionSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 1.4vw, 17px);
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  max-width: 620px;
  margin: 0 auto 56px;
  line-height: 1.7;
  text-wrap: pretty;
`;

/* ── Desktop: horizontal timeline ──────────────────────── */

const CrossfadeWrapper = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 200ms ease-in-out;
`;

const Timeline = styled.div`
  display: none;
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: grid;
    grid-template-columns: repeat(${({ $cols }) => $cols || 5}, 1fr);
    gap: 0;
  }
`;

const TimelineConnector = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: block;
    position: absolute;
    top: 32px;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(6, 182, 212, 0.4),
      rgba(0, 82, 204, 0.4),
      rgba(139, 92, 246, 0.4),
      rgba(16, 185, 129, 0.4)
    );
    z-index: 0;
  }
`;

const TimelineStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 0 8px;
`;

const StepCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #0b1120;
  border: 2px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;

  /* Inner colored fill */
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: ${({ $bg }) => $bg};
  }
`;

const StepNumber = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  position: relative;
  z-index: 1;
`;

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
`;

const StepDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin: 0;
  max-width: 140px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    max-width: 180px;
  }
`;

/* ── Mobile: vertical pipeline ─────────────────────────── */

const MobilePipeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: none;
  }
`;

const MobileCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
`;

const MobileCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  border: 1.5px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MobileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MobileTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const MobileDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
  margin: 0;
`;

const MobileConnector = styled.div`
  width: 2px;
  height: 24px;
  margin: 0 0 0 40px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
`;

/* ── Data ──────────────────────────────────────────────── */

const STEPS = [
  {
    color: '#0052CC',
    bg: 'rgba(0, 82, 204, 0.12)',
    title: 'Utility Launches Program',
    desc: "Your utility sets rebate rates and defines the service area. You don't have to do anything here — they handle it.",
  },
  {
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    title: 'You Install an AWG',
    desc: 'Set up an atmospheric water generator at your home or facility. Pair it with a BlueSignal WQM-1 sensor.',
  },
  {
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    title: 'Sensor Verifies Water',
    desc: 'The WQM-1 monitors your water output 24/7 — pH, TDS, ORP — and reports it to the cloud automatically.',
  },
  {
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.12)',
    title: 'Credits Earned',
    desc: 'Every gallon of verified clean water earns you quantity and quality credits. No paperwork.',
  },
  {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    title: 'You Get Paid',
    desc: 'Credits convert to rebates that appear directly on your water bill. That simple.',
  },
];

export function SolutionSection({ audience, content }) {
  // Use audience-specific steps when provided, otherwise default 5-step
  const steps = content?.steps || STEPS;
  const colCount = steps.length;

  // Crossfade
  const [visible, setVisible] = useState(true);
  const [displaySteps, setDisplaySteps] = useState(steps);

  useEffect(() => {
    if (steps === displaySteps) return;
    setVisible(false);
    const timer = setTimeout(() => {
      setDisplaySteps(steps);
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [steps, displaySteps]);

  return (
    <Section id="demand-response">
      <Inner>
        <RevealOnScroll>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>From Air to Water to Money</SectionTitle>
          <SectionSub>
            An atmospheric water generator harvests water from the air. A BlueSignal sensor verifies
            every drop. Your utility pays you for each gallon — automatically.
          </SectionSub>
        </RevealOnScroll>

        <CrossfadeWrapper $visible={visible}>
          {/* Desktop timeline */}
          <RevealOnScroll delay={0.15}>
            <Timeline $cols={colCount}>
              <TimelineConnector />
              {displaySteps.map((step, i) => (
                <TimelineStep key={i}>
                  <StepCircle $color={step.color} $bg={`${step.color}1F`}>
                    <StepNumber $color={step.color}>{String(i + 1).padStart(2, '0')}</StepNumber>
                  </StepCircle>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDesc>{step.desc}</StepDesc>
                </TimelineStep>
              ))}
            </Timeline>
          </RevealOnScroll>

          {/* Mobile pipeline */}
          <MobilePipeline>
            {displaySteps.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                {i > 0 && <MobileConnector />}
                <MobileCard>
                  <MobileCircle $color={step.color} $bg={`${step.color}1F`}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 13,
                        fontWeight: 700,
                        color: step.color,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </MobileCircle>
                  <MobileContent>
                    <MobileTitle>{step.title}</MobileTitle>
                    <MobileDesc>{step.desc}</MobileDesc>
                  </MobileContent>
                </MobileCard>
              </RevealOnScroll>
            ))}
          </MobilePipeline>
        </CrossfadeWrapper>
      </Inner>
    </Section>
  );
}
