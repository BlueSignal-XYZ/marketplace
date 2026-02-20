/**
 * ForHomeownersPage — dedicated page for homeowners.
 * Covers credit earning, verification transparency, and ROI.
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

const CreditPair = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const CreditCard = styled.div`
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  border-top: 3px solid ${({ $accent }) => $accent};
`;

const CreditLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
`;

const CreditName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const CreditUnit = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 12px;
`;

const CreditDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StepItem = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  align-items: start;
  &:last-child { border-bottom: none; }
`;

const StepNum = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const StepContent = styled.div``;

const StepTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const StepDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const HighlightCard = styled.div`
  padding: 28px 32px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-top: 24px;
`;

const HighlightTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 8px;
`;

const HighlightText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
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

export default function ForHomeownersPage() {
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb href="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>Earn Credits From Your Water Generator</HeroTitle>
          <HeroSub>
            Your atmospheric water generator produces water and earns you
            credits automatically. Two credit types, fully automated verification,
            and rebates credited directly to your monthly water bill.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Section>
        <SectionInner>
          <SectionTitle>How You Earn Credits</SectionTitle>
          <SectionDesc>
            Your water generator earns two types of credits at the same time. One
            for every gallon produced, and one for the environmental quality of
            that water. Both are verified automatically — you don't have to do anything.
          </SectionDesc>
          <CreditPair>
            <CreditCard $accent="#0052CC">
              <CreditLabel $color="#0052CC">Quantity Credit (QC)</CreditLabel>
              <CreditName>Per Gallon Produced</CreditName>
              <CreditUnit>1 QC = 1 gallon</CreditUnit>
              <CreditDesc>
                Every gallon your unit produces is metered by an inline flow
                sensor and confirmed against your property water meter. Two
                independent measurements for every gallon.
              </CreditDesc>
            </CreditCard>
            <CreditCard $accent="#10B981">
              <CreditLabel $color="#10B981">Quality Credit (KC)</CreditLabel>
              <CreditName>Per kg N/P Offset</CreditName>
              <CreditUnit>1 KC = 1 kg nitrogen or phosphorus</CreditUnit>
              <CreditDesc>
                The BlueSignal WQM-1 device on your unit continuously monitors
                water quality. Cleaner water earns more quality credits, which boost
                the value of your quantity credits.
              </CreditDesc>
            </CreditCard>
          </CreditPair>

          <HighlightCard>
            <HighlightTitle>Self-Correcting Incentive</HighlightTitle>
            <HighlightText>
              System maintenance directly impacts your earnings. When your filters are
              fresh and your system runs well, both credit types are maximized. If water
              quality drops, quality credits decline and reduce your overall credit value.
              The system rewards you for keeping your unit in good condition.
            </HighlightText>
          </HighlightCard>
        </SectionInner>
      </Section>

      <Section $alt>
        <SectionInner>
          <SectionTitle>What Verification Looks Like For You</SectionTitle>
          <SectionDesc>
            The short answer: you don't have to do anything. The system handles all
            verification automatically. Here's what happens behind the scenes.
          </SectionDesc>
          <StepsList>
            <StepItem>
              <StepNum $bg="rgba(0, 82, 204, 0.1)" $color="#0052CC">01</StepNum>
              <StepContent>
                <StepTitle>Automatic Metering</StepTitle>
                <StepDesc>
                  Your unit's inline flow sensor records every gallon produced.
                  This is cross-referenced with your property water meter automatically.
                </StepDesc>
              </StepContent>
            </StepItem>
            <StepItem>
              <StepNum $bg="rgba(16, 185, 129, 0.1)" $color="#10B981">02</StepNum>
              <StepContent>
                <StepTitle>Continuous Quality Monitoring</StepTitle>
                <StepDesc>
                  The BlueSignal WQM-1 device reads water quality signals 24/7 and
                  transmits data to the cloud. It also controls anti-fouling to keep
                  your system performing well.
                </StepDesc>
              </StepContent>
            </StepItem>
            <StepItem>
              <StepNum $bg="rgba(139, 92, 246, 0.1)" $color="#8B5CF6">03</StepNum>
              <StepContent>
                <StepTitle>Periodic Independent Sampling</StepTitle>
                <StepDesc>
                  An independent contractor may visit your property for a physical water
                  sample as part of the 25% annual site audit. This is a brief, non-invasive
                  calibration check.
                </StepDesc>
              </StepContent>
            </StepItem>
            <StepItem>
              <StepNum $bg="rgba(6, 182, 212, 0.1)" $color="#06B6D4">04</StepNum>
              <StepContent>
                <StepTitle>Rebate on Your Bill</StepTitle>
                <StepDesc>
                  Your utility issues a rebate directly to your account as a credit on
                  your regular water bill. The more your system produces, the more you earn.
                </StepDesc>
              </StepContent>
            </StepItem>
          </StepsList>
        </SectionInner>
      </Section>

      <Section>
        <SectionInner>
          <SectionTitle>Your ROI</SectionTitle>
          <SectionDesc>
            Your return depends on two factors: how much water your unit produces,
            and the rates your utility has set. A calculator tool is available
            to project your expected earnings based on your utility's specific rates.
          </SectionDesc>
          <Grid>
            <Card>
              <CardTitle>Quantity Earnings</CardTitle>
              <CardDesc>
                Based on your unit's daily production (gallons) multiplied
                by your utility's buyback rate (quarter, half, or full parity
                relative to retail water price).
              </CardDesc>
            </Card>
            <Card>
              <CardTitle>Quality Premium</CardTitle>
              <CardDesc>
                Additional earnings from quality credits based on your water's N/P
                reduction performance. Cleaner water means a higher quality multiplier
                enhances your quantity credit value.
              </CardDesc>
            </Card>
          </Grid>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Start Earning From Your Water</CTATitle>
        <CTADesc>
          Check if your utility participates in the program or
          contact us to learn about availability in your area.
        </CTADesc>
        <CTAButton href="/contact">Get Started</CTAButton>
      </CTASection>
    </Page>
  );
}
