/**
 * ProblemSection — highlights the dual crisis utilities face:
 * water quantity (drought, infrastructure) and water quality (compliance, costs).
 */

import styled, { keyframes } from 'styled-components';
import RevealOnScroll from './RevealOnScroll';

const ripple = keyframes`
  0%   { transform: scale(1); opacity: 0.06; }
  50%  { transform: scale(1.15); opacity: 0.02; }
  100% { transform: scale(1); opacity: 0.06; }
`;

const Section = styled.section`
  padding: 48px clamp(16px, 5vw, 48px);
  background: #0B1120;
  color: #FFFFFF;

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
  max-width: 560px;
  margin: 0 auto 56px;
  line-height: 1.7;
  text-wrap: pretty;
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(12px);
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

const CardRipple = styled.div`
  position: absolute;
  top: -40%;
  right: -20%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${ripple} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  pointer-events: none;
  filter: blur(40px);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(20px, 2.5vw, 24px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  margin: 0 0 24px;
`;

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 22px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const StatLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const BridgeText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 48px auto 0;
  max-width: 480px;
  text-wrap: balance;
`;

const BridgeHighlight = styled.span`
  color: #06B6D4;
`;

export function ProblemSection() {
  return (
    <Section id="problem">
      <Inner>
        <RevealOnScroll>
          <SectionLabel>The Problem</SectionLabel>
          <SectionTitle>Municipal Water Is Getting Worse — and More Expensive</SectionTitle>
          <SectionSub>
            Aging pipes. Rising rates. Contaminants making headlines. Whether you're a
            homeowner tired of boil notices or a utility struggling with infrastructure —
            the system is overdue for an upgrade.
          </SectionSub>
        </RevealOnScroll>

        <CardsRow>
          <RevealOnScroll delay={0.1}>
            <Card>
              <CardRipple $color="rgba(6, 182, 212, 0.06)" $delay="0s" />
              <CardIcon $bg="rgba(6, 182, 212, 0.12)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                </svg>
              </CardIcon>
              <CardTitle>For Homeowners</CardTitle>
              <CardDesc>
                Rising water bills, drought restrictions, and aging pipes mean you're
                paying more for water you can't always trust. What if you could make
                your own — and get paid for it?
              </CardDesc>
              <StatRow>
                <Stat>
                  <StatValue $color="#06B6D4">$600B+</StatValue>
                  <StatLabel>Deferred Infrastructure</StatLabel>
                </Stat>
                <Stat>
                  <StatValue $color="#06B6D4">40%</StatValue>
                  <StatLabel>Of US Facing Shortage</StatLabel>
                </Stat>
              </StatRow>
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <Card>
              <CardRipple $color="rgba(16, 185, 129, 0.06)" $delay="3s" />
              <CardIcon $bg="rgba(16, 185, 129, 0.12)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </CardIcon>
              <CardTitle>For Utilities</CardTitle>
              <CardDesc>
                NPDES compliance costs are rising. Nutrient loading drives expensive
                treatment upgrades. Distributed water generation could offset demand
                and improve quality at a fraction of the cost.
              </CardDesc>
              <StatRow>
                <Stat>
                  <StatValue $color="#10B981">$3.50+</StatValue>
                  <StatLabel>Per kg N/P Removal</StatLabel>
                </Stat>
                <Stat>
                  <StatValue $color="#10B981">15,000+</StatValue>
                  <StatLabel>Utilities Under NPDES</StatLabel>
                </Stat>
              </StatRow>
            </Card>
          </RevealOnScroll>
        </CardsRow>

        <RevealOnScroll delay={0.3}>
          <BridgeText>
            What if one device could <BridgeHighlight>solve both sides</BridgeHighlight>?
          </BridgeText>
        </RevealOnScroll>
      </Inner>
    </Section>
  );
}
