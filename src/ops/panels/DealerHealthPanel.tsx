import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import type { DealerHealth } from '../types';

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Name = styled.span`
  width: 140px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 10px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 5px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $score: number }>`
  height: 100%;
  width: ${({ $score }) => $score}%;
  background: ${({ $score }) => ($score >= 70 ? '#34d399' : $score >= 40 ? '#fbbf24' : '#f87171')};
  border-radius: 5px;
  transition: width 0.4s ease;
`;

const Score = styled.span`
  width: 30px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text2};
`;

const Trend = styled.span<{ $dir: string }>`
  font-size: 0.75rem;
  color: ${({ $dir }) => ($dir === 'up' ? '#34d399' : $dir === 'down' ? '#f87171' : '#9498a8')};
`;

export default function DealerHealthPanel() {
  const { data, loading } = useFirebaseData<DealerHealth>('/ops-dashboard/dealer-health');
  const dealers = data?.dealers ?? [];

  return (
    <Panel
      id="dealer-health"
      title="Dealer Health"
      badge={dealers.length}
      empty={!loading && dealers.length === 0}
    >
      {dealers.map((d, i) => (
        <Row key={i}>
          <Name>{d.name}</Name>
          <BarTrack>
            <BarFill $score={d.score} />
          </BarTrack>
          <Score>{d.score}</Score>
          <Trend $dir={d.trend}>
            {d.trend === 'up' ? '\u2191' : d.trend === 'down' ? '\u2193' : '\u2192'}
          </Trend>
        </Row>
      ))}
    </Panel>
  );
}
