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
import DashboardMain from "./components/cloud/DashboardMain";

// Role-based dashboards
import BuyerDashboard from "./components/dashboards/BuyerDashboard";
import SellerDashboard_Role from "./components/dashboards/SellerDashboard";
import InstallerDashboard from "./components/dashboards/InstallerDashboard";
import { getDefaultDashboardRoute } from "./utils/roleRouting";

/* -------------------------------------------------------------------------- */
/*                              DEBUG VERSION TAG                              */
/* -------------------------------------------------------------------------- */

const BUILD_VERSION = "2025-11-28-03";
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

  // MODE DETECTION (Marketplace vs Cloud)
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

  // Apply document title
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
      {/* DEBUG VERSION LABEL */}
      <div
        style={{
          position: "fixed",
          bottom: 4,
          right: 8,
          fontSize: "10px",
          opacity: 0.5,
          zIndex: 99999,
          background: "#fff",
          padding: "2px 6px",
          borderRadius: 4,
          border: "1px solid #ddd",
        }}
      >
        v{BUILD_VERSION}
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

      {/* BOTTOM BADGE */}
      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*                            LANDING REDIRECTS                               */
/* -------------------------------------------------------------------------- */

const CloudLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, 'cloud');
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return <Welcome />;
};

const MarketplaceLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      const route = getDefaultDashboardRoute(user, 'marketplace');
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  return <Welcome />;
};

/* -------------------------------------------------------------------------- */
/*                                 CLOUD ROUTES                               */
/* -------------------------------------------------------------------------- */

const CloudRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<CloudLanding user={user} />} />

    {user?.uid && (
      <>
        {/* Role-based dashboards */}
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />
        <Route path="/dashboard/installer" element={<InstallerDashboard />} />

        {/* Legacy/admin dashboards */}
        <Route path="/dashboard/:dashID" element={<Home />} />
        <Route path="/dashboard/main" element={<DashboardMain />} />

        {/* Features */}
        <Route
          path="/features/nutrient-calculator"
          element={<NutrientCalculator />}
        />
        <Route path="/features/verification" element={<VerificationUI />} />
        <Route path="/features/stream" element={<Livepeer />} />
        <Route path="/features/upload-media" element={<Livepeer />} />
        <Route path="/features/:serviceID" element={<Livepeer />} />
        <Route path="/media/:playbackID" element={<Livepeer />} />
        <Route path="/media/live/:liveID" element={<Livepeer />} />
      </>
    )}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                             MARKETPLACE ROUTES                             */
/* -------------------------------------------------------------------------- */

const MarketplaceRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<MarketplaceLanding user={user} />} />

    {/* Public marketplace explore routes */}
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/marketplace/listing/:id" element={<ListingPage />} />
    <Route path="/recent-removals" element={<RecentRemoval />} />
    <Route path="/certificate/:id" element={<CertificatePage />} />
    <Route path="/registry" element={<Registry />} />
    <Route path="/map" element={<Map />} />
    <Route path="/presale" element={<Presale />} />

    {/* Auth-gated marketplace tools + account */}
    {user?.uid && (
      <>
        {/* Role-based dashboards */}
        <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard_Role />} />
        <Route path="/dashboard/installer" element={<InstallerDashboard />} />

        {/* Tools */}
        <Route
          path="/marketplace/tools/calculator"
          element={<NutrientCalculator />}
        />
        <Route
          path="/marketplace/tools/live"
          element={<Livepeer />}
        />
        <Route
          path="/marketplace/tools/upload"
          element={<Livepeer />} // placeholder for upload tool
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
        <Route
          path="/dashboard/financial"
          element={<FinancialDashboard />}
        />
      </>
    )}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                                GLOBAL POPUPS                               */
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
/*                               APP WRAPPER                                  */
/* -------------------------------------------------------------------------- */

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

export default App;
