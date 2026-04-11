import styled from 'styled-components';
import { PIPELINE_STAGES, type PipelineStage } from '../types';

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

interface StageSelectProps {
  value: PipelineStage;
  onChange: (stage: PipelineStage) => void;
}

export default function StageSelect({ value, onChange }: StageSelectProps) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as PipelineStage)}>
      {PIPELINE_STAGES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
