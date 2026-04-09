/**
 * CloudApp — Cloud theme provider + router for cloud.bluesignal.xyz.
 * Wraps all Cloud routes with the Cloud design system theme.
 */

import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { cloudTheme } from '../../design-system/themes/cloudTheme';
import { ToastProvider } from '../../shared/providers/ToastProvider';
import { QueryProvider } from '../../shared/providers/QueryProvider';
import { CloudShell } from './layouts/CloudShell';
import { useAppContext } from '../../context/AppContext';
import { useUserDevices } from '../../hooks/useUserDevices';
import { AuthGate } from '../../shared/components/AuthGate';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import { AuthModal } from '../../shared/components/AuthModal';
import Confirmation from '../../components/popups/ConfirmationPopup';
import { AUTH_SESSION_EXPIRED_EVENT } from '../../services/v2/client';
import { lazyWithRetry } from '../../shared/utils/lazyWithRetry';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { OfflineBanner } from '../../shared/components/OfflineBanner';

import { Welcome } from '../../routes';
import { Skeleton } from '../../design-system/primitives/Skeleton';

// ── Lazy-loaded pages (with chunk-load retry) ─────────────
const Home = lazyWithRetry(() => import('../../routes/Home'));
const Livepeer = lazyWithRetry(() => import('../../components/elements/livepeer/Livepeer'));
const CommissionWorkflow = lazyWithRetry(
  () => import('../../components/installer/CommissionWorkflow')
);
const DeviceActivation = lazyWithRetry(() => import('../../components/installer/DeviceActivation'));
const InstallerDashboard = lazyWithRetry(
  () => import('../../components/dashboards/InstallerDashboard')
);
const CloudNutrientCalculator = lazyWithRetry(() =>
  import('../../components/cloud/CloudToolsWrapper').then((m) => ({
    default: m.CloudNutrientCalculator,
  }))
);
const CloudVerification = lazyWithRetry(() =>
  import('../../components/cloud/CloudToolsWrapper').then((m) => ({ default: m.CloudVerification }))
);
const CloudLiveStream = lazyWithRetry(() =>
  import('../../components/cloud/CloudToolsWrapper').then((m) => ({ default: m.CloudLiveStream }))
);
const CloudUploadMedia = lazyWithRetry(() =>
  import('../../components/cloud/CloudToolsWrapper').then((m) => ({ default: m.CloudUploadMedia }))
);
const CloudMediaPlayer = lazyWithRetry(() =>
  import('../../components/cloud/CloudToolsWrapper').then((m) => ({ default: m.CloudMediaPlayer }))
);
const CloudDashboardPage = lazyWithRetry(() => import('./pages/CloudDashboardPage'));
const NewDeviceDetailPage = lazyWithRetry(() => import('./pages/DeviceDetailPage'));
const CommissioningWizardPage = lazyWithRetry(() => import('./pages/CommissioningWizardPage'));
const RevenueGradeWizardPage = lazyWithRetry(() => import('./pages/RevenueGradeWizardPage'));

// Cloud console components (lazy-loaded with retry for code splitting)
const DevicesListPage = lazyWithRetry(() => import('../../components/cloud/DevicesListPage'));
const DeviceDetailPage = lazyWithRetry(() => import('../../components/cloud/DeviceDetailPage'));
const SitesListPage = lazyWithRetry(() => import('../../components/cloud/SitesListPage'));
const SiteDetailPage = lazyWithRetry(() => import('../../components/cloud/SiteDetailPage'));
const CreateSitePage = lazyWithRetry(() => import('../../components/cloud/CreateSitePage'));
const CommissioningPage = lazyWithRetry(() => import('../../components/cloud/CommissioningPage'));
const FullCommissioningWizard = lazyWithRetry(
  () => import('../../components/cloud/FullCommissioningWizard')
);
const AlertsPage = lazyWithRetry(() => import('../../components/cloud/AlertsPage'));
const AlertDetailPage = lazyWithRetry(() => import('../../components/cloud/AlertDetailPage'));
const DeviceOnboardingWizard = lazyWithRetry(
  () => import('../../components/cloud/DeviceOnboardingWizard')
);
const ProfilePage = lazyWithRetry(() => import('../../components/cloud/ProfilePage'));
const OnboardingWizard = lazyWithRetry(() => import('../../components/cloud/OnboardingWizard'));
const AddDevicePage = lazyWithRetry(() => import('../../components/cloud/AddDevicePage'));

// ── Loading fallback ──────────────────────────────────────

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

// ── Cloud Landing ─────────────────────────────────────────

function CloudLanding({ user, authLoading }) {
  const navigate = useNavigate();
  const { hasDevices, isLoading: devicesLoading } = useUserDevices();

  React.useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) return;
    if (devicesLoading) return;

    if (hasDevices || user.onboardingCompleted) {
      navigate('/dashboard/main', { replace: true });
    } else {
      navigate('/cloud/onboarding', { replace: true });
    }
  }, [user, authLoading, hasDevices, devicesLoading, navigate]);

  if (authLoading || (user?.uid && devicesLoading)) return <LoadingFallback />;
  return <Welcome />;
}

