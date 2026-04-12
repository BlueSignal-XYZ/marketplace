import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { OpenLoop } from '../types';

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

const PriorityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
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

const PRIORITY_OPTIONS: OpenLoop['priority'][] = ['high', 'medium', 'low'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'title', label: 'Title' },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    options: [...PRIORITY_OPTIONS],
    defaultValue: 'medium',
  },
  { name: 'age', label: 'Age (days)', type: 'number', defaultValue: '0' },
  { name: 'nextStep', label: 'Next Step' },
];

export default function OpenLoopsPanel() {
  const { data, loading } = useFirebaseData<OpenLoop[]>('/ops-dashboard/open-loops');
  const { writeImmediate } = useWriteBack('/ops-dashboard/open-loops');
  const [showAdd, setShowAdd] = useState(false);

  const items = data ?? [];

  const updateItem = (index: number, field: keyof OpenLoop, value: string) => {
    const updated = [...items];
    const current = { ...updated[index] } as OpenLoop;
    if (field === 'age') {
      (current as any).age = Number(value) || 0;
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
    const newItem: OpenLoop = {
      title: values.title,
      priority: (values.priority as OpenLoop['priority']) || 'medium',
      age: Number(values.age) || 0,
      nextStep: values.nextStep,
    };
    writeImmediate([...items, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="open-loops"
      title="Open Loops"
      badge={items.length}
      actions={actions}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>Priority</Th>
            <Th>Item</Th>
            <Th>Age</Th>
            <Th>Next Step</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <Tr key={i}>
              <Td>
                <PriorityRow>
                  <PriorityBadge value={item.priority} />
                  <InlineSelect
                    value={item.priority}
                    onChange={(e) => updateItem(i, 'priority', e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </InlineSelect>
                </PriorityRow>
              </Td>
              <Td style={{ color: '#e2e4ea' }}>
                <EditableCell value={item.title} onSave={(v) => updateItem(i, 'title', v)} />
              </Td>
              <Td>
                <EditableCell
                  value={item.age}
                  type="number"
                  onSave={(v) => updateItem(i, 'age', v)}
                />
              </Td>
              <Td>
                <EditableCell value={item.nextStep} onSave={(v) => updateItem(i, 'nextStep', v)} />
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
