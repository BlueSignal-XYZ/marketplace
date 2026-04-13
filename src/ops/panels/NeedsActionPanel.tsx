import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { ActionItem } from '../types';

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

const PRIORITY_OPTIONS: ActionItem['priority'][] = ['high', 'medium', 'low'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'title', label: 'Title' },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    options: [...PRIORITY_OPTIONS],
    defaultValue: 'medium',
  },
  { name: 'account', label: 'Account' },
  { name: 'notes', label: 'Notes' },
];

export default function NeedsActionPanel() {
  const { data, loading } = useFirebaseData<ActionItem[]>('/ops-dashboard/needs-action-today');
  const { writeImmediate } = useWriteBack('/ops-dashboard/needs-action-today');
  const [showAdd, setShowAdd] = useState(false);

  const items = data ?? [];

  const updateItem = (index: number, field: keyof ActionItem, value: string) => {
    const updated = [...items];
    const current = { ...updated[index] } as ActionItem;
    (current as any)[field] = value;
    updated[index] = current;
    writeImmediate(updated);
  };

  const deleteItem = (index: number) => {
    if (!confirm(`Delete ${items[index].title}?`)) return;
    writeImmediate(items.filter((_, i) => i !== index));
  };

  const addItem = (values: Record<string, string>) => {
    const newItem: ActionItem = {
      title: values.title,
      priority: (values.priority as ActionItem['priority']) || 'medium',
      account: values.account,
      notes: values.notes,
    };
    writeImmediate([...items, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="needs-action"
      title="Needs Action Today"
      badge={items.length}
      actions={actions}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Priority</Th>
            <Th>Item</Th>
            <Th>Account</Th>
            <Th>Notes</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td>
                <PriorityBadge
                  value={item.priority}
                  options={PRIORITY_OPTIONS}
                  onChange={(v) => updateItem(i, 'priority', v)}
                />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>
                <EditableCell value={item.title} onSave={(v) => updateItem(i, 'title', v)} />
              </Td>
              <Td>
                <EditableCell value={item.account} onSave={(v) => updateItem(i, 'account', v)} />
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
