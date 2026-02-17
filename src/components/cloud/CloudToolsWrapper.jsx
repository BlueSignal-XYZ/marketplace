// /src/components/cloud/CloudToolsWrapper.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CloudPageLayout from "./CloudPageLayout";
import NutrientCalculator from "../NutrientCalculator";
import { VerificationUI } from "../elements/contractUI";
import { Stream, MediaUpload, MediaPlayer, BasicStreamPlayer } from "../elements/livepeer";
import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";
import { LivepeerAPI } from "../../scripts/back_door";

/**
 * CloudToolsWrapper - Wraps existing non-marketplace tools in Cloud UX
 * Provides consistent layout and navigation for Cloud mode tools
 */

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #1D7072;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
  margin: 0 0 16px;
`;

const RetryButton = styled.button`
  padding: 10px 24px;
  background: #1D7072;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #155e5f;
  }
`;

import { ComingSoon } from "../../design-system/primitives/ComingSoon";

/**
 * LivepeerWrapper - Initializes Livepeer client and wraps child components
 */
function LivepeerWrapper({ children }) {
  const [livepeerClient, setLivepeerClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKey();
  }, []);

  const fetchKey = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const key = await LivepeerAPI.getKey();
      if (key) {
        const client = createReactClient({
          provider: studioProvider(key),
        });
        setLivepeerClient(client);
      } else {
        setError("Unable to initialize streaming service");
      }
    } catch (err) {
      console.error("Livepeer key fetch error:", err);
      setError("Failed to connect to streaming service");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Connecting to streaming service...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error || !livepeerClient) {
    return (
      <ErrorContainer>
        <ErrorText>{error || "Streaming service unavailable"}</ErrorText>
        <RetryButton onClick={fetchKey}>Retry Connection</RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <LivepeerConfig client={livepeerClient}>
      {children}
    </LivepeerConfig>
  );
}

export function CloudNutrientCalculator() {
  return (
    <CloudPageLayout
      title="Nutrient Calculator"
      subtitle="Calculate nutrient loads and water quality metrics"
    >
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px" }}>
        <NutrientCalculator />
      </div>
    </CloudPageLayout>
  );
}

export function CloudVerification() {
  return (
    <CloudPageLayout
      title="Verification"
      subtitle="Verify device installations and credentials"
    >
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px" }}>
        <VerificationUI />
      </div>
    </CloudPageLayout>
  );
}

export function CloudLiveStream() {
  return (
    <CloudPageLayout
      title="Live Stream"
      subtitle="Stream live video from site locations"
    >
      <ComingSoon
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>}
        title="Live Stream"
        description="Live video feeds from monitoring sites will appear here once cameras are configured."
      />
    </CloudPageLayout>
  );
}

export function CloudUploadMedia() {
  return (
    <CloudPageLayout
      title="Media Upload"
      subtitle="Upload photos and documentation from site installations"
    >
      <ComingSoon
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>}
        title="Media Upload"
        description="Upload photos and documentation from site installations. Coming soon."
      />
    </CloudPageLayout>
  );
}

export function CloudMediaPlayer() {
  const { playbackID, liveID } = useParams();

  return (
    <CloudPageLayout
      title="Media Player"
      subtitle={playbackID ? "Recorded Media" : "Live Stream"}
    >
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px" }}>
        <LivepeerWrapper>
          {playbackID && <MediaPlayer playbackID={playbackID} />}
          {liveID && <BasicStreamPlayer playbackId={liveID} />}
          {!playbackID && !liveID && (
            <ErrorContainer>
              <ErrorText>No media specified</ErrorText>
            </ErrorContainer>
          )}
        </LivepeerWrapper>
      </div>
    </CloudPageLayout>
  );
}
