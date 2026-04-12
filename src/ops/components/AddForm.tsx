import { useState, type FormEvent } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  align-items: flex-end;
  padding: 0.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 0.5rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 100px;

  /* Stack fields full-width on phones so iPhone SE (375px) doesn't crush them. */
  @media (max-width: 480px) {
    min-width: 0;
    flex-basis: 100%;
  }
`;

const Label = styled.label`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text3};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  padding: 0.35rem 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 0.8rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  /* 16px prevents iOS Safari auto-zoom on focus. */
  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.5rem 0.6rem;
  }
`;

const SelectInput = styled.select`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  padding: 0.35rem 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 0.8rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.5rem 0.6rem;
  }
`;

const Btn = styled.button<{ $variant?: string }>`
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: 3px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  background: ${({ $variant, theme }) =>
    $variant === 'cancel' ? theme.colors.surface2 : theme.colors.accent};
  color: ${({ $variant, theme }) => ($variant === 'cancel' ? theme.colors.text2 : '#fff')};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
`;

export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  defaultValue?: string;
}

interface AddFormProps {
  fields: FieldDef[];
  onAdd: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export default function AddForm({ fields, onAdd, onCancel }: AddFormProps) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? '']));
  const [values, setValues] = useState(initial);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAdd(values);
    setValues(initial);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {fields.map((f) => (
        <FieldWrapper key={f.name}>
          <Label>{f.label}</Label>
          {f.type === 'select' ? (
            <SelectInput
              value={values[f.name]}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            >
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </SelectInput>
          ) : (
            <Input
              type={f.type ?? 'text'}
              inputMode={f.type === 'number' ? 'decimal' : undefined}
              value={values[f.name]}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              placeholder={f.label}
            />
          )}
        </FieldWrapper>
      ))}
      <Btn type="submit">Add</Btn>
      <Btn type="button" $variant="cancel" onClick={onCancel}>
        Cancel
      </Btn>
    </Form>
  );
}
