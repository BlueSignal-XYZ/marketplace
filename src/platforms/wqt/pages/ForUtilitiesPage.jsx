/**
 * ForUtilitiesPage — dedicated page for utilities and municipalities.
 * Covers treatment cost reduction, pricing control, settlement, and VPP.
 */

import React from 'react';
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

const Breadcrumb = styled.a`
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
  padding: 80px 24px;
  background: ${({ $alt, theme }) => $alt ? theme.colors.surface : theme.colors.background};

  @media (max-width: 640px) {
    padding: 56px 20px;
  }
`;

const SectionInner = styled.div`
  max-width: 900px;
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
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 32px;
  max-width: 700px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const Card = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const CardAlt = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
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
  letter-spacing: -0.02em;
`;

const CTADesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 auto 32px;
  max-width: 520px;
`;

const CTAButton = styled.a`
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
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
`;

export default function ForUtilitiesPage() {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb href="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Reduce Treatment Costs Through Distributed Water Production</HeroTitle>
          <HeroSub>
            The water quality trading system enables utilities to compensate distributed
            water producers while reducing downstream treatment costs. You control the
            pricing, set the rates, and integrate through existing billing infrastructure.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>How the System Reduces Treatment Costs</SectionTitle>
          <SectionDesc>
            Every gallon produced by an atmospheric water generator at a home or
            business is a gallon that doesn't need to be treated and distributed
            by your utility. Quality credits also reflect nutrient removal value that
            ties directly to your per-kilogram N/P treatment costs.
          </SectionDesc>
          <Grid>
            <Card>
              <CardTitle>Quantity Value</CardTitle>
              <CardDesc>
                Each gallon produced offsets demand on your treatment and distribution
                infrastructure. The buyback rate you set reflects this value to your
                system planning.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Quality Value</CardTitle>
              <CardDesc>
                Nitrogen and phosphorus offset or removed by distributed water systems
                directly reduces your downstream nutrient load. Credits are measured in
                the same units your operations teams use: cost per kilogram of N/P removal.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Infrastructure Deferral</CardTitle>
              <CardDesc>
                Distributed water production reduces peak demand and defers capital
                expenditure on treatment facility expansion. This value compounds as
                adoption scales in your service area.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Regulatory Alignment</CardTitle>
              <CardDesc>
                Water quality trading programs operate within the framework of the
                Clean Water Act and NPDES permit structures. The system is designed
                to align with existing state-level regulatory programs.
              </CardDesc>
            </Card>
          </Grid>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>You Control the Pricing</SectionTitle>
          <SectionDesc>
            Pricing is controlled entirely by your utility. BlueSignal provides
            recommendations based on regional N/P treatment costs, but all
            final rate decisions are yours.
          </SectionDesc>
          <Grid>
            <CardAlt>
              <CardTitle>Quantity Buyback Rate</CardTitle>
              <CardDesc>
                Set at quarter-rate (0.25:1), half-rate (0.5:1), or full parity (1:1)
                relative to your retail water price. The rate reflects your assessment
                of distributed generation value.
              </CardDesc>
            </CardAlt>
            <CardAlt>
              <CardTitle>Quality Multiplier</CardTitle>
              <CardDesc>
                Set based on your environmental impact assessment for your service area.
                A higher multiplier rewards cleaner production, reflecting your actual
                downstream treatment cost savings.
              </CardDesc>
            </CardAlt>
          </Grid>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>Settlement Flow</SectionTitle>
          <SectionDesc>
            The rebate mechanism integrates with your existing billing infrastructure.
            No platform migration, no system overhaul, no IT project required.
          </SectionDesc>
          <FlowList>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Credits Generated</FlowTitle>
                <FlowDesc>
                  Water generators produce water. BlueSignal devices verify quality.
                  Credits are calculated from verified data.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Rebate Issued</FlowTitle>
                <FlowDesc>
                  The system issues a rebate check to the utility based on aggregate
                  verified credit production across all participating homeowners.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Homeowner Accounts Credited</FlowTitle>
                <FlowDesc>
                  Your utility credits homeowner accounts proportionally. You may pass
                  the full value or retain a portion as an administrative fee per your
                  agreement structure.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
          </FlowList>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>Future: Water Virtual Power Plant</SectionTitle>
          <SectionDesc>
            A future phase enables homeowners to pump locally generated water back
            into treatment facilities or municipal water tanks. This creates a
            secondary revenue stream and transforms distributed production from a
            cost offset into a grid-level resource for your utility.
          </SectionDesc>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to Evaluate the System?</CTATitle>
        <CTADesc>
          Contact us to discuss rate structures, integration requirements,
          and pilot program design for your service area.
        </CTADesc>
        <CTAButton href="/contact">Contact Us</CTAButton>
      </CTASection>
    </Page>
  );
}
