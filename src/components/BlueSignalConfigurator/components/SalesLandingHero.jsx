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
            <div className="value">500+</div>
            <div className="label">Devices Deployed</div>
          </StatCard>
          <StatCard>
            <div className="value">$2M+</div>
            <div className="label">Credits Generated</div>
          </StatCard>
          <StatCard>
            <div className="value">98%</div>
            <div className="label">Uptime</div>
          </StatCard>
        </StatsGrid>
      </HeroContent>

      <ROISection>
        <ROITitle>Calculate Your ROI</ROITitle>
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
              <div className="label">Estimated Monthly Credits</div>
              <div className="value">${estimatedCredits.toLocaleString()}</div>
              <div className="subtext">Based on water quality data value</div>
            </ROIMetric>
            <ROIMetric>
              <div className="label">Payback Period</div>
              <div className="value">{paybackMonths} months</div>
              <div className="subtext">Time to recover system cost</div>
            </ROIMetric>
            <ROIMetric>
              <div className="label">5-Year Value</div>
              <div className="value">${fiveYearValue.toLocaleString()}</div>
              <div className="subtext">Credits + monitoring savings</div>
            </ROIMetric>
          </ROIResults>
        </ROIGrid>
      </ROISection>
    </HeroWrapper>
  );
}
