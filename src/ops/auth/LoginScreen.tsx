import { useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

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
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.6rem 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition: border-color ${({ theme }) => theme.transition};

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text3};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  padding: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transition};

  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.red};
  font-size: 0.8rem;
  text-align: center;
`;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card onSubmit={handleSubmit}>
        <Title>BlueSignal Ops</Title>
        <Subtitle>Internal operations dashboard</Subtitle>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Card>
    </Wrapper>
  );
}
