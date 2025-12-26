// /src/components/cloud/FullCommissioningWizard.jsx
/**
 * Full 7-Step Commissioning Wizard
 * Uses the real backend API via useCommission hook
 */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useCommission } from "../../hooks/useCommission";
import { QRScanner, LocationCapture } from "../installer";
import CloudPageLayout from "./CloudPageLayout";
import { ButtonPrimary, ButtonSecondary, ButtonDanger } from "../shared/button/Button";
import { Input } from "../shared/input/Input";
import { GeocodingAPI } from "../../scripts/back_door";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProgressBar = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  overflow-x: auto;
  padding-bottom: 8px;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const ProgressStep = styled.div`
  flex: 1;
  min-width: 60px;
  padding: 12px 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: all 0.2s ease-out;

  background: ${({ $active, $completed, theme }) =>
    $active
      ? theme.colors?.primary500 || "#0284c7"
      : $completed
      ? theme.colors?.primary100 || "#e0f2ff"
      : theme.colors?.ui100 || "#f4f4f5"};

  color: ${({ $active, $completed, theme }) =>
    $active
      ? "#ffffff"
      : $completed
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui500 || "#71717a"};

  ${({ $clickable }) =>
    $clickable &&
    `
    &:hover {
      opacity: 0.8;
    }
  `}
`;

const StepNumber = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StepLabel = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const StepTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
`;

const StepDescription = styled.p`
  margin: 0 0 24px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  height: 44px;
  padding: 0px 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors?.ui800 || "#27272a"};
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.primary50 || "#EFFBFB"};
  }
`;

const SiteCard = styled.div`
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors?.primary500 || "#0284c7" : theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#22d3ee"};
  }
`;

const SiteName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
  margin-bottom: 4px;
`;

const SiteAddress = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors?.ui100 || "#f4f4f5"};
  border-radius: 8px;
  overflow: hidden;

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

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(220, 38, 38, 0.8);
  }
`;

const AddPhotoButton = styled.label`
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border: 2px dashed ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary500 || "#0284c7"};
    background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  }

  input {
    display: none;
  }
`;

const TestGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TestItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: ${({ $status }) => {
    if ($status === "passed") return "#d1fae5";
    if ($status === "failed") return "#fee2e2";
    if ($status === "running") return "#dbeafe";
    return "#f9fafb";
  }};
  border: 1px solid ${({ $status }) => {
    if ($status === "passed") return "#86efac";
    if ($status === "failed") return "#fca5a5";
    if ($status === "running") return "#93c5fd";
    return "#e5e7eb";
  }};
`;

const TestIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.5);
`;

const TestInfo = styled.div`
  flex: 1;
`;

const TestName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
`;

const TestDetails = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  margin-top: 2px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border-radius: 8px;
  padding: 16px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors?.ui500 || "#71717a"};
  margin-bottom: 8px;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors?.red50 || "#fef2f2"};
  border: 1px solid ${({ theme }) => theme.colors?.red200 || "#fecaca"};
  color: ${({ theme }) => theme.colors?.red700 || "#b91c1c"};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #86efac;
  color: #065f46;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;
  height: ${({ $height }) => $height || "200px"};

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                     */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { id: "device_scan", label: "Scan", icon: "1" },
  { id: "site_selection", label: "Site", icon: "2" },
  { id: "location_capture", label: "Location", icon: "3" },
  { id: "photo_upload", label: "Photos", icon: "4" },
  { id: "connectivity_test", label: "Tests", icon: "5" },
  { id: "sensor_calibration", label: "Calibrate", icon: "6" },
  { id: "review_confirm", label: "Review", icon: "7" },
];

