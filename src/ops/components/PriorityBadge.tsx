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

const Pill = styled.span<{ $bg: string; $fg: string }>`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  text-transform: capitalize;
  white-space: nowrap;
`;

export default function PriorityBadge({ value }: { value: string }) {
  const key = value.toLowerCase();
  const { bg, fg } = colorMap[key] ?? fallback;
  return (
    <Pill $bg={bg} $fg={fg}>
      {value}
    </Pill>
  );
}
