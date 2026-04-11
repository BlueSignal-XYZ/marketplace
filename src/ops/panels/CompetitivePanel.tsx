import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import type { CompetitiveIntel } from '../types';

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

const Name = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Section = styled.div`
  margin-top: 0.4rem;
`;

const SectionLabel = styled.div`
  font-size: 0.65rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 0.2rem;
`;

const ListItem = styled.li`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-left: 1rem;
`;

const BattleCards = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 0.75rem;
`;

const BCTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const BCRow = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.4rem;
`;

const BCScenario = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yellow};
  margin-bottom: 0.2rem;
`;

const BCResponse = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
`;

export default function CompetitivePanel() {
  const { data, loading } = useFirebaseData<CompetitiveIntel>('/ops-dashboard/competitive-intel');
  const competitors = data?.competitors ?? [];
  const battleCards = data?.battleCards ?? [];

  return (
    <Panel
      id="competitive"
      title="Competitive Intel"
      badge={competitors.length}
      empty={!loading && competitors.length === 0}
    >
      <Grid>
        {competitors.map((c, i) => (
          <Card key={i}>
            <Name>
              {c.name} <PriorityBadge value={c.threat} />
            </Name>
            <Section>
              <SectionLabel>Strengths</SectionLabel>
              <ul>
                {c.strengths.map((s, j) => (
                  <ListItem key={j}>{s}</ListItem>
                ))}
              </ul>
            </Section>
            <Section>
              <SectionLabel>Weaknesses</SectionLabel>
              <ul>
                {c.weaknesses.map((w, j) => (
                  <ListItem key={j}>{w}</ListItem>
                ))}
              </ul>
            </Section>
            {c.recentMoves.length > 0 && (
              <Section>
                <SectionLabel>Recent Moves</SectionLabel>
                <ul>
                  {c.recentMoves.map((m, j) => (
                    <ListItem key={j}>{m}</ListItem>
                  ))}
                </ul>
              </Section>
            )}
            <Section>
              <SectionLabel>Our Response</SectionLabel>
              <div style={{ fontSize: '0.75rem', color: '#4f8ff7' }}>{c.ourResponse}</div>
            </Section>
          </Card>
        ))}
      </Grid>
      {battleCards.length > 0 && (
        <BattleCards>
          <BCTitle>Battle Cards</BCTitle>
          {battleCards.map((bc, i) => (
            <BCRow key={i}>
              <BCScenario>{bc.scenario}</BCScenario>
              <BCResponse>{bc.response}</BCResponse>
            </BCRow>
          ))}
        </BattleCards>
      )}
    </Panel>
  );
}
