import React, { useState } from "react";
import styled from "styled-components";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../apis/firebase";

const provider = new GoogleAuthProvider();

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 32px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f5f5f7;

  h1 {
    margin-bottom: 16px;
  }

  pre {
    margin-top: 24px;
    padding: 16px;
    background: #111827;
    color: #e5e7eb;
    border-radius: 8px;
    font-size: 12px;
    max-width: 800px;
    overflow-x: auto;
  }

  button {
    padding: 10px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
`;

const AuthTest = () => {
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleTestSignIn = async () => {
    setLoading(true);
    setResultText("");

    try {
      const origin = window.location.origin;
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const payload = {
        ok: true,
        origin,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerId: user.providerData?.[0]?.providerId,
      };

      setResultText(JSON.stringify(payload, null, 2));
    } catch (err) {
      const origin = window.location.origin;

      const payload = {
        ok: false,
        origin,
        code: err.code || "auth/error",
        message: err.message || "Unknown error",
      };

      setResultText(JSON.stringify(payload, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h1>Google Auth Test</h1>
      <p>
        Origin: <code>{window.location.origin}</code>
      </p>
      <p>
        This page ignores your app&apos;s context/routes and only tests
        <code> signInWithPopup </code> using <code>auth</code> from{" "}
        <code>../apis/firebase</code>.
      </p>

      <button onClick={handleTestSignIn} disabled={loading}>
        {loading ? "Signing in..." : "Test Google Sign-in"}
      </button>

      {resultText && (
        <pre>{resultText}</pre>
      )}
    </Wrapper>
  );
};

export default AuthTest;