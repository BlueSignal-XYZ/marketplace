import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Panel from '../../components/Panel';
import AddForm, { type FieldDef } from '../../components/AddForm';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { useWriteBack } from '../../hooks/useWriteBack';
import type { FundingRound, Instrument, TeamCapTable, TeamMember } from '../../types';
import {
  computeCurrentOutstanding,
  computeIssuedShares,
  computeProForma,
  computeReservedShares,
  memberBucket,
  normalizeTeamCapTable,
} from './dilution';
import KPICards, { type KPIData } from './KPICards';
import TeamTable from './TeamTable';
import RoundsTable from './RoundsTable';
import DilutionSection from './DilutionSection';

// Lazy-load exports to keep jspdf/papaparse out of the initial ops bundle.
// They are only loaded when the user clicks Export.
const loadExports = () => import('./exports');

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 1rem 0 0.5rem;
  &:first-of-type {
    margin-top: 0;
  }
`;

const Btn = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' }>`
  background: ${({ $variant, theme }) =>
    $variant === 'danger'
      ? theme.colors.redDim
      : $variant === 'ghost'
        ? theme.colors.surface2
        : theme.colors.accentDim};
  color: ${({ $variant, theme }) =>
    $variant === 'danger'
      ? theme.colors.red
      : $variant === 'ghost'
        ? theme.colors.text2
        : theme.colors.accent};
  border: none;
  border-radius: 3px;
  padding: 0.25rem 0.55rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
