import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import type { EventsPrograms } from '../types';

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
  margin-bottom: 0.2rem;
`;

const Detail = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 0.15rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 1rem 0 0.5rem;
  &:first-of-type {
    margin-top: 0;
  }
`;

const TierRow = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text2};
  padding: 0.15rem 0;
`;

export default function EventsPanel() {
  const { data, loading } = useFirebaseData<EventsPrograms>('/ops-dashboard/events-programs');
  const events = data?.events ?? [];
  const programs = data?.programs ?? [];
  const empty = !loading && events.length === 0 && programs.length === 0;

  return (
    <Panel
      id="events"
      title="Events & Programs"
      badge={events.length + programs.length}
      empty={empty}
    >
      {events.length > 0 && (
        <>
          <SectionTitle>Events</SectionTitle>
          <Grid>
            {events.map((e, i) => (
              <Card key={i}>
                <Name>{e.name}</Name>
                <Detail>
                  {e.date} — {e.location}
                </Detail>
                <Detail>
                  Budget: ${e.budget.toLocaleString()} | Leads: {e.expectedLeads}
                </Detail>
                <Detail>{e.booth ? 'Booth reserved' : 'No booth'}</Detail>
                <div style={{ marginTop: '0.3rem' }}>
                  <PriorityBadge value={e.status} />
                </div>
                {e.notes && (
                  <Detail style={{ marginTop: '0.3rem', fontStyle: 'italic' }}>{e.notes}</Detail>
                )}
              </Card>
            ))}
          </Grid>
        </>
      )}
      {programs.length > 0 && (
        <>
          <SectionTitle>Programs</SectionTitle>
          <Grid>
            {programs.map((p, i) => (
              <Card key={i}>
                <Name>{p.name}</Name>
                <Detail>{p.description}</Detail>
                <Detail>
                  {p.startDate} — {p.endDate}
                </Detail>
                <Detail>Budget: ${p.budget.toLocaleString()}</Detail>
                <div style={{ marginTop: '0.3rem' }}>
                  <PriorityBadge value={p.status} />
                </div>
                {p.tiers?.length > 0 && (
                  <div style={{ marginTop: '0.4rem' }}>
                    {p.tiers.map((t, j) => (
                      <TierRow key={j}>
                        {t.threshold}: {t.rebate}
                      </TierRow>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </Grid>
        </>
      )}
    </Panel>
  );
}
