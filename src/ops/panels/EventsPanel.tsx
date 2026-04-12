import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import PriorityBadge from '../components/PriorityBadge';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { EventEntry, EventsPrograms } from '../types';

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
`;

const ADD_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'date', label: 'Date (YYYY-MM-DD)' },
  { name: 'location', label: 'Location' },
  { name: 'budget', label: 'Budget', type: 'number' },
  { name: 'expectedLeads', label: 'Expected Leads', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['considering', 'planning', 'registered', 'attended'],
    defaultValue: 'considering',
  },
];

export default function EventsPanel() {
  const { data, loading } = useFirebaseData<EventsPrograms>('/ops-dashboard/events-programs');
  const { writeImmediate } = useWriteBack('/ops-dashboard/events-programs');
  const [showAdd, setShowAdd] = useState(false);

  const events = data?.events ?? [];
  const programs = data?.programs ?? [];
  const currentData: EventsPrograms = {
    currentQuarter: data?.currentQuarter ?? '',
    nextQuarter: data?.nextQuarter ?? '',
    events,
    programs,
  };
  const empty = !loading && events.length === 0 && programs.length === 0;

  const addEvent = (values: Record<string, string>) => {
    const e: EventEntry = {
      name: values.name,
      date: values.date,
      location: values.location,
      booth: false,
      budget: Number(values.budget) || 0,
      expectedLeads: Number(values.expectedLeads) || 0,
      status: values.status,
      notes: '',
    };
    writeImmediate({ ...currentData, events: [...events, e] });
    setShowAdd(false);
  };

  const deleteEvent = (index: number) => {
    if (!confirm(`Delete ${events[index].name}?`)) return;
    writeImmediate({ ...currentData, events: events.filter((_, i) => i !== index) });
  };

  const actions = (
    <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add Event'}</Btn>
  );

  return (
    <Panel
      id="events"
      title="Events & Programs"
      badge={events.length + programs.length}
      actions={actions}
      empty={empty}
    >
      {events.length > 0 && (
        <>
          <SectionTitle>Events</SectionTitle>
          <Grid>
            {events.map((e, i) => (
              <Card key={i}>
                <DeleteBtn $danger onClick={() => deleteEvent(i)}>
                  ×
                </DeleteBtn>
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
              </Card>
            ))}
          </Grid>
        </>
      )}
      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addEvent} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
