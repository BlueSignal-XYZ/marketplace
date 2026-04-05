/**
 * WQT Programs Browser — browse and explore trading programs.
 * Shows registered programs, calculator, and program-specific rules.
 */

import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Input } from '../../../design-system/primitives/Input';
import { Tabs } from '../../../design-system/primitives/Tabs';

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 28px 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 48px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const ProgramCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProgramHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ProgramName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ProgramMeta = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 12px;
  line-height: 1.5;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const CalculatorSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
  margin-top: 24px;
`;

const CalcTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const CalcDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ResultBox = styled.div`
  padding: 24px;
  background: ${({ theme }) => `${theme.colors.primary}06`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const ResultLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ResultValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 4px 0 8px;
`;

const ResultNotes = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const SelectWrap = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 6px;
`;

const DisclaimerBanner = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const DisclaimerIcon = styled.span`
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
`;

// ── Program data (mirrors ProgramRegistry) ────────────────

const PROGRAMS = [
  {
    id: 'va-nce',
    name: 'Virginia Nutrient Credit Exchange',
    shortName: 'VA NCE',
    state: 'Virginia',
    region: 'Chesapeake Bay Watershed',
    description:
      'Buy and sell nutrient reduction credits to meet Chesapeake Bay TMDL requirements.',
    regulatoryBody: 'Virginia DEQ',
    nutrients: ['nitrogen', 'phosphorus'],
    active: true,
    totalListings: 42,
    totalCredits: 5900,
    avgPrice: 8.42,
    baselines: { nitrogen: 5.0, phosphorus: 1.0 },
    ratios: {
      nitrogen: { 'sensor-verified': 1.0, 'third-party': 0.85, 'self-reported': 0.6 },
      phosphorus: { 'sensor-verified': 1.0, 'third-party': 0.9, 'self-reported': 0.65 },
    },
    feePct: 0.05,
  },
];

export function ProgramsPage() {
  useEffect(() => {
    document.title = 'Trading Programs — WaterQuality.Trading';
  }, []);
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0]);
  const [tab, setTab] = useState('overview');
  const [calcForm, setCalcForm] = useState({
    nutrientType: 'nitrogen',
    removalKg: 100,
    verificationLevel: 'sensor-verified',
    vintage: '2025',
  });

  const calcResult = useMemo(() => {
    const p = selectedProgram;
    if (!p) return null;
    const baseline = p.baselines[calcForm.nutrientType] || 0;
    const ratio = p.ratios[calcForm.nutrientType]?.[calcForm.verificationLevel] || 0.5;
    const net = Math.max(0, calcForm.removalKg - baseline);
    const raw = net * ratio;
    const fee = raw * p.feePct;
    return {
      credits: Math.round((raw - fee) * 100) / 100,
      ratio,
      baseline,
      net,
      fee: Math.round(fee * 100) / 100,
    };
  }, [selectedProgram, calcForm]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'calculator', label: 'Credit Calculator' },
  ];

  return (
    <Page>
      <Title>Trading Programs</Title>
      <Subtitle>Explore registered nutrient trading programs and calculate credits.</Subtitle>

      {PROGRAMS.map((program) => (
        <ProgramCard
          key={program.id}
          $active={selectedProgram?.id === program.id}
          onClick={() => setSelectedProgram(program)}
        >
          <ProgramHeader>
            <ProgramName>{program.name}</ProgramName>
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge variant="positive" size="sm" dot>
                {program.active ? 'Active' : 'Inactive'}
              </Badge>
              {program.nutrients.map((n) => (
                <Badge key={n} variant={n === 'nitrogen' ? 'info' : 'positive'} size="sm">
                  {n === 'nitrogen' ? 'N' : 'P'}
                </Badge>
              ))}
            </div>
          </ProgramHeader>
          <ProgramMeta>
            {program.description} · {program.regulatoryBody} · {program.region}
          </ProgramMeta>
          <StatsRow>
            <DataCard label="Active Listings" value={program.totalListings.toString()} compact />
            <DataCard
              label="Total Credits"
              value={program.totalCredits.toLocaleString()}
              unit="kg"
              compact
            />
            <DataCard
              label="Avg Price"
              value={`$${program.avgPrice.toFixed(2)}`}
              unit="/kg"
              compact
            />
          </StatsRow>
        </ProgramCard>
      ))}

      {selectedProgram?.id === 'va-nce' && (
        <DisclaimerBanner>
          <DisclaimerIcon>ℹ️</DisclaimerIcon>
          <div>
            This program is operated by the Commonwealth of Virginia through a state-managed
            registry. It is shown here as a reference example of an active nutrient trading program.
            WaterQuality.Trading is not affiliated with this program. Our platform offers an
            alternative, technology-driven approach to water quality credit registration and
            trading.
          </div>
        </DisclaimerBanner>
      )}

      {selectedProgram && (
        <>
          <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

          {tab === 'overview' && (
            <CalculatorSection>
              <CalcTitle>Program Details — {selectedProgram.shortName}</CalcTitle>
              <CalcDesc>
                {selectedProgram.description}
                <br />
                Regulatory body: {selectedProgram.regulatoryBody}
              </CalcDesc>
              <FormGrid>
                <DataCard
                  label="Nitrogen Baseline"
                  value={`${selectedProgram.baselines.nitrogen} kg`}
                  compact
                />
                <DataCard
                  label="Phosphorus Baseline"
                  value={`${selectedProgram.baselines.phosphorus} kg`}
                  compact
                />
                <DataCard
                  label="Program Fee"
                  value={`${(selectedProgram.feePct * 100).toFixed(0)}%`}
                  compact
                />
                <DataCard
                  label="Supported Nutrients"
                  value={selectedProgram.nutrients.join(', ')}
                  compact
                />
              </FormGrid>
            </CalculatorSection>
          )}

          {tab === 'calculator' && (
            <CalculatorSection>
              <CalcTitle>Credit Calculator</CalcTitle>
              <CalcDesc>
                Estimate how many credits your nutrient removal would generate under{' '}
                {selectedProgram.shortName}.
              </CalcDesc>

              <FormGrid>
                <div>
                  <Label>Nutrient Type</Label>
                  <SelectWrap
                    value={calcForm.nutrientType}
                    onChange={(e) => setCalcForm((f) => ({ ...f, nutrientType: e.target.value }))}
                  >
                    <option value="nitrogen">Nitrogen (N)</option>
                    <option value="phosphorus">Phosphorus (P)</option>
                  </SelectWrap>
                </div>
                <Input
                  label="Removal Amount (kg)"
                  type="number"
                  value={calcForm.removalKg}
                  onChange={(e) =>
                    setCalcForm((f) => ({ ...f, removalKg: parseFloat(e.target.value) || 0 }))
                  }
                />
                <div>
                  <Label>Verification Level</Label>
                  <SelectWrap
                    value={calcForm.verificationLevel}
                    onChange={(e) =>
                      setCalcForm((f) => ({ ...f, verificationLevel: e.target.value }))
                    }
                  >
                    <option value="sensor-verified">Sensor Verified</option>
                    <option value="third-party">Third-Party</option>
                    <option value="self-reported">Self-Reported</option>
                  </SelectWrap>
                </div>
                <Input
                  label="Vintage Year"
                  value={calcForm.vintage}
                  onChange={(e) => setCalcForm((f) => ({ ...f, vintage: e.target.value }))}
                />
              </FormGrid>

              {calcResult && (
                <ResultBox>
                  <ResultLabel>Estimated Credits</ResultLabel>
                  <ResultValue>{calcResult.credits} kg</ResultValue>
                  <ResultNotes>
                    Trading ratio: {calcResult.ratio} · Baseline: {calcResult.baseline} kg · Net
                    removal: {calcResult.net} kg · Program fee: {calcResult.fee} kg
                  </ResultNotes>
                </ResultBox>
              )}
            </CalculatorSection>
          )}
        </>
      )}
    </Page>
  );
}

export default ProgramsPage;
