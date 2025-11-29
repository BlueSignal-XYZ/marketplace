// /src/components/cloud/CloudToolsWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import NutrientCalculator from "../NutrientCalculator";
import { VerificationUI } from "../elements/contractUI";
import { Livepeer } from "../elements/livepeer";

/**
 * CloudToolsWrapper - Wraps existing non-marketplace tools in Cloud UX
 * Provides consistent layout and navigation for Cloud mode tools
 */

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
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px" }}>
        <Livepeer />
      </div>
    </CloudPageLayout>
  );
}

export function CloudUploadMedia() {
  return (
    <CloudPageLayout
      title="Upload Media"
      subtitle="Upload photos and videos from site documentation"
    >
      <div style={{ background: "#ffffff", borderRadius: "12px", padding: "24px" }}>
        <Livepeer />
      </div>
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
        <Livepeer />
      </div>
    </CloudPageLayout>
  );
}
