/**
 * CloudApp — Cloud theme provider + router for cloud.bluesignal.xyz.
 * Wraps all Cloud routes with the Cloud design system theme.
 */

import React, { Suspense } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { cloudTheme } from '../../design-system/themes/cloudTheme';
import { ToastProvider } from '../../shared/providers/ToastProvider';
import { CloudShell } from './layouts/CloudShell';
import { useAppContext } from '../../context/AppContext';
import { useUserDevices } from '../../hooks/useUserDevices';

// Existing route components
import { Welcome, Home } from '../../routes';
import { Livepeer } from '../../components/elements/livepeer';
import { CommissionWorkflow, DeviceActivation } from '../../components/installer';
import InstallerDashboard from '../../components/dashboards/InstallerDashboard';
import { Skeleton } from '../../design-system/primitives/Skeleton';

import {
  CloudNutrientCalculator,
  CloudVerification,
  CloudLiveStream,
  CloudUploadMedia,
  CloudMediaPlayer,
} from '../../components/cloud/CloudToolsWrapper';

// Phase 8 — Rebuilt Cloud pages with new design system
import { CloudDashboardPage } from './pages/CloudDashboardPage';
import { DeviceDetailPage as NewDeviceDetailPage } from './pages/DeviceDetailPage';
import { CommissioningWizardPage } from './pages/CommissioningWizardPage';

// Cloud console components (lazy-loaded for code splitting)
const OverviewDashboard = React.lazy(() => import('../../components/cloud/OverviewDashboard'));
const DevicesListPage = React.lazy(() => import('../../components/cloud/DevicesListPage'));
const DeviceDetailPage = React.lazy(() => import('../../components/cloud/DeviceDetailPage'));
const SitesListPage = React.lazy(() => import('../../components/cloud/SitesListPage'));
const SiteDetailPage = React.lazy(() => import('../../components/cloud/SiteDetailPage'));
const CreateSitePage = React.lazy(() => import('../../components/cloud/CreateSitePage'));
const CommissioningPage = React.lazy(() => import('../../components/cloud/CommissioningPage'));
const FullCommissioningWizard = React.lazy(() => import('../../components/cloud/FullCommissioningWizard'));
const AlertsPage = React.lazy(() => import('../../components/cloud/AlertsPage'));
const AlertDetailPage = React.lazy(() => import('../../components/cloud/AlertDetailPage'));
const DeviceOnboardingWizard = React.lazy(() => import('../../components/cloud/DeviceOnboardingWizard'));
const ProfilePage = React.lazy(() => import('../../components/cloud/ProfilePage'));
const OnboardingWizard = React.lazy(() => import('../../components/cloud/OnboardingWizard'));
const AddDevicePage = React.lazy(() => import('../../components/cloud/AddDevicePage'));

// ── Loading fallback ──────────────────────────────────────

const LoadingFallback = () => (
  <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
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

// ── Cloud Auth Gate ───────────────────────────────────────

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

  if (authLoading) return <LoadingFallback />;
  if (!user?.uid) return <Welcome />;
  if (isOnboardingRoute && devicesLoading) return <LoadingFallback />;
  return children;
}

// ── Cloud App ─────────────────────────────────────────────

