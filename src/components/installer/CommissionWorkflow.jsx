// Commission Workflow Component - Full commissioning workflow for installers
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import commissionService from "../../services/commissionService";
import CommissionChecklist from "./CommissionChecklist";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const StepNav = styled.div`
  display: flex;
  margin-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
`;

const StepTab = styled.button`
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#3b82f6" : "#6b7280")};
  border-bottom: 2px solid ${(props) => (props.active ? "#3b82f6" : "transparent")};
  margin-bottom: -2px;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.active ? "#3b82f6" : "#374151")};
  }

  ${(props) =>
    props.complete &&
    !props.active &&
    `
    color: #16a34a;
  `}
`;

const StepContent = styled.div`
  min-height: 400px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const DeviceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const TestGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const TestItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const TestIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 18px;

  ${(props) =>
    props.status === "passed"
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : props.status === "failed"
      ? `
    background: #fef2f2;
    color: #dc2626;
  `
      : props.status === "running"
      ? `
    background: #dbeafe;
    color: #1d4ed8;
  `
      : `
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const TestInfo = styled.div`
  flex: 1;
`;

const TestName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const TestDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

const TestStatus = styled.span`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;

  ${(props) =>
    props.status === "passed"
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : props.status === "failed"
      ? `
    background: #fef2f2;
    color: #dc2626;
  `
      : props.status === "running"
      ? `
    background: #dbeafe;
    color: #1d4ed8;
  `
      : `
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #ffffff;
  font-size: 11px;
`;

const AddPhotoButton = styled.label`
  aspect-ratio: 1;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  input {
    display: none;
  }
`;

const AddPhotoIcon = styled.div`
  font-size: 32px;
  color: #9ca3af;
  margin-bottom: 8px;
`;

const AddPhotoText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SignatureBox = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const SignatureCanvas = styled.canvas`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: crosshair;
  touch-action: none;
`;

const SignatureActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

const SignatureInput = styled.input`
  width: 100%;
  max-width: 300px;
  margin: 16px auto 0;
  padding: 10px 12px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }
  `
      : props.variant === "success"
      ? `
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const ToolsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
`;

const ToolItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background: ${(props) => (props.essential ? "#fef3c7" : "#f9fafb")};
  border: 1px solid ${(props) => (props.essential ? "#fcd34d" : "#e5e7eb")};
  border-radius: 6px;
`;

const ToolIcon = styled.span`
  margin-right: 10px;
  font-size: 16px;
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
`;

const ToolPurpose = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

const STEPS = [
  { id: "overview", label: "Overview" },
  { id: "pre-deployment", label: "Pre-Deployment" },
  { id: "commissioning", label: "Commissioning" },
  { id: "tests", label: "Tests" },
  { id: "photos", label: "Photos" },
  { id: "signature", label: "Sign Off" },
];

