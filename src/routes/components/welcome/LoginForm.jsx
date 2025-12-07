// /src/routes/components/welcome/LoginForm.jsx
import React, { useState } from "react";
import styled from "styled-components";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../../apis/firebase";


import Notification from "../../../components/popups/NotificationPopup";
import { PROMPT_CARD, PROMPT_FORM } from "../../../components/lib/styled";
import { formVariant } from "./motion_variants";
import FormSection from "../../../components/shared/FormSection/FormSection";
import { Input } from "../../../components/shared/input/Input";
import {
  ButtonLink,
  ButtonPrimary,
  ButtonSecondary,
} from "../../../components/shared/button/Button";
import { useAppContext } from "../../../context/AppContext";

/* -------------------------------------------------------------------------- */
/*                               STYLED WRAPPERS                               */
/* -------------------------------------------------------------------------- */

const Card = styled(PROMPT_CARD)`
  max-width: 420px;
  margin: 0 auto;
`;

const Form = styled(PROMPT_FORM)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;

    ${ButtonPrimary}, ${ButtonSecondary} {
      width: 100%;
    }
  }
`;

const FooterRow = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};

  a {
    color: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
    text-decoration: underline;
    cursor: pointer;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 48px;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
    border-color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .google-icon {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  }

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(String(email).toLowerCase());
}

/* -------------------------------------------------------------------------- */
/*                                 LOGIN FORM                                  */
/* -------------------------------------------------------------------------- */

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // NOTE: Redirect result handling is now done centrally in AppContext
  // to ensure it's processed before any UI renders

  const handleError = (message) => {
    console.error("🔐 Login error:", message);
    setNotification({
      type: "error",
      message,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      handleError("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      handleError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      console.log("🔐 Login attempt:", email);

      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      console.log("✅ Login success:", user.uid);
      console.log("⏳ Waiting for auth listener to update context...");

      // CRITICAL FIX: Don't navigate here!
      // Let onAuthStateChanged listener update AppContext,
      // then CloudLanding/MarketplaceLanding will handle redirect

    } catch (err) {
      console.error("❌ Login failed:", err);
      handleError(err?.message || "Unable to sign in. Please try again.");
      setSubmitting(false);
    }
    // Note: Don't setSubmitting(false) on success - form will unmount on redirect
  };

  const handleResetPassword = async () => {
    if (!email) {
      handleError("Enter your email first to receive a reset link.");
      return;
    }

    if (!isValidEmail(email)) {
      handleError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      await sendPasswordResetEmail(auth, email);
      setNotification({
        type: "success",
        message: "Password reset link sent. Check your inbox.",
      });
    } catch (err) {
      console.error(err);
      handleError(err?.message || "Unable to send reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      console.log("🔐 Google login attempt...");

      // Use popup auth - handles cross-origin via postMessage
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("✅ Google login success:", user.uid);
      console.log("⏳ Waiting for auth listener to update context...");

      // Auth listener will handle the rest
    } catch (err) {
      console.error("❌ Google login failed:", err);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);

      // Handle specific error cases
      if (err.code === "auth/popup-closed-by-user") {
        // User closed popup - don't show error
        console.log("User closed popup");
      } else if (err.code === "auth/popup-blocked") {
        handleError("Popup was blocked. Please allow popups and try again.");
      } else if (err.code === "auth/unauthorized-domain") {
        handleError("This domain is not authorized for authentication. Please contact support.");
      } else if (err.code === "auth/cancelled-popup-request") {
        // Another popup was opened - ignore
        console.log("Popup request cancelled");
      } else {
        handleError(err?.message || "Unable to sign in with Google. Please try again.");
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariant}
      >
        <FormSection>
          <Header>
            <h2>Sign in to continue</h2>
            <p>Access your marketplace tools, dashboards, and projects.</p>
          </Header>

          {/* Google Sign-In Button */}
          <GoogleButton
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {submitting ? "Signing in..." : "Sign in with Google"}
          </GoogleButton>

          <Divider>
            <span>or</span>
          </Divider>

          <Form onSubmit={handleLogin}>
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />

            <ActionsRow>
              <ButtonPrimary type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </ButtonPrimary>

              <ButtonSecondary
                type="button"
                onClick={handleResetPassword}
                disabled={submitting}
              >
                Reset password
              </ButtonSecondary>
            </ActionsRow>
          </Form>

          <FooterRow>
            Need an account?{" "}
            <ButtonLink
              type="button"
              onClick={() => navigate("/?mode=register")}
            >
              Create one here.
            </ButtonLink>
          </FooterRow>

          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Hardware by{' '}
            <a
              href="https://bluesignal.xyz?source=wqt-login"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
            >
              BlueSignal.xyz
            </a>
          </div>
        </FormSection>
      </Card>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default LoginForm;