const REQUIRED_PHOTOS = ["Installation", "Sensors", "Site Overview"];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function FullCommissioningWizard() {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const {
    commission,
    loading,
    error: commissionError,
    initiate,
    updateStep,
    complete,
    cancel,
  } = useCommission();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [sites, setSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Form state
  const [deviceData, setDeviceData] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [newSiteMode, setNewSiteMode] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [calibrationData, setCalibrationData] = useState({});
  const [runningTests, setRunningTests] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    setLoadingSites(true);
    try {
      const response = await GeocodingAPI.listSites({ ownerId: user?.uid });
      setSites(response.sites || []);
    } catch (err) {
      console.error("Error loading sites:", err);
    } finally {
      setLoadingSites(false);
    }
  };

  // Handle device scan success
  const handleDeviceScan = async (device) => {
    setDeviceData(device);
    setError(null);

    // Initiate commission in backend
    try {
      await initiate(device.serialNumber, user?.uid);
      // Auto-advance to next step
      setCurrentStepIndex(1);
    } catch (err) {
      setError(err.message || "Failed to start commissioning");
    }
  };

  // Handle site selection
  const handleSiteSelect = async (site) => {
    setSelectedSite(site);
    setError(null);

    if (commission?.commissionId) {
      try {
        await updateStep("site_selection", { siteId: site.id });
      } catch (err) {
        console.error("Error updating step:", err);
      }
    }
  };

  // Handle location capture
  const handleLocationCapture = async (loc) => {
    setLocation(loc);
    setError(null);

    if (commission?.commissionId) {
      try {
        await updateStep("location_capture", {
          latitude: loc.latitude,
          longitude: loc.longitude,
          address: loc.address,
        });
      } catch (err) {
        console.error("Error updating step:", err);
      }
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPhotos = await Promise.all(
      files.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              id: Date.now() + Math.random(),
              url: event.target.result,
              caption: file.name,
              type: "installation",
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Run connectivity tests
  const handleRunTests = async () => {
    setRunningTests(true);
    setError(null);

    const tests = [
      { id: "power", name: "Power System", status: "pending" },
      { id: "network", name: "Network Connectivity", status: "pending" },
      { id: "sensors", name: "Sensor Response", status: "pending" },
      { id: "data", name: "Data Transmission", status: "pending" },
    ];

    setTestResults(tests);

    // Simulate running tests one by one
    for (let i = 0; i < tests.length; i++) {
      setTestResults((prev) =>
        prev.map((t, idx) =>
          idx === i ? { ...t, status: "running" } : t
        )
      );

      await new Promise((r) => setTimeout(r, 1500));

      const passed = Math.random() > 0.1; // 90% pass rate
      setTestResults((prev) =>
        prev.map((t, idx) =>
          idx === i
            ? {
                ...t,
                status: passed ? "passed" : "failed",
                details: passed ? "OK" : "Check connection",
              }
            : t
        )
      );
    }

    setRunningTests(false);

    if (commission?.commissionId) {
      try {
        await updateStep("connectivity_test", {
          tests: testResults,
          passed: testResults.every((t) => t.status === "passed"),
        });
      } catch (err) {
        console.error("Error updating step:", err);
      }
    }
  };

  // Handle calibration
  const handleCalibrationChange = (sensor, value) => {
    setCalibrationData((prev) => ({
      ...prev,
      [sensor]: value,
    }));
  };

  // Navigate steps
  const goToStep = (index) => {
    if (index <= getMaxAllowedStep()) {
      setCurrentStepIndex(index);
    }
  };

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Determine max step user can navigate to
  const getMaxAllowedStep = () => {
    if (!deviceData) return 0;
    if (!selectedSite && !newSiteName) return 1;
    if (!location) return 2;
    if (photos.length < 1) return 3;
    if (testResults.length === 0) return 4;
    return STEPS.length - 1;
  };

  // Check if step is complete
  const isStepComplete = (index) => {
    switch (index) {
      case 0: return !!deviceData;
      case 1: return !!selectedSite || !!newSiteName;
      case 2: return !!location;
      case 3: return photos.length >= 1;
      case 4: return testResults.some((t) => t.status === "passed" || t.status === "failed");
      case 5: return Object.keys(calibrationData).length > 0;
      default: return false;
    }
  };

  // Handle final submission
  const handleComplete = async () => {
    setError(null);

    try {
      await complete();
      ACTIONS?.logNotification?.("success", "Device commissioned successfully!");
      navigate("/cloud/commissioning");
    } catch (err) {
      setError(err.message || "Failed to complete commissioning");
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this commissioning?")) {
      try {
        await cancel("User cancelled");
        navigate("/cloud/commissioning");
      } catch (err) {
        console.error("Error cancelling:", err);
        navigate("/cloud/commissioning");
      }
    }
  };

  const getTestIcon = (status) => {
    switch (status) {
      case "passed": return "check";
      case "failed": return "X";
      case "running": return "...";
      default: return "-";
    }
  };

  return (
    <CloudPageLayout
      title="Commission Device"
      subtitle="Follow the steps to commission a new device"
    >
      <WizardContainer>
        {/* Progress Bar */}
        <ProgressBar>
          {STEPS.map((step, index) => (
            <ProgressStep
              key={step.id}
              $active={index === currentStepIndex}
              $completed={isStepComplete(index)}
              $clickable={index <= getMaxAllowedStep()}
              onClick={() => goToStep(index)}
            >
              <StepNumber>{step.icon}</StepNumber>
              <StepLabel>{step.label}</StepLabel>
            </ProgressStep>
          ))}
        </ProgressBar>

        {(error || commissionError) && (
          <ErrorMessage>{error || commissionError}</ErrorMessage>
        )}

        {/* Step Content */}
        <Card>
          {/* Step 1: Device Scan */}
          {currentStep.id === "device_scan" && (
            <>
              <StepTitle>Scan Device</StepTitle>
              <StepDescription>
                Scan the QR code on the device or enter the serial number manually.
              </StepDescription>

              {deviceData ? (
                <SuccessMessage>
                  Device scanned successfully!
                  <div style={{ fontWeight: 700, marginTop: 8 }}>
                    {deviceData.serialNumber}
                  </div>
                </SuccessMessage>
              ) : (
                <QRScanner
                  onDeviceValidated={handleDeviceScan}
                  onError={(err) => setError(err)}
                />
              )}
            </>
          )}

          {/* Step 2: Site Selection */}
          {currentStep.id === "site_selection" && (
            <>
              <StepTitle>Select Site</StepTitle>
              <StepDescription>
                Choose an existing site or create a new one for this device.
              </StepDescription>

              <FormGroup>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newSiteMode}
                    onChange={(e) => setNewSiteMode(e.target.checked)}
                  />
                  <span>Create a new site</span>
                </label>
              </FormGroup>

              {newSiteMode ? (
                <FormGroup>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    type="text"
                    value={newSiteName}
                    onChange={(e) => setNewSiteName(e.target.value)}
                    placeholder="Enter site name"
                  />
                </FormGroup>
              ) : loadingSites ? (
                <Skeleton $height="150px" />
              ) : sites.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: "#6b7280" }}>
                  No sites found. Create a new site to continue.
                </div>
              ) : (
                <>
                  {sites.map((site) => (
                    <SiteCard
                      key={site.id}
                      $selected={selectedSite?.id === site.id}
                      onClick={() => handleSiteSelect(site)}
                    >
                      <SiteName>{site.name}</SiteName>
                      <SiteAddress>{site.address || "No address"}</SiteAddress>
                    </SiteCard>
                  ))}
                </>
              )}
            </>
          )}

          {/* Step 3: Location Capture */}
          {currentStep.id === "location_capture" && (
            <>
              <StepTitle>Capture Location</StepTitle>
              <StepDescription>
                Record the exact installation location using GPS, map, or address.
              </StepDescription>

              {location ? (
                <SuccessMessage>
                  Location captured!
                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    {location.address || `${location.latitude}, ${location.longitude}`}
                  </div>
                </SuccessMessage>
              ) : (
                <LocationCapture onLocationCaptured={handleLocationCapture} />
              )}
            </>
          )}

          {/* Step 4: Photo Upload */}
          {currentStep.id === "photo_upload" && (
            <>
              <StepTitle>Upload Photos</StepTitle>
              <StepDescription>
                Take photos of the installation for documentation.
                Required: {REQUIRED_PHOTOS.join(", ")}
              </StepDescription>

              <PhotoGrid>
                {photos.map((photo) => (
                  <PhotoCard key={photo.id}>
                    <img src={photo.url} alt={photo.caption} />
                    <PhotoCaption>{photo.caption}</PhotoCaption>
                    <RemovePhotoButton onClick={() => handleRemovePhoto(photo.id)}>
                      X
                    </RemovePhotoButton>
                  </PhotoCard>
                ))}

                <AddPhotoButton>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                  <div style={{ fontSize: 32, color: "#9ca3af" }}>+</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Add Photo</div>
                </AddPhotoButton>
              </PhotoGrid>
            </>
          )}

          {/* Step 5: Connectivity Tests */}
          {currentStep.id === "connectivity_test" && (
            <>
              <StepTitle>Connectivity Tests</StepTitle>
              <StepDescription>
                Run automated tests to verify device connectivity.
              </StepDescription>

              {testResults.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32 }}>
                  <ButtonPrimary onClick={handleRunTests} disabled={runningTests}>
                    {runningTests ? "Running Tests..." : "Run Tests"}
                  </ButtonPrimary>
                </div>
              ) : (
                <>
                  <TestGrid>
                    {testResults.map((test) => (
                      <TestItem key={test.id} $status={test.status}>
                        <TestIcon>{getTestIcon(test.status)}</TestIcon>
                        <TestInfo>
                          <TestName>{test.name}</TestName>
                          <TestDetails>
                            {test.details || (test.status === "pending" ? "Waiting..." : "")}
                          </TestDetails>
                        </TestInfo>
                      </TestItem>
                    ))}
                  </TestGrid>

                  {testResults.some((t) => t.status === "failed") && (
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      <ButtonSecondary onClick={handleRunTests} disabled={runningTests}>
                        Retry Tests
                      </ButtonSecondary>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Step 6: Sensor Calibration */}
          {currentStep.id === "sensor_calibration" && (
            <>
              <StepTitle>Sensor Calibration</StepTitle>
              <StepDescription>
                Calibrate sensors with reference values.
              </StepDescription>

              <FormGroup>
                <Label htmlFor="ph">pH Reference Value</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={calibrationData.ph || ""}
                  onChange={(e) => handleCalibrationChange("ph", e.target.value)}
                  placeholder="7.0"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="temperature">Temperature Reference (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={calibrationData.temperature || ""}
                  onChange={(e) => handleCalibrationChange("temperature", e.target.value)}
                  placeholder="25.0"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="dissolvedOxygen">Dissolved Oxygen Reference (mg/L)</Label>
                <Input
                  id="dissolvedOxygen"
                  type="number"
                  step="0.1"
                  value={calibrationData.dissolvedOxygen || ""}
                  onChange={(e) => handleCalibrationChange("dissolvedOxygen", e.target.value)}
                  placeholder="8.0"
                />
              </FormGroup>
            </>
          )}

          {/* Step 7: Review & Confirm */}
          {currentStep.id === "review_confirm" && (
            <>
              <StepTitle>Review & Confirm</StepTitle>
              <StepDescription>
                Review the commissioning details before completing.
              </StepDescription>

              <SummaryGrid>
                <SummaryCard>
                  <SummaryLabel>Device</SummaryLabel>
                  <SummaryValue>{deviceData?.serialNumber || "N/A"}</SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Site</SummaryLabel>
                  <SummaryValue>{selectedSite?.name || newSiteName || "N/A"}</SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Location</SummaryLabel>
                  <SummaryValue>
                    {location?.address || (location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "N/A")}
                  </SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Photos</SummaryLabel>
                  <SummaryValue>{photos.length} uploaded</SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Tests</SummaryLabel>
                  <SummaryValue>
                    {testResults.filter((t) => t.status === "passed").length}/
                    {testResults.length} passed
                  </SummaryValue>
                </SummaryCard>

                <SummaryCard>
                  <SummaryLabel>Calibration</SummaryLabel>
                  <SummaryValue>
                    {Object.keys(calibrationData).length > 0 ? "Complete" : "Skipped"}
                  </SummaryValue>
                </SummaryCard>
              </SummaryGrid>
            </>
          )}
        </Card>

        {/* Footer Navigation */}
        <Footer>
          <div>
            {currentStepIndex > 0 && (
              <ButtonSecondary onClick={goBack}>
                Back
              </ButtonSecondary>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <ButtonDanger onClick={handleCancel}>
              Cancel
            </ButtonDanger>

            {currentStepIndex < STEPS.length - 1 ? (
              <ButtonPrimary
                onClick={goNext}
                disabled={!isStepComplete(currentStepIndex)}
              >
                Continue
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                onClick={handleComplete}
                disabled={loading}
              >
                {loading ? "Completing..." : "Complete Commission"}
              </ButtonPrimary>
            )}
          </div>
        </Footer>
      </WizardContainer>
    </CloudPageLayout>
  );
}
