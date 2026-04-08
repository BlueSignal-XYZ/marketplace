/**
 * ForCreditGeneratorsPage — Getting started guide for credit generation.
 * URL: /generate-credits
 *
 * Explains the complete on-ramp from monitoring device to tradeable credits.
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
  max-width: 660px;
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
  margin: 0 0 20px;
  letter-spacing: -0.02em;
`;

const Prose = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.75;
  max-width: 680px;
  p {
    margin: 0 0 24px;
  }
  p:last-child {
    margin-bottom: 0;
  }
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
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

const Card = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-bottom: 16px;
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

const Callout = styled.div`
  padding: 32px;
  background: rgba(0, 82, 204, 0.04);
  border: 1px solid rgba(0, 82, 204, 0.12);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  margin-top: 24px;
`;

const CodeBlock = styled.pre`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  line-height: 1.6;
  margin: 24px 0;

  @media (max-width: 640px) {
    font-size: 12px;
    padding: 16px;
  }
`;

const FAQItem = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const FAQAnswer = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
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
  margin: 0 0 32px;
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
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export default function ForCreditGeneratorsPage() {
  useEffect(() => {
    document.title = 'Generate Credits — WaterQuality.Trading';
  }, []);
  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb to="/">&larr; Back to Overview</Breadcrumb>
          <HeroTitle>For Credit Generators</HeroTitle>
          <HeroSub>
            How to go from &quot;I have a monitoring device&quot; to &quot;I&apos;m generating
            tradeable water quality credits.&quot; The complete on-ramp.
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* What You Need */}
      <Section>
        <SectionInner>
          <SectionTitle>What You Need</SectionTitle>
          <Prose>
            <p>
              <strong>A BlueSignal WQM-1</strong> (or compatible continuous monitoring device)
              deployed at your site with calibrated probes for pH, TDS, turbidity, and ORP.
            </p>
            <p>
              <strong>A site with measurable water quality improvement</strong> — a rain garden,
              bioretention system, advanced septic, stormwater retrofit, or any installation that
              reduces nutrient runoff or improves water quality beyond your baseline.
            </p>
            <p>
              <strong>A WaterQuality.Trading account</strong> linked to your BlueSignal Cloud
              account for data sharing and credit issuance.
            </p>
          </Prose>
        </SectionInner>
      </Section>

      {/* Step by Step */}
      <Section $alt>
        <SectionInner>
          <SectionTitle>Step by Step</SectionTitle>
          <FlowList>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Install & Commission Your Device</FlowTitle>
                <FlowDesc>
                  Deploy the WQM-1 at your discharge point. Commission it via the BlueSignal mobile
                  app — scan, claim, assign to a site.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Enable Revenue Grade</FlowTitle>
                <FlowDesc>
                  In BlueSignal Cloud, navigate to your device settings and tap &quot;Enable Revenue
                  Grade.&quot; This starts the guided setup process.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Calibrate Probes</FlowTitle>
                <FlowDesc>
                  Document your probe calibration against known standards. The system tracks
                  calibration dates and alerts you when recalibration is due (every 90 days).
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Establish Baseline</FlowTitle>
                <FlowDesc>
                  Choose a baseline type: monitoring period (30-90 days of data collection),
                  regulatory (your NPDES permit limits), or historical (pre-project data).
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Link Accounts</FlowTitle>
                <FlowDesc>
                  Connect your BlueSignal Cloud account to WaterQuality.Trading. This authorizes
                  verified sensor data sharing for credit verification.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Register Credit Project</FlowTitle>
                <FlowDesc>
                  Define your project: site, watershed, improvement method, eligible credit types.
                  The system maps your GPS coordinates to a HUC-12 watershed automatically.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
            <FlowItem>
              <FlowContent>
                <FlowTitle>Credits Start Accruing</FlowTitle>
                <FlowDesc>
                  Once your baseline completes, credits accrue automatically based on measured
                  improvement vs. baseline. Submit for verification when ready to trade.
                </FlowDesc>
              </FlowContent>
            </FlowItem>
          </FlowList>
        </SectionInner>
      </Section>

      {/* Calibration Requirements */}
      <Section>
        <SectionInner>
          <SectionTitle>Calibration Requirements</SectionTitle>
          <Prose>
            <p>
              Revenue-grade data requires documented calibration against traceable standards. All
              probes must be recalibrated every 90 days. If calibration lapses, credit generation
              pauses until recalibration is completed.
            </p>
          </Prose>
          <Card>
            <CardTitle>pH Probe</CardTitle>
            <CardDesc>
              Three-point calibration: pH 4.0, pH 7.0, and pH 10.0 buffer solutions. The system
              records the calibration offset and slope correction.
            </CardDesc>
          </Card>
          <Card>
            <CardTitle>TDS Probe</CardTitle>
            <CardDesc>
              Calibrate against a known conductivity standard (500 ppm or 1000 ppm solution). The
              scale factor is recorded and applied to all subsequent readings.
            </CardDesc>
          </Card>
          <Card>
            <CardTitle>Turbidity Probe</CardTitle>
            <CardDesc>
              Two-point calibration: 0 NTU (deionized water) and a formazin standard (typically 100
              NTU). Establishes the sensor&apos;s response curve.
            </CardDesc>
          </Card>
          <Card>
            <CardTitle>ORP Probe</CardTitle>
            <CardDesc>
              Calibrate with quinhydrone solution at pH 4 (+220mV) or pH 7 (+86mV), or a commercial
              ORP standard solution. Records the voltage offset.
            </CardDesc>
          </Card>
        </SectionInner>
      </Section>

      {/* Baseline Options */}
      <Section $alt>
        <SectionInner>
          <SectionTitle>Baseline Options</SectionTitle>
          <Card>
            <CardTitle>Monitoring Baseline (30-90 days)</CardTitle>
            <CardDesc>
              Your device collects data for a defined period before credit generation begins. The
              system computes statistical baselines (mean, standard deviation) from this period.
              Recommended for new installations where no prior data exists.
            </CardDesc>
          </Card>
          <Card>
            <CardTitle>Regulatory Baseline</CardTitle>
            <CardDesc>
              Use your facility&apos;s NPDES (National Pollutant Discharge Elimination System)
              permit limits as the baseline. Credits equal the improvement beyond your permitted
              discharge. Available immediately — no waiting period.
            </CardDesc>
          </Card>
          <Card>
            <CardTitle>Historical Baseline</CardTitle>
            <CardDesc>
              Upload pre-project measurement data (CSV) from before your improvement was installed.
              The system validates the data and computes statistical baselines. Credits begin
              accruing immediately after validation.
            </CardDesc>
          </Card>
        </SectionInner>
      </Section>

      {/* How Credits Are Calculated */}
      <Section>
        <SectionInner>
          <SectionTitle>How Credits Are Calculated</SectionTitle>
          <Prose>
            <p>Credits are calculated daily using this formula:</p>
          </Prose>
          <CodeBlock>{`credit_amount (lbs) = (baseline_mg_L - measured_mg_L) × flow_m3 × 0.002205

Where:
  baseline_mg_L  = established baseline concentration (e.g., 5.0 mg/L TN)
  measured_mg_L  = average measured value from device (e.g., 2.0 mg/L TN)
  flow_m3        = discharge volume in cubic meters per day
  0.002205       = conversion factor (mg/L × m³ → lbs)`}</CodeBlock>

          <Callout>
            <CardTitle>Worked Example</CardTitle>
            <CardDesc>
              A homeowner with a 5-acre property in a Chesapeake Bay watershed has a bioretention
              system. Regulatory baseline: 5.0 mg/L total phosphorus. Average measured discharge:
              2.0 mg/L. Estimated flow: 10 m³/day.
            </CardDesc>
            <CodeBlock>{`Daily credit = (5.0 - 2.0) × 10 × 0.002205
             = 3.0 × 10 × 0.002205
             = 0.066 lbs/day

Annual credit = 0.066 × 365 = ~24 lbs phosphorus/year`}</CodeBlock>
          </Callout>
        </SectionInner>
      </Section>

      {/* Verification */}
      <Section $alt>
        <SectionInner>
          <SectionTitle>Verification</SectionTitle>
          <Prose>
            <p>When you submit credits for verification, the system runs automated checks:</p>
            <p>
              <strong>Data continuity:</strong> Were readings received at ≥95% of expected
              intervals? Gaps reduce confidence in the measured improvement.
            </p>
            <p>
              <strong>Calibration records:</strong> Were all probes within their 90-day calibration
              window during the accrual period?
            </p>
            <p>
              <strong>Statistical significance:</strong> Is the improvement beyond the baseline
              statistically significant (p &lt; 0.05), or within measurement noise?
            </p>
            <p>
              <strong>Baseline integrity:</strong> Has the baseline remained unchanged since project
              registration? Baselines are locked after the first credit calculation.
            </p>
            <p>
              Submissions that pass all automated checks are queued for manual review (target: 5
              business days). Verified credits become tradeable on the marketplace.
            </p>
          </Prose>
        </SectionInner>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionInner>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FAQItem>
            <FAQQuestion>Can I trade credits from multiple sites?</FAQQuestion>
            <FAQAnswer>
              Yes. Register each site as a separate credit project. Credits accrue independently per
              site and can be listed individually or bundled.
            </FAQAnswer>
          </FAQItem>
          <FAQItem>
            <FAQQuestion>What if my calibration lapses?</FAQQuestion>
            <FAQAnswer>
              Credit generation pauses automatically. Data continues to be collected and stored, but
              readings during the lapsed period are flagged as &quot;uncalibrated&quot; and excluded
              from credit calculations. Recalibrate to resume.
            </FAQAnswer>
          </FAQItem>
          <FAQItem>
            <FAQQuestion>How long until I see my first credits?</FAQQuestion>
            <FAQAnswer>
              With a regulatory or historical baseline, credits can begin accruing immediately after
              setup. With a monitoring baseline, expect 30-90 days of data collection before credits
              start. First verification review adds approximately 5 business days.
            </FAQAnswer>
          </FAQItem>
          <FAQItem>
            <FAQQuestion>What if I don&apos;t have a flow meter?</FAQQuestion>
            <FAQAnswer>
              The first version supports manual flow estimates based on pump rates, engineering
              calculations, or site drainage area. Enter your estimate in the project settings.
              Future hardware revisions may add flow sensor support to the WQM-1&apos;s I2C
              expansion port.
            </FAQAnswer>
          </FAQItem>
          <FAQItem>
            <FAQQuestion>What monitoring devices are compatible?</FAQQuestion>
            <FAQAnswer>
              The BlueSignal WQM-1 is the primary supported device. It provides continuous,
              calibrated sensor data with GPS, LoRaWAN connectivity, and tamper-evident data
              integrity. Contact us about integrating other monitoring platforms.
            </FAQAnswer>
          </FAQItem>
        </SectionInner>
      </Section>

      <CTASection>
        <CTATitle>Ready to start generating credits?</CTATitle>
        <CTAButtons>
          <CTAButton to="/login">Create Your Account</CTAButton>
          <CTAButtonOutline href="https://bluesignal.xyz" target="_blank" rel="noopener noreferrer">
            Get a BlueSignal WQM-1
          </CTAButtonOutline>
        </CTAButtons>
      </CTASection>
    </Page>
  );
}
