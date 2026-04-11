import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import ProgressBar from '../components/ProgressBar';
import type { Initiative } from '../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.75rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
`;

const Name = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Desc = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 0.5rem;
`;

const PctLabel = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
`;

const Milestone = styled.div<{ $done: boolean }>`
  font-size: 0.75rem;
  color: ${({ $done, theme }) => ($done ? theme.colors.green : theme.colors.text2)};
  padding: 0.15rem 0;
  &::before {
    content: '${({ $done }) => ($done ? '\u2713' : '\u25CB')}';
    margin-right: 0.4rem;
  }
`;

export default function InitiativesPanel() {
  const { data, loading } = useFirebaseData<Initiative[]>('/ops-dashboard/active-initiatives');
  const items = data ?? [];

  return (
    <Panel
      id="initiatives"
      title="Active Initiatives"
      badge={items.length}
      empty={!loading && items.length === 0}
    >
      <Grid>
        {items.map((init, i) => (
          <Card key={i}>
            <Header>
              <Name>{init.name}</Name>
              <PriorityBadge value={init.status} />
            </Header>
            <Desc>{init.description}</Desc>
            <ProgressBar value={init.progress} />
            <PctLabel>
              {init.progress}% — Target: {init.target}
            </PctLabel>
            {init.milestones?.map((m, j) => (
              <Milestone key={j} $done={m.status === 'done'}>
                {m.name}
              </Milestone>
            ))}
          </Card>
        ))}
      </Grid>
    </Panel>
  );
}
