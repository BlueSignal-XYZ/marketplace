import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import PriorityBadge from '../components/PriorityBadge';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { TopAccount } from '../types';

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

const HEALTH_OPTIONS = ['prospect', 'customer', 'at-risk', 'churned'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'rank', label: 'Rank', type: 'number', defaultValue: '0' },
  { name: 'name', label: 'Name' },
  {
    name: 'health',
    label: 'Health',
    type: 'select',
    options: [...HEALTH_OPTIONS],
    defaultValue: 'prospect',
  },
  { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: '0' },
  { name: 'lastContact', label: 'Last Contact' },
  { name: 'nextAction', label: 'Next Action' },
];

export default function TopAccountsPanel() {
  const { data, loading } = useFirebaseData<TopAccount[]>('/ops-dashboard/top-accounts');
  const { writeImmediate } = useWriteBack('/ops-dashboard/top-accounts');
  const [showAdd, setShowAdd] = useState(false);

  const items = data ?? [];

  const updateItem = (index: number, field: keyof TopAccount, value: string) => {
    const updated = [...items];
    const current = { ...updated[index] } as TopAccount;
    if (field === 'rank') {
      (current as any).rank = Number(value) || 0;
    } else if (field === 'revenue') {
      (current as any).revenue = value === '' ? null : Number(value);
    } else {
      (current as any)[field] = value;
    }
    updated[index] = current;
    writeImmediate(updated);
  };

  const deleteItem = (index: number) => {
    if (!confirm(`Delete ${items[index].name}?`)) return;
    writeImmediate(items.filter((_, i) => i !== index));
  };

  const addItem = (values: Record<string, string>) => {
    const newItem: TopAccount = {
      rank: Number(values.rank) || items.length + 1,
      name: values.name,
      health: values.health || 'prospect',
      revenue: values.revenue === '' ? null : Number(values.revenue),
      lastContact: values.lastContact,
      nextAction: values.nextAction,
    };
    writeImmediate([...items, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="top-accounts"
      title="Top Accounts"
      badge={items.length}
      actions={actions}
      empty={!loading && items.length === 0}
    >
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Account</Th>
            <Th>Health</Th>
            <Th>Revenue</Th>
            <Th>Last Contact</Th>
            <Th>Next Action</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((a, i) => (
            <Tr key={i}>
              <Td>
                <EditableCell
                  value={a.rank}
                  type="number"
                  onSave={(v) => updateItem(i, 'rank', v)}
                />
              </Td>
              <Td style={{ color: '#e2e4ea' }}>
                <EditableCell value={a.name} onSave={(v) => updateItem(i, 'name', v)} />
              </Td>
              <Td>
                <PriorityBadge
                  value={a.health}
                  options={HEALTH_OPTIONS}
                  onChange={(v) => updateItem(i, 'health', v)}
                />
              </Td>
              <Td>
                <EditableCell
                  value={a.revenue != null ? a.revenue : ''}
                  type="number"
                  onSave={(v) => updateItem(i, 'revenue', v)}
                />
              </Td>
              <Td>
                <EditableCell
                  value={a.lastContact}
                  onSave={(v) => updateItem(i, 'lastContact', v)}
                />
              </Td>
              <Td>
                <EditableCell value={a.nextAction} onSave={(v) => updateItem(i, 'nextAction', v)} />
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
