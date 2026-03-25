/**
 * HowItWorksSection — three feature columns + terminal-style program config.
 * Sensor-Verified. Utility-Controlled. Fully Automated.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import RevealOnScroll from './RevealOnScroll';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Section = styled.section`
  padding: 48px clamp(16px, 5vw, 48px);
  background: #0B1120;

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
  color: #FFFFFF;
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
  max-width: 580px;
  margin: 0 auto 56px;
  line-height: 1.7;
  text-wrap: pretty;
`;

/* ── Feature columns ───────────────────────────────────── */

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 56px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 200ms;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 40px 32px;
  }
`;

const FeatureIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 10px;
`;

const FeatureDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  margin: 0;
`;

/* ── Terminal code viewer ──────────────────────────────── */

const Terminal = styled.div`
  background: #0D1117;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45),
              0 0 0 1px rgba(255, 255, 255, 0.03);
`;

const TermBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #161B22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DotsGroup = styled.div`
  display: flex;
  gap: 7px;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $c }) => $c};

  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
  }
`;

const TabLabel = styled.span`
  margin-left: 14px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 11px;
    margin-left: 10px;
    padding: 3px 8px;
  }
`;

const CodeScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const CodeTable = styled.div`
  display: table;
  min-width: min(100%, 480px);
  width: 100%;
  padding: 16px 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11px, 1.05vw, 14px);
  line-height: 1.75;
`;

const Row = styled.div`
  display: table-row;
`;

const Gutter = styled.span`
  display: table-cell;
  width: 40px;
  padding: 0 12px 0 16px;
  text-align: right;
  user-select: none;
  color: rgba(139, 148, 158, 0.35);
  font-size: 0.85em;
  vertical-align: top;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
`;

const Code = styled.span`
  display: table-cell;
  padding: 0 16px;
  white-space: pre;
`;

const Comment = styled.span`color: #6A737D;`;
const Key = styled.span`color: #79C0FF;`;
const Str = styled.span`color: #A5D6FF;`;
const Val = styled.span`color: #7EE787;`;
const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background: rgba(255, 255, 255, 0.6);
  vertical-align: text-bottom;
  animation: ${blink} 1.1s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
`;

const CrossfadeWrapper = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 200ms ease-in-out;
`;

const TrustLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
  margin: 32px 0 0;
  padding: 0 16px;
`;

/* ── Data ──────────────────────────────────────────────── */

const FEATURES = [
  {
    bg: 'rgba(6, 182, 212, 0.12)',
    color: '#06B6D4',
    title: 'Always-On Verification',
    desc: 'The WQM-1 sensor paired with your AWG reads water quality around the clock. Every reading is timestamped, encrypted, and stored.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    bg: 'rgba(0, 82, 204, 0.12)',
    color: '#0052CC',
    title: 'Two Ways to Earn',
    desc: 'Quantity Credits for every gallon your AWG produces. Quality Credits when your water exceeds purity thresholds. Both stack.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0052CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    bg: 'rgba(16, 185, 129, 0.12)',
    color: '#10B981',
    title: 'Your Utility Sets the Rate',
    desc: 'Rebate rates are set by your water utility — transparent, configurable, and backed by real economics. Not crypto. Not tokens.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

const CODE_LINES = [
  { content: <Comment># program_config.yaml</Comment> },
  { content: <><Key>program</Key>:</> },
  { content: <>&nbsp;&nbsp;<Key>name</Key>: <Str>"Metro Water District DR"</Str></> },
  { content: <>&nbsp;&nbsp;<Key>type</Key>: <Str>"demand_response"</Str></> },
  { content: <>&nbsp;&nbsp;<Key>status</Key>: <Val>active</Val></> },
  { content: <></> },
  { content: <><Key>source</Key>:</> },
  { content: <>&nbsp;&nbsp;<Key>device</Key>: <Str>"AWG + BlueSignal WQM-1"</Str></> },
  { content: <>&nbsp;&nbsp;<Key>output</Key>: <Str>"potable water"</Str> <Comment># sensor-verified</Comment></> },
  { content: <></> },
  { content: <><Key>credits</Key>:</> },
  { content: <>&nbsp;&nbsp;<Key>quantity_rate</Key>: <Val>0.50</Val> <Comment># $/gallon conserved</Comment></> },
  { content: <>&nbsp;&nbsp;<Key>quality_multiplier</Key>: <Val>1.25</Val> <Comment># N/P offset bonus</Comment></> },
  { content: <>&nbsp;&nbsp;<Key>verification</Key>: <Str>"three_layer"</Str></> },
  { content: <></> },
  { content: <><Key>settlement</Key>:</> },
  { content: <>&nbsp;&nbsp;<Key>method</Key>: <Str>"utility_bill_credit"</Str></> },
  { content: <>&nbsp;&nbsp;<Key>frequency</Key>: <Str>"monthly"</Str></> },
  { content: <>&nbsp;&nbsp;<Key>auto_generate</Key>: <Val>true</Val><Cursor /></> },
];

function GenericIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function HowItWorksSection({ audience, content, trust }) {
  // Use audience-specific value props when provided, otherwise default features
  const features = content || FEATURES;
  const isAudienceContent = !!content;

  // Crossfade
  const [visible, setVisible] = useState(true);
  const [displayFeatures, setDisplayFeatures] = useState(features);
  const [displayTrust, setDisplayTrust] = useState(trust);

  useEffect(() => {
    if (features === displayFeatures && trust === displayTrust) return;
    setVisible(false);
    const timer = setTimeout(() => {
      setDisplayFeatures(features);
      setDisplayTrust(trust);
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [features, trust, displayFeatures, displayTrust]);

  return (
    <Section id="how-it-works">
      <Inner>
        <RevealOnScroll>
          <SectionLabel>Under the Hood</SectionLabel>
          <SectionTitle>Real Sensors. Real Credits. Real Money.</SectionTitle>
          <SectionSub>
            No guesswork. No tokens. No speculation. Every credit comes from a real sensor
            reading — and every rebate hits your real water bill.
          </SectionSub>
        </RevealOnScroll>

        <CrossfadeWrapper $visible={visible}>
          <FeaturesGrid>
            {displayFeatures.map((f, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <FeatureCard>
                  <FeatureIcon $bg={f.bg || `${f.color}1F`}>
                    {f.icon || <GenericIcon color={f.color} />}
                  </FeatureIcon>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureDesc>{f.desc}</FeatureDesc>
                </FeatureCard>
              </RevealOnScroll>
            ))}
          </FeaturesGrid>

          {displayTrust && (
            <RevealOnScroll delay={0.15}>
              <TrustLine>{displayTrust}</TrustLine>
            </RevealOnScroll>
          )}
        </CrossfadeWrapper>

        <RevealOnScroll delay={0.2}>
          <Terminal>
            <TermBar>
              <DotsGroup>
                <Dot $c="#ff5f57" />
                <Dot $c="#febc2e" />
                <Dot $c="#28c840" />
              </DotsGroup>
              <TabLabel>program_config.yaml</TabLabel>
            </TermBar>
            <CodeScroll>
              <CodeTable>
                {CODE_LINES.map((line, i) => (
                  <Row key={i}>
                    <Gutter>{i + 1}</Gutter>
                    <Code>{line.content}</Code>
                  </Row>
                ))}
              </CodeTable>
            </CodeScroll>
          </Terminal>
        </RevealOnScroll>
      </Inner>
    </Section>
  );
}
