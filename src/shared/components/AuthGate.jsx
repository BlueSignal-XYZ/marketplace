/**
 * Shared Auth Gate — unified auth guard for both WQT and Cloud platforms.
 *
 * Behavior:
 * - loading → LoadingFallback
 * - !user   → platform-specific redirect:
 *     WQT:   Navigate to /login
 *     Cloud: Render <Welcome /> (auth modal inline)
 * - user    → render children
 *
 * Usage:
 *   <AuthGate platform="wqt" user={user} authLoading={authLoading}>
 *     <ProtectedContent />
 *   </AuthGate>
 */

import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '../../design-system/primitives/Skeleton';
import { Welcome } from '../../routes';

const LoadingFallback = () => (
  <div
    style={{
      padding: 48,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <Skeleton width={200} height={24} />
    <Skeleton width={140} height={16} />
  </div>
);

export function AuthGate({ children, user, authLoading, platform = 'wqt' }) {
  const location = useLocation();
  const redirectTo = location.pathname + (location.search || '');

  if (authLoading) return <LoadingFallback />;

  if (!user?.uid) {
    if (platform === 'cloud') {
      return <Welcome redirectTo={redirectTo} />;
    }
    return <Navigate to="/login" replace state={{ redirectTo }} />;
  }

  return children;
}

export default AuthGate;
