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

import {
  NotificationBar,
  NutrientCalculator,
  SettingsMenu,
} from "./components";

import {
  SellerDashboard,
  ListingPage,
} from "./components/elements/marketplace";

import { Livepeer } from "./components/elements/livepeer";
import { VerificationUI } from "./components/elements/contractUI";
import BlueSignalConfigurator from "./components/BlueSignalConfigurator";

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
import CommissioningPage from "./components/cloud/CommissioningPage";
import AlertsPage from "./components/cloud/AlertsPage";
import AlertDetailPage from "./components/cloud/AlertDetailPage";
import DeviceOnboardingWizard from "./components/cloud/DeviceOnboardingWizard";

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
import { isCloudMode, getAppMode } from "./utils/modeDetection";

/* -------------------------------------------------------------------------- */
/*                              DEBUG VERSION TAG                              */
/* -------------------------------------------------------------------------- */

const BUILD_VERSION =
  import.meta.env.VITE_BUILD_VERSION ||
  new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------------------------- */
/*                                   APP ROOT                                 */
/* -------------------------------------------------------------------------- */

function App() {
  const { STATES } = useAppContext();
  const { user, authLoading } = STATES || {};

  // MODE DETECTION - using shared utility
  const mode = getAppMode();

  // DIAGNOSTIC LOGGING (as per spec)
  console.log("═══════════════════════════════════════════════════════════");
  console.log("BUILD:", BUILD_VERSION);
  console.log("MODE:", mode);
  console.log("AUTH_LOADING:", authLoading);
  console.log("USER:", user?.uid || "null");
  console.log("ROLE:", user?.role || "null");
  console.log("ROUTE:", window.location.pathname);
  console.log("═══════════════════════════════════════════════════════════");

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
    document.title =
      mode === "cloud"
        ? "BlueSignal Cloud Monitoring"
        : "WaterQuality.Trading";
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

      {/* DEBUG VERSION BUBBLE */}
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

      {/* HEADERS */}
      {!isAuthLanding && mode === "cloud" && (
        <CloudHeader onMenuClick={toggleCloudMenu} />
      )}

      {!isAuthLanding && mode === "marketplace" && (
        <MarketplaceHeader onMenuClick={toggleMarketMenu} />
      )}

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
      {mode === "cloud" ? (
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
        <LoadingText>Authenticating...</LoadingText>
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

    {/* All dashboard routes ALWAYS registered */}
    <Route
      path="/dashboard/main"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <OverviewDashboard />
        </CloudAuthGate>
      }
    />

    <Route
      path="/dashboard/buyer"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <BuyerDashboard />
        </CloudAuthGate>
      }
    />

    <Route
      path="/dashboard/seller"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <SellerDashboard_Role />
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
      path="/cloud/sites/:siteId"
      element={
        <CloudAuthGate authLoading={authLoading}>
          <SiteDetailPage />
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
    <Route path="/presale" element={<Presale />} />
    <Route path="/sales/configurator" element={<BlueSignalConfigurator />} />

    {/* Auth-gated marketplace */}
    {user?.uid && (
      <>
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />
        <Route path="/dashboard/installer" element={<InstallerDashboard />} />

        <Route
          path="/marketplace/tools/calculator"
          element={<NutrientCalculator />}
        />
        <Route path="/marketplace/tools/live" element={<Livepeer />} />
        <Route path="/marketplace/tools/upload" element={<Livepeer />} />
        <Route
          path="/marketplace/tools/verification"
          element={<VerificationUI />}
        />

        <Route
          path="/marketplace/seller-dashboard"
          element={<SellerDashboard />}
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  font-weight: 500;
  opacity: 0.9;
`;

export default App;
