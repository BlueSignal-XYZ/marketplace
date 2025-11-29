// /src/routes/Welcome.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LoginForm from "./components/welcome/LoginForm";
import RegisterForm from "./components/welcome/RegisterForm";
import { WelcomeHome } from "./components/welcome";

import Footer from "../components/shared/Footer/Footer";
import { useAppContext } from "../context/AppContext";
import { getDefaultDashboardRoute } from "../utils/roleRouting";

import cloudLogo from "../assets/bluesignal-logo.png";
import marketplaceLogo from "../assets/logo.png";

// --------------------- logo by hostname (used by WelcomeHome) -------------
const host = window.location.hostname;
const isCloudHost =
  host === "cloud.bluesignal.xyz" || host.endsWith(".cloud.bluesignal.xyz");

export const logoImage = isCloudHost ? cloudLogo : marketplaceLogo;

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

    const host = window.location.hostname;
    const mode =
      host === "cloud.bluesignal.xyz" ||
      host.endsWith(".cloud.bluesignal.xyz")
        ? "cloud"
        : "marketplace";

    const route = getDefaultDashboardRoute(user, mode);
    navigate(route, { replace: true });
  }, [user, navigate]);

  const enterDash = () => {
    const host = window.location.hostname;
    const mode =
      host === "cloud.bluesignal.xyz" ||
      host.endsWith(".cloud.bluesignal.xyz")
        ? "cloud"
        : "marketplace";

    const route = getDefaultDashboardRoute(user, mode);
    navigate(route);
  };

  return (
    <FullScreenWrapper>
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

      <Footer />
    </FullScreenWrapper>
  );
};

export default Welcome;