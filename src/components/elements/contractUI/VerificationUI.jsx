import React, { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { STRING, logDev } from "../../../scripts/helpers";
import { AssetAPI, UserAPI } from "../../../scripts/back_door";
import AssetCard from "./AssetCard";
import { ButtonPrimary } from "../../shared/button/Button";
import { Badge } from "../../shared/Badge/Badge";
import { useAppContext } from "../../../context/AppContext";
import { useToastContext } from "../../../shared/providers/ToastProvider";
import { Button as DesignButton } from "../../../design-system/primitives/Button";
import { Skeleton } from "../../../design-system/primitives/Skeleton";
import {
  NoUploadsState,
  NoSubmissionsState,
  NoDisputesState,
  NoApprovalsState,
} from "../../shared/EmptyState/EmptyState";
import { useNavigate } from "react-router-dom";
import { isCloudMode } from "../../../utils/modeDetection";

const neptuneColorPalette = {
  lightBlue: "#8abbd0",
  darkBlue: "#005f73",
  green: "#0a9396",
  white: "#e9ecef",
  navy: "#003459",
};

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 65, 93, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled(motion.div)`
  background-color: white;
  padding: 50px;
  border-radius: 10px;
  width: 90%;
  max-width: 1000px;
  position: relative;
  background-color: white;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); // Soft glow effect
  backdrop-filter: blur(8px);
  border: 1px solid ${neptuneColorPalette.lightBlue};
  box-sizing: border-box;

  @media (min-width: 768px) {
    width: 80%;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #222;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 0;
  overflow: auto;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const TabContent = styled(TabContainer)`
  height: 100%;
  gap: 10px;
`;

const TabBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  margin-bottom: 24px;
  gap: 0;
`;

const Tab = styled(motion.button)`
  position: relative;
  padding: 12px 20px;
  min-height: 44px;
  border: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  color: ${(props) =>
    props.active
      ? (props.theme?.colors?.primary || '#0066FF')
      : (props.theme?.colors?.textSecondary || '#6B7280')};
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) =>
      props.active ? (props.theme?.colors?.primary || '#0066FF') : 'transparent'};
    border-radius: 1px 1px 0 0;
    transition: background 0.15s;
  }

  &:hover {
    color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  }
`;
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  margin: 0 auto;
  gap: 24px;

  .input-button-wrap {
    display: flex;
    align-items: center;
  }
`;

const Loading = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.ui800};
  animation: spin 0.2s infinite linear;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMsg = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: red;
  animation: shake 0.5s;

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-10px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(10px);
    }
  }
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
`;

const WelcomeState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
`;

const WelcomeText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  max-width: 400px;
`;

// Simple Button styled component
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #1D7072;
  background: #1D7072;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #155e5f;
  }
