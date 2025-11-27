import React, { useState } from "react";
import styled from "styled-components";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../apis/firebase";


import successAnimation from "../../../assets/animations/success-animation.json";
import environmentalRotation from "../../../assets/animations/environmental-friendly-animation.json";
import Notification from "../../../components/popups/NotificationPopup";
import {
  LOADING_ANIMATION,
  PROMPT_CARD,
  PROMPT_FORM,
} from "../../../components/lib/styled";
import { formVariant, loadingVariant } from "./motion_variants";
import FormSection from "../../../components/shared/FormSection/FormSection";
import { Input } from "../../../components/shared/input/Input";
import {
  ButtonLink,
  ButtonPrimary,
  ButtonSecondary,
} from "../../../components/shared/button/Button";
import { useAppContext } from "../../../context/AppContext";

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

const StyledLoginForm = styled.div`
  .input-section {
  }

  ${ButtonPrimary} {
    margin-top: 40px;
    width: 100%;
  }

  ${ButtonSecondary} {
    width: 100%;
  }

  .secondary-actions {
    .secondary-action-text {
      font-weight: 500;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.ui600};
    }
  }
`;

const LoginForm = ({ onSuccess, onSwitchToRegister, updateUser }) => {
  const { ACTIONS } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { logNotification } = ACTIONS || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1) Firebase auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        setError("Login failed: no user returned from Firebase.");
        return;
      }

      // 2) Build a fallback user object for the app (bypasses backend if it’s down)
      const fallbackUser = {
        uid: firebaseUser.uid,
        username: firebaseUser.email
          ? firebaseUser.email.split("@")[0].toLowerCase()
          : "user",
        email: firebaseUser.email?.toLowerCase() || "",
        role: "farmer",
        PIN: 123456,
      };

      // 3) Push that into AppContext (this skips the backend UserAPI lookup)
      if (updateUser) {
        await updateUser(null, fallbackUser);
      }

      // 4) Navigate to the main app surface
      navigate("/marketplace");
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (isValidEmail(email)) {
      try {
        await sendPasswordResetEmail(auth, email);
        logNotification("alert", `Password reset email sent to ${email}!`);
      } catch (error) {
        console.error("Reset password error:", error);
        setError(`Error sending password reset email: ${error.message}`);
        logNotification("error", "Error sending password reset email");
      }
    } else {
      logNotification("error", "Please enter a valid email");
    }
  };

  return (
    <StyledLoginForm>
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
            <div className="input-section">
              <FormSection label={"Email"}>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormSection>
            </div>
            <div className="input-section">
              <FormSection label={"Password"}>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormSection>
            </div>
            <div className="button-area">
              <ButtonPrimary type="submit">Log In</ButtonPrimary>
            </div>
            <div className="secondary-actions">
              <div className="secondary-action-text">
                <ButtonLink type="button" onClick={handleResetPassword}>
                  Forgot Password?
                </ButtonLink>
              </div>
              <div className="secondary-action-text">
                Need an account?{" "}
                <ButtonLink type="button" onClick={onSwitchToRegister}>
                  Register
                </ButtonLink>
              </div>
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
    </StyledLoginForm>
  );
};

export default LoginForm;
