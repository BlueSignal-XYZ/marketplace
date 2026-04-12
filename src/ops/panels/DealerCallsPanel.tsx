import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { DealerCall, DealerCalls } from '../types';

const ActionRow = styled.div`
  display: flex;
  gap: 0.4rem;
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

const InlineSelect = styled.select`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.15rem 0.35rem;
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const STATUS_OPTIONS = ['scheduled', 'completed', 'missed', 'rescheduled'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'day', label: 'Day' },
  { name: 'time', label: 'Time' },
  { name: 'dealer', label: 'Dealer' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [...STATUS_OPTIONS],
    defaultValue: 'scheduled',
  },
  { name: 'notes', label: 'Notes' },
];

export default function DealerCallsPanel() {
  const { data, loading } = useFirebaseData<DealerCalls>('/ops-dashboard/dealer-calls');
  const { writeImmediate } = useWriteBack('/ops-dashboard/dealer-calls');
  const [showAdd, setShowAdd] = useState(false);

  const calls = data?.calls ?? [];

  const persist = (updated: DealerCall[]) => {
    writeImmediate({ week: data?.week ?? '', calls: updated });
  };

  const updateCall = (index: number, field: keyof DealerCall, value: string) => {
    const updated = [...calls];
    const current = { ...updated[index] } as DealerCall;
    (current as any)[field] = value;
    updated[index] = current;
    persist(updated);
  };

  const deleteCall = (index: number) => {
    if (!confirm(`Delete call with ${calls[index].dealer}?`)) return;
    persist(calls.filter((_, i) => i !== index));
  };

  const addCall = (values: Record<string, string>) => {
    const newCall: DealerCall = {
      day: values.day,
      time: values.time,
      dealer: values.dealer,
      status: values.status || 'scheduled',
      notes: values.notes,
    };
    persist([...calls, newCall]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="dealer-calls"
      title="Dealer Calls"
      badge={calls.length}
      actions={actions}
      empty={!loading && calls.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Day</Th>
            <Th>Time</Th>
            <Th>Dealer</Th>
            <Th>Status</Th>
            <Th>Notes</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {calls.map((c, i) => (
            <Tr key={i}>
              <Td>
                <EditableCell value={c.day} onSave={(v) => updateCall(i, 'day', v)} />
              </Td>
              <Td>
                <EditableCell value={c.time} onSave={(v) => updateCall(i, 'time', v)} />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>
                <EditableCell value={c.dealer} onSave={(v) => updateCall(i, 'dealer', v)} />
              </Td>
              <Td>
                <InlineSelect
                  value={c.status}
                  onChange={(e) => updateCall(i, 'status', e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </InlineSelect>
              </Td>
              <Td>
                <EditableCell value={c.notes} onSave={(v) => updateCall(i, 'notes', v)} />
              </Td>
              <Td>
                <ActionRow>
                  <Btn $danger onClick={() => deleteCall(i)}>
                    Delete
                  </Btn>
                </ActionRow>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addCall} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
