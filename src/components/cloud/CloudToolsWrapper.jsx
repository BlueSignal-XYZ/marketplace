// /src/components/cloud/CloudToolsWrapper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CloudPageLayout from './CloudPageLayout';
import NutrientCalculator from '../NutrientCalculator';
import VerificationUI from '../elements/contractUI/VerificationUI';
import MediaPlayer from '../elements/livepeer/elements/MediaPlayer';
import { BasicStreamPlayer } from '../elements/livepeer/elements/StreamPlayer';
import { LivepeerAPI } from '../../scripts/back_door';

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
  border-top-color: #1d7072;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
  background: #1d7072;
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

import { ComingSoon } from '../../design-system/primitives/ComingSoon';
import { Modal } from '../../design-system/primitives/Modal';
import { Button } from '../../design-system/primitives/Button';

/**
 * LivepeerWrapper - Validates Livepeer availability and wraps child components
 */
function LivepeerWrapper({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const key = await LivepeerAPI.getKey();
      if (key) {
        setIsReady(true);
      } else {
        setError('Unable to initialize streaming service');
      }
    } catch (err) {
      console.error('Livepeer key fetch error:', err);
      setError('Failed to connect to streaming service');
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

  if (error || !isReady) {
    return (
      <ErrorContainer>
        <ErrorText>{error || 'Streaming service unavailable'}</ErrorText>
        <RetryButton onClick={checkAvailability}>Retry Connection</RetryButton>
      </ErrorContainer>
    );
  }

  return <>{children}</>;
}

export function CloudNutrientCalculator() {
  return (
    <CloudPageLayout
      title="Nutrient Calculator"
      subtitle="Calculate nutrient loads and water quality metrics"
    >
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px' }}>
        <NutrientCalculator />
      </div>
    </CloudPageLayout>
  );
}

export function CloudVerification() {
  return (
    <CloudPageLayout title="Verification" subtitle="Verify device installations and credentials">
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px' }}>
        <VerificationUI />
      </div>
    </CloudPageLayout>
  );
}

export function CloudLiveStream() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <CloudPageLayout title="Live Stream" subtitle="Stream live video from site locations">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ marginBottom: 24 }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          >
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
            <rect width="14" height="12" x="2" y="6" rx="2" />
          </svg>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', margin: '0 0 8px' }}>
          Live Streaming
        </h3>
        <p
          style={{
            fontSize: 15,
            color: '#6B7280',
            margin: '0 0 24px',
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Stream real-time water quality data and video from your monitoring sites directly to the
          cloud.
        </p>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Go Live
        </Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Live Streaming">
        <div style={{ padding: '8px 0', lineHeight: 1.6, color: '#4B5563' }}>
          <p style={{ margin: '0 0 16px', fontSize: 15 }}>
            Live streaming is coming soon. Once your BlueSignal WQM-1 device is connected and a
            camera is configured at your site, you&apos;ll be able to stream real-time water quality
            data and video directly from this page.
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#9CA3AF' }}>
            In the meantime, you can monitor device telemetry from the Dashboard and review
            historical data in the device detail pages.
          </p>
        </div>
      </Modal>
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
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        }
        title="Media Upload"
        description="Upload photos and documentation from site installations. Coming soon."
      />
    </CloudPageLayout>
  );
}

export function CloudMediaPlayer() {
  const { playbackID, liveID } = useParams();

  return (
    <CloudPageLayout title="Media Player" subtitle={playbackID ? 'Recorded Media' : 'Live Stream'}>
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px' }}>
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
