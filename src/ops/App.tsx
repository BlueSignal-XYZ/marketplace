import styled from 'styled-components';
import { useAuth } from './hooks/useAuth';
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

export default function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <LoadingWrapper>Loading...</LoadingWrapper>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <DashboardLayout onSignOut={signOut} />;
}
