import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import ProgressBar from '../components/ProgressBar';
import type { Forecast } from '../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.75rem;
`;

const QLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 0.35rem;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

export default function ForecastPanel() {
  const { data, loading } = useFirebaseData<Forecast>('/ops-dashboard/forecast');

  if (!data)
    return (
      <Panel id="forecast" title="Forecast" empty={!loading}>
        <span />
      </Panel>
    );

  const quarters = Object.entries(data.forecast ?? {});

  return (
    <Panel id="forecast" title="Forecast">
      <Grid>
        {quarters.map(([key, q]) => {
          const pct = q.target > 0 ? Math.round((q.committed / q.target) * 100) : 0;
          return (
            <Card key={key}>
              <QLabel>{key.toUpperCase()}</QLabel>
              <Row>
                <span>Target</span>
                <Value>${q.target.toLocaleString()}</Value>
              </Row>
              <Row>
                <span>Committed</span>
                <Value>${q.committed.toLocaleString()}</Value>
              </Row>
              <Row>
                <span>Best Case</span>
                <Value>${q.bestCase.toLocaleString()}</Value>
              </Row>
              <Row>
                <span>Pipeline</span>
                <Value>${q.pipeline.toLocaleString()}</Value>
              </Row>
              <Row>
                <span>Gap</span>
                <Value style={{ color: q.gap > 0 ? '#f87171' : '#34d399' }}>
                  ${q.gap.toLocaleString()}
                </Value>
              </Row>
              <div style={{ marginTop: '0.5rem' }}>
                <ProgressBar value={pct} />
                <div style={{ fontSize: '0.65rem', color: '#9498a8', marginTop: '0.25rem' }}>
                  {pct}% of target
                </div>
              </div>
            </Card>
          );
        })}
      </Grid>
    </Panel>
  );
}
