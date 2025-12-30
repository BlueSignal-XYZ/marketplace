// ROICalculatorSection - Interactive ROI calculator for the sales portal
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";

const CalculatorSection = styled.section`
  background: ${salesTheme.colors.bgSurface};
  padding: 80px 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px;
  }
`;

const CalculatorContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 16px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${salesTheme.colors.textMuted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CalculatorCard = styled.div`
  background: ${salesTheme.colors.bgCard};
  border-radius: ${salesTheme.borderRadius.xl};
  box-shadow: ${salesTheme.shadows.xl};
  overflow: hidden;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InputsPanel = styled.div`
  padding: 40px;
  border-right: 1px solid ${salesTheme.colors.border};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    border-right: none;
    border-bottom: 1px solid ${salesTheme.colors.border};
    padding: 32px 24px;
  }
`;

const InputsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${salesTheme.colors.textMuted};
  margin-bottom: 8px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  font-size: 16px;
  color: ${salesTheme.colors.textDark};
  transition: all ${salesTheme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${salesTheme.colors.border};
  border-radius: ${salesTheme.borderRadius.md};
  font-size: 16px;
  color: ${salesTheme.colors.textDark};
  background: ${salesTheme.colors.bgCard};
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${salesTheme.colors.accentSecondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ResultsPanel = styled.div`
  padding: 40px;
  background: ${salesTheme.gradients.roiResults};

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 32px 24px;
  }
`;

const ResultsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${salesTheme.colors.textDark};
  margin: 0 0 24px;
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ResultItem = styled.div``;

const ResultLabel = styled.div`
  font-size: 13px;
  color: ${salesTheme.colors.textMuted};
  margin-bottom: 4px;
`;

const ResultValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${salesTheme.colors.accentPrimary};
  font-family: ${salesTheme.typography.fontMono};
`;

const ResultSubtext = styled.div`
  font-size: 12px;
  color: ${salesTheme.colors.textMuted};
  margin-top: 4px;
`;

const CTASection = styled.div`
  padding: 24px 40px;
  background: ${salesTheme.colors.bgCard};
  border-top: 1px solid ${salesTheme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    flex-direction: column;
    padding: 24px;
    text-align: center;
  }
`;

const CTAText = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textMuted};
  margin: 0;
`;

const CTAButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  color: ${salesTheme.colors.bgPrimary};
  border: none;
  border-radius: ${salesTheme.borderRadius.md};
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${salesTheme.shadows.glow};
  }
`;

export default function ROICalculatorSection({ onGetQuote }) {
  const [waterVolume, setWaterVolume] = useState(50000);
  const [siteType, setSiteType] = useState("pond");
  const [currentCost, setCurrentCost] = useState(500);

  const results = useMemo(() => {
    // Calculate estimated monthly credits based on water volume
    const estimatedCredits = Math.round(waterVolume * 0.02);
    const annualCredits = estimatedCredits * 12;

    // System cost based on site type
    const systemCost = siteType === "pond" ? 1500 : siteType === "lake" ? 3000 : 5000;

    // Payback calculation
    const monthlySavings = estimatedCredits + currentCost * 0.3;
    const paybackMonths = Math.round(systemCost / monthlySavings);

    // 5-year value
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
          <SectionLabel>ROI Calculator</SectionLabel>
          <SectionTitle>Calculate Your Return</SectionTitle>
          <SectionDescription>
            See how quickly a BlueSignal monitoring system can pay for itself
            through water quality credits and monitoring savings.
          </SectionDescription>
        </SectionHeader>

        <CalculatorCard>
          <CalculatorGrid>
            <InputsPanel>
              <InputsTitle>Your Site Details</InputsTitle>

              <InputGroup>
                <InputLabel htmlFor="waterVolume">
                  Water Volume (gallons/day)
                </InputLabel>
                <InputField
                  id="waterVolume"
                  type="number"
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(Number(e.target.value))}
                  min="1000"
                  step="1000"
                />
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="siteType">Site Type</InputLabel>
                <SelectField
                  id="siteType"
                  value={siteType}
                  onChange={(e) => setSiteType(e.target.value)}
                >
                  <option value="pond">Pond / Small Lake</option>
                  <option value="lake">Large Lake</option>
                  <option value="commercial">Commercial / Municipal</option>
                </SelectField>
              </InputGroup>

              <InputGroup>
                <InputLabel htmlFor="currentCost">
                  Current Monthly Monitoring Cost ($)
                </InputLabel>
                <InputField
                  id="currentCost"
                  type="number"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Number(e.target.value))}
                  min="0"
                  step="50"
                />
              </InputGroup>
            </InputsPanel>

            <ResultsPanel>
              <ResultsTitle>Projected Results</ResultsTitle>
              <ResultsGrid>
                <ResultItem>
                  <ResultLabel>Estimated Monthly Credits</ResultLabel>
                  <ResultValue>
                    ${results.estimatedCredits.toLocaleString()}
                  </ResultValue>
                  <ResultSubtext>Based on water quality data value</ResultSubtext>
                </ResultItem>

                <ResultItem>
                  <ResultLabel>Payback Period</ResultLabel>
                  <ResultValue>{results.paybackMonths} months</ResultValue>
                  <ResultSubtext>Time to recover system cost</ResultSubtext>
                </ResultItem>

                <ResultItem>
                  <ResultLabel>5-Year Value</ResultLabel>
                  <ResultValue>
                    ${results.fiveYearValue.toLocaleString()}
                  </ResultValue>
                  <ResultSubtext>Credits + monitoring savings</ResultSubtext>
                </ResultItem>
              </ResultsGrid>
            </ResultsPanel>
          </CalculatorGrid>

          <CTASection>
            <CTAText>
              Ready to see the full breakdown? Get a customized quote for your site.
            </CTAText>
            <CTAButton onClick={onGetQuote}>Get Your Custom Quote</CTAButton>
          </CTASection>
        </CalculatorCard>
      </CalculatorContainer>
    </CalculatorSection>
  );
}