`;

// Upload CTA Button
const UploadCTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1D7072;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;

  &:hover {
    background: #155e5f;
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ErrorBanner = styled.div`
  padding: 20px 24px;
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.2);
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts?.sans ?? 'system-ui, sans-serif'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.text ?? '#1e293b'};
`;

// Framer Motion variants for animations
const tabVariants = {
  initial: { x: -10, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  exit: { x: 10, opacity: 0 },
};

function VerificationUI() {
  const { STATES, ACTIONS } = useAppContext();
  const navigate = useNavigate();
  const toast = useToastContext();
  const [accessibleTabs, setAccessibleTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);

  const [uploads, setUploads] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [approvals, setApprovals] = useState([]);

  // Navigate to upload page based on mode
  const handleUploadMedia = () => {
    const uploadPath = isCloudMode()
      ? "/cloud/tools/upload-media"
      : "/features/upload-media";
    navigate(uploadPath);
  };

  const { user, verificationUIOpen, verificationData } = STATES || {};
  const { setTxPopupVisible, setResult, setVerificationData } = ACTIONS || {};

  const { assetID } = verificationData || {};

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    setDataLoading(true);
    setLoadErrors([]);

    const uid = user.uid;
    const results = await Promise.allSettled([
      UserAPI.media.getUserMedia(uid).then((r) => r?.user_media),
      UserAPI.assets.getUserAssets(uid).then((r) => r?.user_assets),
      UserAPI.assets.getUserAssetDisputes(uid).then((r) => r?.user_disputes),
      UserAPI.assets.getUserAssetApprovals(uid).then((r) => r?.user_approvals),
    ]);

    const setters = [setUploads, setSubmissions, setDisputes, setApprovals];
    const labels = ["uploads", "submissions", "disputes", "approvals"];
    const errors = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        const data = Array.isArray(result.value) ? result.value : [];
        setters[i](data);
      } else {
        setters[i]([]);
        errors.push({ label: labels[i], message: result.reason?.message || "Failed to load" });
      }
    });

    setLoadErrors(errors);
    setDataLoading(false);
  }, [user?.uid, toast]);

  useEffect(() => {
    if (user?.uid) {
      const role = user?.role || "farmer";
      const accessible = getAccessibleTabs(role);
      const finalTabs = accessible.length > 0 ? accessible : ["uploads", "submissions"];
      setAccessibleTabs(finalTabs);
      setActiveTab(finalTabs[0]);
      loadData();
    }
  }, [user?.uid, loadData]);

  const submitMutation = useMutation(AssetAPI.submit);
  const approveMutation = useMutation(AssetAPI.approve);
  const disputeMutation = useMutation(AssetAPI.dispute);
  const resolveMutation = useMutation(AssetAPI.closeDispute);

  // useEffect(() => {
  //   if (Interactions) {
  //     Interactions.Listeners.onDataSubmitted(({ dataId, farmer }) => {
  //       console.log(`Data with ID ${dataId} submitted by ${farmer}`);
  //     });
  //   }
  // }, [Interactions]);

  const handleMutation = async (mutation, params = null) => {
    setIsLoading(true);
    try {
      if (params) await mutation.mutateAsync(params);
      else await mutation.mutateAsync();
      const _receipt = mutation.data;
      // mutation handled
      setTxPopupVisible(true);
      if (_receipt?.hash) {
        setResult?.({
          title: "Confirmed",
          message: "",
          txHash: _receipt.hash,
        });
      } else {
        setResult?.({
          title: "Failed",
          message: mutation?.error?.reason || "Could not transact.",
        });
      }
    } catch (error) {
      //handle error
      setResult?.({
        title: "Error",
        message: error?.reason || error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmission = async () => {
    //Handle Submission
    logDev("Verification: Handle Submission", { assetID });
  };

  const tabs = [
    "uploads",
    "submissions",
    "disputes",
    "approvals",
  ];

  const tabAccess = {
    farmer: tabs,
    verifier: ["submissions", "disputes", "approvals"],
    admin: tabs,
  };

  const handleApprovalDetails = async () => {};

  const getAccessibleTabs = (userRole) => tabAccess[userRole] || [];

  const modalSpring = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  // Show welcome state if no user or no tabs
  if (!user?.uid) {
    return (
      <Page>
        <WelcomeState>
          <WelcomeTitle>Verification Portal</WelcomeTitle>
          <WelcomeText>
            Sign in to access the verification system. Upload media, submit data
            for verification, and track your submissions.
          </WelcomeText>
        </WelcomeState>
      </Page>
    );
  }

  return (
    <Page>
      <HeaderRow>
        <TabBar>
          {accessibleTabs.map((tab) => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {STRING.toTitleCase(tab)}
            </Tab>
          ))}
        </TabBar>
        {activeTab === "uploads" && (
          <UploadCTAButton onClick={handleUploadMedia}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Media
          </UploadCTAButton>
        )}
      </HeaderRow>
      {loadErrors.length > 0 && (
        <ErrorBanner>
          <ErrorText>
            Failed to load: {loadErrors.map((e) => e.label).join(", ")}. {loadErrors[0]?.message}
          </ErrorText>
          <DesignButton variant="outline" size="sm" onClick={loadData}>
            Retry
          </DesignButton>
        </ErrorBanner>
      )}
      {dataLoading ? (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton width="100%" height={120} />
          <Skeleton width="100%" height={120} />
          <Skeleton width="100%" height={120} />
        </div>
      ) : isLoading ? (
        <Loading>
          <FontAwesomeIcon icon={faSpinner} />
        </Loading>
      ) : (
        <TabContent>
          {activeTab === "uploads" && (
            <InputGroup>
              {uploads?.length < 1 ? (
                <NoUploadsState />
              ) : (
                uploads.map((upload, index) => (
                  <AssetCard
                    key={index}
                    metadata={upload?.metadata}
                    onClick={() =>
                      handleMutation(submitMutation, upload.assetID)
                    }
                  />
                ))
              )}
            </InputGroup>
          )}
          {activeTab === "submissions" && (
            <InputGroup>
              {submissions?.length < 1 ? (
                <NoSubmissionsState />
              ) : (
                submissions.map((submission, index) => (
                  <div key={index}>
                    <label>{submission?.assetID}</label>
                    <label>{submission?.txHash}</label>
                    <Button
                      onClick={() =>
                        handleMutation(
                          user?.role === "verifier"
                            ? approveMutation
                            : disputeMutation,
                          submission?.assetID
                        )
                      }
                    >
                      {user?.role === "verifier" ? "Approve" : "Dispute"}
                    </Button>
                  </div>
                ))
              )}
            </InputGroup>
          )}
          {activeTab === "disputes" && (
            <InputGroup>
              {disputes?.length < 1 ? (
                <NoDisputesState />
              ) : (
                disputes.map((dispute, index) => (
                  <div key={index}>
                    <label>{dispute?.assetID}</label>
                    <label>{dispute?.txHash}</label>
                    <ButtonPrimary
                      onClick={() =>
                        handleMutation(resolveMutation, dispute?.assetID)
                      }
                    >
                      Resolve Dispute
                    </ButtonPrimary>
                  </div>
                ))
              )}
            </InputGroup>
          )}
          {activeTab === "approvals" && (
            <InputGroup>
              {approvals?.length < 1 ? (
                <NoApprovalsState />
              ) : (
                approvals.map((approval, index) => (
                  <div key={index}>
                    <label>{approval?.assetID}</label>
                    <label>{approval?.txHash}</label>
                    <Button
                      onClick={() => handleApprovalDetails(approval?.assetID)}
                    >
                      Approval Details
                    </Button>
                  </div>
                ))
              )}
            </InputGroup>
          )}
        </TabContent>
      )}

      {assetID && (
        <Button onClick={handleSubmission}>
          Submit for Verification
        </Button>
      )}
    </Page>
  );
}

export default VerificationUI;
