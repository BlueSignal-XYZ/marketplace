// /src/App.jsx
/**
 * BRAND SEPARATION RULE:
 * - Cloud mode: imports from src/components/cloud/ and shared components only
 * - Marketplace mode: imports from src/wqt/ and shared components only
 * - Shared components must be brand-neutral (no hardcoded branding)
 */
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";

import { DemoBanner } from "./components/DemoBanner";

import { CloudHeader } from "./components/navigation/CloudHeader";
import { MarketplaceHeader } from "./components/navigation/MarketplaceHeader";
import { MarketplaceMenu } from "./components/navigation/MarketplaceMenu";
import { CloudMenu } from "./components/navigation/CloudMenu";

import LinkBadgePortal from "./components/LinkBadgePortal.jsx";

import {
  Welcome,
  Home,
  Marketplace,
  NotFound,
  FinancialDashboard,
} from "./routes";

import {
  CertificatePage,
  Presale,
} from "./components/routes";

import { RegistryPage } from "./wqt/pages/RegistryPage";
import { RecentRemovalsPage } from "./wqt/pages/RecentRemovalsPage";
import { MapPage } from "./wqt/pages/MapPage";
import { PresalePage } from "./wqt/pages/PresalePage";

import {
  NotificationBar,
  SettingsMenu,
} from "./components";

import {
  ListingPage,
  CreateListingPage,
} from "./components/elements/marketplace";

import { Livepeer } from "./components/elements/livepeer";
import { VerificationUI } from "./components/elements/contractUI";
import BlueSignalConfigurator from "./components/BlueSignalConfigurator";
import { SalesPage, AboutPage, FAQPage, ContactPage } from "./components/BlueSignalConfigurator/components";

// Installer portal components (used in Cloud commissioning routes)
import {
  CommissionWorkflow,
  DeviceActivation,
} from "./components/installer";

import {
  Notification,
  Confirmation,
  ResultPopup,
} from "./components/popups";

import { useAppContext } from "./context/AppContext";

// Cloud console components
import OverviewDashboard from "./components/cloud/OverviewDashboard";
import DevicesListPage from "./components/cloud/DevicesListPage";
import DeviceDetailPage from "./components/cloud/DeviceDetailPage";
import SitesListPage from "./components/cloud/SitesListPage";
import SiteDetailPage from "./components/cloud/SiteDetailPage";
import CreateSitePage from "./components/cloud/CreateSitePage";
import CommissioningPage from "./components/cloud/CommissioningPage";
import FullCommissioningWizard from "./components/cloud/FullCommissioningWizard";
import AlertsPage from "./components/cloud/AlertsPage";
import AlertDetailPage from "./components/cloud/AlertDetailPage";
import DeviceOnboardingWizard from "./components/cloud/DeviceOnboardingWizard";
import ProfilePage from "./components/cloud/ProfilePage";
import OnboardingWizard from "./components/cloud/OnboardingWizard";

import {
  CloudNutrientCalculator,
  CloudVerification,
  CloudLiveStream,
  CloudUploadMedia,
  CloudMediaPlayer,
} from "./components/cloud/CloudToolsWrapper";

// Role dashboards
import BuyerDashboard from "./components/dashboards/BuyerDashboard";
import SellerDashboard_Role from "./components/dashboards/SellerDashboard";
import InstallerDashboard from "./components/dashboards/InstallerDashboard";

import { getDefaultDashboardRoute } from "./utils/roleRouting";
import { isCloudMode, isSalesMode, getAppMode } from "./utils/modeDetection";
import { isFirebaseConfigured, firebaseConfigError } from "./apis/firebase";

/* -------------------------------------------------------------------------- */
/*                              DEBUG VERSION TAG                              */
/* -------------------------------------------------------------------------- */

const BUILD_VERSION =
  import.meta.env.VITE_BUILD_VERSION ||
  new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------------------------- */
/*                           CONFIGURATION ERROR                              */
/* -------------------------------------------------------------------------- */

