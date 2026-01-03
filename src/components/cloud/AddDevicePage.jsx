// /src/components/cloud/AddDevicePage.jsx
/**
 * Streamlined Add Device page for returning users.
 * Unlike the onboarding flow, this is a quick single-page form
 * that assumes the user already knows the product.
 */

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { DeviceAPI } from "../../scripts/back_door";
import CloudPageLayout from "./CloudPageLayout";
import { ButtonPrimary, ButtonSecondary } from "../shared/button/Button";
import { Input } from "../shared/input/Input";
import { clearDeviceCache } from "../../hooks/useUserDevices";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 16px;
  padding: 32px;
  max-width: 560px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
  margin: 0 0 32px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
`;

const HelpText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin-top: 4px;
`;

const DeviceTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const DeviceTypeCard = styled.button`
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors?.primary500 || "#1D7072" : theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#38BDBE"};
    background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  }

  .icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .name {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors?.red50 || "#fef2f2"};
  border: 1px solid ${({ theme }) => theme.colors?.red200 || "#fecaca"};
  color: ${({ theme }) => theme.colors?.red700 || "#b91c1c"};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors?.green50 || "#f0fdf4"};
  border: 1px solid ${({ theme }) => theme.colors?.green200 || "#bbf7d0"};
  color: ${({ theme }) => theme.colors?.green700 || "#15803d"};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
`;

const ScanHint = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border-radius: 12px;
  margin-bottom: 24px;

  .icon {
    font-size: 24px;
  }

  .text {
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
    line-height: 1.4;
  }
`;

/* -------------------------------------------------------------------------- */
/*                              DEVICE TYPES                                  */
/* -------------------------------------------------------------------------- */

const DEVICE_TYPES = [
  { id: "buoy", icon: "🔵", name: "Water Buoy" },
  { id: "soil", icon: "🟤", name: "Soil Probe" },
  { id: "gateway", icon: "📡", name: "Gateway" },
  { id: "emitter", icon: "🔊", name: "Algae Emitter" },
  { id: "other", icon: "⚙️", name: "Other" },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AddDevicePage() {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || !deviceId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Validate device ID format (pgw-XXXX or BS-XXXXXX)
      const trimmedId = deviceId.trim().toUpperCase();
      const validFormats = [
        /^PGW-[A-Z0-9]{4,12}$/i,  // Pollution Gateway format
        /^BS-[A-Z0-9]{6,12}$/i,   // BlueSignal format
      ];

      const isValidFormat = validFormats.some((pattern) => pattern.test(trimmedId));
      if (!isValidFormat) {
        throw new Error(
          "Invalid device ID format. Expected: PGW-XXXX or BS-XXXXXX"
        );
      }

      // Prepare device payload
      const devicePayload = {
        deviceId: trimmedId,
        name: deviceName.trim() || `Device ${trimmedId.slice(-4)}`,
        deviceType: deviceType || "other",
        status: "pending",
        ownerId: user.uid,
        addedAt: new Date().toISOString(),
      };

      // Add device via API
      await DeviceAPI.addDevice(devicePayload);

      // Clear cache to force refetch
      clearDeviceCache();

      setSuccess(true);

      // Notify user
      ACTIONS.logNotification("success", "Device added successfully!");

      // Navigate to device list after short delay
      setTimeout(() => {
        navigate("/cloud/devices", {
          state: { message: "Device added successfully!" },
        });
      }, 1500);
    } catch (err) {
      console.error("Error adding device:", err);
      setError(err.message || "Failed to add device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (success) {
    return (
      <CloudPageLayout title="Add Device">
        <FormCard>
          <SuccessMessage>
            Device added successfully! Redirecting to your devices...
          </SuccessMessage>
        </FormCard>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Add Device"
      subtitle="Register a new device to your account"
    >
      <FormCard>
        <Title>Add a Device</Title>
        <Subtitle>
          Enter the device ID from the label on your BlueSignal hardware.
          You can find this on the QR code sticker or printed on the device.
        </Subtitle>

        <ScanHint>
          <div className="icon">📱</div>
          <div className="text">
            <strong>Tip:</strong> You can also scan the QR code on your device
            using the BlueSignal mobile app for faster setup.
          </div>
        </ScanHint>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="deviceId">Device ID *</Label>
            <Input
              id="deviceId"
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="PGW-0001 or BS-ABC123"
              required
              disabled={loading}
            />
            <HelpText>
              Found on the device label (e.g., PGW-0001, BS-ABC123)
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="deviceName">Device Name (optional)</Label>
            <Input
              id="deviceName"
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g., North Pond Monitor"
              disabled={loading}
            />
            <HelpText>
              A friendly name to help you identify this device
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label>Device Type</Label>
            <DeviceTypeGrid>
              {DEVICE_TYPES.map((type) => (
                <DeviceTypeCard
                  key={type.id}
                  type="button"
                  $selected={deviceType === type.id}
                  onClick={() => setDeviceType(type.id)}
                  disabled={loading}
                >
                  <div className="icon">{type.icon}</div>
                  <div className="name">{type.name}</div>
                </DeviceTypeCard>
              ))}
            </DeviceTypeGrid>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonRow>
            <ButtonSecondary
              type="button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </ButtonSecondary>
            <ButtonPrimary type="submit" disabled={loading || !deviceId.trim()}>
              {loading ? "Adding..." : "Add Device"}
            </ButtonPrimary>
          </ButtonRow>
        </Form>
      </FormCard>
    </CloudPageLayout>
  );
}
