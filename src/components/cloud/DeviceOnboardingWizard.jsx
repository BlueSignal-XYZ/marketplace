// /src/components/cloud/DeviceOnboardingWizard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CloudPageLayout from "./CloudPageLayout";
import CloudMockAPI from "../../services/cloudMockAPI";
import { useAppContext } from "../../context/AppContext";
import QRScanner from "./QRScanner";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const WizardContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 16px;
  overflow: hidden;
  max-width: 720px;
  margin: 0 auto;
`;

const ProgressBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
`;

const ProgressStep = styled.div`
  flex: 1;
  padding: 16px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active, $completed, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0369a1"
      : $completed
      ? theme.colors?.primary600 || "#0284c7"
      : theme.colors?.ui400 || "#9ca3af"};
  background: ${({ $active, theme }) =>
    $active ? "#ffffff" : "transparent"};
  border-bottom: 2px solid
    ${({ $active, $completed, theme }) =>
      $active
        ? theme.colors?.primary600 || "#0284c7"
        : $completed
        ? theme.colors?.primary400 || "#22d3ee"
        : "transparent"};
  transition: all 0.2s ease-out;

  @media (max-width: 600px) {
    font-size: 11px;
    padding: 12px 8px;
  }
`;

const StepContent = styled.div`
  padding: 32px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const StepTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const StepDescription = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const DeviceTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const DeviceTypeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors?.primary500 || "#06b6d4"
        : theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};
  cursor: pointer;
  transition: all 0.15s ease-out;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#22d3ee"};
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  }

  .icon {
    font-size: 32px;
  }

  .name {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  .description {
    font-size: 12px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }

  .hint {
    margin-top: 4px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  }

  .error {
    margin-top: 4px;
    font-size: 12px;
    color: #dc2626;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${({ $error, theme }) =>
      $error ? "#dc2626" : theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  transition: all 0.15s ease-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  resize: vertical;
  min-height: 80px;
  transition: all 0.15s ease-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }
`;

const CoordinatesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 8px;

  input {
    flex: 1;
  }
`;

const ScanButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 500px) {
    padding: 12px 14px;
    font-size: 13px;
  }
`;

const ScanSuccessBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #059669;
  margin-top: 8px;
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }

  .value {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
    text-align: right;
    max-width: 60%;
    word-break: break-word;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    padding: 16px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 48px;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: ${theme.colors?.primary600 || "#0284c7"};
    color: #ffffff;
    border: none;

    &:hover {
      background: ${theme.colors?.primary700 || "#0369a1"};
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    color: ${theme.colors?.ui700 || "#374151"};
    border: 1px solid ${theme.colors?.ui300 || "#d1d5db"};

    &:hover {
      background: ${theme.colors?.ui50 || "#f9fafb"};
      border-color: ${theme.colors?.ui400 || "#9ca3af"};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px 20px;

  .icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  h2 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }

  p {
    margin: 0 0 24px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  }
`;

/* -------------------------------------------------------------------------- */
/*                              DEVICE TYPE DATA                               */
/* -------------------------------------------------------------------------- */

const DEVICE_TYPES = [
  {
    id: "buoy",
    name: "Water Quality Buoy",
    icon: "Blue",
    description: "Monitors water quality parameters",
  },
  {
    id: "soil_sensor",
    name: "Soil NPK Probe",
    icon: "Brown",
    description: "Measures soil nutrient levels",
  },
  {
    id: "emitter",
    name: "Ultrasonic Emitter",
    icon: "Purple",
    description: "Algae control device",
  },
  {
    id: "gateway",
    name: "LoRaWAN Gateway",
    icon: "Gray",
    description: "Network connectivity hub",
  },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function DeviceOnboardingWizard() {
  const navigate = useNavigate();
  const { ACTIONS } = useAppContext();
  const { logNotification } = ACTIONS || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedFromQR, setScannedFromQR] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    deviceType: "",
    name: "",
    serialNumber: "",
    hardwareId: "",
    siteId: "",
    latitude: "",
    longitude: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [sites, setSites] = useState([]);

  // Load sites for dropdown
  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await CloudMockAPI.sites.getAll();
        setSites(data);
      } catch (error) {
        console.error("Error loading sites:", error);
      }
    };
    loadSites();
  }, []);

  const steps = [
    { number: 1, label: "Device Type" },
    { number: 2, label: "Identity" },
    { number: 3, label: "Location" },
    { number: 4, label: "Confirm" },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.deviceType) {
        newErrors.deviceType = "Please select a device type";
      }
    }

    if (step === 2) {
      if (!formData.name || formData.name.length < 3) {
        newErrors.name = "Device name must be at least 3 characters";
      }
      if (!formData.serialNumber) {
        newErrors.serialNumber = "Serial number is required";
      }
    }

    if (step === 3) {
      if (!formData.siteId) {
        newErrors.siteId = "Please select a site";
      }
      if (formData.latitude) {
        const lat = parseFloat(formData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          newErrors.latitude = "Latitude must be between -90 and 90";
        }
      }
      if (formData.longitude) {
        const lng = parseFloat(formData.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          newErrors.longitude = "Longitude must be between -180 and 180";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);

    try {
      // Simulate API call to create device
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock device ID
      const mockDeviceId = `pgw-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;
      setNewDeviceId(mockDeviceId);

      console.log("Device created:", {
        id: mockDeviceId,
        ...formData,
      });

      setSuccess(true);
      if (logNotification) {
        logNotification("success", "Device added successfully!");
      }
    } catch (error) {
      console.error("Error creating device:", error);
      if (logNotification) {
        logNotification("error", "Failed to add device. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getDeviceTypeName = (typeId) => {
    const type = DEVICE_TYPES.find((t) => t.id === typeId);
    return type?.name || typeId;
  };

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === siteId);
    return site?.name || siteId;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Handle QR scan result
  const handleQRScan = (scanResult) => {
    setScannedFromQR(true);
    setShowQRScanner(false);

    // Update form with scanned data
    setFormData((prev) => ({
      ...prev,
      serialNumber: scanResult.serialNumber || prev.serialNumber,
      hardwareId: scanResult.hardwareId || prev.hardwareId,
    }));

    // Clear related errors
    setErrors((prev) => ({
      ...prev,
      serialNumber: null,
      hardwareId: null,
    }));

    if (logNotification) {
      logNotification("success", "Device QR code scanned successfully!");
    }
  };

  // Render success state
  if (success) {
    return (
      <CloudPageLayout
        title="Add Device"
        subtitle="Register a new device in your fleet"
      >
        <WizardContainer>
          <StepContent>
            <SuccessMessage>
              <div className="icon">Done</div>
              <h2>Device Added Successfully</h2>
              <p>
                Your device <strong>{formData.name}</strong> has been registered
                with ID <strong>{newDeviceId}</strong>
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  $variant="primary"
                  onClick={() => navigate(`/cloud/devices/${newDeviceId}`)}
                >
                  View Device
                </Button>
                <Button onClick={() => navigate("/cloud/commissioning")}>
                  Commission Device
                </Button>
              </div>
            </SuccessMessage>
          </StepContent>
        </WizardContainer>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Add Device"
      subtitle="Register a new device in your fleet"
    >
      <WizardContainer>
        {/* Progress Bar */}
        <ProgressBar>
          {steps.map((step) => (
            <ProgressStep
              key={step.number}
              $active={currentStep === step.number}
              $completed={currentStep > step.number}
            >
              {step.label}
            </ProgressStep>
          ))}
        </ProgressBar>

        {/* Step Content */}
        <StepContent>
          {/* Step 1: Device Type */}
          {currentStep === 1 && (
            <>
              <StepTitle>Select Device Type</StepTitle>
              <StepDescription>
                Choose the type of device you're adding to your fleet.
              </StepDescription>

              <DeviceTypeGrid>
                {DEVICE_TYPES.map((type) => (
                  <DeviceTypeCard
                    key={type.id}
                    $selected={formData.deviceType === type.id}
                    onClick={() => handleInputChange("deviceType", type.id)}
                  >
                    <div className="icon">{type.icon}</div>
                    <div className="name">{type.name}</div>
                    <div className="description">{type.description}</div>
                  </DeviceTypeCard>
                ))}
              </DeviceTypeGrid>
              {errors.deviceType && (
                <div style={{ color: "#dc2626", fontSize: "13px", marginTop: "12px" }}>
                  {errors.deviceType}
                </div>
              )}
            </>
          )}

          {/* Step 2: Device Identity */}
          {currentStep === 2 && (
            <>
              <StepTitle>Device Identity</StepTitle>
              <StepDescription>
                Scan the device QR code or enter identifying information manually.
              </StepDescription>

              <FormGroup>
                <label>Device Name *</label>
                <Input
                  type="text"
                  placeholder="e.g., Lakefront Buoy #1"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  $error={errors.name}
                />
                {errors.name && <div className="error">{errors.name}</div>}
                <div className="hint">A descriptive name for this device</div>
              </FormGroup>

              <FormGroup>
                <label>Serial Number *</label>
                <InputWithButton>
                  <Input
                    type="text"
                    placeholder="e.g., SN-2024-001234"
                    value={formData.serialNumber}
                    onChange={(e) => {
                      handleInputChange("serialNumber", e.target.value);
                      setScannedFromQR(false);
                    }}
                    $error={errors.serialNumber}
                  />
                  <ScanButton
                    type="button"
                    onClick={() => setShowQRScanner(true)}
                    title="Scan device QR code"
                  >
                    Scan QR
                  </ScanButton>
                </InputWithButton>
                {errors.serialNumber && (
                  <div className="error">{errors.serialNumber}</div>
                )}
                {scannedFromQR && formData.serialNumber && (
                  <ScanSuccessBadge>
                    Scanned from QR code
                  </ScanSuccessBadge>
                )}
                <div className="hint">Found on the device label or scan the QR code</div>
              </FormGroup>

              <FormGroup>
                <label>Hardware ID (optional)</label>
                <Input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={formData.hardwareId}
                  onChange={(e) => handleInputChange("hardwareId", e.target.value)}
                />
                <div className="hint">UUID format, auto-generated if not provided</div>
              </FormGroup>
            </>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <>
              <StepTitle>Location Assignment</StepTitle>
              <StepDescription>
                Assign this device to a monitoring site.
              </StepDescription>

              <FormGroup>
                <label>Site *</label>
                <Select
                  value={formData.siteId}
                  onChange={(e) => handleInputChange("siteId", e.target.value)}
                >
                  <option value="">Select a site...</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.location})
                    </option>
                  ))}
                </Select>
                {errors.siteId && <div className="error">{errors.siteId}</div>}
              </FormGroup>

              <CoordinatesRow>
                <FormGroup>
                  <label>Latitude (optional)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="e.g., 39.5"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    $error={errors.latitude}
                  />
                  {errors.latitude && (
                    <div className="error">{errors.latitude}</div>
                  )}
                </FormGroup>

                <FormGroup>
                  <label>Longitude (optional)</label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="e.g., -79.3"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    $error={errors.longitude}
                  />
                  {errors.longitude && (
                    <div className="error">{errors.longitude}</div>
                  )}
                </FormGroup>
              </CoordinatesRow>

              <FormGroup>
                <label>Notes (optional)</label>
                <Textarea
                  placeholder="Any additional notes about this device..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  maxLength={500}
                />
                <div className="hint">{formData.notes.length}/500 characters</div>
              </FormGroup>
            </>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <>
              <StepTitle>Confirm Device Details</StepTitle>
              <StepDescription>
                Review the information before adding this device.
              </StepDescription>

              <SummaryCard>
                <SummaryRow>
                  <span className="label">Device Type</span>
                  <span className="value">{getDeviceTypeName(formData.deviceType)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span className="label">Device Name</span>
                  <span className="value">{formData.name}</span>
                </SummaryRow>
                <SummaryRow>
                  <span className="label">Serial Number</span>
                  <span className="value">{formData.serialNumber}</span>
                </SummaryRow>
                {formData.hardwareId && (
                  <SummaryRow>
                    <span className="label">Hardware ID</span>
                    <span className="value">{formData.hardwareId}</span>
                  </SummaryRow>
                )}
                <SummaryRow>
                  <span className="label">Site</span>
                  <span className="value">{getSiteName(formData.siteId)}</span>
                </SummaryRow>
                {(formData.latitude || formData.longitude) && (
                  <SummaryRow>
                    <span className="label">Coordinates</span>
                    <span className="value">
                      {formData.latitude || "—"}, {formData.longitude || "—"}
                    </span>
                  </SummaryRow>
                )}
                {formData.notes && (
                  <SummaryRow>
                    <span className="label">Notes</span>
                    <span className="value">{formData.notes}</span>
                  </SummaryRow>
                )}
              </SummaryCard>
            </>
          )}
        </StepContent>

        {/* Footer */}
        <Footer>
          <Button
            onClick={currentStep === 1 ? () => navigate(-1) : handleBack}
            disabled={submitting}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < 4 ? (
            <Button $variant="primary" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button $variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Adding Device..." : "Add Device"}
            </Button>
          )}
        </Footer>
      </WizardContainer>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </CloudPageLayout>
  );
}
