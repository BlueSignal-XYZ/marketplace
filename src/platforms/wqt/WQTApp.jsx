/**
 * WQTApp — WQT theme provider + router for waterquality.trading.
 * Wraps all marketplace routes with the WQT design system theme.
 */

import { Suspense, useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { wqtTheme } from '../../design-system/themes/wqtTheme';
import { ToastProvider } from '../../shared/providers/ToastProvider';
import { QueryProvider } from '../../shared/providers/QueryProvider';
import { WQTShell } from './layouts/WQTShell';
import { Skeleton } from '../../design-system/primitives/Skeleton';
import { AuthGate } from '../../shared/components/AuthGate';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import { AuthModal } from '../../shared/components/AuthModal';
import Confirmation from '../../components/popups/ConfirmationPopup';
import { AUTH_SESSION_EXPIRED_EVENT } from '../../services/v2/client';
import { lazyWithRetry } from '../../shared/utils/lazyWithRetry';

// WQT Landing page (unauthenticated visitors — not lazy, above fold)
import { WQTLandingPage } from './landing/WQTLandingPage';

// Eagerly loaded (used in routing logic)
import { Welcome, NotFound } from '../../routes';

// ── Lazy-loaded pages (with chunk-load retry) ─────────────
const MarketplacePage = lazyWithRetry(() => import('./pages/MarketplacePage'));
const ListingDetailPage = lazyWithRetry(() => import('./pages/ListingDetailPage'));
const CertificateDetailPage = lazyWithRetry(() => import('./pages/CertificateDetailPage'));
const EnvironmentalMapPage = lazyWithRetry(() => import('./pages/EnvironmentalMapPage'));
const WatershedDashboardPage = lazyWithRetry(() => import('./pages/WatershedDashboardPage'));
const PurchaseFlowPage = lazyWithRetry(() => import('./pages/PurchaseFlowPage'));
const PortfolioPage = lazyWithRetry(() => import('./pages/PortfolioPage'));
const SellerOnboardingPage = lazyWithRetry(() => import('./pages/SellerOnboardingPage'));
const WQTDashboardPage = lazyWithRetry(() => import('./pages/WQTDashboardPage'));
const ProgramsPage = lazyWithRetry(() => import('./pages/ProgramsPage'));
const FinancialDashboard = lazyWithRetry(() => import('../../routes/marketplace/account/FinancialDashboard'));
const RegistryPage = lazyWithRetry(() => import('../../wqt/pages/RegistryPage'));
const RecentRemovalsPage = lazyWithRetry(() => import('../../wqt/pages/RecentRemovalsPage'));
const MapPage = lazyWithRetry(() => import('../../wqt/pages/MapPage'));
const PresalePage = lazyWithRetry(() => import('../../wqt/pages/PresalePage'));
const TradingProgramDetailPage = lazyWithRetry(() => import('../../wqt/pages/TradingProgramDetailPage'));
const CreditPortfolioPage = lazyWithRetry(() => import('../../wqt/pages/CreditPortfolioPage'));
const CreateListingPage = lazyWithRetry(() => import('../../components/elements/marketplace/CreateListingPage'));
const TransactionPage = lazyWithRetry(() => import('../../components/elements/marketplace/TransactionPage'));
const VerificationUI = lazyWithRetry(() => import('../../components/elements/contractUI/VerificationUI'));
const BuyerDashboard = lazyWithRetry(() => import('../../components/dashboards/BuyerDashboard'));
const SellerDashboard_Role = lazyWithRetry(() => import('../../components/dashboards/SellerDashboard'));

// Audience-specific pages
const ForUtilitiesPage = lazyWithRetry(() => import('./pages/ForUtilitiesPage'));
const ForHomeownersPage = lazyWithRetry(() => import('./pages/ForHomeownersPage'));
const ForAggregatorsPage = lazyWithRetry(() => import('./pages/ForAggregatorsPage'));
const HowItWorksPage = lazyWithRetry(() => import('./pages/HowItWorksPage'));
const ForCreditGeneratorsPage = lazyWithRetry(() => import('./pages/ForCreditGeneratorsPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'));
const WQTProfilePage = lazyWithRetry(() => import('./pages/WQTProfilePage'));

// ── Loading fallback ──────────────────────────────────────

const LoadingFallback = () => (
  <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <Skeleton width={200} height={24} />
    <Skeleton width={140} height={16} />
  </div>
);

// ── Landing redirect ──────────────────────────────────────

function MarketplaceLanding({ user: _user, authLoading }) {
  if (authLoading) return <LoadingFallback />;

  // Always show landing page — authenticated users can navigate away via nav/CTA
  return <WQTLandingPage />;
}

// ── WQT Auth Gate (delegates to shared AuthGate) ──────────

function WQTAuthGate({ children, user, authLoading }) {
  return (
    <AuthGate user={user} authLoading={authLoading} platform="wqt">
      {children}
    </AuthGate>
  );
}

// ── WQT App ───────────────────────────────────────────────

export function WQTApp({ user, authLoading }) {
  const location = useLocation();
  const isAuthLanding = location.pathname === '/';
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSessionExpiredOpen(true);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handler);
  }, []);

  return (
    <QueryProvider>
    <ThemeProvider theme={wqtTheme}>
      <ErrorBoundary platform="wqt">
      <ToastProvider>
        <WQTShell user={user} isAuthLanding={isAuthLanding}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<MarketplaceLanding user={user} authLoading={authLoading} />} />
              <Route path="/login" element={<Welcome />} />

              {/* Audience-specific pages */}
              <Route path="/for-utilities" element={<ForUtilitiesPage />} />
              <Route path="/for-homeowners" element={<ForHomeownersPage />} />
              <Route path="/for-aggregators" element={<ForAggregatorsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/generate-credits" element={<ForCreditGeneratorsPage />} />
              <Route path="/learn-more" element={<Navigate to="/" replace />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Public routes — platform pages */}
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

              {/* Auth-gated routes — WQTAuthGate redirects to /login */}
              <Route path="/dashboard" element={<WQTAuthGate user={user} authLoading={authLoading}><WQTDashboardPage /></WQTAuthGate>} />
              <Route path="/portfolio" element={<WQTAuthGate user={user} authLoading={authLoading}><PortfolioPage /></WQTAuthGate>} />
              <Route path="/seller/onboarding" element={<WQTAuthGate user={user} authLoading={authLoading}><SellerOnboardingPage /></WQTAuthGate>} />
              <Route path="/purchase/:id" element={<WQTAuthGate user={user} authLoading={authLoading}><PurchaseFlowPage /></WQTAuthGate>} />
              <Route path="/dashboard/buyer" element={<WQTAuthGate user={user} authLoading={authLoading}><BuyerDashboard /></WQTAuthGate>} />
              <Route path="/dashboard/seller" element={<WQTAuthGate user={user} authLoading={authLoading}><SellerDashboard_Role /></WQTAuthGate>} />
              <Route path="/credits" element={<WQTAuthGate user={user} authLoading={authLoading}><CreditPortfolioPage /></WQTAuthGate>} />
              <Route path="/marketplace/tools/verification" element={<WQTAuthGate user={user} authLoading={authLoading}><VerificationUI /></WQTAuthGate>} />
              <Route path="/marketplace/seller-dashboard" element={<Navigate to="/dashboard/seller" replace />} />
              <Route path="/marketplace/create-listing" element={<WQTAuthGate user={user} authLoading={authLoading}><CreateListingPage /></WQTAuthGate>} />
              <Route path="/dashboard/financial" element={<WQTAuthGate user={user} authLoading={authLoading}><FinancialDashboard /></WQTAuthGate>} />
              <Route path="/marketplace/transactions" element={<WQTAuthGate user={user} authLoading={authLoading}><TransactionPage /></WQTAuthGate>} />
              <Route path="/profile" element={<WQTProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </WQTShell>
        <AuthModal
          isOpen={sessionExpiredOpen}
          onClose={() => setSessionExpiredOpen(false)}
          platform="wqt"
          message="Your session has expired. Please sign in again."
        />
        <Confirmation />
      </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
    </QueryProvider>
  );
}
