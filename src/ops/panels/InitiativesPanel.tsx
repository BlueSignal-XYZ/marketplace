import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import ProgressBar from '../components/ProgressBar';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { Initiative } from '../types';

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  gap: 0.5rem;
  /* Reserve room for the absolutely-positioned DeleteBtn at top-right. */
  padding-right: 1.5rem;

  @media (max-width: 1024px) {
    padding-right: 2.5rem;
  }
`;

const Name = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const Desc = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-bottom: 0.5rem;
`;

const PctLabel = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const Milestone = styled.div<{ $done: boolean }>`
  font-size: 0.75rem;
  color: ${({ $done, theme }) => ($done ? theme.colors.green : theme.colors.text2)};
  padding: 0.15rem 0;
  &::before {
    content: '${({ $done }) => ($done ? '\u2713' : '\u25CB')}';
    margin-right: 0.4rem;
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

const StatusSelect = styled.select`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
  cursor: pointer;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const STATUS_OPTIONS: Initiative['status'][] = ['in-progress', 'pending', 'completed'];

const ADD_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'description', label: 'Description' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [...STATUS_OPTIONS],
    defaultValue: 'pending',
  },
  { name: 'target', label: 'Target (YYYY-MM-DD)' },
  { name: 'progress', label: 'Progress', type: 'number', defaultValue: '0' },
];

export default function InitiativesPanel() {
  const { data, loading } = useFirebaseData<Initiative[]>('/ops-dashboard/active-initiatives');
  const { writeImmediate } = useWriteBack('/ops-dashboard/active-initiatives');
  const [showAdd, setShowAdd] = useState(false);

  const items = data ?? [];

  const updateInitiative = (index: number, field: keyof Initiative, value: string) => {
    const updated = [...items];
    const current = { ...updated[index] } as Initiative;
    if (field === 'progress') {
      (current as any).progress = Number(value) || 0;
    } else {
      (current as any)[field] = value;
    }
    updated[index] = current;
    writeImmediate(updated);
  };

  const deleteInitiative = (index: number) => {
    if (!confirm(`Delete ${items[index].name}?`)) return;
    writeImmediate(items.filter((_, i) => i !== index));
  };

  const addInitiative = (values: Record<string, string>) => {
    const newItem: Initiative = {
      name: values.name,
      description: values.description,
      status: (values.status as Initiative['status']) || 'pending',
      target: values.target,
      progress: Number(values.progress) || 0,
      milestones: [],
    };
    writeImmediate([...items, newItem]);
    setShowAdd(false);
  };

  const actions = <Btn onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'Cancel' : '+ Add'}</Btn>;

  return (
    <Panel
      id="initiatives"
      title="Active Initiatives"
      badge={items.length}
      actions={actions}
      empty={!loading && items.length === 0}
    >
      <Grid>
        {items.map((init, i) => (
          <Card key={i}>
            <DeleteBtn $danger onClick={() => deleteInitiative(i)}>
              ×
            </DeleteBtn>
            <Header>
              <Name>
                <EditableCell value={init.name} onSave={(v) => updateInitiative(i, 'name', v)} />
              </Name>
              <StatusSelect
                value={init.status}
                onChange={(e) => updateInitiative(i, 'status', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </StatusSelect>
            </Header>
            <Desc>
              <EditableCell
                value={init.description}
                onSave={(v) => updateInitiative(i, 'description', v)}
              />
            </Desc>
            <ProgressBar value={init.progress} />
            <PctLabel>
              <span>
                <EditableCell
                  value={init.progress}
                  type="number"
                  onSave={(v) => updateInitiative(i, 'progress', v)}
                />
                %
              </span>
              <span>
                Target:{' '}
                <EditableCell
                  value={init.target}
                  onSave={(v) => updateInitiative(i, 'target', v)}
                />
              </span>
            </PctLabel>
            {init.milestones?.map((m, j) => (
              <Milestone key={j} $done={m.status === 'done'}>
                {m.name}
              </Milestone>
            ))}
          </Card>
        ))}
      </Grid>
      {showAdd && (
        <AddForm fields={ADD_FIELDS} onAdd={addInitiative} onCancel={() => setShowAdd(false)} />
      )}
    </Panel>
  );
}
