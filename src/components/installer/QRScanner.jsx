/**
 * QR Scanner Component
 * Scans BlueSignal device QR codes for commissioning
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { auth } from "../../apis/firebase";
import configs from "../../../configs";

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const ScannerView = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #1a1a2e;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const ScanFrame = styled.div`
  width: 250px;
  height: 250px;
  border: 3px solid #00d4ff;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const ManualEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    text-transform: none;
  }

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.5rem;
  background: ${(props) => (props.primary ? "#00d4ff" : "transparent")};
  color: ${(props) => (props.primary ? "#000" : "#fff")};
  border: ${(props) => (props.primary ? "none" : "1px solid rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.primary ? "#00b8e0" : "rgba(255, 255, 255, 0.1)")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  padding: 1rem;
  background: ${(props) =>
    props.type === "success"
      ? "rgba(34, 197, 94, 0.1)"
      : props.type === "error"
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(59, 130, 246, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.type === "success"
        ? "rgba(34, 197, 94, 0.3)"
        : props.type === "error"
        ? "rgba(239, 68, 68, 0.3)"
        : "rgba(59, 130, 246, 0.3)"};
  border-radius: 8px;
  color: ${(props) =>
    props.type === "success" ? "#22c55e" : props.type === "error" ? "#ef4444" : "#3b82f6"};
`;

const DeviceInfo = styled.div`
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
`;

const DeviceInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const DeviceInfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

const DeviceInfoValue = styled.span`
  color: white;
  font-weight: 500;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

/**
 * QR Scanner Component
 */
export function QRScanner({ onScan, onError, onDeviceValidated }) {
  const [scanning, setScanning] = useState(false);
  const [manualSerial, setManualSerial] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [validatedDevice, setValidatedDevice] = useState(null);
  const [validating, setValidating] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  /**
   * Start the QR scanner
   */
  const startScanner = useCallback(async () => {
    if (html5QrCodeRef.current?.isScanning) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-scanner");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScan,
        () => {} // Silent on scan failure
      );

      setScanning(true);
      setStatus({ type: "info", message: "Position the QR code within the frame" });
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setStatus({ type: "error", message: "Failed to access camera. Please allow camera access." });
      onError?.(err.message);
    }
  }, []);

  /**
   * Stop the QR scanner
   */
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current?.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScanning(false);
  }, []);

  // Start scanner on mount
  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  /**
   * Handle scanned QR code
   */
  const handleScan = async (decodedText) => {
    await stopScanner();
    setStatus({ type: "info", message: "Processing QR code..." });

    try {
      // Extract QR data from URL if present
      let qrData = decodedText;
      if (decodedText.includes("?d=")) {
        try {
          const url = new URL(decodedText);
          qrData = url.searchParams.get("d") || decodedText;
        } catch (e) {
          // Not a URL, use as-is
        }
      }

      await validateQRCode(qrData, "qr_scan");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      onError?.(err.message);
      // Restart scanner after error
      setTimeout(() => startScanner(), 2000);
    }
  };

  /**
   * Handle manual serial number submission
   */
  const handleManualSubmit = async () => {
    if (!manualSerial.trim()) return;

    setStatus({ type: "info", message: "Validating serial number..." });

    try {
      // Create a manual entry payload
      const payload = {
        serialNumber: manualSerial.trim().toUpperCase(),
        type: "manual",
        signature: "manual",
        timestamp: Date.now(),
      };
      const qrData = btoa(JSON.stringify(payload));

      await validateQRCode(qrData, "serial_manual");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
      onError?.(err.message);
    }
  };

  /**
   * Validate QR code with backend
   */
  const validateQRCode = async (qrData, method) => {
    setValidating(true);

    try {
      // Get auth token
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Please sign in to scan devices");
      }

      const response = await axios.post(
        `${configs.server_url}/device/qr/validate`,
        { qrData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { valid, device, error: validationError } = response.data;

      if (!valid) {
        throw new Error(validationError || "Invalid QR code");
      }

      setValidatedDevice(device);
      setStatus({ type: "success", message: "Device validated successfully!" });

      // Notify parent components
      onScan?.(qrData);
      onDeviceValidated?.({
        ...device,
        qrData,
        method,
      });
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to validate device";
      throw new Error(message);
    } finally {
      setValidating(false);
    }
  };

  /**
   * Reset scanner state
   */
  const handleReset = () => {
    setValidatedDevice(null);
    setManualSerial("");
    setStatus({ type: null, message: "" });
    startScanner();
  };

  return (
    <ScannerContainer>
      {!validatedDevice ? (
        <>
          {/* Scanner View */}
          <ScannerView ref={scannerRef}>
            <div id="qr-scanner" style={{ width: "100%", height: "100%" }} />
            {scanning && (
              <ScannerOverlay>
                <ScanFrame />
              </ScannerOverlay>
            )}
          </ScannerView>

          {/* Status Message */}
          {status.message && (
            <StatusMessage type={status.type}>{status.message}</StatusMessage>
          )}

          {/* Divider */}
          <Divider>or enter manually</Divider>

          {/* Manual Entry */}
          <ManualEntry>
            <Input
              type="text"
              placeholder="e.g., BS-2024-001234"
              value={manualSerial}
              onChange={(e) => setManualSerial(e.target.value.toUpperCase())}
              maxLength={15}
            />
            <Button
              primary
              onClick={handleManualSubmit}
              disabled={!manualSerial.trim() || validating}
            >
              {validating ? "Validating..." : "Submit Serial Number"}
            </Button>
          </ManualEntry>
        </>
      ) : (
        <>
          {/* Device Validated */}
          <StatusMessage type="success">Device validated successfully!</StatusMessage>

          <DeviceInfo>
            <DeviceInfoRow>
              <DeviceInfoLabel>Serial Number</DeviceInfoLabel>
              <DeviceInfoValue>{validatedDevice.serialNumber}</DeviceInfoValue>
            </DeviceInfoRow>
            <DeviceInfoRow>
              <DeviceInfoLabel>Type</DeviceInfoLabel>
              <DeviceInfoValue>{validatedDevice.type}</DeviceInfoValue>
            </DeviceInfoRow>
            {validatedDevice.model && (
              <DeviceInfoRow>
                <DeviceInfoLabel>Model</DeviceInfoLabel>
                <DeviceInfoValue>{validatedDevice.model}</DeviceInfoValue>
              </DeviceInfoRow>
            )}
            <DeviceInfoRow>
              <DeviceInfoLabel>Status</DeviceInfoLabel>
              <DeviceInfoValue>{validatedDevice.currentStatus}</DeviceInfoValue>
            </DeviceInfoRow>
          </DeviceInfo>

          <Button onClick={handleReset}>Scan Different Device</Button>
        </>
      )}
    </ScannerContainer>
  );
}

export default QRScanner;
