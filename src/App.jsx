// /src/App.jsx
/**
 * App root — mode detector only.
 * Detects hostname → renders WQTApp or CloudApp with their respective themes.
 * ~90 lines. All routing and layout logic lives in src/platforms/.
 */
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import { useAppContext } from "./context/AppContext";
import { getAppMode } from "./utils/modeDetection";
import { isFirebaseConfigured, firebaseConfigError } from "./apis/firebase";

// Platform apps
import { WQTApp } from "./platforms/wqt/WQTApp";
import { CloudApp } from "./platforms/cloud/CloudApp";

// Legacy sales/landing (backward compat when accessed via ?app=landing)
import BlueSignalConfigurator from "./components/BlueSignalConfigurator";
import { SalesPage, AboutPage, FAQPage, ContactPage, LegalPage, DeveloperDocsPage } from "./components/BlueSignalConfigurator/components";

// ── Build version (debug only) ────────────────────────────
const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || new Date().toISOString().slice(0, 10);

// ── Configuration error screen ────────────────────────────
const ConfigurationError = ({ error }) => (
  <ErrorContainer>
    <ErrorCard>
      <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 16px' }}>Configuration Required</h1>
      <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.6 }}>
        The application is not properly configured. Environment variables may be missing.
      </p>
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#991b1b', textAlign: 'left', marginTop: 20 }}>
        <strong>Details:</strong> {error}
      </div>
    </ErrorCard>
  </ErrorContainer>
);

// ── Legacy sales routes ───────────────────────────────────
const SalesRoutes = () => (
  <Routes>
    <Route path="/" element={<SalesPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/developers" element={<DeveloperDocsPage />} />
    <Route path="/docs" element={<DeveloperDocsPage />} />
    <Route path="/privacy" element={<LegalPage />} />
    <Route path="/terms" element={<LegalPage />} />
    <Route path="/warranty" element={<LegalPage />} />
    <Route path="/accessibility" element={<LegalPage />} />
    <Route path="/configurator" element={<Navigate to="/" replace />} />
    <Route path="/products/:productId" element={<ProductRedirect />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const ProductRedirect = () => {
  const location = useLocation();
  const productId = location.pathname.split('/').pop();
  return <Navigate to={`/?product=${productId}`} replace />;
};

// ── App root ──────────────────────────────────────────────
function App() {
  if (!isFirebaseConfigured) {
    return <ConfigurationError error={firebaseConfigError} />;
  }

  const { STATES } = useAppContext();
  const { user, authLoading } = STATES || {};
  const mode = getAppMode();

  const isDev = import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true";
  if (isDev) console.log("BUILD:", BUILD_VERSION, "| MODE:", mode);

  return (
    <Router>
      {isDev && <VersionBubble>{BUILD_VERSION}</VersionBubble>}
      {mode === "landing" ? (
        <SalesRoutes />
      ) : mode === "cloud" ? (
        <CloudApp user={user} authLoading={authLoading} />
      ) : (
        <WQTApp user={user} authLoading={authLoading} />
      )}
    </Router>
  );
}

// ── Styled (minimal) ──────────────────────────────────────
const ErrorContainer = styled.div`
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px;
`;
const ErrorCard = styled.div`
  background: white; border-radius: 16px; padding: 40px;
  max-width: 500px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
`;
const VersionBubble = styled.div`
  position: fixed; bottom: 8px; right: 12px; font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-weight: 500; opacity: 0.6; z-index: 99999; background: #fff; color: #64748b;
  padding: 4px 10px; border-radius: 999px; border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15,23,42,0.08); pointer-events: none; user-select: none;
`;

export default App;
