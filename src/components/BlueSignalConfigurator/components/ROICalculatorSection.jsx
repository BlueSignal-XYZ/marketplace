// ROICalculatorSection - Interactive ROI calculator for the sales portal
import React, { useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { salesTheme } from "../styles/theme";

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const CalculatorSection = styled.section`
  background: ${salesTheme.colors.bgSurface};
  padding: 100px 24px;
  position: relative;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 80px 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const CalculatorContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 56px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin-bottom: 40px;
  }
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 16px;
  padding: 6px 14px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 100px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 20px;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 17px;
  color: ${salesTheme.colors.textMuted};
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 15px;
  }
`;

const CalculatorCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: 28px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 12px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InputsPanel = styled.div`
  padding: 48px;
  border-right: 1px solid ${salesTheme.colors.border};

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 40px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    border-right: none;
    border-bottom: 1px solid ${salesTheme.colors.border};
    padding: 32px 24px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const PanelIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
    color: ${salesTheme.colors.accentSecondary};
  }
`;

const PanelTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0;
  letter-spacing: -0.01em;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin-bottom: 10px;
`;

const InputHelper = styled.span`
  font-weight: 400;
  color: ${salesTheme.colors.textMuted};
  font-size: 13px;
  display: block;
  margin-top: 4px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 16px 18px;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${salesTheme.colors.textDark};
  background: #fafbfc;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    background: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 16px 18px;
  border: 2px solid ${salesTheme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${salesTheme.colors.textDark};
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 48px;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const ResultsPanel = styled.div`
  padding: 48px;
  background: linear-gradient(145deg, #f0fdf4 0%, #ecfeff 50%, #f0f9ff 100%);
  position: relative;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 40px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 32px 24px;
  }
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const ResultItem = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
  }
`;

const ResultLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${salesTheme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 8px;
`;

const ResultValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
  line-height: 1.1;
  letter-spacing: -0.02em;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const ResultSubtext = styled.div`
  font-size: 13px;
  color: ${salesTheme.colors.textMuted};
  margin-top: 6px;
  line-height: 1.4;
`;

const MarketDisclaimer = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: #f59e0b;
    margin-top: 1px;
  }

  p {
    font-size: 12px;
    color: ${salesTheme.colors.textMuted};
    margin: 0;
    line-height: 1.5;
  }
`;

const CTASection = styled.div`
  padding: 28px 48px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.04) 0%, rgba(59, 130, 246, 0.04) 100%);
  border-top: 1px solid ${salesTheme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 24px 40px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    padding: 24px;
    text-align: center;
  }
`;

const CTAContent = styled.div``;

const CTATitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 4px;
`;

const CTAText = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 0;
`;

const CTAButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  color: #0f172a;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    width: 100%;
    justify-content: center;
  }
`;

export default function ROICalculatorSection({ onGetQuote }) {
  const [waterVolume, setWaterVolume] = useState(50000);
  const [siteType, setSiteType] = useState("pond");
  const [currentCost, setCurrentCost] = useState(500);

  const results = useMemo(() => {
    const estimatedCredits = Math.round(waterVolume * 0.02);
    const annualCredits = estimatedCredits * 12;
    const systemCost = siteType === "pond" ? 1500 : siteType === "lake" ? 3000 : 5000;
    const monthlySavings = estimatedCredits + currentCost * 0.3;
    const paybackMonths = Math.round(systemCost / monthlySavings);
    const fiveYearValue = annualCredits * 5 + currentCost * 0.3 * 12 * 5;

    return {
      estimatedCredits,
      paybackMonths,
      fiveYearValue,
    };
  }, [waterVolume, siteType, currentCost]);

  return (
    <CalculatorSection id="calculator">
      <CalculatorContainer>
        <SectionHeader>
          <SectionLabel>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            ROI Calculator
          </SectionLabel>
          <SectionTitle>Calculate Your Return on Investment</SectionTitle>
          <SectionDescription>
            Estimate potential returns from water quality credits and monitoring savings.
            Credit values vary based on market conditions and regional programs.
          </SectionDescription>
        </SectionHeader>

        <CalculatorCard>
          <CalculatorGrid>
            <InputsPanel>
              <PanelHeader>
                <PanelIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </PanelIcon>
                <PanelTitle>Your Site Details</PanelTitle>
              </PanelHeader>

              <InputGroup>
                <InputLabel htmlFor="waterVolume">
                  Daily Water Volume
                  <InputHelper>Estimated gallons processed per day</InputHelper>
                </InputLabel>
                <InputField
                  id="waterVolume"
                  type="number"
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(Number(e.target.value))}
                  min="1000"
                  step="1000"
                  placeholder="50000"
                />
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="siteType">
                  Site Type
                  <InputHelper>Select your water body type</InputHelper>
                </InputLabel>
                <SelectField
                  id="siteType"
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                >
                  <option value="pond">Pond / Small Lake (up to 5 acres)</option>
                  <option value="lake">Large Lake (5-50 acres)</option>
                  <option value="commercial">Commercial / Municipal</option>
                </SelectField>
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="currentCost">
                  Current Monthly Monitoring Cost
                  <InputHelper>What you currently spend on water testing</InputHelper>
                </InputLabel>
                <InputField
                  id="currentCost"
                  type="number"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Number(e.target.value))}
                  min="0"
                  step="50"
                  placeholder="500"
                />
              </InputGroup>
            </InputsPanel>

            <ResultsPanel>
              <PanelHeader>
                <PanelIcon style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: salesTheme.colors.accentPrimary }}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </PanelIcon>
                <PanelTitle>Projected Results</PanelTitle>
              </PanelHeader>
              <ResultsGrid>
                <ResultItem>
                  <ResultLabel>Estimated Monthly Credits*</ResultLabel>
                  <ResultValue>
                    ${results.estimatedCredits.toLocaleString()}
                  </ResultValue>
                  <ResultSubtext>Based on illustrative market rates</ResultSubtext>
                </ResultItem>

                <ResultItem>
                  <ResultLabel>Payback Period</ResultLabel>
                  <ResultValue>{results.paybackMonths} months</ResultValue>
                  <ResultSubtext>Estimate based on projected credit value</ResultSubtext>
                </ResultItem>

                <ResultItem>
                  <ResultLabel>5-Year Total Value</ResultLabel>
                  <ResultValue>
                    ${results.fiveYearValue.toLocaleString()}
                  </ResultValue>
                  <ResultSubtext>Combined credits and monitoring savings</ResultSubtext>
                </ResultItem>
              </ResultsGrid>
              <MarketDisclaimer>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>
                  *Credit values are estimates only. Actual revenue depends on market supply and demand,
                  regional credit programs, and verification requirements. Contact us for a detailed
                  assessment of credit potential in your area.
                </p>
              </MarketDisclaimer>
            </ResultsPanel>
          </CalculatorGrid>

          <CTASection>
            <CTAContent>
              <CTATitle>Ready to see the full breakdown?</CTATitle>
              <CTAText>Get a customized quote tailored to your specific site requirements.</CTAText>
            </CTAContent>
            <CTAButton onClick={onGetQuote}>
              Get Your Custom Quote
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </CTAButton>
          </CTASection>
        </CalculatorCard>
      </CalculatorContainer>
    </CalculatorSection>
  );
}
