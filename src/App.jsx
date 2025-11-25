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
  Sidebar,
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

// ---------------------------------------------------------------------------
// Root App: decide mode based on hostname / ?app= for local dev
// ---------------------------------------------------------------------------
function App() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  let mode = "marketplace";

  // Cloud domain → cloud mode
  if (
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz")
  ) {
    mode = "cloud";
  }
  // Marketplace domains → marketplace mode
  else if (
    host === "waterquality.trading" ||
    host === "waterquality-trading.web.app" ||
    host.endsWith(".waterquality.trading")
  ) {
    mode = "marketplace";
  }
  // Local / dev override via ?app=
  else {
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

// ---------------------------------------------------------------------------
// Inner shell (inside Router) so we can use useLocation, etc.
// ---------------------------------------------------------------------------
function AppShell({ mode, user }) {
  const location = useLocation();

  const [cloudMenuOpen, setCloudMenuOpen] = React.useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = React.useState(false);

  const toggleCloudMenu = () => setCloudMenuOpen((prev) => !prev);
  const toggleMarketMenu = () => setMarketMenuOpen((prev) => !prev);

  // Close marketplace drawer on route change
  React.useEffect(() => {
    setMarketMenuOpen(false);
  }, [location.pathname]);

  const isAuthLanding = location.pathname === "/";
  const isAnyMenuOpen = cloudMenuOpen || marketMenuOpen;

  // Dynamic <title> per mode
  React.useEffect(() => {
    if (mode === "cloud") {
      document.title = "BlueSignal Cloud Monitoring";
    } else {
      document.title = "WaterQuality.Trading";
    }
  }, [mode]);

  return (
    <AppContainer>
      {/* Mode pill – hidden while a menu drawer is open */}
      {!isAnyMenuOpen && (
        <ModeBadge $mode={mode}>
          {mode === "cloud"
            ? "CLOUD MODE (Monitoring)"
            : "MARKETPLACE MODE (Trading)"}
        </ModeBadge>
      )}

      {/* Headers only on non-auth pages */}
      {!isAuthLanding && mode === "cloud" && (
        <CloudHeader onMenuClick={toggleCloudMenu} />
      )}

      {!isAuthLanding && mode === "marketplace" && (
        <MarketplaceHeader onMenuClick={toggleMarketMenu} />
      )}

      <Popups mode={mode} />

      {/* Marketplace drawer */}
      {mode === "marketplace" && (
        <MarketplaceMenu
          open={marketMenuOpen}
          onClose={() => setMarketMenuOpen(false)}
          user={user}
        />
      )}

      {/* Cloud drawer */}
      {mode === "cloud" && (
        <CloudMenu
          open={cloudMenuOpen}
          onClose={() => setCloudMenuOpen(false)}
          user={user}
        />
      )}

      {mode === "cloud" ? (
        <CloudRoutes user={user} />
      ) : (
        <MarketplaceRoutes user={user} />
      )}

      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}

// ---------------------------------------------------------------------------
// Landing redirect handlers
// ---------------------------------------------------------------------------
const CloudLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      // default cloud landing: devices / environment dashboard
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

// ---------------------------------------------------------------------------
// Cloud routes
// ---------------------------------------------------------------------------
const CloudRoutes = ({ user }) => (
  <Routes>
    <Route path="/" element={<CloudLanding user={user} />} />

    {user?.uid && (
      <>
        {/* devices / environment dashboard */}
        <Route path="/dashboard/:dashID" element={<Home />} />
        <Route path="/dashboard/main" element={<DashboardMain />} />

        {/* nutrient tools */}
        <Route
          path="/features/nutrient-calculator"
          element={<NutrientCalculator />}
        />

        {/* verification */}
        <Route
          path="/features/verification"
          element={<VerificationUI />}
        />

        {/* broadcast + media */}
        <Route path="/features/stream" element={<Livepeer />} />
        <Route path="/features/upload-media" element={<Livepeer />} />

        {/* generic fallbacks */}
        <Route path="/features/:serviceID" element={<Livepeer />} />
        <Route path="/media/:playbackID" element={<Livepeer />} />
        <Route path="/media/live/:liveID" element={<Livepeer />} />
      </>
    )}

    <Route path="*" element={<NotFound />} />
  </Routes>
);

// ---------------------------------------------------------------------------
// Marketplace routes
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Global popups
// ---------------------------------------------------------------------------
const Popups = ({ mode }) => {
  return (
    <>
      <Notification />
      <Confirmation />
      <ResultPopup />

      {/* Sidebar only matters in cloud / monitoring */}
      {mode === "cloud" && (
        <Sidebar key={window.location.pathname} />
      )}

      <NotificationBar />
      <SettingsMenu />
    </>
  );
};

// ---------------------------------------------------------------------------
// App wrapper + mode badge
// ---------------------------------------------------------------------------
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 1024px) {
    min-height: 100vh;
    width: 100vw;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
  }
`;

const ModeBadge = styled.div`
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 9000;

  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  background: ${({ $mode, theme }) =>
    $mode === "cloud"
      ? theme.colors?.primary50 || "#e0f2ff"
      : theme.colors?.accent50 || "#f3e8ff"};

  color: ${({ $mode, theme }) =>
    $mode === "cloud"
      ? theme.colors?.primary700 || "#075985"
      : theme.colors?.accent700 || "#6b21a8"};

  border: 1px solid
    ${({ $mode, theme }) =>
      $mode === "cloud"
        ? theme.colors?.primary200 || "#bae6fd"
        : theme.colors?.accent200 || "#e9d5ff"};
`;

export default App;