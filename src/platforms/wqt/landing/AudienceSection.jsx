/**
 * AudienceSection — two-audience gateway: Utilities and Participants.
 * Focused on the Demand Response Program value proposition.
 */

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
  max-width: 900px;
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
  max-width: 560px;
  margin: 0 auto 56px;
  line-height: 1.7;
  text-wrap: pretty;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const AudienceCard = styled.a`
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  text-decoration: none;
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: ${({ $accent }) => $accent}33;
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 40px 32px;
  }
`;

const AudienceIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const AudienceTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(20px, 2.5vw, 24px);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
`;

const AudienceDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  margin: 0 0 24px;
  flex: 1;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.li`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $accent }) => $accent};
  }
`;

const CardLink = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 200ms;

  ${AudienceCard}:hover & {
    gap: 10px;
  }
`;

const AUDIENCES = [
  {
    href: '/for-homeowners',
    bg: 'rgba(16, 185, 129, 0.12)',
    accent: '#10B981',
    title: 'Homeowners & Facilities',
    desc: 'Install an AWG, pair it with a BlueSignal sensor, and start earning rebates on your water bill. Clean water from the air — verified and paid for, automatically.',
    features: [
      'Generate clean water from the air',
      'Sensor verifies every drop',
      'Rebates appear on your water bill',
      'Track earnings in real-time',
    ],
    iconPath:
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/for-utilities',
    bg: 'rgba(0, 82, 204, 0.12)',
    accent: '#3B82F6',
    title: 'Utilities & Municipalities',
    desc: 'Launch a turnkey program that pays residents to generate clean water locally — reducing demand on your infrastructure while improving water quality district-wide.',
    features: [
      'White-label our API and sensor network',
      'Set your own rebate rates and multipliers',
      'Automated credit generation and settlement',
      'No changes to your existing billing systems',
    ],
    iconPath:
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
];

export function AudienceSection() {
  return (
    <Section id="audiences">
      <Inner>
        <RevealOnScroll>
          <SectionLabel>Your Path</SectionLabel>
          <SectionTitle>Ready to Start Earning?</SectionTitle>
          <SectionSub>
            Whether you want to earn rebates at home or launch a program for your service area —
            here&apos;s where to start.
          </SectionSub>
        </RevealOnScroll>

        <CardsGrid>
          {AUDIENCES.map((a, i) => (
            <RevealOnScroll key={a.title} delay={i * 0.12}>
              <AudienceCard href={a.href} $accent={a.accent}>
                <AudienceIcon $bg={a.bg}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={a.accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={a.iconPath} />
                  </svg>
                </AudienceIcon>
                <AudienceTitle>{a.title}</AudienceTitle>
                <AudienceDesc>{a.desc}</AudienceDesc>
                <FeatureList>
                  {a.features.map((f) => (
                    <FeatureItem key={f} $accent={a.accent}>
                      {f}
                    </FeatureItem>
                  ))}
                </FeatureList>
                <CardLink $color={a.accent}>
                  Learn more <span aria-hidden>→</span>
                </CardLink>
              </AudienceCard>
            </RevealOnScroll>
          ))}
        </CardsGrid>
      </Inner>
    </Section>
  );
}
