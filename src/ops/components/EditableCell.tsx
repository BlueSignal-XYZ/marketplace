import { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';

const Display = styled.span`
  cursor: pointer;
  padding: 0.15rem 0.25rem;
  border-radius: 3px;
  transition: background ${({ theme }) => theme.transition};
  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }

  @media (max-width: 1024px) {
    display: inline-block;
    padding: 0.4rem 0.45rem;
    min-height: 28px;
  }
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 3px;
  padding: 0.15rem 0.25rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  width: 100%;
  font-size: inherit;

  /* 16px prevents iOS Safari auto-zoom on focus. Covers iPhone + iPad portrait. */
  @media (max-width: 1024px) {
    font-size: 16px;
    padding: 0.35rem 0.4rem;
  }
`;

interface EditableCellProps {
  value: string | number;
  onSave: (value: string) => void;
  type?: 'text' | 'number';
}

export default function EditableCell({ value, onSave, type = 'text' }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft !== String(value)) onSave(draft);
  };

  // iOS Safari only opens the keyboard when focus() is called synchronously
  // inside the user-gesture handler. flushSync forces the Input to mount
  // before focus() runs, keeping us inside the same tap context.
  const beginEdit = () => {
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        inputMode={type === 'number' ? 'decimal' : 'text'}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(String(value));
            setEditing(false);
          }
        }}
      />
    );
  }

  return <Display onClick={beginEdit}>{value || '—'}</Display>;
}
