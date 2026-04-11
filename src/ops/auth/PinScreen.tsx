import { useState, type FormEvent } from 'react';
import styled from 'styled-components';

// SHA-256 hash of the PIN — computed at build time, never stored in plain text
const PIN_HASH = '1ef79462017df1bf88a3e99aff3a3b5d5935816797117cfa617e8fa30e31be2d';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg};
`;

const Card = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius};
  padding: 2rem;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
`;

const PinInput = styled.input`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 1.5rem;
  letter-spacing: 0.75rem;
  text-align: center;
  width: 160px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text3};
    letter-spacing: 0.3rem;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transition};
  width: 100%;

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-size: 0.75rem;
`;

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const SESSION_KEY = 'ops-pin-verified';

export function isPinVerified(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const hash = await hashPin(pin);
      if (hash === PIN_HASH) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        window.location.reload();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card onSubmit={handleSubmit}>
        <Title>Enter PIN</Title>
        <Subtitle>Access restricted</Subtitle>
        <PinInput
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="----"
          autoFocus
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading || pin.length < 4}>
          {loading ? 'Verifying...' : 'Unlock'}
        </Button>
      </Card>
    </Wrapper>
  );
}
