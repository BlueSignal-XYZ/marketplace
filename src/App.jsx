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

function App() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  let mode = "marketplace";

  if (host === "cloud.bluesignal.xyz" || host.endsWith(".cloud.bluesignal.xyz")) {
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

  return (
    <Router>
      <AppShell mode={mode} user={user} />
    </Router>
  );
}

/* -------------------------------------------------------------------------- */
/*                           INNER APP SHELL (Router)                          */
/* -------------------------------------------------------------------------- */

function AppShell({ mode, user }) {
  const location = useLocation();

  const [cloudMenuOpen, setCloudMenuOpen] = React.useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = React.useState(false);

  const toggleCloudMenu = () => setCloudMenuOpen((prev) => !prev);
  const toggleMarketMenu = () => setMarketMenuOpen((prev) => !prev);

  React.useEffect(() => {
    setCloudMenuOpen(false);
    setMarketMenuOpen(false);
  }, [location.pathname]);

  // ---------- DYNAMIC TITLE ----------
  React.useEffect(() => {
    const host = window.location.hostname;
    const path = location.pathname;

    if (host.includes("cloud.bluesignal.xyz")) {
      // Cloud app
      if (path.startsWith("/dashboard")) {
        document.title = "BlueSignal Cloud Monitoring – Dashboard";
      } else if (path.startsWith("/features/nutrient-calculator")) {
        document.title = "BlueSignal Cloud – Nutrient Calculator";
      } else if (path.startsWith("/features/verification")) {
        document.title = "BlueSignal Cloud – Verification";
      } else {
        document.title = "BlueSignal Cloud Monitoring";
      }
    } else if (
      host.includes("waterquality.trading") ||
      host.includes("waterquality-trading.web.app")
    ) {
      // Marketplace app
      if (path.startsWith("/marketplace/seller-dashboard")) {
        document.title = "WaterQuality.Trading – Seller Dashboard";
      } else if (path.startsWith("/dashboard/financial")) {
        document.title = "WaterQuality.Trading – Financial Dashboard";
      } else if (path.startsWith("/marketplace")) {
        document.title = "WaterQuality.Trading – Marketplace";
      } else if (path.startsWith("/registry")) {
        document.title = "WaterQuality.Trading – Registry";
      } else {
        document.title = "WaterQuality.Trading";
      }
    } else {
      // Fallback (local dev / other)
      document.title = "Water Quality & Monitoring";
    }
  }, [location.pathname]);
  // -----------------------------------

  const isAuthLanding = location.pathname === "/";
  const isLoggedIn = !!user?.uid;
  const showAppChrome = isLoggedIn && !isAuthLanding;

  return (
    <AppContainer>
      {/* Headers only after login and off "/" */}
      {showAppChrome && mode === "cloud" && (
        <CloudHeader onMenuClick={toggleCloudMenu} />
      )}

      {showAppChrome && mode === "marketplace" && (
        <MarketplaceHeader onMenuClick={toggleMarketMenu} />
      )}

      {/* Global popups / settings only after login */}
      <Popups show={showAppChrome} />

      {/* Menus only after login */}
      {showAppChrome && mode === "marketplace" && (
        <MarketplaceMenu
          open={marketMenuOpen}
          onClose={() => setMarketMenuOpen(false)}
          user={user}
        />
      )}

      {showAppChrome && mode === "cloud" && (
        <CloudMenu
          open={cloudMenuOpen}
          onClose={() => setCloudMenuOpen(false)}
          user={user}
        />
      )}

      {/* Mode-specific routes */}
      {mode === "cloud" ? (
        <CloudRoutes user={user} />
      ) : (
        <MarketplaceRoutes user={user} />
      )}

      {isLoggedIn && <LinkBadgePortal />}
    </AppContainer>
  );
}

/* -------------------------------------------------------------------------- */
/*                          LANDING REDIRECT HANDLERS                          */
/* -------------------------------------------------------------------------- */

const CloudLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      navigate("/dashboard/main", { replace: true });
    }
  }, [user, navigate]);

  return <Welcome />;
};

const MarketplaceLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      navigate("/marketplace", { replace: true });
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
        <Route path="/dashboard/:dashID" element={<Home />} />
        <Route path="/dashboard/main" element={<DashboardMain />} />

        <Route
          path="/features/nutrient-calculator"
          element={<NutrientCalculator />}
        />

        <Route
          path="/features/verification"
          element={<VerificationUI />}
        />

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

    {user?.uid && (
      <>
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

    <Route path="/marketplace" element={<Marketplace />} />
    <Route
      path="/marketplace/listing/:id"
      element={<ListingPage />}
    />
    <Route path="/recent-removals" element={<RecentRemoval />} />
    <Route path="/certificate/:id" element={<CertificatePage />} />
    <Route path="/registry" element={<Registry />} />
    <Route path="/map" element={<Map />} />
    <Route path="/presale" element={<Presale />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* -------------------------------------------------------------------------- */
/*                              GLOBAL POPUPS                                 */
/* -------------------------------------------------------------------------- */

const Popups = ({ show }) => {
  if (!show) return null;

  return (
    <>
      <Notification />
      <Confirmation />
      <ResultPopup />
      <NotificationBar />
      <SettingsMenu />
    </>
  );
};

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