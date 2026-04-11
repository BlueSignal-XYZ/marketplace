import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import EditableCell from '../components/EditableCell';
import StageSelect from '../components/StageSelect';
import AddForm, { type FieldDef } from '../components/AddForm';
import { PIPELINE_STAGES, type Customer, type PipelineStage } from '../types';

const StageCounts = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const StagePill = styled.div<{ $active: boolean }>`
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : theme.colors.surface2)};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.text3)};
  cursor: pointer;
  white-space: nowrap;
`;

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

const ADD_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'contact', label: 'Contact' },
  { name: 'type', label: 'Type' },
  {
    name: 'stage',
    label: 'Stage',
    type: 'select',
    options: [...PIPELINE_STAGES],
    defaultValue: 'Prospect',
  },
  { name: 'notes', label: 'Notes' },
];

export default function CRMPanel() {
  const { data, loading } = useFirebaseData<Customer[]>('/ops-dashboard/customers');
  const { writeImmediate } = useWriteBack('/ops-dashboard/customers');
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<PipelineStage | null>(null);

  const customers = data ?? [];
  const filtered = filter ? customers.filter((c) => c.stage === filter) : customers;

  const stageCounts = PIPELINE_STAGES.map((s) => ({
    stage: s,
    count: customers.filter((c) => c.stage === s).length,
  }));

  const updateCustomer = (index: number, field: keyof Customer, value: string) => {
    const updated = [...customers];
    updated[index] = { ...updated[index], [field]: field === 'dealValue' ? Number(value) : value };
    writeImmediate(updated);
  };

  const deleteCustomer = (index: number) => {
    if (!confirm(`Delete ${customers[index].name}?`)) return;
    const updated = customers.filter((_, i) => i !== index);
    writeImmediate(updated);
  };

  const addCustomer = (values: Record<string, string>) => {
    const newCustomer: Customer = {
      name: values.name,
      contact: values.contact,
      type: values.type,
      stage: values.stage as PipelineStage,
      dealValue: 0,
      lastContact: '',
      notes: values.notes,
    };
    writeImmediate([...customers, newCustomer]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="crm"
      title="CRM"
      badge={customers.length}
      actions={actions}
      empty={!loading && customers.length === 0}
    >
      <StageCounts>
        <StagePill $active={filter === null} onClick={() => setFilter(null)}>
          All ({customers.length})
        </StagePill>
        {stageCounts.map((sc) => (
          <StagePill
            key={sc.stage}
            $active={filter === sc.stage}
            onClick={() => setFilter(filter === sc.stage ? null : sc.stage)}
          >
            {sc.stage} ({sc.count})
          </StagePill>
        ))}
      </StageCounts>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Contact</Th>
            <Th>Type</Th>
            <Th>Stage</Th>
            <Th>Deal Value</Th>
            <Th>Notes</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => {
            const realIndex = customers.indexOf(c);
            return (
              <Tr key={realIndex}>
                <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                  <EditableCell
                    value={c.name}
                    onSave={(v) => updateCustomer(realIndex, 'name', v)}
                  />
                </Td>
                <Td>
                  <EditableCell
                    value={c.contact}
                    onSave={(v) => updateCustomer(realIndex, 'contact', v)}
                  />
                </Td>
                <Td>
                  <EditableCell
                    value={c.type}
                    onSave={(v) => updateCustomer(realIndex, 'type', v)}
                  />
                </Td>
                <Td>
                  <StageSelect
                    value={c.stage}
                    onChange={(s) => updateCustomer(realIndex, 'stage', s)}
                  />
                </Td>
                <Td>
                  <EditableCell
                    value={c.dealValue}
                    type="number"
                    onSave={(v) => updateCustomer(realIndex, 'dealValue', v)}
                  />
                </Td>
                <Td>
                  <EditableCell
                    value={c.notes}
                    onSave={(v) => updateCustomer(realIndex, 'notes', v)}
                  />
                </Td>
                <Td>
                  <ActionRow>
                    <Btn $danger onClick={() => deleteCustomer(realIndex)}>
                      Delete
                    </Btn>
                  </ActionRow>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>

      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addCustomer} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
