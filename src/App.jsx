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

import LinkBadgePortal from "./components/LinkBadgePortal.jsx";

import { Welcome, Home, Marketplace, NotFound } from "./routes";

import {
  Registry,
  RecentRemoval,
  CertificatePage,
  Map,
  Presale,
} from "./components/routes";

import {
  Navbar,
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

function App() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  // ---------------------------------------------
  // Determine which APP MODE we’re using
  // ---------------------------------------------
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);

  let mode = "marketplace"; // default

  if (host.includes("cloud.bluesignal.xyz")) {
    mode = "cloud";
  } else if (host.includes("waterquality.trading")) {
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

/**
 * Inner shell so we can use useLocation (needs to be inside Router)
 */
function AppShell({ mode, user }) {
  const location = useLocation();

  // Cloud + Marketplace menu toggles (header burger) – ready for menus later
  const [cloudMenuOpen, setCloudMenuOpen] = React.useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = React.useState(false);

  const toggleCloudMenu = () => setCloudMenuOpen((prev) => !prev);
  const toggleMarketMenu = () => setMarketMenuOpen((prev) => !prev);

  // Treat "/" as AUTH LANDING ONLY (no header there)
  const isAuthLanding = location.pathname === "/";

  return (
    <AppContainer>
      {/* Mode badge so you can SEE the difference */}
      <ModeBadge $mode={mode}>
        {mode === "cloud"
          ? "CLOUD MODE (Monitoring)"
          : "MARKETPLACE MODE (Trading)"}
      </ModeBadge>

      {/* Headers ONLY when we're not on the auth landing page */}
      {!isAuthLanding && mode === "cloud" && (
        <CloudHeader onMenuClick={toggleCloudMenu} />
      )}

      {!isAuthLanding && mode === "marketplace" && (
        <MarketplaceHeader onMenuClick={toggleMarketMenu} />
      )}

      {/* Pass mode into Popups so Sidebar can be gated */}
      <Popups mode={mode} />

      {/* Global navbar is intentionally disabled for now */}
      {/* <Navbar /> */}

      {mode === "cloud" ? (
        <CloudRoutes user={user} />
      ) : (
        <MarketplaceRoutes user={user} />
      )}

      {user?.uid && <LinkBadgePortal />}
    </AppContainer>
  );
}

/* ========================================================================== */
/* LANDING COMPONENTS WITH REDIRECTS                                          */
/* ========================================================================== */

const CloudLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      // redirect logged-in cloud users off "/" to a default dashboard
      navigate("/dashboard/main", { replace: true });
    }
  }, [user, navigate]);

  // Logged-out users see Welcome (auth/marketing)
  return <Welcome />;
};

const MarketplaceLanding = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.uid) {
      // redirect logged-in marketplace users off "/" to marketplace
      navigate("/marketplace", { replace: true });
    }
  }, [user, navigate]);

  // Logged-out users see Welcome (auth/marketing)
  return <Welcome />;
};

/* ========================================================================== */
/* CLOUD ROUTES — cloud.bluesignal.xyz                                         */
/* Monitoring / devices / dashboard / nutrient tools                           */
/* ========================================================================== */
const CloudRoutes = ({ user }) => (
  <Routes>
    {/* Root: auth landing + redirect for logged-in cloud users */}
    <Route path="/" element={<CloudLanding user={user} />} />

    {user?.uid && (
      <>
        {/* Environmental dashboard */}
        <Route path="/dashboard/:dashID" element={<Home />} />
        <Route path="/dashboard/main" element={<Home />} />

        {/* Nutrient calculator */}
        <Route
          path="/features/nutrient-calculator"
          element={<NutrientCalculator />}
        />

        {/* Verification */}
        <Route
          path="/features/verification"
          element={<VerificationUI />}
        />

        {/* Live streaming / playback */}
        <Route path="/features/:serviceID" element={<Livepeer />} />
        <Route path="/media/:playbackID" element={<Livepeer />} />
        <Route path="/media/live/:liveID" element={<Livepeer />} />
      </>
    )}

    {/* 404 fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* ========================================================================== */
/* MARKETPLACE ROUTES — waterquality.trading                                   */
/* Trading / seller dashboard / registry / financial dashboard                 */
/* ========================================================================== */
const MarketplaceRoutes = ({ user }) => (
  <Routes>
    {/* Root: auth landing + redirect for logged-in marketplace users */}
    <Route path="/" element={<MarketplaceLanding user={user} />} />

    {/* Authenticated marketplace features */}
    {user?.uid && (
      <>
        <Route
          path="/marketplace/seller-dashboard"
          element={<SellerDashboard />}
        />
      </>
    )}

    {/* Public marketplace */}
    <Route path="/marketplace" element={<Marketplace />} />
    <Route
      path="/marketplace/listing/:id"
      element={<ListingPage />}
    />

    {/* Registry, map, certificate pages */}
    <Route path="/recent-removals" element={<RecentRemoval />} />
    <Route path="/certificate/:id" element={<CertificatePage />} />
    <Route path="/registry" element={<Registry />} />
    <Route path="/map" element={<Map />} />
    <Route path="/presale" element={<Presale />} />

    {/* 404 fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/* ========================================================================== */
/* GLOBAL POPUPS USED BY BOTH MODES                                            */
/* ========================================================================== */
const Popups = ({ mode }) => {
  return (
    <>
      <Notification />
      <Confirmation />
      <ResultPopup />

      {/* Sidebar + phone sidebar ONLY in cloud mode */}
      {mode === "cloud" && (
        <Sidebar key={window.location.pathname} />
      )}

      <NotificationBar />
      <SettingsMenu />
    </>
  );
};

/* ========================================================================== */
/* WRAPPER + MODE BADGE                                                        */
/* ========================================================================== */
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
  z-index: 9999;

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