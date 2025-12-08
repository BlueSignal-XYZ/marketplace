import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaFileVideo,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaVideo,
  FaInbox,
  FaWifi,
  FaServer,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ButtonPrimary } from "../button/Button";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: ${({ $minHeight }) => $minHeight || "300px"};
  width: 100%;
  box-sizing: border-box;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case "error":
        return "rgba(239, 68, 68, 0.1)";
      case "warning":
        return "rgba(245, 158, 11, 0.1)";
      case "success":
        return "rgba(16, 185, 129, 0.1)";
      default:
        return theme.colors?.ui100 || "rgba(99, 102, 241, 0.1)";
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  svg {
    width: 36px;
    height: 36px;
    color: ${({ theme, $variant }) => {
      switch ($variant) {
        case "error":
          return "#ef4444";
        case "warning":
          return "#f59e0b";
        case "success":
          return "#10b981";
        default:
          return theme.colors?.primary || "#6366f1";
      }
    }};
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.5;
`;

const ActionButton = styled(ButtonPrimary)`
  min-height: 44px;
  padding: 12px 24px;
  font-size: 14px;
`;

const SecondaryAction = styled.button`
  margin-top: 12px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors?.primary || "#6366f1"};
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

// Icon mapping for common empty state types
const ICONS = {
  upload: FaUpload,
  media: FaFileVideo,
  verification: FaShieldAlt,
  approval: FaCheckCircle,
  dispute: FaExclamationTriangle,
  stream: FaVideo,
  inbox: FaInbox,
  offline: FaWifi,
  server: FaServer,
  cloudUpload: FaCloudUploadAlt,
};

/**
 * EmptyState Component
 * A reusable empty state component for displaying when there's no content
 *
 * @param {string} icon - Icon type: 'upload', 'media', 'verification', 'approval', 'dispute', 'stream', 'inbox', 'offline', 'server'
 * @param {string} title - Main title text
 * @param {string} description - Description text
 * @param {string} actionLabel - Label for the primary action button
 * @param {function} onAction - Click handler for primary action
 * @param {string} secondaryActionLabel - Label for secondary action link
 * @param {function} onSecondaryAction - Click handler for secondary action
 * @param {string} variant - Visual variant: 'default', 'error', 'warning', 'success'
 * @param {string} minHeight - Minimum height of container
 * @param {ReactNode} customIcon - Custom icon component to use instead of preset
 */
export const EmptyState = ({
  icon = "inbox",
  title = "No items found",
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = "default",
  minHeight,
  customIcon: CustomIcon,
}) => {
  const IconComponent = CustomIcon || ICONS[icon] || FaInbox;

  return (
    <Container
      $minHeight={minHeight}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper $variant={variant}>
        <IconComponent />
      </IconWrapper>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {actionLabel && onAction && (
        <ActionButton onClick={onAction}>{actionLabel}</ActionButton>
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <SecondaryAction onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </SecondaryAction>
      )}
    </Container>
  );
};

/**
 * Preset empty states for common scenarios
 */
export const NoUploadsState = ({ onUpload }) => (
  <EmptyState
    icon="upload"
    title="No uploads yet"
    description="Upload your first media file to get started. Supported formats include MP4 videos and PDF documents."
    actionLabel={onUpload ? "Upload Media" : undefined}
    onAction={onUpload}
  />
);

export const NoSubmissionsState = ({ onSubmit }) => (
  <EmptyState
    icon="verification"
    title="No submissions"
    description="You haven't submitted any assets for verification yet. Upload media first, then submit for verification."
    actionLabel={onSubmit ? "Upload Media" : undefined}
    onAction={onSubmit}
  />
);

export const NoDisputesState = () => (
  <EmptyState
    icon="dispute"
    title="No disputes"
    description="Great news! There are no active disputes. All your submissions are in good standing."
    variant="success"
  />
);

export const NoApprovalsState = () => (
  <EmptyState
    icon="approval"
    title="No approvals yet"
    description="Approved submissions will appear here. Once a verifier approves your submission, you'll see it listed."
  />
);

export const ServiceUnavailableState = ({ onRetry }) => (
  <EmptyState
    icon="server"
    title="Service Unavailable"
    description="We're having trouble connecting to the service. This might be a temporary issue."
    variant="error"
    actionLabel={onRetry ? "Try Again" : undefined}
    onAction={onRetry}
  />
);

export const ClientUnavailableState = ({ onRetry }) => (
  <EmptyState
    icon="offline"
    title="Connection Unavailable"
    description="Unable to establish a connection. Please check your internet connection and try again."
    variant="warning"
    actionLabel={onRetry ? "Retry Connection" : undefined}
    onAction={onRetry}
  />
);

export const LoadingState = () => (
  <EmptyState
    icon="server"
    title="Loading..."
    description="Please wait while we load your content."
    variant="default"
    minHeight="200px"
  />
);

export const NoStreamsState = ({ onCreate }) => (
  <EmptyState
    icon="stream"
    title="No active streams"
    description="Start broadcasting by creating a new stream. You'll receive a stream key to use with your broadcasting software."
    actionLabel={onCreate ? "Create Stream" : undefined}
    onAction={onCreate}
  />
);

export const NoVideosState = ({ onUpload }) => (
  <EmptyState
    icon="media"
    title="No videos found"
    description="Your uploaded videos will appear here. Start by uploading your first video."
    actionLabel={onUpload ? "Upload Video" : undefined}
    onAction={onUpload}
  />
);

export default EmptyState;
