/**
 * PillarsSection — "How It Works" 3-step visual explainer.
 * Monitor → Verify → Trade. Clean, Apple-like explanation flow.
 */

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 640px) {
    padding: 64px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

const SectionSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 560px;
  margin: 0 auto 64px;
  line-height: 1.6;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: flex-start;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr auto 1fr auto 1fr;
    gap: 0;
  }
`;

const Step = styled.div`
  text-align: center;
  padding: 0 16px;
`;

const StepNumber = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const StepIcon = styled.span`
  font-size: 24px;
`;

const StepTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const StepDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
`;

const Arrow = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: flex;
  }
`;

const CreditTypesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 48px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 64px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(4, 1fr);
    margin-top: 72px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CreditCard = styled.a`
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  text-decoration: none;
  transition: all 200ms;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.elevation.cardHover};
    transform: translateY(-2px);
  }
`;

const CreditIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const CreditName = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CreditDesc = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const CreditLink = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const STEPS = [
  {
    icon: '📡',
    bg: 'rgba(6, 182, 212, 0.1)',
    title: 'Monitor',
    desc: 'BlueSignal devices measure water quality continuously — pH, turbidity, dissolved oxygen, and nutrient levels in real time.',
  },
  {
    icon: '✓',
    bg: 'rgba(139, 92, 246, 0.1)',
    title: 'Verify',
    desc: 'Sensor data is validated against quality thresholds. Verified nutrient removals generate tradeable credits on-chain.',
  },
  {
    icon: '⇄',
    bg: 'rgba(0, 82, 204, 0.1)',
    title: 'Trade',
    desc: 'Buy and sell verified credits on the open marketplace. Every transaction is transparent, traceable, and blockchain-settled.',
  },
];

const CREDIT_TYPES = [
  {
    icon: 'N',
    bg: 'rgba(0, 82, 204, 0.1)',
    name: 'Nitrogen',
    desc: 'Removal credits for dissolved and total nitrogen in waterways.',
    href: '/marketplace?nutrientType=nitrogen',
  },
  {
    icon: 'P',
    bg: 'rgba(16, 185, 129, 0.1)',
    name: 'Phosphorus',
    desc: 'Credits for phosphorus reduction in lakes and watersheds.',
    href: '/marketplace?nutrientType=phosphorus',
  },
  {
    icon: '💧',
    bg: 'rgba(6, 182, 212, 0.1)',
    name: 'Stormwater',
    desc: 'Volume-based stormwater retention and treatment credits.',
    href: '/marketplace',
  },
  {
    icon: '🌡',
    bg: 'rgba(245, 158, 11, 0.1)',
    name: 'Thermal',
    desc: 'Temperature reduction credits for thermal discharge compliance.',
    href: '/marketplace',
  },
];

export function PillarsSection() {
  return (
    <Section id="how-it-works">
      <Inner>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>From Sensors to Settlements</SectionTitle>
        <SectionSub>
          Real-time environmental monitoring generates verified credits
          that trade on a transparent, blockchain-settled marketplace.
        </SectionSub>

        <StepsGrid>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              {i > 0 && <Arrow>→</Arrow>}
              <Step>
                <StepNumber $bg={step.bg}>
                  <StepIcon>{step.icon}</StepIcon>
                </StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDesc>{step.desc}</StepDesc>
              </Step>
            </React.Fragment>
          ))}
        </StepsGrid>

        <CreditTypesGrid>
          {CREDIT_TYPES.map((ct) => (
            <CreditCard key={ct.name} href={ct.href}>
              <CreditIcon $bg={ct.bg}>
                <span style={{ fontFamily: ct.icon.length === 1 && /[A-Z]/.test(ct.icon) ? "'JetBrains Mono', monospace" : 'inherit', fontWeight: 700, fontSize: ct.icon.length === 1 && /[A-Z]/.test(ct.icon) ? 16 : 18 }}>
                  {ct.icon}
                </span>
              </CreditIcon>
              <CreditName>{ct.name}</CreditName>
              <CreditDesc>{ct.desc}</CreditDesc>
              <CreditLink>Browse {ct.name} →</CreditLink>
            </CreditCard>
          ))}
        </CreditTypesGrid>
      </Inner>
    </Section>
  );
}
