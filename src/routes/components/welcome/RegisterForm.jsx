import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import Notification from "../../../components/popups/NotificationPopup";
import {
  environmentalRotation,
  successAnimation,
} from "../../../assets/animations";
import {
  LOADING_ANIMATION,
  PROMPT_CARD,
  PROMPT_FORM,
} from "../../../components/lib/styled";
import { formVariant, loadingVariant } from "./motion_variants";

/** #BACKEND */
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

/** FIREBASE AUTH */
import { auth, googleProvider } from "../../../apis/firebase";
import { Input } from "../../../components/shared/input/Input";
import FormSection from "../../../components/shared/FormSection/FormSection";
import {
  ButtonLink,
  ButtonPrimary,
} from "../../../components/shared/button/Button";
import { AccountAPI } from "../../../scripts/back_door";

/* -------------------------------------------------------------------------- */
/*                               STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

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

const RegisterForm = ({
  onSuccess,
  onSwitchToLogin,
  updateUser,
  googleData,
}) => {
  const [username, setUsername] = useState(googleData?.name || "");
  const [email, setEmail] = useState(
    (googleData?.gmail || googleData?.email || "").toLowerCase()
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // NOTE: Redirect result handling is now done centrally in AppContext
  // to ensure it's processed before any UI renders

  // Trigger onSuccess callback after success animation
  useEffect(() => {
    if (isSuccess && onSuccess) {
      const t = setTimeout(() => {
        onSuccess();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onSuccess]);

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      console.log("🔐 Google sign-up attempt...");

      // Use popup auth - handles cross-origin via postMessage
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("✅ Google auth success:", user.uid);

      // Create user account with Google data
      const newUser = {
        uid: user.uid,
        username: (user.displayName || user.email?.split("@")[0] || "user").toLowerCase().replace(/\s+/g, "_"),
        email: user.email?.toLowerCase(),
        displayName: user.displayName,
        role: "farmer",
        PIN: 123456,
      };

      console.log("RegisterForm → Google newUser:", newUser);

      // Best-effort backend account creation
      try {
        const apiResult = await AccountAPI.create(newUser);
        console.log("AccountAPI.create →", apiResult);
      } catch (err) {
        console.warn("AccountAPI.create failed (non-fatal):", err);
      }

      // Keep local user state in sync
      let updatedOK = false;
      if (updateUser) {
        updatedOK = !!(await updateUser(null, newUser));
      }
      if (!updatedOK) {
        try {
          sessionStorage.setItem("user", JSON.stringify(newUser));
        } catch (e) {
          console.error("Failed to write sessionStorage user:", e);
        }
      }

      setIsSuccess(true);
      // Note: AppContext onAuthStateChanged will handle redirect
    } catch (err) {
      console.error("❌ Google sign-up failed:", err);

      if (err.code === "auth/popup-closed-by-user") {
        console.log("User closed popup");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups and try again.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email. Try signing in instead.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for authentication. Please contact support.");
      } else {
        setError(err?.message || "Unable to sign up with Google. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = (username || "").trim();
    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedUsername) {
      setError("Please choose a username.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter an email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      let newUser = null;

      // Keep Google path future-proofed, even though we disabled it in the UI for now
      if (googleData?.gmail || googleData?.email) {
        const googleEmail =
          (googleData.gmail || googleData.email || "").toLowerCase();
        newUser = {
          uid: googleData.uid,
          username: trimmedUsername.toLowerCase(),
          email: googleEmail,
          role: "farmer",
          PIN: 123456,
        };
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );
        const userData = userCredential.user;

        newUser = {
          uid: userData.uid,
          username: trimmedUsername.toLowerCase(),
          email: (userData.email || trimmedEmail).toLowerCase(),
          role: "farmer",
          PIN: 123456,
        };
      }

      console.log("RegisterForm → newUser:", newUser);

      // 🔹 Best-effort backend account creation — NO alert if it fails
      try {
        const apiResult = await AccountAPI.create(newUser);
        console.log("AccountAPI.create →", apiResult);
      } catch (err) {
        console.warn("AccountAPI.create failed (non-fatal):", err);
      }

      // Keep local user state in sync
      let updatedOK = false;
      if (updateUser) {
        updatedOK = !!(await updateUser(null, newUser));
      }
      if (!updatedOK) {
        try {
          sessionStorage.setItem("user", JSON.stringify(newUser));
        } catch (e) {
          console.error("Failed to write sessionStorage user:", e);
        }
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 8 characters.");
      } else {
        setError(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <Notification type="error" message={error} />

      <PROMPT_CARD>
        {isLoading ? (
          <LOADING_ANIMATION
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loadingVariant}
          >
            <Player
              autoplay
              loop
              src={environmentalRotation}
              style={{ height: 100, width: 100 }}
            />
          </LOADING_ANIMATION>
        ) : !isSuccess ? (
          <PROMPT_FORM
            variants={formVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit}
          >
            <Header>
              <h2>Create your account</h2>
              <p>Join the water quality trading marketplace.</p>
            </Header>

            {/* Google Sign-Up Button */}
            <GoogleButton
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
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
              {isLoading ? "Creating account..." : "Sign up with Google"}
            </GoogleButton>

            <Divider>
              <span>or</span>
            </Divider>

            <FormSection label="Username">
              <Input
                type="text"
                value={username}
                placeholder="Choose a username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormSection>

            <FormSection label="Email">
              <Input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormSection>

            <FormSection label="Password">
              <Input
                type="password"
                value={password}
                placeholder="Create a password (min 8 chars)"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormSection>

            <ButtonPrimary className="register-button" type="submit">
              Register
            </ButtonPrimary>

            <div>
              <ButtonLink type="button" onClick={onSwitchToLogin}>
                Already have an account? Log in
              </ButtonLink>
            </div>
          </PROMPT_FORM>
        ) : (
          <LOADING_ANIMATION
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loadingVariant}
          >
            <Player
              autoplay
              loop
              src={successAnimation}
              style={{ height: 100, width: 100 }}
            />
          </LOADING_ANIMATION>
        )}
      </PROMPT_CARD>
    </AnimatePresence>
  );
};

export default RegisterForm;