`;

const MEMBER_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name' },
  { name: 'role', label: 'Role' },
  { name: 'equity', label: 'Equity %', type: 'number' },
  { name: 'startDate', label: 'Start Date (YYYY-MM-DD)' },
  { name: 'vestingYears', label: 'Vesting (yrs)', type: 'number', defaultValue: '4' },
  { name: 'cliffYears', label: 'Cliff (yrs)', type: 'number', defaultValue: '1' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Open', 'Vested', 'Terminated'],
    defaultValue: 'Open',
  },
];

const ROUND_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Round' },
  {
    name: 'instrument',
    label: 'Instrument',
    type: 'select',
    options: ['Common Stock', 'Preferred Stock', 'SAFE', 'Convertible Note', 'Reserved'],
    defaultValue: 'SAFE',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['Issued', 'Reserved', 'Planned', 'Closed', 'Converting'],
    defaultValue: 'Planned',
  },
  { name: 'targetRaise', label: 'Target Raise', type: 'number' },
  { name: 'targetValuation', label: 'Valuation / Cap', type: 'number' },
];

export default function TeamCapPanel() {
  const { data, loading } = useFirebaseData<TeamCapTable>('/ops-dashboard/team-cap-table');
  const { writeImmediate } = useWriteBack('/ops-dashboard/team-cap-table');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddRound, setShowAddRound] = useState(false);
  const [mode, setMode] = useState<'current' | 'proforma'>('current');

  const normalized = useMemo(() => normalizeTeamCapTable(data), [data]);
  const members = normalized.members;
  const capTable = normalized.capTable;
  const rounds = capTable.rounds;

  const totalOutstanding = useMemo(() => computeCurrentOutstanding(rounds), [rounds]);
  const issuedShares = useMemo(() => computeIssuedShares(rounds), [rounds]);
  const reservedShares = useMemo(() => computeReservedShares(rounds), [rounds]);

  const proformaAll = useMemo(
    () => computeProForma({ members, rounds, mode: 'proforma' }),
    [members, rounds]
  );

  const founderShares = useMemo(
    () =>
      members
        .filter((m) => memberBucket(m) === 'Founder')
        .reduce(
          (acc, m) => acc + (m.shares ?? Math.round(((m.equity || 0) / 100) * totalOutstanding)),
          0
        ),
    [members, totalOutstanding]
  );

  const kpis: KPIData = {
    authorized: capTable.authorized,
    issued: issuedShares,
    reserved: reservedShares,
    available: Math.max(0, capTable.authorized - issuedShares - reservedShares),
    founderPctCurrent: totalOutstanding > 0 ? (founderShares / totalOutstanding) * 100 : 0,
    founderPctDiluted:
      proformaAll.final.totalShares > 0
        ? (proformaAll.final.founderShares / proformaAll.final.totalShares) * 100
        : 0,
  };

  const save = (updated: TeamCapTable) => writeImmediate(updated);

  const updateMember = (index: number, updates: Partial<TeamMember>) => {
    const updated = [...members];
    updated[index] = { ...updated[index], ...updates };
    save({ members: updated, capTable });
  };

  const removeMember = (index: number) => {
    save({ members: members.filter((_, i) => i !== index), capTable });
  };

  const addMember = (values: Record<string, string>) => {
    const m: TeamMember = {
      name: values.name,
      role: values.role,
      equity: Number(values.equity) || 0,
      shares:
        totalOutstanding > 0
          ? Math.round(((Number(values.equity) || 0) / 100) * totalOutstanding)
          : null,
      startDate: values.startDate || '',
      vesting: '',
      vestingYears: values.vestingYears ? Number(values.vestingYears) : 4,
      cliffYears: values.cliffYears ? Number(values.cliffYears) : 1,
      status: (values.status as TeamMember['status']) || 'Open',
      filed83b: false,
    };
    save({ members: [...members, m], capTable });
    setShowAddMember(false);
  };

  const updateRound = (index: number, updates: Partial<FundingRound>) => {
    const updated = [...rounds];
    updated[index] = { ...updated[index], ...updates };
    save({ members, capTable: { ...capTable, rounds: updated } });
  };

  const removeRound = (index: number) => {
    save({ members, capTable: { ...capTable, rounds: rounds.filter((_, i) => i !== index) } });
  };

  const addRound = (values: Record<string, string>) => {
    const r: FundingRound = {
      name: values.name,
      instrument: (values.instrument as Instrument) || 'SAFE',
      shares: 0,
      price: null,
      status: (values.status as FundingRound['status']) || 'Planned',
      targetRaise: values.targetRaise ? Number(values.targetRaise) : null,
      targetValuation: values.targetValuation ? Number(values.targetValuation) : null,
      targetShares: null,
    };
    save({ members, capTable: { ...capTable, rounds: [...rounds, r] } });
    setShowAddRound(false);
  };

  const handleExportTeamCSV = async () => {
    const mod = await loadExports();
    mod.exportTeamCSV(members);
  };
  const handleExportRoundsCSV = async () => {
    const mod = await loadExports();
    mod.exportRoundsCSV(rounds);
  };
  const handleExportPDF = async () => {
    const mod = await loadExports();
    mod.exportPDF({ data: normalized, kpis });
  };

  const actions = (
    <HeaderActions>
      <Btn onClick={() => setShowAddMember((v) => !v)}>+ Member</Btn>
      <Btn onClick={() => setShowAddRound((v) => !v)}>+ Round</Btn>
      <Btn $variant="ghost" onClick={handleExportTeamCSV}>
        CSV (Team)
      </Btn>
      <Btn $variant="ghost" onClick={handleExportRoundsCSV}>
        CSV (Rounds)
      </Btn>
      <Btn $variant="ghost" onClick={handleExportPDF}>
        PDF
      </Btn>
    </HeaderActions>
  );

  const isEmpty = !loading && members.length === 0 && rounds.length === 0;

  return (
    <Panel id="team-cap" title="Team & Cap Table" actions={actions} empty={isEmpty}>
      <KPICards data={kpis} />

      <SectionTitle>Team</SectionTitle>
      <TeamTable
        members={members}
        totalOutstanding={totalOutstanding}
        onUpdateMember={updateMember}
        onRemoveMember={removeMember}
      />
      {showAddMember && (
        <AddForm
          fields={MEMBER_FIELDS}
          onAdd={addMember}
          onCancel={() => setShowAddMember(false)}
        />
      )}

      <SectionTitle>Funding Rounds</SectionTitle>
      <RoundsTable rounds={rounds} onUpdateRound={updateRound} onRemoveRound={removeRound} />
      {showAddRound && (
        <AddForm fields={ROUND_FIELDS} onAdd={addRound} onCancel={() => setShowAddRound(false)} />
      )}

      <SectionTitle>Dilution</SectionTitle>
      <DilutionSection members={members} rounds={rounds} mode={mode} onChangeMode={setMode} />
    </Panel>
  );
}
