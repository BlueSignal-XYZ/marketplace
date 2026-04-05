/**
 * ForHomeownersPage — dedicated page for homeowners.
 * Content: Property-level credit generation from water quality improvements.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 80px 24px 64px;
  background: #0B1120;
  color: #FFFFFF;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 120px 24px 96px;
  }
`;

const HeroInner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Breadcrumb = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  margin-bottom: 24px;
  display: inline-block;
  &:hover { color: rgba(255, 255, 255, 0.6); }
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0 0 20px;
`;

const HeroSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 620px;
  margin: 0;
`;

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ $alt, theme }) => $alt ? theme.colors.surface : theme.colors.background};
  @media (max-width: 640px) { padding: 64px 20px; }
`;

const SectionInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
  letter-spacing: -0.02em;
`;

const SectionDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  margin: 0 0 36px;
  max-width: 680px;
`;

const FlowList = styled.ol`
  list-style: none;
  counter-reset: flow;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FlowItem = styled.li`
  counter-increment: flow;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 16px;
  align-items: start;
  &::before {
    content: counter(flow, decimal-leading-zero);
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 82, 204, 0.08);
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    &::before {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }
  }
`;

const FlowContent = styled.div``;

const FlowTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const FlowDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Callout = styled.div`
  padding: 32px;
  background: rgba(0, 82, 204, 0.04);
  border: 1px solid rgba(0, 82, 204, 0.12);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-top: 8px;
`;

const CalloutTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
`;

const CalloutDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;

  & + & {
    margin-top: 12px;
  }
`;

const BulletList = styled.ul`
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BulletItem = styled.li`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #0B1120 0%, #0F1B35 100%);
  text-align: center;
`;

const CTATitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 16px;
`;

const CTADesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 auto 32px;
  max-width: 520px;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #0052CC 0%, #0066FF 100%);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4); }
`;

const CTAButtonOutline = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  &:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.3); }
`;

export default function ForHomeownersPage() {
  useEffect(() => { document.title = 'For Homeowners — WaterQuality.Trading'; }, []);
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb to="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Your Property Generates Water Quality Credits</HeroTitle>
          <HeroSub>
            If you manage stormwater, treat well water, or maintain a rainwater system,
            the improvements you make can be measured, verified, and sold.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>You're Already Doing the Work</SectionTitle>
          <SectionDesc>
            You installed a rain garden. You maintain a septic system that outperforms
            county minimums. You run a residential water treatment system. You've invested
            in your property's water quality — but until now, there's been no way to
            capture the value of that investment beyond your own property line.
          </SectionDesc>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>How It Works for You</SectionTitle>
          <FlowList>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Install a Monitor</FlowTitle>
                <FlowDesc>
                  A BlueSignal WQM-1 device at your discharge point or well head continuously
                  measures water quality — pH, nutrients, sediment, temperature. It runs on
                  solar or AC power and transmits data automatically.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Establish a Baseline</FlowTitle>
                <FlowDesc>
                  The platform compares your current water quality against a regulatory
                  baseline or your pre-improvement condition. The difference is your
                  credit-generating capacity.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Earn Credits</FlowTitle>
                <FlowDesc>
                  As your system continues to perform, verified credits accumulate in your
                  WaterQuality.Trading account. You can hold them, sell them on the
                  marketplace, or retire them as a personal environmental offset.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
          </FlowList>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>What This Looks Like in Practice</SectionTitle>
          <Callout>
            <CalloutTitle>Example: 5-Acre Chesapeake Bay Property</CalloutTitle>
            <CalloutDesc>
              A homeowner with a 5-acre property in a Chesapeake Bay watershed installs a
              bioretention system and a BlueSignal monitor. The system reduces phosphorus
              runoff by 12 lbs/year compared to the pre-project baseline.
            </CalloutDesc>
            <CalloutDesc>
              After a 6-month
              verification period, the platform issues 12 phosphorus credits. At current
              regional prices, those credits have market value — potentially enough to offset
              the cost of the monitoring equipment within 2–3 years.
            </CalloutDesc>
          </Callout>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>Who This Works For</SectionTitle>
          <BulletList>
            <BulletItem>Waterfront property owners (docks, ponds, lakefront)</BulletItem>
            <BulletItem>Rural well and spring water system operators</BulletItem>
            <BulletItem>Rainwater harvesting system owners</BulletItem>
            <BulletItem>Homeowners with rain gardens, bioswales, or constructed wetlands</BulletItem>
            <BulletItem>Residential septic system operators exceeding baseline performance</BulletItem>
          </BulletList>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to see if your property qualifies?</CTATitle>
        <CTADesc>
          Create an account to check eligibility, or learn about BlueSignal monitoring devices.
        </CTADesc>
        <CTAButtons>
          <CTAButton to="/login">See If Your Property Qualifies</CTAButton>
          <CTAButtonOutline href="https://bluesignal.xyz" target="_blank" rel="noopener noreferrer">
            Learn About BlueSignal Devices
          </CTAButtonOutline>
        </CTAButtons>
      </CTASection>
    </Page>
  );
}
