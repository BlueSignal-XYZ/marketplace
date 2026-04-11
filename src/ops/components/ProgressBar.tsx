import styled from 'styled-components';

const Track = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 3px;
  overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${({ $pct }) => Math.min(100, Math.max(0, $pct))}%;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.4s ease;
`;

function getColor(pct: number): string {
  if (pct >= 60) return '#34d399';
  if (pct >= 30) return '#fbbf24';
  return '#4f8ff7';
}

export default function ProgressBar({ value }: { value: number }) {
  return (
    <Track>
      <Fill $pct={value} $color={getColor(value)} />
    </Track>
  );
}
