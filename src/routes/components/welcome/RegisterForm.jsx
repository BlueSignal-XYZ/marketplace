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
import { createUserWithEmailAndPassword } from "firebase/auth";

/** FIREBASE AUTH */
import { auth } from "../../../apis/firebase";
import { Input } from "../../../components/shared/input/Input";
import FormSection from "../../../components/shared/FormSection/FormSection";
import {
  ButtonLink,
  ButtonPrimary,
} from "../../../components/shared/button/Button";
import { AccountAPI } from "../../../scripts/back_door";

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

  useEffect(() => {
    if (isSuccess && onSuccess) {
      const t = setTimeout(() => {
        onSuccess();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onSuccess]);

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
