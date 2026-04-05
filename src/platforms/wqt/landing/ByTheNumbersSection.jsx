/**
 * ByTheNumbersSection — animated stat cards showcasing scale and reliability.
 * Count-up fade-in effect on scroll intersection.
 */

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import RevealOnScroll from './RevealOnScroll';

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
  margin: 0 0 56px;
  letter-spacing: -0.03em;
  text-wrap: balance;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    gap: 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const StatCard = styled.div`
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  text-align: center;
  transition: all 200ms;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 40px 32px;
  }
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${({ $color }) => $color};
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
`;

/* ── Animated counter hook ─────────────────────────────── */

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          observer.unobserve(el);

          if (prefersReducedMotion) {
            setValue(target);
            return;
          }

          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

/* ── Data ──────────────────────────────────────────────── */

const STATS = [
  {
    value: 24,
    suffix: '/7',
    color: '#06B6D4',
    label: 'Continuous sensor monitoring',
    countTarget: 24,
  },
  {
    value: 3,
    suffix: '-Layer',
    color: '#3B82F6',
    label: 'Independent verification',
    countTarget: 3,
  },
  {
    value: 90,
    prefix: '< ',
    suffix: ' Days',
    color: '#8B5CF6',
    label: 'Program launch timeline',
    countTarget: 90,
  },
  {
    value: 2,
    suffix: ' Credits',
    color: '#10B981',
    label: 'Quality + Quantity per device',
    countTarget: 2,
  },
];

function AnimatedStat({ stat, delay }) {
  const { ref, value } = useCountUp(stat.countTarget);

  return (
    <RevealOnScroll delay={delay}>
      <StatCard ref={ref}>
        <StatValue $color={stat.color}>
          {stat.prefix || ''}
          {value}
          {stat.suffix}
        </StatValue>
        <StatLabel>{stat.label}</StatLabel>
      </StatCard>
    </RevealOnScroll>
  );
}

export function ByTheNumbersSection() {
  return (
    <Section id="by-the-numbers">
      <Inner>
        <RevealOnScroll>
          <SectionLabel>Platform</SectionLabel>
          <SectionTitle>Built for Trust</SectionTitle>
        </RevealOnScroll>

        <StatsGrid>
          {STATS.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} delay={i * 0.08} />
          ))}
        </StatsGrid>
      </Inner>
    </Section>
  );
}