// ── Cloud Auth Gate (delegates to shared AuthGate + onboarding logic) ──

function CloudAuthGate({ children, authLoading, isOnboardingRoute = false }) {
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const { hasDevices, isLoading: devicesLoading } = useUserDevices();

  React.useEffect(() => {
    if (authLoading || devicesLoading) return;
    if (!user?.uid) return;
    if (!isOnboardingRoute) return;
    if (hasDevices || user.onboardingCompleted) {
      navigate('/dashboard/main', { replace: true });
    }
  }, [authLoading, devicesLoading, user, hasDevices, isOnboardingRoute, navigate]);

  return (
    <AuthGate user={user} authLoading={authLoading} platform="cloud">
      {isOnboardingRoute && devicesLoading ? <LoadingFallback /> : children}
    </AuthGate>
  );
}

// ── Cloud App ─────────────────────────────────────────────

export function CloudApp({ user, authLoading }) {
  const location = useLocation();
  const isAuthLanding = location.pathname === '/';
  const isOnline = useOnlineStatus();
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  useEffect(() => {
    const handler = () => setSessionExpiredOpen(true);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider theme={cloudTheme}>
        <ErrorBoundary platform="cloud">
          <ToastProvider>
            <CloudShell user={user} isAuthLanding={isAuthLanding}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={<CloudLanding user={user} authLoading={authLoading} />}
                  />

                  {/* Main dashboard */}
                  <Route
                    path="/dashboard/main"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudDashboardPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/dashboard/installer"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <InstallerDashboard />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/dashboard/:dashID"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <Home />
                      </CloudAuthGate>
                    }
                  />

                  {/* Sites */}
                  <Route
                    path="/cloud/sites"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <SitesListPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/sites/new"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CreateSitePage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/sites/:siteId"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <SiteDetailPage />
                      </CloudAuthGate>
                    }
                  />

                  {/* Profile */}
                  <Route
                    path="/cloud/profile"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <ProfilePage />
                      </CloudAuthGate>
                    }
                  />

                  {/* Onboarding */}
                  <Route
                    path="/cloud/onboarding"
                    element={
                      <CloudAuthGate authLoading={authLoading} isOnboardingRoute={true}>
                        <OnboardingWizard />
                      </CloudAuthGate>
                    }
                  />

                  {/* Devices */}
                  <Route
                    path="/cloud/devices"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <DevicesListPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/devices/new"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <DeviceOnboardingWizard />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/devices/add"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <AddDevicePage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/devices/:deviceId"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <DeviceDetailPage />
                      </CloudAuthGate>
                    }
                  />

                  {/* Commissioning */}
                  <Route
                    path="/cloud/commissioning"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CommissioningPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/commissioning/new"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <FullCommissioningWizard />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/commissioning/:commissionId"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CommissionWorkflow />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/commissioning/:commissionId/complete"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <DeviceActivation />
                      </CloudAuthGate>
                    }
                  />

                  {/* Alerts */}
                  <Route
                    path="/cloud/alerts"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <AlertsPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/alerts/:alertId"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <AlertDetailPage />
                      </CloudAuthGate>
                    }
                  />

                  {/* v2 Cloud pages (Phase 8 rebuild) */}
                  <Route
                    path="/v2/dashboard"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudDashboardPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/device/:deviceId"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <NewDeviceDetailPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/devices/:deviceId/revenue-grade/setup"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <RevenueGradeWizardPage />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/commission"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CommissioningWizardPage />
                      </CloudAuthGate>
                    }
                  />

                  {/* Cloud tools */}
                  <Route
                    path="/cloud/tools/nutrient-calculator"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudNutrientCalculator />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/tools/verification"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudVerification />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/tools/live"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudLiveStream />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/cloud/tools/upload-media"
                    element={<Navigate to="/cloud/tools/verification" replace />}
                  />

                  {/* Media */}
                  <Route
                    path="/media/:playbackID"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudMediaPlayer />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/media/live/:liveID"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudMediaPlayer />
                      </CloudAuthGate>
                    }
                  />

                  {/* Legacy feature paths */}
                  <Route
                    path="/features/nutrient-calculator"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudNutrientCalculator />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/features/verification"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudVerification />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/features/stream"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudLiveStream />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/features/upload-media"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <CloudUploadMedia />
                      </CloudAuthGate>
                    }
                  />
                  <Route
                    path="/features/:serviceID"
                    element={
                      <CloudAuthGate authLoading={authLoading}>
                        <Livepeer />
                      </CloudAuthGate>
                    }
                  />

                  {/* Catch-all */}
                  <Route
                    path="*"
                    element={<CloudLanding user={user} authLoading={authLoading} />}
                  />
                </Routes>
              </Suspense>
            </CloudShell>
            {!isOnline && <OfflineBanner />}
            <AuthModal
              isOpen={sessionExpiredOpen}
              onClose={() => setSessionExpiredOpen(false)}
              platform="cloud"
              message="Your session has expired. Please sign in again."
            />
            <Confirmation />
          </ToastProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryProvider>
  );
}
