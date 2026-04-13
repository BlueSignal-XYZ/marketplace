import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { Competitor, CompetitiveIntel } from '../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.75rem;
  position: relative;
`;

const Name = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
  /* Reserve room for the absolutely-positioned DeleteBtn at top-right. */
  padding-right: 1.5rem;

  @media (max-width: 1024px) {
    padding-right: 2.5rem;
  }
`;

const NameText = styled.div`
  flex: 1;
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

const Btn = styled.button<{ $danger?: boolean }>`
  background: ${({ $danger, theme }) => ($danger ? theme.colors.redDim : theme.colors.accentDim)};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.red : theme.colors.accent)};
  border: none;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const DeleteBtn = styled(Btn)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  line-height: 1;

  /* Give the close-X a real tap target on phones without enlarging it
     visually on desktop. */
  @media (max-width: 1024px) {
    min-width: 32px;
    min-height: 32px;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }
`;

const THREAT_OPTIONS: Competitor['threat'][] = ['high', 'medium', 'low'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  {
    name: 'threat',
    label: 'Threat',
    type: 'select',
    options: [...THREAT_OPTIONS],
    defaultValue: 'medium',
  },
  { name: 'ourResponse', label: 'Our Response' },
];

export default function CompetitivePanel() {
  const { data, loading } = useFirebaseData<CompetitiveIntel>('/ops-dashboard/competitive-intel');
  const { writeImmediate } = useWriteBack('/ops-dashboard/competitive-intel');
  const [showAdd, setShowAdd] = useState(false);

  const competitors = data?.competitors ?? [];
  const battleCards = data?.battleCards ?? [];

  const persist = (updated: Competitor[]) => {
    writeImmediate({
      lastUpdated: data?.lastUpdated ?? '',
      competitors: updated,
      battleCards,
    });
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors];
    const current = { ...updated[index] } as Competitor;
    (current as any)[field] = value;
    updated[index] = current;
    persist(updated);
  };

  const deleteCompetitor = (index: number) => {
    if (!confirm(`Delete ${competitors[index].name}?`)) return;
    persist(competitors.filter((_, i) => i !== index));
  };

  const addCompetitor = (values: Record<string, string>) => {
    const newItem: Competitor = {
      name: values.name,
      threat: (values.threat as Competitor['threat']) || 'medium',
      strengths: [],
      weaknesses: [],
      recentMoves: [],
      ourResponse: values.ourResponse,
    };
    persist([...competitors, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="competitive"
      title="Competitive Intel"
      badge={competitors.length}
      actions={actions}
      empty={!loading && competitors.length === 0}
    >
      <Grid>
        {competitors.map((c, i) => (
          <Card key={i}>
            <DeleteBtn $danger onClick={() => deleteCompetitor(i)}>
              ×
            </DeleteBtn>
            <Name>
              <NameText>
                <EditableCell value={c.name} onSave={(v) => updateCompetitor(i, 'name', v)} />
              </NameText>
              <PriorityBadge
                value={c.threat}
                options={THREAT_OPTIONS}
                onChange={(v) => updateCompetitor(i, 'threat', v)}
              />
            </Name>
            {c.strengths?.length > 0 && (
              <Section>
                <SectionLabel>Strengths</SectionLabel>
                <ul>
                  {c.strengths.map((s, j) => (
                    <ListItem key={j}>{s}</ListItem>
                  ))}
                </ul>
              </Section>
            )}
            {c.weaknesses?.length > 0 && (
              <Section>
                <SectionLabel>Weaknesses</SectionLabel>
                <ul>
                  {c.weaknesses.map((w, j) => (
                    <ListItem key={j}>{w}</ListItem>
                  ))}
                </ul>
              </Section>
            )}
            {c.recentMoves?.length > 0 && (
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
              <div style={{ fontSize: '0.75rem', color: '#4f8ff7' }}>
                <EditableCell
                  value={c.ourResponse}
                  onSave={(v) => updateCompetitor(i, 'ourResponse', v)}
                />
              </div>
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
      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addCompetitor} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
