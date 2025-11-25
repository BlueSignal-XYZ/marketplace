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

import cloudLogo from "../assets/bluesignal-logo.png";
import marketplaceLogo from "../assets/logo.png";

// ----------------------------------------------------------------------------
// Host / mode helpers
// ----------------------------------------------------------------------------
const getHostInfo = () => {
  const host = window.location.hostname;
  const isCloud =
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz");
  return { host, isCloud };
};

const { isCloud: initialIsCloud } = getHostInfo();

// Exposed logo for WelcomeHome, etc.
export const logoImage = initialIsCloud ? cloudLogo : marketplaceLogo;

const backgroundImage = new URL(
  "../assets/wallpapers/welcome_wallpaper.jpg",
  import.meta.url
).href;

// ----------------------------------------------------------------------------
// Layout
// ----------------------------------------------------------------------------

const FullScreenWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;

  .form-elements-wrap {
    max-width: 400px;
    width: 90%;
    margin: 0 auto;

    @media (min-width: 1024px) {
      margin: 0;
    }
  }

  .separator {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0px;

    .separator-line {
      width: 100%;
      height: 1px;
      background: ${({ theme }) => theme.colors.ui100};
    }

    .separator-text {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.ui600};
    }
  }

  .content {
    overflow-y: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: calc(100vh - 24px);

    @media (max-width: 1024px) {
      flex-direction: column;
    }
  }

  .section-left {
    width: 100%;
    display: none;

    @media (min-width: 1024px) {
      max-width: 45vw;
      display: block;
      height: calc(100vh - 24px);
    }

    img {
      border-radius: 40px;
      height: 100%;
      width: 100%;
      padding: 24px;
      object-fit: cover;
    }

    .section-left-image {
      overflow: hidden;
      width: 100%;
    }
  }

  .sign-in-form-section {
    width: 100%;
    display: flex;
    flex-direction: column;

    @media (min-width: 1024px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 0;
    }

    .form-content {
      max-width: 400px;
    }
  }
`;

const StyledLogo = styled.img``;
export const CardLogo = styled(StyledLogo)``;

export const logoVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1 } },
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

const Welcome = () => {
  const { STATES, ACTIONS } = useAppContext();
  const navigate = useNavigate();

  const [cardState, setCardState] = useState("");
  const [googleData, setGoogleData] = useState({});
  const { user } = STATES || {};
  const { updateUser } = ACTIONS || {};

  // If user already logged in, send them to the right app
  useEffect(() => {
    if (!user?.uid) return;

    const { isCloud } = getHostInfo();

    if (isCloud) {
      navigate("/dashboard/main", { replace: true });
    } else {
      navigate("/marketplace", { replace: true });
    }
  }, [user, navigate]);

  // Called after successful login/register
  const enterDash = () => {
    const { isCloud } = getHostInfo();

    if (isCloud) {
      navigate("/dashboard/main");
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <FullScreenWrapper>
      <div className="content">
        <div className="sign-in-form-section">
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
        </div>

        <div className="section-left">
          <img
            className="section-left-image"
            src={backgroundImage}
            alt="Welcome background"
          />
        </div>
      </div>

      <Footer />
    </FullScreenWrapper>
  );
};

export default Welcome;