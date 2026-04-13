import styled from 'styled-components';

const colorMap: Record<string, { bg: string; fg: string }> = {
  high: { bg: 'var(--red-dim, rgba(248,113,113,0.10))', fg: 'var(--red, #f87171)' },
  medium: { bg: 'var(--yellow-dim, rgba(251,191,36,0.10))', fg: 'var(--yellow, #fbbf24)' },
  low: { bg: 'var(--green-dim, rgba(52,211,153,0.10))', fg: 'var(--green, #34d399)' },
  prospect: { bg: 'rgba(79,143,247,0.12)', fg: '#4f8ff7' },
  customer: { bg: 'rgba(52,211,153,0.10)', fg: '#34d399' },
  'in-progress': { bg: 'rgba(79,143,247,0.12)', fg: '#4f8ff7' },
  pending: { bg: 'rgba(251,191,36,0.10)', fg: '#fbbf24' },
  done: { bg: 'rgba(52,211,153,0.10)', fg: '#34d399' },
  completed: { bg: 'rgba(52,211,153,0.10)', fg: '#34d399' },
  planned: { bg: 'rgba(167,139,250,0.12)', fg: '#a78bfa' },
  issued: { bg: 'rgba(52,211,153,0.10)', fg: '#34d399' },
  reserved: { bg: 'rgba(251,191,36,0.10)', fg: '#fbbf24' },
};

const fallback = { bg: 'rgba(148,152,168,0.10)', fg: '#9498a8' };

const pillStyles = `
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  text-transform: capitalize;
  white-space: nowrap;
  line-height: 1.2;
`;

const Pill = styled.span<{ $bg: string; $fg: string }>`
  ${pillStyles}
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
`;

/**
 * Editable variant — a native <select> styled exactly like the pill so the
 * component doubles as display + edit control (no separate "raw" dropdown
 * next to the badge, which previously looked like duplicated state).
 */
const PillSelect = styled.select<{ $bg: string; $fg: string }>`
  ${pillStyles}
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  border: none;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 0.5rem;

  &:focus {
    box-shadow: 0 0 0 1px ${({ $fg }) => $fg};
  }

  /* Native <option> menus inherit the OS theme; force readable contrast. */
  & option {
    background: #1a1c22;
    color: #e2e4ea;
  }

  /* Mobile: 16px prevents iOS Safari auto-zoom on focus, and a larger
     padding gives the native picker a usable touch target without
     changing the visual pill size drastically. */
  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.35rem 0.7rem;
    min-height: 32px;
  }
`;

interface PriorityBadgeProps {
  value: string;
  /** When provided together with onChange, render as an editable pill-select. */
  options?: readonly string[];
  onChange?: (value: string) => void;
}

export default function PriorityBadge({ value, options, onChange }: PriorityBadgeProps) {
  const key = value.toLowerCase();
  const { bg, fg } = colorMap[key] ?? fallback;

  if (options && onChange) {
    return (
      <PillSelect
        $bg={bg}
        $fg={fg}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select priority"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </PillSelect>
    );
  }

  return (
    <Pill $bg={bg} $fg={fg}>
      {value}
    </Pill>
  );
}
