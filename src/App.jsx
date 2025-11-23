import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import LinkBadgePortal from "./components/LinkBadgePortal.jsx";

import {
  Welcome,
  Home,
  Marketplace,
  NotFound,
} from "./routes";

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
import { Notification, Confirmation, ResultPopup } from "./components/popups";
import { useAppContext } from "./context/AppContext";

function App() {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  return (
    <Router>
      <AppContainer>
        <Popups />

        {/* If you use a top nav, mount it here */}
        {/* <Navbar /> */}

        <Routes>
          {/* Root goes back to Welcome */}
          <Route path="/" element={<Welcome />} />

          {user?.uid && (
            <>
              <Route
                path="/features/verification"
                element={<VerificationUI />}
              />
              <Route path="/dashboard/:dashID" element={<Home />} />
              <Route
                path="/features/nutrient-calculator"
                element={<NutrientCalculator />}
              />
              <Route path="/features/:serviceID" element={<Livepeer />} />
              <Route path="/media/:playbackID" element={<Livepeer />} />
              <Route path="/media/live/:liveID" element={<Livepeer />} />
              <Route
                path="/marketplace/seller-dashboard"
                element={<SellerDashboard />}
              />
            </>
          )}

          {/* Public marketplace + registry flows */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/listing/:id" element={<ListingPage />} />
          <Route path="/recent-removals" element={<RecentRemoval />} />
          <Route path="/certificate/:id" element={<CertificatePage />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/map" element={<Map />} />
          <Route path="/presale" element={<Presale />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 👇 Only show the connectivity badge for logged-in users.
            The badge itself also hides unless pathname starts with /dashboard */}
        {user?.uid && <LinkBadgePortal />}
      </AppContainer>
    </Router>
  );
}

const Popups = () => {
  return (
    <>
      <Notification />
      <Confirmation />
      <ResultPopup />
      {/* User Only */}
      <Sidebar key={window.location.pathname} />
      <NotificationBar />
      <SettingsMenu />
    </>
  );
};

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

export default App;