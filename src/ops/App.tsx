import styled from 'styled-components';
import { firebaseError, db } from './firebase';
import { useAuth } from './hooks/useAuth';
import { useFirebaseData } from './hooks/useFirebaseData';
import PinScreen, { isPinVerified } from './auth/PinScreen';
import LoginScreen from './auth/LoginScreen';
import DashboardLayout from './layout/DashboardLayout';

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.85rem;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.red};
  font-size: 0.85rem;
  text-align: center;
  padding: 2rem;
`;

const ErrorDetail = styled.code`
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

export default function App() {
  if (firebaseError) {
    return (
      <ErrorWrapper>
        <div>Firebase configuration error</div>
        <ErrorDetail>{firebaseError}</ErrorDetail>
      </ErrorWrapper>
    );
  }

  // PIN gate — required once per browser session
  if (!isPinVerified()) {
    return <PinScreen />;
  }

  return <AuthGate />;
}

const DebugBanner = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
  font-family: monospace;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

function DebugInfo({ email }: { email: string | null }) {
  const { data, error } = useFirebaseData<unknown>('/ops-dashboard/last-synced');
  return (
    <DebugBanner>
      <span>auth: {email || 'none'}</span>
      <span>db: {db ? 'init' : 'FAIL'}</span>
      <span>rtdb: {error ? `ERR: ${error.message}` : data ? `ok (synced: ${data})` : 'null'}</span>
    </DebugBanner>
  );
}

function AuthGate() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <LoadingWrapper>Loading...</LoadingWrapper>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <DebugInfo email={user.email} />
      <DashboardLayout onSignOut={signOut} />
    </>
  );
}
