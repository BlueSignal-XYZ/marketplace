import styled from 'styled-components';
import { Table, Th, Td, Tr } from '../../components/DataTable';
import EditableCell from '../../components/EditableCell';
import type { TeamMember, MemberStatus } from '../../types';
import {
  election83bDeadline,
  election83bStatus,
  formatNumber,
  formatPct,
  normalizeMemberStatus,
  vestingProgress,
} from './dilution';

const MEMBER_STATUSES: MemberStatus[] = ['Active', 'Open', 'Vested', 'Terminated'];

const StatusSelect = styled.select`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const RemoveBtn = styled.button`
  background: ${({ theme }) => theme.colors.redDim};
  color: ${({ theme }) => theme.colors.red};
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

const CheckBox = styled.input.attrs({ type: 'checkbox' })`
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`;

const DeadlineCell = styled.span<{ $state: 'na' | 'filed' | 'warn' | 'overdue' }>`
  color: ${({ $state, theme }) =>
    $state === 'overdue'
      ? theme.colors.red
      : $state === 'warn'
        ? theme.colors.yellow
        : $state === 'filed'
          ? theme.colors.green
          : theme.colors.text2};
  font-weight: ${({ $state }) => ($state === 'overdue' || $state === 'warn' ? 600 : 400)};
  font-size: 0.75rem;
`;

const VestingBar = styled.div`
  width: 70px;
  height: 5px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.15rem;
`;

const VestingFill = styled.div<{ $pct: number; $vested: boolean }>`
  height: 100%;
  width: ${({ $pct }) => Math.max(0, Math.min(100, $pct))}%;
  background: ${({ $vested, theme }) => ($vested ? theme.colors.green : theme.colors.accent)};
  transition: width 0.4s ease;
`;

const VestingLabel = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
`;

export interface TeamTableProps {
  members: TeamMember[];
  totalOutstanding: number;
  onUpdateMember: (index: number, updates: Partial<TeamMember>) => void;
  onRemoveMember: (index: number) => void;
}

export default function TeamTable({
  members,
  totalOutstanding,
  onUpdateMember,
  onRemoveMember,
}: TeamTableProps) {
  const handleEditEquity = (i: number, raw: string) => {
    const equity = Number(raw) || 0;
    // Recompute shares from equity when total outstanding is known.
    const shares = totalOutstanding > 0 ? Math.round((equity / 100) * totalOutstanding) : null;
    onUpdateMember(i, { equity, shares });
  };

  const handleEditShares = (i: number, raw: string) => {
    const shares = Number(raw) || 0;
    // Recompute equity from shares.
    const equity = totalOutstanding > 0 ? (shares / totalOutstanding) * 100 : 0;
    onUpdateMember(i, { shares, equity: round2(equity) });
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>Equity %</Th>
          <Th>Shares</Th>
          <Th>Start</Th>
          <Th>Vest (yrs)</Th>
          <Th>Cliff (yrs)</Th>
          <Th>Vesting</Th>
          <Th>Status</Th>
          <Th>83(b)</Th>
          <Th>83(b) Deadline</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {members.map((m, i) => {
          const shares = m.shares ?? Math.round(((m.equity || 0) / 100) * totalOutstanding);
          const status = normalizeMemberStatus(m);
          const vp = vestingProgress(m.startDate, m.vestingYears ?? null, m.cliffYears ?? null);
          const deadline = election83bDeadline(m.startDate);
          const bState = election83bStatus(m.startDate, m.filed83b);
          return (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                <EditableCell value={m.name} onSave={(v) => onUpdateMember(i, { name: v })} />
              </Td>
              <Td>
                <EditableCell value={m.role} onSave={(v) => onUpdateMember(i, { role: v })} />
              </Td>
              <Td>
                <EditableCell
                  value={formatPct(m.equity, 2).replace('%', '')}
                  type="number"
                  onSave={(v) => handleEditEquity(i, v)}
                />
                %
              </Td>
              <Td>
                <EditableCell
                  value={formatNumber(shares)}
                  type="number"
                  onSave={(v) => handleEditShares(i, v)}
                />
              </Td>
              <Td>
                <EditableCell
                  value={m.startDate || ''}
                  onSave={(v) => onUpdateMember(i, { startDate: v })}
                />
              </Td>
              <Td>
                <EditableCell
                  value={m.vestingYears ?? ''}
                  type="number"
                  onSave={(v) => onUpdateMember(i, { vestingYears: v === '' ? null : Number(v) })}
                />
              </Td>
              <Td>
                <EditableCell
                  value={m.cliffYears ?? ''}
                  type="number"
                  onSave={(v) => onUpdateMember(i, { cliffYears: v === '' ? null : Number(v) })}
                />
              </Td>
              <Td>
                {status === 'Active' && m.startDate && (m.vestingYears ?? 0) > 0 ? (
                  <>
                    <VestingLabel>
                      {vp.fullyVested ? 'Fully vested' : `${vp.pct.toFixed(0)}%`}
                    </VestingLabel>
                    <VestingBar>
                      <VestingFill $pct={vp.pct} $vested={vp.fullyVested} />
                    </VestingBar>
                  </>
                ) : (
                  <VestingLabel>—</VestingLabel>
                )}
              </Td>
              <Td>
                <StatusSelect
                  value={status}
                  onChange={(e) => onUpdateMember(i, { status: e.target.value as MemberStatus })}
                >
                  {MEMBER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </StatusSelect>
              </Td>
              <Td>
                <CheckBox
                  checked={Boolean(m.filed83b)}
                  onChange={(e) => onUpdateMember(i, { filed83b: e.target.checked })}
                />
              </Td>
              <Td>
                <DeadlineCell $state={bState}>
                  {deadline ? deadline.toISOString().slice(0, 10) : '—'}
                  {bState === 'overdue' && ' ⚠ overdue'}
                  {bState === 'warn' && ' ⚠ soon'}
                </DeadlineCell>
              </Td>
              <Td>
                <RemoveBtn
                  onClick={() => {
                    if (confirm(`Remove ${m.name || 'this member'}?`)) onRemoveMember(i);
                  }}
                >
                  Remove
                </RemoveBtn>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
