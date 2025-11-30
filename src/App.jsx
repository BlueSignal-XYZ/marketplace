// /src/App.jsx
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
  Registry,
  RecentRemoval,
  CertificatePage,
  Map,
  Presale,
} from "./components/routes";

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
import CommissioningPage from "./components/cloud/CommissioningPage";
import AlertsPage from "./components/cloud/AlertsPage";

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

/* -------------------------------------------------------------------------- */
/*                              DEBUG VERSION TAG                              */
/* -------------------------------------------------------------------------- */

const BUILD_VERSION =
  import.meta.env.VITE_BUILD_VERSION ||
  new Date().toISOString().slice(0, 10);
console.log("🔥 BUILD VERSION:", BUILD_VERSION);

/* -------------------------------------------------------------------------- */
/*                                   APP ROOT                                 */
/* -------------------------------------------------------------------------- */

function App() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  let mode = "marketplace";

  // MODE DETECTION
  if (
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz") ||
    host === "cloud-bluesignal.web.app"
  ) {
    mode = "cloud";
  } else if (
    host === "waterquality.trading" ||
    host === "waterquality-trading.web.app" ||
    host.endsWith(".waterquality.trading")
  ) {
    mode = "marketplace";
  } else {
    const appParam = params.get("app");
    if (appParam === "cloud" || appParam === "marketplace") {
      mode = appParam;
    }
  }

  console.log("🌐 MODE:", mode, "| USER:", user?.uid || "none");

  return (
    <Router>
      <AppShell mode={mode} user={user} />
    </Router>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   APP SHELL                                */
/* -------------------------------------------------------------------------- */

function AppShell({ mode, user }) {
  const location = useLocation();

  const [cloudMenuOpen, setCloudMenuOpen] = React.useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = React.useState(false);

  const toggleCloudMenu = () => {
    console.log("📡 CLOUD MENU TOGGLE:", !cloudMenuOpen);
    setCloudMenuOpen((p) => !p);
  };

  const toggleMarketMenu = () => {
    console.log("🛒 MARKET MENU TOGGLE:", !marketMenuOpen);
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
        Last updated: {BUILD_VERSION}
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
        <CloudRoutes user={user} />
      ) : (
        <MarketplaceRoutes user={user} />
      )}

      {/* BADGE PORTAL */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*                        LANDING / POST-AUTH REDIRECTS                        */
/* -------------------------------------------------------------------------- */

const CloudLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, "cloud");
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return <Welcome />;
};

const MarketplaceLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, "marketplace");
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return <Welcome />;
};

/* -------------------------------------------------------------------------- */
/*                            CLOUD AUTH GATE                                 */
/* -------------------------------------------------------------------------- */

/**
 * CloudAuthGate - Protects Cloud routes while preventing 404s
 * Shows Welcome (login) if no user, otherwise renders the protected component
 */
const CloudAuthGate = ({ children }) => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  if (!user?.uid) {
    return <Welcome />;
  }

  return children;
};

/* -------------------------------------------------------------------------- */
/*                                 CLOUD ROUTES                                */
/* -------------------------------------------------------------------------- */

const CloudRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<CloudLanding user={user} />} />

    {/*
      ALWAYS-REGISTERED CLOUD DASHBOARD ROUTES
      These routes are ALWAYS defined to prevent 404s.
      CloudAuthGate handles auth, showing Welcome if not logged in.
    */}
    <Route
      path="/dashboard/main"
      element={
        <CloudAuthGate>
          <OverviewDashboard />
        </CloudAuthGate>
      }
    />

    <Route
      path="/dashboard/buyer"
      element={
        <CloudAuthGate>
          <BuyerDashboard />
        </CloudAuthGate>
      }
    />

    <Route
      path="/dashboard/seller"
      element={
        <CloudAuthGate>
          <SellerDashboard_Role />
        </CloudAuthGate>
      }
    />

    <Route
      path="/dashboard/installer"
      element={
        <CloudAuthGate>
          <InstallerDashboard />
        </CloudAuthGate>
      }
    />

    {/* Legacy dashboard */}
    <Route
      path="/dashboard/:dashID"
      element={
        <CloudAuthGate>
          <Home />
        </CloudAuthGate>
      }
    />

    {/* Cloud console pages */}
    <Route
      path="/cloud/sites"
      element={
        <CloudAuthGate>
          <OverviewDashboard />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/devices"
      element={
        <CloudAuthGate>
          <DevicesListPage />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/devices/:deviceId"
      element={
        <CloudAuthGate>
          <DeviceDetailPage />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/commissioning"
      element={
        <CloudAuthGate>
          <CommissioningPage />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/alerts"
      element={
        <CloudAuthGate>
          <AlertsPage />
        </CloudAuthGate>
      }
    />

    {/* Cloud tools (non-marketplace) */}
    <Route
      path="/cloud/tools/nutrient-calculator"
      element={
        <CloudAuthGate>
          <CloudNutrientCalculator />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/tools/verification"
      element={
        <CloudAuthGate>
          <CloudVerification />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/tools/live"
      element={
        <CloudAuthGate>
          <CloudLiveStream />
        </CloudAuthGate>
      }
    />

    <Route
      path="/cloud/tools/upload-media"
      element={
        <CloudAuthGate>
          <CloudUploadMedia />
        </CloudAuthGate>
      }
    />

    {/* Media */}
    <Route
      path="/media/:playbackID"
      element={
        <CloudAuthGate>
          <CloudMediaPlayer />
        </CloudAuthGate>
      }
    />

    <Route
      path="/media/live/:liveID"
      element={
        <CloudAuthGate>
          <CloudMediaPlayer />
        </CloudAuthGate>
      }
    />

    {/* Legacy features for backwards compatibility */}
    <Route
      path="/features/nutrient-calculator"
      element={
        <CloudAuthGate>
          <CloudNutrientCalculator />
        </CloudAuthGate>
      }
    />

    <Route
      path="/features/verification"
      element={
        <CloudAuthGate>
          <CloudVerification />
        </CloudAuthGate>
      }
    />

    <Route
      path="/features/stream"
      element={
        <CloudAuthGate>
          <CloudLiveStream />
        </CloudAuthGate>
      }
    />

    <Route
      path="/features/upload-media"
      element={
        <CloudAuthGate>
          <CloudUploadMedia />
        </CloudAuthGate>
      }
    />

    <Route
      path="/features/:serviceID"
      element={
        <CloudAuthGate>
          <Livepeer />
        </CloudAuthGate>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                             MARKETPLACE ROUTES                              */
/* -------------------------------------------------------------------------- */

const MarketplaceRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<MarketplaceLanding user={user} />} />

    {/* Public marketplace routes */}
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/marketplace/listing/:id" element={<ListingPage />} />
    <Route path="/recent-removals" element={<RecentRemoval />} />
    <Route path="/certificate/:id" element={<CertificatePage />} />
    <Route path="/registry" element={<Registry />} />
    <Route path="/map" element={<Map />} />
    <Route path="/presale" element={<Presale />} />

    {/* Auth-gated marketplace */}
    {user?.uid && (
      <>
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />
        <Route path="/dashboard/installer" element={<InstallerDashboard />} />

        {/* Marketplace tools */}
        <Route
          path="/marketplace/tools/calculator"
          element={<NutrientCalculator />}
        />
        <Route path="/marketplace/tools/live" element={<Livepeer />} />
        <Route
          path="/marketplace/tools/upload"
          element={<Livepeer />}
        />
        <Route
          path="/marketplace/tools/verification"
          element={<VerificationUI />}
        />

        {/* Account */}
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
/*                               APP WRAPPER                                   */
/* -------------------------------------------------------------------------- */

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

export default App;
