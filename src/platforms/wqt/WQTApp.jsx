/**
 * WQTApp — WQT theme provider + router for waterquality.trading.
 * Wraps all marketplace routes with the WQT design system theme.
 */

import React, { Suspense } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { wqtTheme } from '../../design-system/themes/wqtTheme';
import { ToastProvider } from '../../shared/providers/ToastProvider';
import { WQTShell } from './layouts/WQTShell';
import { useAppContext } from '../../context/AppContext';

// WQT Landing page (unauthenticated visitors)
import { WQTLandingPage } from './landing/WQTLandingPage';

// New WQT pages (Phase 4+)
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CertificateDetailPage } from './pages/CertificateDetailPage';

// Phase 5 — Environmental data
import { EnvironmentalMapPage } from './pages/EnvironmentalMapPage';
import { WatershedDashboardPage } from './pages/WatershedDashboardPage';

// Phase 6 — Purchase flow
import { PurchaseFlowPage } from './pages/PurchaseFlowPage';

// Phase 7 — Portfolio, Seller, Dashboard
import { PortfolioPage } from './pages/PortfolioPage';
import { SellerOnboardingPage } from './pages/SellerOnboardingPage';
import { WQTDashboardPage } from './pages/WQTDashboardPage';

// Phase 9 — Programs
import { ProgramsPage } from './pages/ProgramsPage';

// Existing route components
import { Welcome, Marketplace, NotFound, FinancialDashboard } from '../../routes';
import { CertificatePage } from '../../components/routes';
import { RegistryPage } from '../../wqt/pages/RegistryPage';
import { RecentRemovalsPage } from '../../wqt/pages/RecentRemovalsPage';
import { MapPage } from '../../wqt/pages/MapPage';
import { PresalePage } from '../../wqt/pages/PresalePage';
import { TradingProgramsPage } from '../../wqt/pages/TradingProgramsPage';
import { TradingProgramDetailPage } from '../../wqt/pages/TradingProgramDetailPage';
import { CreditPortfolioPage } from '../../wqt/pages/CreditPortfolioPage';
import { ListingPage, CreateListingPage, TransactionPage } from '../../components/elements/marketplace';
import { VerificationUI } from '../../components/elements/contractUI';
import BuyerDashboard from '../../components/dashboards/BuyerDashboard';
import SellerDashboard_Role from '../../components/dashboards/SellerDashboard';
import { getDefaultDashboardRoute } from '../../utils/roleRouting';
import { Skeleton } from '../../design-system/primitives/Skeleton';

// ── Loading fallback ──────────────────────────────────────

const LoadingFallback = () => (
  <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Skeleton width={200} height={24} />
    <Skeleton width={140} height={16} />
  </div>
);

// ── Landing redirect ──────────────────────────────────────

function MarketplaceLanding({ user, authLoading }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authLoading) return;
    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, 'marketplace');
      navigate(route, { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) return <LoadingFallback />;

  // Authenticated users get redirected above. Show landing page to visitors.
  if (!user?.uid) return <WQTLandingPage />;

  return <Welcome />;
}

// ── WQT App ───────────────────────────────────────────────

export function WQTApp({ user, authLoading }) {
  const location = useLocation();
  const isAuthLanding = location.pathname === '/';

  return (
    <ThemeProvider theme={wqtTheme}>
      <ToastProvider>
        <WQTShell user={user} isAuthLanding={isAuthLanding}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<MarketplaceLanding user={user} authLoading={authLoading} />} />
              <Route path="/login" element={<Welcome />} />

              {/* Public routes — v2 marketplace pages */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/listing/:id" element={<ListingDetailPage />} />
              <Route path="/recent-removals" element={<RecentRemovalsPage />} />
              <Route path="/certificate/:id" element={<CertificateDetailPage />} />
              <Route path="/registry" element={<RegistryPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/data" element={<EnvironmentalMapPage />} />
              <Route path="/data/watersheds" element={<WatershedDashboardPage />} />
              <Route path="/presale" element={<PresalePage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/programs/:programId" element={<TradingProgramDetailPage />} />

              {/* Auth-gated marketplace */}
              {user?.uid && (
                <>
                  <Route path="/dashboard" element={<WQTDashboardPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/seller/onboarding" element={<SellerOnboardingPage />} />
                  <Route path="/purchase/:id" element={<PurchaseFlowPage />} />
                  <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
                  <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />
                  <Route path="/credits" element={<CreditPortfolioPage />} />
                  <Route path="/marketplace/tools/verification" element={<VerificationUI />} />
                  <Route path="/marketplace/seller-dashboard" element={<Navigate to="/dashboard/seller" replace />} />
                  <Route path="/marketplace/create-listing" element={<CreateListingPage />} />
                  <Route path="/dashboard/financial" element={<FinancialDashboard />} />
                  <Route path="/marketplace/transactions" element={<TransactionPage />} />
                </>
              )}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </WQTShell>
      </ToastProvider>
    </ThemeProvider>
  );
}
