import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import type { TerritoryMap } from '../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.6rem 0.75rem;
`;

const DealerName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.2rem;
`;

const Detail = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text2};
`;

export default function TerritoryPanel() {
  const { data, loading } = useFirebaseData<TerritoryMap>('/ops-dashboard/territory-map');
  const dealers = data?.dealers ?? [];

  return (
    <Panel
      id="territory"
      title="Territory Map"
      badge={dealers.length}
      empty={!loading && dealers.length === 0}
    >
      {data?.territory && (
        <div style={{ fontSize: '0.75rem', color: '#9498a8', marginBottom: '0.75rem' }}>
          {data.territory.name} — {data.territory.description}
        </div>
      )}
      <Grid>
        {dealers.map((d, i) => (
          <Card key={i}>
            <DealerName>{d.name}</DealerName>
            <Detail>{d.location}</Detail>
            <Detail>{d.type}</Detail>
            <div style={{ marginTop: '0.3rem' }}>
              <PriorityBadge value={d.status} />
            </div>
          </Card>
        ))}
      </Grid>
    </Panel>
  );
}
