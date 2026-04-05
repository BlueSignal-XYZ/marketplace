/**
 * ForAggregatorsPage — dedicated page for aggregators and portfolio managers.
 * Content: Bundle projects, generate credits, access institutional buyers.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 80px 24px 64px;
  background: #0b1120;
  color: #ffffff;
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
  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #ffffff;
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
  background: ${({ $alt, theme }) => ($alt ? theme.colors.surface : theme.colors.background)};
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
  background: linear-gradient(135deg, #0b1120 0%, #0f1b35 100%);
  text-align: center;
`;

const CTATitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 700;
  color: #ffffff;
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
  color: #ffffff;
  background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
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

export default function ForAggregatorsPage() {
  useEffect(() => {
    document.title = 'For Aggregators — WaterQuality.Trading';
  }, []);
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb to="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Bundle Projects. Generate Credits. Access Buyers.</HeroTitle>
          <HeroSub>
            Aggregate water quality improvement projects across your portfolio and monetize verified
            outcomes on the WaterQuality.Trading marketplace.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>The Opportunity</SectionTitle>
          <SectionDesc>
            You manage multiple sites — farms implementing nutrient management plans, stormwater
            retrofits across a municipality, BMP (best management practice) installations for a land
            conservancy. Each site generates measurable water quality improvements, but individually
            they&apos;re too small to attract buyers.
          </SectionDesc>
          <SectionDesc>Aggregated, they&apos;re a portfolio.</SectionDesc>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>How Aggregation Works on WQT</SectionTitle>
          <FlowList>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Register Your Portfolio</FlowTitle>
                <FlowDesc>
                  Create a project for each site. Upload site locations, baseline data, and
                  installed BMPs or treatment systems.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Deploy Monitoring</FlowTitle>
                <FlowDesc>
                  Install continuous monitoring at each site. The platform ingests timestamped water
                  quality data and associates it with each project.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Submit for Batch Verification</FlowTitle>
                <FlowDesc>
                  Submit your entire portfolio for verification in a single batch. The verification
                  workflow reviews each project against its baseline and flags any that need
                  additional data.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>List Bundled Credits</FlowTitle>
                <FlowDesc>
                  Once verified, credits from all sites are issued and can be listed individually or
                  as bundled packages. Utilities and buyers prefer larger blocks — bundling gives
                  you pricing leverage.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
          </FlowList>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>Your Economics</SectionTitle>
          <SectionDesc>
            You invest in monitoring equipment and project installation. The platform handles
            measurement, verification, issuance, and marketplace access. Your revenue comes from
            credit sales minus the platform&apos;s transaction fee. The more sites you aggregate,
            the lower your per-credit cost and the more attractive your listings are to
            institutional buyers.
          </SectionDesc>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>Who This Works For</SectionTitle>
          <BulletList>
            <BulletItem>Environmental consulting firms managing BMP portfolios</BulletItem>
            <BulletItem>Agricultural cooperatives with nutrient management programs</BulletItem>
            <BulletItem>
              Stormwater authorities implementing green infrastructure across a jurisdiction
            </BulletItem>
            <BulletItem>
              Land trusts and conservation districts with restoration projects
            </BulletItem>
            <BulletItem>Water technology companies deploying treatment systems at scale</BulletItem>
          </BulletList>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to aggregate your portfolio?</CTATitle>
        <CTADesc>
          Register as an aggregator to start bundling projects and accessing institutional buyers.
        </CTADesc>
        <CTAButtons>
          <CTAButton to="/login">Register as an Aggregator</CTAButton>
          <CTAButtonOutline to="/registry">View Current Market Prices</CTAButtonOutline>
        </CTAButtons>
      </CTASection>
    </Page>
  );
}