export function CloudApp({ user, authLoading }) {
  const location = useLocation();
  const isAuthLanding = location.pathname === '/';

  return (
    <ThemeProvider theme={cloudTheme}>
      <ToastProvider>
        <CloudShell user={user} isAuthLanding={isAuthLanding}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<CloudLanding user={user} authLoading={authLoading} />} />

              {/* Main dashboard */}
              <Route path="/dashboard/main" element={<CloudAuthGate authLoading={authLoading}><OverviewDashboard /></CloudAuthGate>} />
              <Route path="/dashboard/installer" element={<CloudAuthGate authLoading={authLoading}><InstallerDashboard /></CloudAuthGate>} />
              <Route path="/dashboard/:dashID" element={<CloudAuthGate authLoading={authLoading}><Home /></CloudAuthGate>} />

              {/* Sites */}
              <Route path="/cloud/sites" element={<CloudAuthGate authLoading={authLoading}><SitesListPage /></CloudAuthGate>} />
              <Route path="/cloud/sites/new" element={<CloudAuthGate authLoading={authLoading}><CreateSitePage /></CloudAuthGate>} />
              <Route path="/cloud/sites/:siteId" element={<CloudAuthGate authLoading={authLoading}><SiteDetailPage /></CloudAuthGate>} />

              {/* Profile */}
              <Route path="/cloud/profile" element={<CloudAuthGate authLoading={authLoading}><ProfilePage /></CloudAuthGate>} />

              {/* Onboarding */}
              <Route path="/cloud/onboarding" element={<CloudAuthGate authLoading={authLoading} isOnboardingRoute={true}><OnboardingWizard /></CloudAuthGate>} />

              {/* Devices */}
              <Route path="/cloud/devices" element={<CloudAuthGate authLoading={authLoading}><DevicesListPage /></CloudAuthGate>} />
              <Route path="/cloud/devices/new" element={<CloudAuthGate authLoading={authLoading}><DeviceOnboardingWizard /></CloudAuthGate>} />
              <Route path="/cloud/devices/add" element={<CloudAuthGate authLoading={authLoading}><AddDevicePage /></CloudAuthGate>} />
              <Route path="/cloud/devices/:deviceId" element={<CloudAuthGate authLoading={authLoading}><DeviceDetailPage /></CloudAuthGate>} />

              {/* Commissioning */}
              <Route path="/cloud/commissioning" element={<CloudAuthGate authLoading={authLoading}><CommissioningPage /></CloudAuthGate>} />
              <Route path="/cloud/commissioning/new" element={<CloudAuthGate authLoading={authLoading}><FullCommissioningWizard /></CloudAuthGate>} />
              <Route path="/cloud/commissioning/:commissionId" element={<CloudAuthGate authLoading={authLoading}><CommissionWorkflow /></CloudAuthGate>} />
              <Route path="/cloud/commissioning/:commissionId/complete" element={<CloudAuthGate authLoading={authLoading}><DeviceActivation /></CloudAuthGate>} />

              {/* Alerts */}
              <Route path="/cloud/alerts" element={<CloudAuthGate authLoading={authLoading}><AlertsPage /></CloudAuthGate>} />
              <Route path="/cloud/alerts/:alertId" element={<CloudAuthGate authLoading={authLoading}><AlertDetailPage /></CloudAuthGate>} />

              {/* v2 Cloud pages (Phase 8 rebuild) */}
              <Route path="/v2/dashboard" element={<CloudAuthGate authLoading={authLoading}><CloudDashboardPage /></CloudAuthGate>} />
              <Route path="/device/:deviceId" element={<CloudAuthGate authLoading={authLoading}><NewDeviceDetailPage /></CloudAuthGate>} />
              <Route path="/commission" element={<CloudAuthGate authLoading={authLoading}><CommissioningWizardPage /></CloudAuthGate>} />

              {/* Cloud tools */}
              <Route path="/cloud/tools/nutrient-calculator" element={<CloudAuthGate authLoading={authLoading}><CloudNutrientCalculator /></CloudAuthGate>} />
              <Route path="/cloud/tools/verification" element={<CloudAuthGate authLoading={authLoading}><CloudVerification /></CloudAuthGate>} />
              <Route path="/cloud/tools/live" element={<CloudAuthGate authLoading={authLoading}><CloudLiveStream /></CloudAuthGate>} />
              <Route path="/cloud/tools/upload-media" element={<CloudAuthGate authLoading={authLoading}><CloudUploadMedia /></CloudAuthGate>} />

              {/* Media */}
              <Route path="/media/:playbackID" element={<CloudAuthGate authLoading={authLoading}><CloudMediaPlayer /></CloudAuthGate>} />
              <Route path="/media/live/:liveID" element={<CloudAuthGate authLoading={authLoading}><CloudMediaPlayer /></CloudAuthGate>} />

              {/* Legacy feature paths */}
              <Route path="/features/nutrient-calculator" element={<CloudAuthGate authLoading={authLoading}><CloudNutrientCalculator /></CloudAuthGate>} />
              <Route path="/features/verification" element={<CloudAuthGate authLoading={authLoading}><CloudVerification /></CloudAuthGate>} />
              <Route path="/features/stream" element={<CloudAuthGate authLoading={authLoading}><CloudLiveStream /></CloudAuthGate>} />
              <Route path="/features/upload-media" element={<CloudAuthGate authLoading={authLoading}><CloudUploadMedia /></CloudAuthGate>} />
              <Route path="/features/:serviceID" element={<CloudAuthGate authLoading={authLoading}><Livepeer /></CloudAuthGate>} />

              {/* Catch-all */}
              <Route path="*" element={<CloudLanding user={user} authLoading={authLoading} />} />
            </Routes>
          </Suspense>
        </CloudShell>
      </ToastProvider>
    </ThemeProvider>
  );
}
