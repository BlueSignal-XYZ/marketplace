/**
 * HowItWorksPage — single page replacing old Credit Definitions, Verification,
 * Pricing Mechanics, and Risk Framework sub-pages.
 *
 * URL: /how-it-works
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GlossaryTooltip } from '../components/GlossaryTooltip';

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
  max-width: 660px;
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
  margin: 0 0 20px;
  letter-spacing: -0.02em;
`;

const Prose = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  max-width: 680px;

  p { margin: 0 0 24px; }
  p:last-child { margin-bottom: 0; }
  strong { color: ${({ theme }) => theme.colors.text}; font-weight: 600; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 32px;
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

const CardAlt = styled(Card)`
  background: ${({ theme }) => theme.colors.background};
`;

/** 2-over-1 layout: two cards on first row, third spans full width below (or 2/3 centered) */
const DifferentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 32px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const DifferentCard = styled(CardAlt)`
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    &:nth-child(3) {
      grid-column: 1 / -1;
      max-width: 66%;
      margin-left: auto;
      margin-right: auto;
      justify-self: center;
    }
  }
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
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const FlowList = styled.ol`
  list-style: none;
  counter-reset: flow;
  padding: 0;
  margin: 32px 0 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FlowItem = styled.li`
  counter-increment: flow;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 16px;
  align-items: start;
  &::before {
    content: counter(flow);
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
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
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

const CTAButtonOutline = styled(Link)`
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

