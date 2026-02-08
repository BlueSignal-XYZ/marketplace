// SalesLandingHero - Landing section for sales.bluesignal.xyz
import React, { useState } from "react";
import styled from "styled-components";

const HeroWrapper = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
  color: #ffffff;
  padding: 60px 24px;
  margin: -24px -24px 24px -24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 40px 16px;
    margin: -16px -16px 16px -16px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroText = styled.div`
  h1 {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 16px;
    letter-spacing: -0.02em;

    span {
      background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p {
    font-size: 18px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 32px;
    max-width: 500px;

    @media (max-width: 900px) {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #0f172a;
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 222, 128, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    max-width: 400px;
    margin: 0 auto;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;

  .value {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 4px;
  }

  .label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);

  .icon {
    font-size: 16px;
  }
`;

// ROI Calculator Section
const ROISection = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  margin-top: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: #0f172a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ROITitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 24px;
  text-align: center;
  color: #0f172a;
`;

const ROIGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ROIInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ROIInput = styled.div`
  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.15s;

    &:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }
  }
`;

const ROIResults = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ROIMetric = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .value {
    font-size: 28px;
    font-weight: 800;
    color: #059669;
  }

  .subtext {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
`;

const MarketNote = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  .icon {
    flex-shrink: 0;
    font-size: 14px;
    margin-top: 1px;
  }

  p {
    font-size: 11px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

// DIY Section Styles
const DIYSection = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  padding: 32px;
  margin-top: 32px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  color: #ffffff;
  border: 1px solid rgba(74, 222, 128, 0.2);
`;

const DIYHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const DIYTitle = styled.div`
  h3 {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    max-width: 400px;
  }
`;

const DIYBadge = styled.div`
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #4ade80;
  white-space: nowrap;
`;

const DIYPathsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const DIYPathCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease-out;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(74, 222, 128, 0.3);
    transform: translateY(-2px);
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${({ $color }) => $color || 'rgba(74, 222, 128, 0.15)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 12px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 6px;
  }

  .description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .features {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .feature {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: "✓";
      color: #4ade80;
      font-size: 11px;
    }
  }
`;

const DIYResources = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`;

export default function SalesLandingHero({ onGetStarted, onWatchDemo }) {
  // ROI Calculator state
  const [waterVolume, setWaterVolume] = useState(50000);
  const [siteType, setSiteType] = useState("pond");
  const [currentCost, setCurrentCost] = useState(500);

  // Simple ROI calculations
  const estimatedCredits = Math.round(waterVolume * 0.02); // $0.02 per gallon/month estimate
  const annualCredits = estimatedCredits * 12;
  const systemCost = siteType === "pond" ? 1500 : siteType === "lake" ? 3000 : 5000;
  const paybackMonths = Math.round(systemCost / (estimatedCredits + currentCost * 0.3));
  const fiveYearValue = annualCredits * 5 + currentCost * 0.3 * 12 * 5;

  return (
    <HeroWrapper>
      <HeroContent>
        <HeroText>
          <h1>
            Turn Water Quality Into <span>Revenue</span>
          </h1>
          <p>
            BlueSignal monitoring devices transform your water quality data into
            tradeable credits. Professional-grade sensors, real-time monitoring,
            and seamless marketplace integration.
          </p>
          <HeroActions>
            <PrimaryButton onClick={onGetStarted}>
              Start Your Quote →
            </PrimaryButton>
            <SecondaryButton onClick={onWatchDemo}>
              Watch Demo
            </SecondaryButton>
          </HeroActions>
          <TrustBadges>
            <TrustBadge>
              <span className="icon">✓</span>
              EPA Compliant
            </TrustBadge>
            <TrustBadge>
              <span className="icon">✓</span>
              Registry Verified
            </TrustBadge>
            <TrustBadge>
              <span className="icon">✓</span>
              2-Year Warranty
            </TrustBadge>
          </TrustBadges>
        </HeroText>

        <StatsGrid>
          <StatCard>
            <div className="value">24/7</div>
            <div className="label">Real-Time Monitoring</div>
          </StatCard>
          <StatCard>
            <div className="value">LTE</div>
            <div className="label">Cloud Connected</div>
          </StatCard>
          <StatCard>
            <div className="value">DIY</div>
            <div className="label">Open Source</div>
          </StatCard>
        </StatsGrid>
      </HeroContent>

      <ROISection>
        <ROITitle>Estimate Your Potential ROI</ROITitle>
        <ROIGrid>
          <ROIInputs>
            <ROIInput>
              <label>Water Volume (gallons/day)</label>
              <input
                type="number"
                value={waterVolume}
                onChange={(e) => setWaterVolume(Number(e.target.value))}
                min="1000"
                step="1000"
              />
            </ROIInput>
            <ROIInput>
              <label>Site Type</label>
              <select
                value={siteType}
                onChange={(e) => setSiteType(e.target.value)}
              >
                <option value="pond">Pond / Small Lake</option>
                <option value="lake">Large Lake</option>
                <option value="commercial">Commercial / Municipal</option>
              </select>
            </ROIInput>
            <ROIInput>
              <label>Current Monthly Monitoring Cost ($)</label>
              <input
                type="number"
                value={currentCost}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
                min="0"
                step="50"
              />
            </ROIInput>
          </ROIInputs>

          <ROIResults>
            <ROIMetric>
              <div className="label">Estimated Monthly Credits*</div>
              <div className="value">${estimatedCredits.toLocaleString()}</div>
              <div className="subtext">Based on illustrative market rates</div>
            </ROIMetric>
            <ROIMetric>
              <div className="label">Payback Period</div>
              <div className="value">{paybackMonths} months</div>
              <div className="subtext">Estimate based on projected value</div>
            </ROIMetric>
            <ROIMetric>
              <div className="label">5-Year Value</div>
              <div className="value">${fiveYearValue.toLocaleString()}</div>
              <div className="subtext">Credits + monitoring savings</div>
            </ROIMetric>
            <MarketNote>
              <span className="icon">*</span>
              <p>Credit values vary based on market supply/demand and regional programs.</p>
            </MarketNote>
          </ROIResults>
        </ROIGrid>
      </ROISection>

      {/* DIY Section */}
      <DIYSection>
        <DIYHeader>
          <DIYTitle>
            <h3>Build It <span>Yourself</span></h3>
            <p>
              For those who want to build their own monitoring system, we provide
              complete documentation, wiring diagrams, and BOM lists.
            </p>
          </DIYTitle>
          <DIYBadge>Open Hardware</DIYBadge>
        </DIYHeader>

        <DIYPathsGrid>
          <DIYPathCard onClick={onGetStarted} $color="rgba(74, 222, 128, 0.15)">
            <div className="icon">Tool</div>
            <div className="title">Full DIY Kit</div>
            <div className="description">
              Source your own components using our complete bill of materials and wiring diagrams.
            </div>
            <div className="features">
              <div className="feature">Complete BOM with sources</div>
              <div className="feature">Wiring diagrams</div>
              <div className="feature">3D enclosure files</div>
              <div className="feature">Firmware repository</div>
            </div>
          </DIYPathCard>

          <DIYPathCard onClick={onGetStarted} $color="rgba(34, 211, 238, 0.15)">
            <div className="icon">Chip</div>
            <div className="title">Electronics Only</div>
            <div className="description">
              Get the pre-assembled PCB and sensors, build your own enclosure and power system.
            </div>
            <div className="features">
              <div className="feature">Pre-flashed controller</div>
              <div className="feature">Calibrated sensors</div>
              <div className="feature">Cloud connectivity ready</div>
              <div className="feature">Enclosure templates</div>
            </div>
          </DIYPathCard>

          <DIYPathCard onClick={onGetStarted} $color="rgba(251, 191, 36, 0.15)">
            <div className="icon">Box</div>
            <div className="title">Turnkey System</div>
            <div className="description">
              Fully assembled and tested system ready to deploy. Just connect power and start monitoring.
            </div>
            <div className="features">
              <div className="feature">Factory calibrated</div>
              <div className="feature">Weatherproof enclosure</div>
              <div className="feature">Solar + battery included</div>
              <div className="feature">1-year warranty</div>
            </div>
          </DIYPathCard>
        </DIYPathsGrid>

        <DIYResources>
          <ResourceLink href="#technical" onClick={onGetStarted}>
            View Wiring Diagrams
          </ResourceLink>
          <ResourceLink href="#pricing" onClick={onGetStarted}>
            Download BOM
          </ResourceLink>
          <ResourceLink href="#install" onClick={onGetStarted}>
            Installation Guide
          </ResourceLink>
          <ResourceLink href="https://github.com/BlueSignal-XYZ" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </ResourceLink>
        </DIYResources>
      </DIYSection>
    </HeroWrapper>
  );
}