const CommissionWorkflow = () => {
  const navigate = useNavigate();
  const { commissionId } = useParams();
  const { ACTIONS, STATES } = useAppContext();
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [commission, setCommission] = useState(null);
  const [currentStep, setCurrentStep] = useState("overview");
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerName, setSignerName] = useState("");

  useEffect(() => {
    loadCommission();
  }, [commissionId]);

  const loadCommission = async () => {
    try {
      setLoading(true);
      const data = await commissionService.getCommissionWithContext(commissionId);
      setCommission(data);
    } catch (err) {
      console.error("Failed to load commission:", err);
      setError("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const handlePreDeploymentChange = async (checkId, completed, notes) => {
    try {
      await commissionService.updatePreDeploymentCheck(
        commissionId,
        checkId,
        completed,
        notes,
        STATES?.user?.uid
      );
      await loadCommission();
    } catch (err) {
      console.error("Failed to update checklist:", err);
    }
  };

  const handleCommissioningChange = async (checkId, completed, notes) => {
    try {
      await commissionService.updateCommissioningCheck(
        commissionId,
        checkId,
        completed,
        notes,
        STATES?.user?.uid
      );
      await loadCommission();
    } catch (err) {
      console.error("Failed to update checklist:", err);
    }
  };

  const handleRunTests = async () => {
    setSaving(true);
    try {
      await commissionService.runTests(commissionId);
      ACTIONS?.logNotification?.("success", "Tests initiated");
      await loadCommission();
    } catch (err) {
      console.error("Failed to run tests:", err);
      setError("Failed to run tests");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In production, upload to storage and get URL
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await commissionService.uploadPhoto(
          commissionId,
          {
            url: event.target.result,
            caption: file.name,
            category: "installation",
          },
          STATES?.user?.uid
        );
        await loadCommission();
        ACTIONS?.logNotification?.("success", "Photo uploaded");
      } catch (err) {
        console.error("Failed to upload photo:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Signature canvas handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmitSignature = async () => {
    if (!signerName.trim()) {
      setError("Please enter your name");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setSaving(true);
    try {
      await commissionService.submitSignature(commissionId, {
        name: signerName,
        dataUrl: canvas.toDataURL(),
      });
      ACTIONS?.logNotification?.("success", "Signature submitted");
      await loadCommission();
    } catch (err) {
      console.error("Failed to submit signature:", err);
      setError("Failed to submit signature");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const result = await commissionService.completeCommission(commissionId);
      if (result.passed) {
        ACTIONS?.logNotification?.("success", "Commission completed successfully!");
        navigate(`/commissions/${commissionId}/complete`);
      } else {
        ACTIONS?.logNotification?.("warning", "Commission completed with failures");
        await loadCommission();
      }
    } catch (err) {
      console.error("Failed to complete commission:", err);
      setError(err.message || "Failed to complete commission");
    } finally {
      setSaving(false);
    }
  };

  const isStepComplete = (stepId) => {
    if (!commission) return false;
    switch (stepId) {
      case "pre-deployment":
        return commission.preDeploymentChecks?.every((c) => c.completed);
      case "commissioning":
        return commission.commissioningChecks?.every((c) => c.completed);
      case "tests":
        return commission.testResults?.every((t) => t.status !== "pending");
      case "photos":
        return commission.photos?.length >= 3;
      case "signature":
        return !!commission.signature;
      default:
        return false;
    }
  };

  const canComplete = () => {
    return (
      isStepComplete("pre-deployment") &&
      isStepComplete("commissioning") &&
      isStepComplete("tests") &&
      isStepComplete("photos") &&
      isStepComplete("signature")
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading commission...</LoadingState>
      </PageContainer>
    );
  }

  if (!commission) {
    return (
      <PageContainer>
        <LoadingState>Commission not found</LoadingState>
      </PageContainer>
    );
  }

  const getTestIcon = (status) => {
    switch (status) {
      case "passed": return "check_circle";
      case "failed": return "error";
      case "running": return "sync";
      default: return "radio_button_unchecked";
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate("/commissions")}>
          ← Back to Commissions
        </BackLink>
        <PageTitle>Commission Workflow</PageTitle>
        <PageSubtitle>
          Device {commission.device?.id} at {commission.site?.name || "Site"}
        </PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StepNav>
        {STEPS.map((step) => (
          <StepTab
            key={step.id}
            active={currentStep === step.id}
            complete={isStepComplete(step.id)}
            onClick={() => setCurrentStep(step.id)}
          >
            {isStepComplete(step.id) && currentStep !== step.id ? "Done" : step.label}
          </StepTab>
        ))}
      </StepNav>

      <StepContent>
        {currentStep === "overview" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardBody>
                <DeviceInfo>
                  <InfoItem>
                    <InfoLabel>Device ID</InfoLabel>
                    <InfoValue>{commission.device?.id}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Model</InfoLabel>
                    <InfoValue>{commission.device?.deviceType || "BlueSignal"}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Site</InfoLabel>
                    <InfoValue>{commission.site?.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Address</InfoLabel>
                    <InfoValue>{commission.site?.address || "N/A"}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Order</InfoLabel>
                    <InfoValue>{commission.order?.id}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue style={{ textTransform: "capitalize" }}>
                      {commission.status}
                    </InfoValue>
                  </InfoItem>
                </DeviceInfo>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Tools</CardTitle>
              </CardHeader>
              <CardBody>
                <ToolsList>
                  {commission.requiredTools?.map((tool, index) => (
                    <ToolItem key={index} essential={tool.essential}>
                      <ToolIcon>{tool.essential ? "!" : "+"}</ToolIcon>
                      <ToolInfo>
                        <ToolName>{tool.name}</ToolName>
                        <ToolPurpose>{tool.purpose}</ToolPurpose>
                      </ToolInfo>
                    </ToolItem>
                  ))}
                </ToolsList>
              </CardBody>
            </Card>
          </>
        )}

        {currentStep === "pre-deployment" && (
          <CommissionChecklist
            title="Pre-Deployment Checklist"
            items={commission.preDeploymentChecks || []}
            onItemChange={handlePreDeploymentChange}
          />
        )}

        {currentStep === "commissioning" && (
          <CommissionChecklist
            title="Commissioning Checklist"
            items={commission.commissioningChecks || []}
            onItemChange={handleCommissioningChange}
          />
        )}

        {currentStep === "tests" && (
          <Card>
            <CardHeader>
              <CardTitle>Hardware Tests</CardTitle>
              <Button onClick={handleRunTests} disabled={saving}>
                {saving ? "Running..." : "Run All Tests"}
              </Button>
            </CardHeader>
            <CardBody>
              <TestGrid>
                {commission.testResults?.map((test) => (
                  <TestItem key={test.id}>
                    <TestIcon status={test.status}>
                      {test.status === "passed" ? "PASS" : test.status === "failed" ? "FAIL" : test.status === "running" ? "..." : "-"}
                    </TestIcon>
                    <TestInfo>
                      <TestName>{test.name}</TestName>
                      <TestDetails>
                        {test.details || (test.status === "pending" ? "Not run yet" : "")}
                        {test.duration > 0 && ` (${test.duration}ms)`}
                      </TestDetails>
                    </TestInfo>
                    <TestStatus status={test.status}>
                      {test.status.toUpperCase()}
                    </TestStatus>
                  </TestItem>
                ))}
              </TestGrid>
            </CardBody>
          </Card>
        )}

        {currentStep === "photos" && (
          <Card>
            <CardHeader>
              <CardTitle>Photo Documentation</CardTitle>
            </CardHeader>
            <CardBody>
              <PhotoGrid>
                {commission.photos?.map((photo) => (
                  <PhotoCard key={photo.id}>
                    <img src={photo.url} alt={photo.caption} />
                    <PhotoCaption>{photo.caption}</PhotoCaption>
                  </PhotoCard>
                ))}
                <AddPhotoButton>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  <AddPhotoIcon>+</AddPhotoIcon>
                  <AddPhotoText>Add Photo</AddPhotoText>
                </AddPhotoButton>
              </PhotoGrid>
              <div style={{ marginTop: 16, fontSize: 13, color: "#6b7280" }}>
                Minimum 3 photos required: enclosure, sensors, and site overview
              </div>
            </CardBody>
          </Card>
        )}

        {currentStep === "signature" && (
          <Card>
            <CardHeader>
              <CardTitle>Installer Sign-Off</CardTitle>
            </CardHeader>
            <CardBody>
              {commission.signature ? (
                <SignatureBox>
                  <img
                    src={commission.signature.dataUrl}
                    alt="Signature"
                    style={{ maxWidth: "100%", maxHeight: 150 }}
                  />
                  <div style={{ marginTop: 12, color: "#6b7280" }}>
                    Signed by {commission.signature.name} on{" "}
                    {new Date(commission.signature.timestamp).toLocaleString()}
                  </div>
                </SignatureBox>
              ) : (
                <SignatureBox>
                  <div style={{ marginBottom: 16, color: "#6b7280" }}>
                    Draw your signature below
                  </div>
                  <SignatureCanvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <SignatureActions>
                    <Button onClick={clearSignature}>Clear</Button>
                  </SignatureActions>
                  <SignatureInput
                    type="text"
                    placeholder="Type your full name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Button
                      variant="primary"
                      onClick={handleSubmitSignature}
                      disabled={saving || !signerName.trim()}
                    >
                      {saving ? "Submitting..." : "Submit Signature"}
                    </Button>
                  </div>
                </SignatureBox>
              )}
            </CardBody>
          </Card>
        )}
      </StepContent>

      <ButtonGroup>
        <Button
          onClick={() => {
            const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
            if (currentIndex > 0) {
              setCurrentStep(STEPS[currentIndex - 1].id);
            }
          }}
          disabled={currentStep === STEPS[0].id}
        >
          Previous
        </Button>
        <div style={{ display: "flex", gap: 12 }}>
          {currentStep === STEPS[STEPS.length - 1].id ? (
            <Button
              variant="success"
              onClick={handleComplete}
              disabled={saving || !canComplete()}
            >
              {saving ? "Completing..." : "Complete Commission"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
                if (currentIndex < STEPS.length - 1) {
                  setCurrentStep(STEPS[currentIndex + 1].id);
                }
              }}
            >
              Next
            </Button>
          )}
        </div>
      </ButtonGroup>
    </PageContainer>
  );
};

export default CommissionWorkflow;