/**
 * ConfigurationError - Displays a user-friendly error when Firebase isn't configured
 * This prevents the white screen issue when environment variables are missing
 */
const ConfigurationError = ({ error }) => (
  <ConfigErrorContainer>
    <ConfigErrorCard>
      <ConfigErrorIcon>⚠️</ConfigErrorIcon>
      <ConfigErrorTitle>Configuration Required</ConfigErrorTitle>
      <ConfigErrorMessage>
        The application is not properly configured. This usually means
        environment variables are missing from the deployment.
      </ConfigErrorMessage>
      <ConfigErrorDetails>
        <strong>Technical details:</strong> {error}
      </ConfigErrorDetails>
      <ConfigErrorHelp>
        If you are a developer, ensure all required VITE_FIREBASE_* environment
        variables are set. If you are a user, please contact support.
      </ConfigErrorHelp>
    </ConfigErrorCard>
  </ConfigErrorContainer>
);

/* -------------------------------------------------------------------------- */
/*                                   APP ROOT                                 */
/* -------------------------------------------------------------------------- */

function App() {
  // Check Firebase configuration first - show error screen if not configured
  // This prevents white screen when environment variables are missing
  if (!isFirebaseConfigured) {
    return <ConfigurationError error={firebaseConfigError} />;
  }

  const { STATES } = useAppContext();
  const { user, authLoading } = STATES || {};

  // MODE DETECTION - using shared utility
  const mode = getAppMode();

  // SECURITY: Debug logging disabled in production - enable with VITE_DEBUG=true
  const isDev = import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true";
  if (isDev) {
    console.log("BUILD:", BUILD_VERSION, "| MODE:", mode);
  }

  return (
    <Router>
      <AppShell mode={mode} user={user} authLoading={authLoading} />
    </Router>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   APP SHELL                                */
/* -------------------------------------------------------------------------- */

function AppShell({ mode, user, authLoading }) {
  const location = useLocation();

  const [cloudMenuOpen, setCloudMenuOpen] = React.useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = React.useState(false);

  const toggleCloudMenu = () => {
    setCloudMenuOpen((p) => !p);
  };

  const toggleMarketMenu = () => {
    setMarketMenuOpen((p) => !p);
  };

  // Apply tab title
  React.useEffect(() => {
    const titles = {
      cloud: "BlueSignal Cloud Monitoring",
      sales: "BlueSignal Sales Portal",
      marketplace: "WaterQuality.Trading",
    };
    document.title = titles[mode] || "WaterQuality.Trading";
  }, [mode]);

  // Close menus on route change
  React.useEffect(() => {
    setCloudMenuOpen(false);
    setMarketMenuOpen(false);
  }, [location.pathname]);

  const isAuthLanding = location.pathname === "/";

  return (
    <AppContainer>
      {/* DEMO MODE BANNER */}
      <DemoBanner />

      {/* SECURITY: Version bubble only shown in development mode */}
      {(import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true") && (
        <div
          style={{
            position: "fixed",
            bottom: 8,
            right: 12,
            fontSize: "11px",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
            fontWeight: 500,
            opacity: 0.6,
            zIndex: 99999,
            background: "#ffffff",
            color: "#64748b",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {BUILD_VERSION}
        </div>
      )}

      {/* HEADERS - Sales mode has no header (clean product-focused layout) */}
      {!isAuthLanding && mode === "cloud" && (
        <CloudHeader onMenuClick={toggleCloudMenu} />
      )}

      {!isAuthLanding && mode === "marketplace" && (
        <MarketplaceHeader onMenuClick={toggleMarketMenu} />
      )}

      {/* Sales mode intentionally has no header - configurator has its own navigation */}

      {/* GLOBAL POPUPS */}
      <Popups />

      {/* MENUS */}
      {mode === "marketplace" && (
        <MarketplaceMenu
          open={marketMenuOpen}
          onClose={() => setMarketMenuOpen(false)}
          user={user}
        />
      )}

      {mode === "cloud" && (
        <CloudMenu
          open={cloudMenuOpen}
          onClose={() => setCloudMenuOpen(false)}
          user={user}
        />
      )}

      {/* ROUTES */}
      {mode === "sales" ? (
        <SalesRoutes />
      ) : mode === "cloud" ? (
        <CloudRoutes user={user} authLoading={authLoading} />
      ) : (
        <MarketplaceRoutes user={user} authLoading={authLoading} />
      )}

      {/* BADGE PORTAL */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*                        LANDING / POST-AUTH REDIRECTS                        */
/* -------------------------------------------------------------------------- */

/**
 * CloudLanding - Handles / route for Cloud mode
 * Waits for auth to complete, then redirects authenticated users
 */
const CloudLanding = ({ user, authLoading }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("🚀 CloudLanding useEffect fired:", {
      user: user?.uid || "null",
      authLoading,
    });

    if (authLoading) {
      console.log("⏳ CloudLanding: Auth loading, waiting...");
      return;
    }

    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, "cloud");
      console.log("✅ CloudLanding: User authenticated, redirecting to:", route);
      navigate(route, { replace: true });
    } else {
      console.log("❌ CloudLanding: No user, showing login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading BlueSignal Cloud...</LoadingText>
        <LoadingSubtext>Preparing your dashboard</LoadingSubtext>
      </LoadingContainer>
    );
  }

  return <Welcome />;
};

/**
 * MarketplaceLanding - Handles / route for Marketplace mode
 */
const MarketplaceLanding = ({ user, authLoading }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("🚀 MarketplaceLanding useEffect fired:", {
      user: user?.uid || "null",
      authLoading,
    });

    if (authLoading) {
      console.log("⏳ MarketplaceLanding: Auth loading, waiting...");
      return;
    }

    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, "marketplace");
      console.log("✅ MarketplaceLanding: User authenticated, redirecting to:", route);
      navigate(route, { replace: true });
    } else {
      console.log("❌ MarketplaceLanding: No user, showing login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading WaterQuality.Trading...</LoadingText>
        <LoadingSubtext>Connecting to the marketplace</LoadingSubtext>
      </LoadingContainer>
    );
  }

  return <Welcome />;
};

/* -------------------------------------------------------------------------- */
/*                            CLOUD AUTH GATE                                 */
/* -------------------------------------------------------------------------- */

/**
 * CloudAuthGate - Protects Cloud routes
 * Shows loading → login → or protected content
 */
const CloudAuthGate = ({ children, authLoading }) => {
  if (authLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Checking authentication...</LoadingText>
        <LoadingSubtext>Please wait while we verify your session</LoadingSubtext>
      </LoadingContainer>
    );
  }

  const { STATES } = useAppContext();
  const { user } = STATES || {};

  if (!user?.uid) {
    console.log("🚫 CloudAuthGate: Not authenticated");
    return <Welcome />;
  }

  console.log("✅ CloudAuthGate: Authenticated, rendering protected route");
  return children;
};

/* -------------------------------------------------------------------------- */
/*                                 CLOUD ROUTES                                */
/* -------------------------------------------------------------------------- */

const CloudRoutes = ({ user, authLoading }) => (
  <Routes>
    <Route path="/" element={<CloudLanding user={user} authLoading={authLoading} />} />

    {/* Main dashboard */}
    <Route
      path="/dashboard/main"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <OverviewDashboard />
        </CloudAuthGate>
      }
    />

    {/* Role-specific dashboards - only installer belongs on Cloud */}
    <Route
      path="/dashboard/installer"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <InstallerDashboard />
        </CloudAuthGate>
      }
    />

    {/* Buyer/seller dashboards removed - they belong on WQT marketplace */}
    {/* Users accessing these routes will fall through to the catch-all */}

    <Route
      path="/dashboard/:dashID"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <Home />
        </CloudAuthGate>
      }
    />

    {/* Cloud console pages */}
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

    <Route
      path="/cloud/profile"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <ProfilePage />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/onboarding"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <OnboardingWizard />
        </CloudAuthGate>
      }
    />

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
      path="/cloud/devices/:deviceId"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <DeviceDetailPage />
        </CloudAuthGate>
      }
    />

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
      element={
        <CloudAuthGate authLoading={authLoading}>
          <CloudUploadMedia />
        </CloudAuthGate>
      }
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

    {/* Legacy features */}
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

    {/* Catch-all: redirect to CloudLanding instead of 404 */}
    <Route path="*" element={<CloudLanding user={user} authLoading={authLoading} />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                               SALES ROUTES                                  */
/* -------------------------------------------------------------------------- */

/**
 * SalesRoutes - Dedicated routes for sales.bluesignal.xyz
 * Unified single-page sales portal with clean URL structure.
 * Uses query params for state instead of hash routes.
 */
const SalesRoutes = () => (
  <Routes>
    {/* Main unified sales page - handles all product/quote state via query params */}
    <Route path="/" element={<SalesPage />} />

    {/* Information pages */}
    <Route path="/about" element={<AboutPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/contact" element={<ContactPage />} />

    {/* Legacy configurator path - redirects to main page */}
    <Route path="/configurator" element={<Navigate to="/" replace />} />

    {/* Product deep links - redirect to main with product param */}
    <Route path="/products/:productId" element={<ProductRedirect />} />

    {/* Catch-all: redirect to main sales page */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

/**
 * ProductRedirect - Handles legacy product routes by converting to query params
 */
const ProductRedirect = () => {
  const location = useLocation();
  const productId = location.pathname.split('/').pop();
  return <Navigate to={`/?product=${productId}`} replace />;
};

/* -------------------------------------------------------------------------- */
/*                             MARKETPLACE ROUTES                              */
/* -------------------------------------------------------------------------- */

const MarketplaceRoutes = ({ user, authLoading }) => (
  <Routes>
    <Route path="/" element={<MarketplaceLanding user={user} authLoading={authLoading} />} />

    {/* Public routes */}
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/marketplace/listing/:id" element={<ListingPage />} />
    <Route path="/recent-removals" element={<RecentRemovalsPage />} />
    <Route path="/certificate/:id" element={<CertificatePage />} />
    <Route path="/registry" element={<RegistryPage />} />
    <Route path="/map" element={<MapPage />} />
    <Route path="/presale" element={<PresalePage />} />

    {/* Redirects for relocated features */}
    {/* Sales configurator moved to sales.bluesignal.xyz */}
    {/* Installer dashboard moved to cloud.bluesignal.xyz */}

    {/* Auth-gated marketplace */}
    {user?.uid && (
      <>
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />

        <Route
          path="/marketplace/tools/verification"
          element={<VerificationUI />}
        />

        {/* Redirect legacy seller dashboard to consolidated route */}
        <Route
          path="/marketplace/seller-dashboard"
          element={<Navigate to="/dashboard/seller" replace />}
        />
        <Route
          path="/marketplace/create-listing"
          element={<CreateListingPage />}
        />
        <Route path="/dashboard/financial" element={<FinancialDashboard />} />
      </>
    )}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                                GLOBAL POPUPS                                */
/* -------------------------------------------------------------------------- */

const Popups = () => (
  <>
    <Notification />
    <Confirmation />
    <ResultPopup />
    <NotificationBar />
    <SettingsMenu />
  </>
);

/* -------------------------------------------------------------------------- */
/*                               STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1D7072 0%, #155e5f 100%);
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  opacity: 1;
`;

const LoadingSubtext = styled.p`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
`;

const ConfigErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 20px;
`;

const ConfigErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ConfigErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const ConfigErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const ConfigErrorMessage = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const ConfigErrorDetails = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #991b1b;
  text-align: left;
  margin-bottom: 20px;
  word-break: break-word;
`;

const ConfigErrorHelp = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
`;

export default App;
