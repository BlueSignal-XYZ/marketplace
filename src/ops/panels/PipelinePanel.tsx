import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import type { PipelineSnapshot } from '../types';

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.5rem 0.75rem;
`;

const StatLabel = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const StageBar = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.surface2};
`;

const StageSegment = styled.div<{ $pct: number; $color: string }>`
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
`;

const stageColors = ['#4f8ff7', '#a78bfa', '#fbbf24', '#fb923c', '#34d399', '#f87171', '#9498a8'];

export default function PipelinePanel() {
  const { data, loading } = useFirebaseData<PipelineSnapshot>('/ops-dashboard/pipeline-snapshot');

  if (!data)
    return (
      <Panel id="pipeline" title="Pipeline" empty={!loading}>
        <span />
      </Panel>
    );

  const { summary, stages = [], deals = [] } = data;
  const totalCount = stages.reduce((s, st) => s + st.count, 0) || 1;

  return (
    <Panel
      id="pipeline"
      title="Pipeline"
      badge={`$${(summary?.totalPipeline ?? 0).toLocaleString()}`}
    >
      <Stats>
        <StatCard>
          <StatLabel>Total Pipeline</StatLabel>
          <StatValue>${(summary?.totalPipeline ?? 0).toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Weighted</StatLabel>
          <StatValue>${(summary?.weightedPipeline ?? 0).toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Won YTD</StatLabel>
          <StatValue>${(summary?.closedWonYTD ?? 0).toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Win Rate</StatLabel>
          <StatValue>{summary?.winRate ?? 0}%</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Avg Deal</StatLabel>
          <StatValue>${(summary?.avgDealSize ?? 0).toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Avg Cycle</StatLabel>
          <StatValue>{summary?.avgCycleLength ?? 0}d</StatValue>
        </StatCard>
      </Stats>

      <StageBar>
        {stages.map((st, i) => (
          <StageSegment
            key={st.name}
            $pct={(st.count / totalCount) * 100}
            $color={stageColors[i % stageColors.length]}
          />
        ))}
      </StageBar>

      {deals.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Deal</Th>
              <Th>Stage</Th>
              <Th>Value</Th>
              <Th>Probability</Th>
              <Th>Expected Close</Th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <Tr key={i}>
                <Td style={{ color: '#e2e4ea' }}>{d.name}</Td>
                <Td>{d.stage}</Td>
                <Td>${d.value.toLocaleString()}</Td>
                <Td>{d.probability}%</Td>
                <Td>{d.expectedClose}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Panel>
  );
}