export default function HowItWorksPage() {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb to="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>How Water Quality Credits Work</HeroTitle>
          <HeroSub>
            Generate, verify, and trade environmental credits from real water quality
            improvements — measured by sensors, not spreadsheets.
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* Section 1: What Are Water Quality Credits? */}
      <Section>
        <SectionInner>
          <SectionTitle>What Are Water Quality Credits?</SectionTitle>
          <Prose>
            <p>
              Water quality credits represent verified, measurable improvements in water
              conditions. When a property owner, facility operator, or municipality reduces
              pollutant discharge or improves water quality beyond regulatory baselines,
              the difference can be quantified and issued as a tradeable credit.
            </p>
            <p>
              Each credit is tied to a specific geographic location, a verified measurement
              dataset, and a defined baseline — not estimates or models.
            </p>
          </Prose>

          <Grid>
            <Card>
              <CardTitle>Quantity Credits (QC)</CardTitle>
              <CardDesc>
                Issued when a project reduces the total volume of polluted discharge entering
                a waterway. Stormwater retention systems, rainwater harvesting, and green
                infrastructure that diverts runoff from impaired streams generate QCs. One QC
                represents one verified unit of volume reduction against an established baseline.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Quality Credits (KC)</CardTitle>
              <CardDesc>
                Issued when a project measurably improves the chemical or biological quality
                of a discharge or water body. Algae remediation, advanced filtration, and
                treatment system upgrades that reduce contaminant concentrations generate KCs.
                One KC represents one verified unit of quality improvement measured against
                baseline conditions.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Nitrogen Credits</CardTitle>
              <CardDesc>
                Issued specifically for reductions in total nitrogen (TN) loading. Agricultural
                best management practices, upgraded wastewater treatment, and riparian buffer
                installations that reduce nitrogen runoff generate these credits. Measured in
                pounds of nitrogen reduced per year.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Phosphorus Credits</CardTitle>
              <CardDesc>
                Issued specifically for reductions in total phosphorus (TP) loading. Nutrient
                management plans, stormwater retrofits, and point-source treatment upgrades
                that reduce phosphorus discharge generate these credits. Measured in pounds of
                phosphorus reduced per year.
              </CardDesc>
            </Card>
          </Grid>
        </SectionInner>
      </Section>

      {/* Section 2: How Credits Are Generated */}
      <Section $alt>
        <SectionInner>
          <SectionTitle>How Credits Are Generated</SectionTitle>
          <Prose>
            <p>The credit lifecycle has four stages:</p>
          </Prose>

          <FlowList>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Measurement</FlowTitle>
                <FlowDesc>
                  A monitoring device (such as the BlueSignal WQM-1) continuously measures
                  water quality parameters — pH, turbidity, dissolved solids, nutrient
                  concentrations, temperature — at the project site. Data is transmitted
                  automatically to the cloud and stored with GPS coordinates and timestamps.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Baseline Establishment</FlowTitle>
                <FlowDesc>
                  Before credits can be issued, a baseline must be established. This is the
                  "before" condition — either a regulatory discharge limit, a historical
                  average, or a pre-project measurement period. The baseline defines the
                  floor. Only improvements above this floor generate credits.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Verification</FlowTitle>
                <FlowDesc>
                  Sensor data is submitted to the WaterQuality.Trading verification portal.
                  Verification confirms that the improvement is real, sustained, and
                  attributable to the project — not seasonal variation or upstream changes.
                  Verification reviews sensor calibration records, data continuity, and
                  statistical significance.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Issuance</FlowTitle>
                <FlowDesc>
                  Once verified, credits are minted on the WaterQuality.Trading registry with
                  a unique credit ID, the originating site, the credit type, the quantity,
                  the verification period, and the supporting dataset. Credits are visible in
                  the registry and available for trading.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
          </FlowList>
        </SectionInner>
      </Section>

      {/* Section 3: How Trading Works */}
      <Section>
        <SectionInner>
          <SectionTitle>How Trading Works</SectionTitle>
          <Prose>
            <p>
              <GlossaryTooltip term="Nutrient trading" definition="A market mechanism where polluters can buy credits from projects that reduce pollution, instead of upgrading their own facilities. Lowers compliance costs while meeting water quality goals." source="EPA Water Quality Trading" /> works like this: credits listed on the <GlossaryTooltip term="credit registry" definition="A public ledger of verified water quality credits. Each credit has a unique ID, origin, verification status, and ownership history. Regulators and buyers use it to verify compliance." source="EPA, state DEQ programs" /> can be purchased by entities that need to
              offset their own water quality impacts — utilities facing <GlossaryTooltip term="nutrient limits" definition="Regulatory caps on nitrogen and phosphorus discharge. Facilities must stay under these limits or purchase credits to offset excess loading." source="EPA TMDL, NPDES permits" />,
              <GlossaryTooltip term="developers" definition="Land and real estate developers who must manage stormwater from new construction. Not software developers." source="MS4 permits, post-construction requirements" /> with <GlossaryTooltip term="stormwater obligations" definition="Requirements to manage runoff from developed sites. Often tied to MS4 permits and post-construction stormwater management plans." source="EPA MS4, state DEQ" />, or municipalities under consent
              decrees.
            </p>
            <p>
              <strong>Pricing</strong> is determined by supply and demand within each
              watershed or trading region. Credits in impaired watersheds with regulatory
              pressure command higher prices. The platform displays current listings,
              recent transaction prices, and regional context so both buyers and sellers
              can make informed decisions.
            </p>
            <p>
              <strong>Settlement</strong> occurs on-platform. When a buyer purchases
              credits, ownership transfers in the registry. The buyer receives a
              certificate of credit retirement that can be submitted to their regulatory
              authority as proof of offset.
            </p>
          </Prose>
        </SectionInner>
      </Section>

      {/* Section 4: What Makes This Different */}
      <Section $alt>
        <SectionInner>
          <SectionTitle>What Makes This Different</SectionTitle>
          <Prose>
            <p>
              Most water quality trading today happens through state-run programs with
              manual verification, paper-based registries, and limited participation.
              These programs work, but they're slow, opaque, and inaccessible to
              small-scale generators.
            </p>
          </Prose>

          <DifferentGrid>
            <DifferentCard>
              <CardTitle>Sensor-Verified, Not Self-Reported</CardTitle>
              <CardDesc>
                Credits are backed by continuous monitoring data from calibrated instruments,
                not annual reports or engineering estimates. The data exists, it's
                timestamped, and it's auditable.
              </CardDesc>
            </DifferentCard>
            <DifferentCard>
              <CardTitle>Open Registry</CardTitle>
              <CardDesc>
                Any qualified project can register. Any verified buyer can purchase. The
                registry is transparent — every credit's origin, verification status, and
                ownership history is visible.
              </CardDesc>
            </DifferentCard>
            <DifferentCard>
              <CardTitle>Technology-Native Infrastructure</CardTitle>
              <CardDesc>
                The platform handles measurement, verification, issuance, listing, and
                settlement in one system. No separate spreadsheets, no mailed forms, no
                phone calls to a state office.
              </CardDesc>
            </DifferentCard>
          </DifferentGrid>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to generate or purchase credits?</CTATitle>
        <CTAButtons>
          <CTAButton to="/login">Create an Account</CTAButton>
          <CTAButtonOutline to="/registry">View the Credit Registry</CTAButtonOutline>
        </CTAButtons>
      </CTASection>
    </Page>
  );
}
