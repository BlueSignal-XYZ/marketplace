import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { AgendaItem } from '../types';

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

const TYPE_OPTIONS = ['engineering', 'personal', 'meeting', 'sales'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'time', label: 'Time' },
  { name: 'title', label: 'Title' },
  { name: 'duration', label: 'Duration (min)', type: 'number', defaultValue: '30' },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [...TYPE_OPTIONS],
    defaultValue: 'engineering',
  },
  { name: 'notes', label: 'Notes' },
];

export default function TodaysAgendaPanel() {
  const { data, loading } = useFirebaseData<AgendaItem[]>('/ops-dashboard/todays-agenda');
  const { writeImmediate } = useWriteBack('/ops-dashboard/todays-agenda');
  const [showAdd, setShowAdd] = useState(false);

  const items = data ?? [];

  const updateItem = (index: number, field: keyof AgendaItem, value: string) => {
    const updated = [...items];
    const current = { ...updated[index] } as AgendaItem;
    if (field === 'duration') {
      (current as any).duration = Number(value) || 0;
    } else {
      (current as any)[field] = value;
    }
    updated[index] = current;
    writeImmediate(updated);
  };

  const deleteItem = (index: number) => {
    if (!confirm(`Delete ${items[index].title}?`)) return;
    writeImmediate(items.filter((_, i) => i !== index));
  };

  const addItem = (values: Record<string, string>) => {
    const newItem: AgendaItem = {
      time: values.time,
      title: values.title,
      duration: Number(values.duration) || 0,
      type: values.type,
      notes: values.notes,
    };
    writeImmediate([...items, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="todays-agenda"
      title="Today's Agenda"
      badge={items.length}
      actions={actions}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Time</Th>
            <Th>Activity</Th>
            <Th>Duration</Th>
            <Th>Type</Th>
            <Th>Notes</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td style={{ whiteSpace: 'nowrap', color: '#e2e4ea' }}>
                <EditableCell value={item.time} onSave={(v) => updateItem(i, 'time', v)} />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>
                <EditableCell value={item.title} onSave={(v) => updateItem(i, 'title', v)} />
              </Td>
              <Td>
                <EditableCell
                  value={item.duration}
                  type="number"
                  onSave={(v) => updateItem(i, 'duration', v)}
                />
              </Td>
              <Td>
                <InlineSelect
                  value={item.type}
                  onChange={(e) => updateItem(i, 'type', e.target.value)}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </InlineSelect>
              </Td>
              <Td>
                <EditableCell value={item.notes} onSave={(v) => updateItem(i, 'notes', v)} />
              </Td>
              <Td>
                <ActionRow>
                  <Btn $danger onClick={() => deleteItem(i)}>
                    Delete
                  </Btn>
                </ActionRow>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addItem} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
