/**
 * ForUtilitiesPage — dedicated page for utilities and municipalities.
 * Content: Nutrient credit offset strategy for NPDES compliance.
 */

import React, { useEffect } from 'react';
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

  @media (max-width: 640px) {
    padding: 64px 20px;
  }
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
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
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
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function ForUtilitiesPage() {
  useEffect(() => { document.title = 'For Utilities — WaterQuality.Trading'; }, []);
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb to="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Offset Nutrient Limits Without Capital Projects</HeroTitle>
          <HeroSub>
            Purchase verified water quality credits to meet discharge permit requirements
            at a fraction of the cost of plant upgrades.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>The Problem</SectionTitle>
          <SectionDesc>
            NPDES permits (National Pollutant Discharge Elimination System) are getting
            tighter. EPA nutrient criteria are dropping. Your treatment plant meets today's
            limits, but the next permit cycle will require further nitrogen and phosphorus
            reductions.
          </SectionDesc>
          <SectionDesc>
            A plant upgrade costs $10–50M and takes 3–5 years to design and
            build. You need compliance flexibility now.
          </SectionDesc>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>The Alternative</SectionTitle>
          <SectionDesc>
            Water quality credit trading lets you purchase verified nutrient reductions
            generated by upstream projects — agricultural BMPs (best management practices),
            stormwater retrofits, restored wetlands — and apply them against your permit
            obligations.
          </SectionDesc>
          <SectionDesc>
            This is legal under Clean Water Act trading frameworks and already
            operational in states like Virginia, Pennsylvania, and Connecticut.
          </SectionDesc>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>What WaterQuality.Trading Provides</SectionTitle>
          <SectionDesc>
            The platform connects you directly to verified credit generators with
            transparent pricing and defensible documentation.
          </SectionDesc>
          <Grid>
            <Card>
              <CardTitle>Access to Verified Credits</CardTitle>
              <CardDesc>
                Every credit on the platform is backed by continuous sensor data, not
                modeled estimates. You can inspect the originating project, the monitoring
                data, and the verification report before purchasing.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Defensible Documentation</CardTitle>
              <CardDesc>
                Each credit purchase generates a certificate of retirement with the credit
                ID, quantity, type, originating project, watershed, verification period,
                and the underlying dataset reference.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Cost Certainty</CardTitle>
              <CardDesc>
                Credit prices are transparent. You can see current listings and historical
                transaction prices to forecast your offset costs. Compare that against the
                NPV of a capital project and make a data-driven decision.
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Speed</CardTitle>
              <CardDesc>
                Credit purchases settle immediately on the platform. No 18-month
                procurement cycle. No construction risk. Buy the credits you need for this
                permit cycle while you plan long-term infrastructure investments.
              </CardDesc>
            </Card>
          </Grid>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>Who This Works For</SectionTitle>
          <BulletList>
            <BulletItem>Municipal wastewater utilities approaching nutrient cap limits</BulletItem>
            <BulletItem>Combined sewer overflow (CSO) communities needing interim offsets</BulletItem>
            <BulletItem>MS4 permit holders with numeric stormwater quality targets</BulletItem>
            <BulletItem>Industrial dischargers with NPDES nutrient limits</BulletItem>
          </BulletList>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to explore credit options?</CTATitle>
        <CTADesc>
          Browse verified credits in your watershed or contact us to discuss your compliance strategy.
        </CTADesc>
        <CTAButtons>
          <CTAButton to="/registry">View Available Credits</CTAButton>
          <CTAButtonOutline to="/contact">Contact Us</CTAButtonOutline>
        </CTAButtons>
      </CTASection>
    </Page>
  );
}
