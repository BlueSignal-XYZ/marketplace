import { useState } from 'react';
import styled from 'styled-components';
import { refreshAll, useLastSync } from '../hooks/useFirebaseData';

const Bar = styled.header`
  min-height: ${({ theme }) => theme.layout.topbarHeight};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  padding-top: env(safe-area-inset-top);
  flex-shrink: 0;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text2};
  font-size: 1.25rem;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0.5rem 0.75rem;
    margin: -0.5rem 0 -0.5rem -0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};

  /* Hide auxiliary date / synced text on phones to keep the action buttons reachable. */
  @media (max-width: 640px) {
    gap: 0.5rem;
    font-size: 0.7rem;

    & > span {
      display: none;
    }
  }
`;

const RefreshBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  color: ${({ theme }) => theme.colors.text2};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.7rem;
    font-size: 0.8rem;
  }
`;

const SignOutBtn = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  color: ${({ theme }) => theme.colors.text3};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.red};
    border-color: ${({ theme }) => theme.colors.red};
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.7rem;
    font-size: 0.8rem;
  }
`;

interface TopbarProps {
  title: string;
  onMenuToggle: () => void;
  onSignOut: () => void;
}

export default function Topbar({ title, onMenuToggle, onSignOut }: TopbarProps) {
  const lastSyncMs = useLastSync();
  const [busy, setBusy] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Re-fetch every Firebase node currently subscribed and update the synced
  // timestamp. Brief busy state so the user sees the click registered.
  const handleRefresh = () => {
    setBusy(true);
    refreshAll();
    setTimeout(() => setBusy(false), 400);
  };

  return (
    <Bar>
      <Left>
        <Hamburger onClick={onMenuToggle}>&#9776;</Hamburger>
        <Title>{title}</Title>
      </Left>
      <Right>
        <span>{today}</span>
        <span>Synced: {new Date(lastSyncMs).toLocaleTimeString()}</span>
        <RefreshBtn onClick={handleRefresh} disabled={busy}>
          {busy ? 'Refreshing…' : 'Refresh'}
        </RefreshBtn>
        <SignOutBtn onClick={onSignOut}>Sign Out</SignOutBtn>
      </Right>
    </Bar>
  );
}
