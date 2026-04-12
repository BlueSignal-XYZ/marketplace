import { useState } from 'react';
import styled from 'styled-components';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useWriteBack } from '../hooks/useWriteBack';
import Panel from '../components/Panel';
import { Table, Th, Td, Tr } from '../components/DataTable';
import EditableCell from '../components/EditableCell';
import AddForm, { type FieldDef } from '../components/AddForm';
import type { TeamCapTable, TeamMember, FundingRound } from '../types';

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

const BtnRow = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ChartWrapper = styled.div`
  margin-top: 1rem;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
`;

const BarLabel = styled.span`
  width: 100px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text2};
  text-align: right;
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 16px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.4s ease;
  display: flex;
  align-items: center;
  padding-left: 0.4rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: #fff;
`;

const MEMBER_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'role', label: 'Role' },
  { name: 'equity', label: 'Equity %', type: 'number' },
  { name: 'startDate', label: 'Start Date' },
  { name: 'vesting', label: 'Vesting' },
];

const ROUND_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Round Name' },
  { name: 'targetRaise', label: 'Target Raise', type: 'number' },
  { name: 'targetValuation', label: 'Valuation', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['planned', 'reserved', 'issued'],
    defaultValue: 'planned',
  },
];

const BAR_COLORS = ['#4f8ff7', '#a78bfa', '#34d399', '#fbbf24', '#fb923c', '#f87171', '#9498a8'];

const ROUND_STATUSES: FundingRound['status'][] = ['planned', 'reserved', 'issued'];

const StatusSelect = styled.select`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;
  text-transform: capitalize;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export default function TeamCapPanel() {
  const { data, loading } = useFirebaseData<TeamCapTable>('/ops-dashboard/team-cap-table');
  const { writeImmediate } = useWriteBack('/ops-dashboard/team-cap-table');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddRound, setShowAddRound] = useState(false);

  const members = data?.members ?? [];
  const capTable = data?.capTable ?? { authorized: 10000000, rounds: [] };
  const rounds = capTable.rounds ?? [];

  const save = (updated: TeamCapTable) => writeImmediate(updated);

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: field === 'equity' ? Number(value) : value };
    save({ members: updated, capTable });
  };

  const deleteMember = (index: number) => {
    if (!confirm(`Remove ${members[index].name}?`)) return;
    save({ members: members.filter((_, i) => i !== index), capTable });
  };

  const addMember = (values: Record<string, string>) => {
    const m: TeamMember = {
      name: values.name,
      role: values.role,
      equity: Number(values.equity) || 0,
      startDate: values.startDate,
      vesting: values.vesting,
    };
    save({ members: [...members, m], capTable });
    setShowAddMember(false);
  };

  const updateRound = (index: number, field: keyof FundingRound, value: string) => {
    const updated = [...rounds];
    const numFields: (keyof FundingRound)[] = [
      'shares',
      'price',
      'targetRaise',
      'targetValuation',
      'targetShares',
    ];
    updated[index] = {
      ...updated[index],
      [field]: numFields.includes(field) ? (value ? Number(value) : null) : value,
    };
    save({ members, capTable: { ...capTable, rounds: updated } });
  };

  const addRound = (values: Record<string, string>) => {
    const r: FundingRound = {
      name: values.name,
      shares: 0,
      price: null,
      status: values.status as FundingRound['status'],
      targetRaise: values.targetRaise ? Number(values.targetRaise) : null,
      targetValuation: values.targetValuation ? Number(values.targetValuation) : null,
      targetShares: null,
    };
    save({ members, capTable: { ...capTable, rounds: [...rounds, r] } });
    setShowAddRound(false);
  };

  const deleteRound = (index: number) => {
    if (!confirm(`Remove ${rounds[index].name}?`)) return;
    save({ members, capTable: { ...capTable, rounds: rounds.filter((_, i) => i !== index) } });
  };

  const actions = (
    <BtnRow>
      <Btn onClick={() => setShowAddMember(!showAddMember)}>+ Member</Btn>
      <Btn onClick={() => setShowAddRound(!showAddRound)}>+ Round</Btn>
    </BtnRow>
  );

  return (
    <Panel
      id="team-cap"
      title="Team & Cap Table"
      actions={actions}
      empty={!loading && members.length === 0 && rounds.length === 0}
    >
      <SectionTitle>Team</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Equity %</Th>
            <Th>Start Date</Th>
            <Th>Vesting</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                <EditableCell value={m.name} onSave={(v) => updateMember(i, 'name', v)} />
              </Td>
              <Td>
                <EditableCell value={m.role} onSave={(v) => updateMember(i, 'role', v)} />
              </Td>
              <Td>
                <EditableCell
                  value={m.equity}
                  type="number"
                  onSave={(v) => updateMember(i, 'equity', v)}
                />
              </Td>
              <Td>
                <EditableCell value={m.startDate} onSave={(v) => updateMember(i, 'startDate', v)} />
              </Td>
              <Td>{m.vesting}</Td>
              <Td>
                <Btn $danger onClick={() => deleteMember(i)}>
                  Remove
                </Btn>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {showAddMember && (
        <AddForm
          fields={MEMBER_FIELDS}
          onAdd={addMember}
          onCancel={() => setShowAddMember(false)}
        />
      )}

      <SectionTitle>Funding Rounds</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Round</Th>
            <Th>Shares</Th>
            <Th>Price</Th>
            <Th>Status</Th>
            <Th>Target Raise</Th>
            <Th>Valuation</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((r, i) => (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                <EditableCell value={r.name} onSave={(v) => updateRound(i, 'name', v)} />
              </Td>
              <Td>
                <EditableCell
                  value={r.shares}
                  type="number"
                  onSave={(v) => updateRound(i, 'shares', v)}
                />
              </Td>
              <Td>
                <EditableCell
                  value={r.price ?? ''}
                  type="number"
                  onSave={(v) => updateRound(i, 'price', v)}
                />
              </Td>
              <Td>
                <StatusSelect
                  value={r.status}
                  onChange={(e) => updateRound(i, 'status', e.target.value)}
                >
                  {ROUND_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </StatusSelect>
              </Td>
              <Td>
                <EditableCell
                  value={r.targetRaise ?? ''}
                  type="number"
                  onSave={(v) => updateRound(i, 'targetRaise', v)}
                />
              </Td>
              <Td>
                <EditableCell
                  value={r.targetValuation ?? ''}
                  type="number"
                  onSave={(v) => updateRound(i, 'targetValuation', v)}
                />
              </Td>
              <Td>
                <Btn $danger onClick={() => deleteRound(i)}>
                  Remove
                </Btn>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {showAddRound && (
        <AddForm fields={ROUND_FIELDS} onAdd={addRound} onCancel={() => setShowAddRound(false)} />
      )}

      <ChartWrapper>
        <SectionTitle>Ownership</SectionTitle>
        {rounds
          .filter((r) => r.shares > 0 || r.status === 'reserved')
          .map((r, i) => {
            const pct = capTable.authorized > 0 ? (r.shares / capTable.authorized) * 100 : 0;
            return (
              <BarRow key={i}>
                <BarLabel>{r.name}</BarLabel>
                <BarTrack>
                  <BarFill $pct={pct} $color={BAR_COLORS[i % BAR_COLORS.length]}>
                    {pct >= 5 ? `${pct.toFixed(1)}%` : ''}
                  </BarFill>
                </BarTrack>
              </BarRow>
            );
          })}
      </ChartWrapper>
    </Panel>
  );
}
