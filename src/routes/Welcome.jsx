// /src/routes/Welcome.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LoginForm from "./components/welcome/LoginForm";
import RegisterForm from "./components/welcome/RegisterForm";
import { WelcomeHome } from "./components/welcome";

import { useAppContext } from "../context/AppContext";
import { getDefaultDashboardRoute } from "../utils/roleRouting";
import { isCloudMode, getAppMode } from "../utils/modeDetection";
import SEOHead from "../components/seo/SEOHead";
import { WQT_ORGANIZATION_SCHEMA, BLUESIGNAL_ORGANIZATION_SCHEMA } from "../components/seo/schemas";

import cloudLogo from "../assets/bluesignal-logo.png";
import marketplaceLogo from "../assets/logo.png";

// --------------------- logo by hostname (used by WelcomeHome) -------------
export const logoImage = isCloudMode() ? cloudLogo : marketplaceLogo;

// ------------------------------ layout ------------------------------------

const FullScreenWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px 32px;
  box-sizing: border-box;
`;

const CardShell = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 520px;
  }

  .form-elements-wrap {
    margin-top: 16px;
  }

  .form-content {
    width: 100%;
  }
`;

// (kept for animation compatibility if you use it elsewhere)
const StyledLogo = styled.img``;
export const CardLogo = styled(StyledLogo)``;

export const logoVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

const Welcome = () => {
  const { STATES, ACTIONS } = useAppContext();
  const navigate = useNavigate();

  const [cardState, setCardState] = useState("");
  const [googleData, setGoogleData] = useState({});
  const { user } = STATES || {};
  const { updateUser } = ACTIONS || {};

  // If user already logged in, redirect by mode and role
  useEffect(() => {
    if (!user?.uid) return;

    const mode = getAppMode();
    const route = getDefaultDashboardRoute(user, mode);
    console.log("🚀 Welcome: User authenticated, redirecting to:", route);
    navigate(route, { replace: true });
  }, [user, navigate]);

  const enterDash = () => {
    const mode = getAppMode();
    const route = getDefaultDashboardRoute(user, mode);
    console.log("🚀 Welcome: enterDash called, navigating to:", route);
    navigate(route);
  };

  const mode = getAppMode();
  const isCloud = mode === 'cloud';

  // Mode-specific SEO content
  const seoContent = isCloud
    ? {
        title: 'BlueSignal Cloud - Water Quality Monitoring Platform',
        description: 'Real-time water quality monitoring and device management. Monitor your sensors, track data, and manage alerts from anywhere.',
        schema: BLUESIGNAL_ORGANIZATION_SCHEMA,
      }
    : {
        title: 'WaterQuality.Trading - Water Credit Marketplace',
        description: 'B2B marketplace for water quality credit trading. Buy and sell nutrient, stormwater, and thermal credits. Connect with verified sellers.',
        schema: WQT_ORGANIZATION_SCHEMA,
      };

  return (
    <FullScreenWrapper>
      <SEOHead
        title={seoContent.title}
        description={seoContent.description}
        canonical="/"
        jsonLd={seoContent.schema}
      />
      <Content>
        <CardShell>
          <WelcomeHome
            key="welcome"
            user={user}
            setCardState={setCardState}
            enterDash={enterDash}
          />

          <div className="form-elements-wrap">
            <div className="form-content">
              <AnimatePresence mode="wait">
                {cardState !== "register" && (
                  <LoginForm
                    key="login"
                    onSuccess={enterDash}
                    updateUser={updateUser}
                    onSwitchToRegister={() => setCardState("register")}
                  />
                )}
              </AnimatePresence>

              {cardState === "register" && (
                <RegisterForm
                  key="register"
                  onSuccess={enterDash}
                  updateUser={updateUser}
                  onSwitchToLogin={() => setCardState("login")}
                  googleData={googleData}
                />
              )}
            </div>
          </div>
        </CardShell>
      </Content>
    </FullScreenWrapper>
  );
};

export default Welcome;