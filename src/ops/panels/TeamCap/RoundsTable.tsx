import styled from 'styled-components';
import { Table, Th, Td, Tr } from '../../components/DataTable';
import EditableCell from '../../components/EditableCell';
import type { FundingRound, Instrument, RoundStatus } from '../../types';
import { formatNumber, normalizeInstrument, normalizeRoundStatus } from './dilution';

const INSTRUMENTS: Instrument[] = [
  'Common Stock',
  'Preferred Stock',
  'SAFE',
  'Convertible Note',
  'Reserved',
];

const ROUND_STATUSES: RoundStatus[] = ['Issued', 'Reserved', 'Planned', 'Closed', 'Converting'];

const Select = styled.select`
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

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.text3};
  font-style: italic;
  font-size: 0.75rem;
`;

const CheckBox = styled.input.attrs({ type: 'checkbox' })`
  accent-color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
`;

export interface RoundsTableProps {
  rounds: FundingRound[];
  onUpdateRound: (index: number, updates: Partial<FundingRound>) => void;
  onRemoveRound: (index: number) => void;
}

export default function RoundsTable({ rounds, onUpdateRound, onRemoveRound }: RoundsTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Round</Th>
          <Th>Instrument</Th>
          <Th>Status</Th>
          <Th>Shares</Th>
          <Th>Price / Share</Th>
          <Th>Cap / Pref</Th>
          <Th>Discount %</Th>
          <Th>Interest %</Th>
          <Th>Maturity / Part.</Th>
          <Th>Target Raise</Th>
          <Th>Valuation</Th>
          <Th></Th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((r, i) => {
          const instrument = normalizeInstrument(r);
          const status = normalizeRoundStatus(r.status);
          const isSafe = instrument === 'SAFE';
          const isNote = instrument === 'Convertible Note';
          const isPreferred = instrument === 'Preferred Stock';
          const isCommon = instrument === 'Common Stock';
          const isReserved = instrument === 'Reserved';
          return (
            <Tr key={i}>
              <Td style={{ color: '#e2e4ea', fontWeight: 600 }}>
                <EditableCell value={r.name} onSave={(v) => onUpdateRound(i, { name: v })} />
              </Td>
              <Td>
                <Select
                  value={instrument}
                  onChange={(e) => onUpdateRound(i, { instrument: e.target.value as Instrument })}
                >
                  {INSTRUMENTS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Select
                  value={status}
                  onChange={(e) => onUpdateRound(i, { status: e.target.value as RoundStatus })}
                >
                  {ROUND_STATUSES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Td>
              {/* Shares */}
              <Td>
                {isSafe || isNote ? (
                  <Placeholder>converts at priced round</Placeholder>
                ) : (
                  <EditableCell
                    value={formatNumber(r.shares)}
                    type="number"
                    onSave={(v) => onUpdateRound(i, { shares: Number(v) || 0 })}
                  />
                )}
              </Td>
              {/* Price / Share */}
              <Td>
                {isSafe || isNote || isReserved ? (
                  <Placeholder>—</Placeholder>
                ) : (
                  <>
                    $
                    <EditableCell
                      value={r.price ?? ''}
                      type="number"
                      onSave={(v) => onUpdateRound(i, { price: v === '' ? null : Number(v) })}
                    />
                  </>
                )}
              </Td>
              {/* Cap (SAFE/Note) or Liquidation Pref (Preferred) */}
              <Td>
                {isSafe || isNote ? (
                  <>
                    $
                    <EditableCell
                      value={r.valuationCap ?? ''}
                      type="number"
                      onSave={(v) =>
                        onUpdateRound(i, { valuationCap: v === '' ? null : Number(v) })
                      }
                    />
                    <Placeholder> cap</Placeholder>
                  </>
                ) : isPreferred ? (
                  <>
                    <EditableCell
                      value={r.liquidationPref ?? 1}
                      type="number"
                      onSave={(v) =>
                        onUpdateRound(i, {
                          liquidationPref: v === '' ? null : Number(v),
                        })
                      }
                    />
                    x
                  </>
                ) : (
                  <Placeholder>—</Placeholder>
                )}
              </Td>
              {/* Discount % */}
              <Td>
                {isSafe || isNote ? (
                  <>
                    <EditableCell
                      value={r.discountPct ?? ''}
                      type="number"
                      onSave={(v) => onUpdateRound(i, { discountPct: v === '' ? null : Number(v) })}
                    />
                    %
                  </>
                ) : (
                  <Placeholder>—</Placeholder>
                )}
              </Td>
              {/* Interest % (Note only) */}
              <Td>
                {isNote ? (
                  <>
                    <EditableCell
                      value={r.interestPct ?? ''}
                      type="number"
                      onSave={(v) => onUpdateRound(i, { interestPct: v === '' ? null : Number(v) })}
                    />
                    %
                  </>
                ) : (
                  <Placeholder>—</Placeholder>
                )}
              </Td>
              {/* Maturity (Note) or Participation (Preferred) */}
              <Td>
                {isNote ? (
                  <EditableCell
                    value={r.maturityDate ?? ''}
                    onSave={(v) => onUpdateRound(i, { maturityDate: v || null })}
                  />
                ) : isPreferred ? (
                  <label
                    style={{
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      gap: '0.3rem',
                      alignItems: 'center',
                    }}
                  >
                    <CheckBox
                      checked={Boolean(r.participation)}
                      onChange={(e) => onUpdateRound(i, { participation: e.target.checked })}
                    />
                    participating
                  </label>
                ) : (
                  <Placeholder>—</Placeholder>
                )}
              </Td>
              {/* Target Raise */}
              <Td>
                {isCommon || isReserved ? (
                  <Placeholder>—</Placeholder>
                ) : (
                  <>
                    {r.targetRaise !== null && r.targetRaise !== undefined ? '$' : ''}
                    <EditableCell
                      value={r.targetRaise ?? ''}
                      type="number"
                      onSave={(v) => onUpdateRound(i, { targetRaise: v === '' ? null : Number(v) })}
                    />
                  </>
                )}
              </Td>
              {/* Valuation */}
              <Td>
                {isCommon || isReserved ? (
                  <Placeholder>—</Placeholder>
                ) : (
                  <>
                    {r.targetValuation !== null && r.targetValuation !== undefined ? '$' : ''}
                    <EditableCell
                      value={r.targetValuation ?? ''}
                      type="number"
                      onSave={(v) =>
                        onUpdateRound(i, { targetValuation: v === '' ? null : Number(v) })
                      }
                    />
                  </>
                )}
              </Td>
              <Td>
                <RemoveBtn
                  onClick={() => {
                    if (confirm(`Remove ${r.name || 'this round'}?`)) onRemoveRound(i);
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
