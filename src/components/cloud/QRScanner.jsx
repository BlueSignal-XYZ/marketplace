// QR Code Scanner Component for Device Commissioning
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  line-height: 1;

  &:hover {
    color: #1f2937;
  }
`;

const ScannerContainer = styled.div`
  position: relative;
  background: #000;
  min-height: 300px;

  #qr-reader {
    width: 100% !important;
    border: none !important;
  }

  #qr-reader video {
    width: 100% !important;
    object-fit: cover;
  }

  #qr-reader__scan_region {
    min-height: 280px !important;
  }
`;

const ScanOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 3px solid rgba(6, 182, 212, 0.8);
  border-radius: 16px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #06b6d4;
    border-style: solid;
  }

  &::before {
    top: -3px;
    left: -3px;
    border-width: 4px 0 0 4px;
    border-radius: 16px 0 0 0;
  }

  &::after {
    bottom: -3px;
    right: -3px;
    border-width: 0 4px 4px 0;
    border-radius: 0 0 16px 0;
  }
`;

const StatusBar = styled.div`
  padding: 16px 20px;
  background: ${({ $error }) => ($error ? "#fef2f2" : "#f9fafb")};
  border-top: 1px solid ${({ $error }) => ($error ? "#fecaca" : "#e5e7eb")};
`;

const StatusMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ $error }) => ($error ? "#dc2626" : "#4b5563")};
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: #0284c7;
    color: #ffffff;
    border: none;

    &:hover:not(:disabled) {
      background: #0369a1;
    }
  `
      : `
    background: #ffffff;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ManualInput = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
`;

const ManualInputLabel = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }
`;

const CameraPermissionRequest = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 300px;
  background: #f9fafb;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  p {
    margin: 0 0 20px;
    font-size: 14px;
    color: #6b7280;
    max-width: 280px;
  }
`;

/**
 * Parse QR code content - supports multiple formats:
 * 1. Plain serial number: "SN-2024-001234"
 * 2. Pipe-delimited: "pgw-0001|SN-2024-001234|HW-REV-02"
 * 3. JSON: {"id":"pgw-0001","serialNumber":"SN-2024-001234"}
 */
const parseQRContent = (content) => {
  const trimmed = content.trim();

  // Try JSON first
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        deviceId: parsed.id || parsed.deviceId || "",
        serialNumber: parsed.serialNumber || parsed.serial || "",
        hardwareId: parsed.hardwareId || parsed.hwId || "",
        deviceType: parsed.deviceType || parsed.type || "",
        raw: trimmed,
      };
    } catch (e) {
      // Not valid JSON, continue to other formats
    }
  }

  // Try pipe-delimited format: id|serial|hwId|type
  if (trimmed.includes("|")) {
    const parts = trimmed.split("|");
    return {
      deviceId: parts[0] || "",
      serialNumber: parts[1] || "",
      hardwareId: parts[2] || "",
      deviceType: parts[3] || "",
      raw: trimmed,
    };
  }

  // Plain serial number
  return {
    deviceId: "",
    serialNumber: trimmed,
    hardwareId: "",
    deviceType: "",
    raw: trimmed,
  };
};

export default function QRScanner({ isOpen, onClose, onScan }) {
  const [status, setStatus] = useState("initializing");
  const [error, setError] = useState(null);
  const [manualEntry, setManualEntry] = useState("");
  const [cameraPermission, setCameraPermission] = useState("prompt"); // prompt, granted, denied
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setStatus("initializing");
    setError(null);

    const initScanner = async () => {
      try {
        // Check for camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera not supported on this device");
        }

        // Create scanner instance
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        // Get available cameras
        const cameras = await Html5Qrcode.getCameras();
        if (cameras.length === 0) {
          throw new Error("No cameras found on this device");
        }

        // Prefer back camera on mobile
        const backCamera = cameras.find(
          (c) =>
            c.label.toLowerCase().includes("back") ||
            c.label.toLowerCase().includes("rear")
        );
        const cameraId = backCamera?.id || cameras[0].id;

        if (!mounted) return;

        setCameraPermission("granted");
        setStatus("scanning");

        // Start scanning
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1,
          },
          (decodedText) => {
            // QR code scanned successfully
            const parsed = parseQRContent(decodedText);
            onScan(parsed);
            handleClose();
          },
          (errorMessage) => {
            // Ignore continuous scanning errors (no QR in frame)
          }
        );
      } catch (err) {
        console.error("QR Scanner error:", err);
        if (!mounted) return;

        if (err.name === "NotAllowedError") {
          setCameraPermission("denied");
          setError("Camera access denied. Please allow camera access in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError(err.message || "Failed to start camera");
        }
        setStatus("error");
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initScanner, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current = null;
      }
    };
  }, [isOpen, onScan]);

  const handleClose = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
      html5QrCodeRef.current = null;
    }
    onClose();
  };

  const handleManualSubmit = () => {
    if (manualEntry.trim()) {
      const parsed = parseQRContent(manualEntry.trim());
      onScan(parsed);
      handleClose();
    }
  };

  const handleRetryCamera = () => {
    setCameraPermission("prompt");
    setError(null);
    setStatus("initializing");
    // Force re-init by closing and re-opening
    onClose();
    setTimeout(() => {
      // This would need parent to re-open, so we just reset state
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Scan Device QR Code</Title>
          <CloseButton onClick={handleClose}>&times;</CloseButton>
        </Header>

        {cameraPermission === "denied" ? (
          <CameraPermissionRequest>
            <div className="icon">No camera</div>
            <h4>Camera Access Required</h4>
            <p>
              Please enable camera access in your browser settings to scan QR codes, or use manual entry below.
            </p>
            <Button $variant="primary" onClick={handleRetryCamera}>
              Try Again
            </Button>
          </CameraPermissionRequest>
        ) : (
          <ScannerContainer>
            <div id="qr-reader" ref={scannerRef}></div>
            {status === "scanning" && <ScanOverlay />}
          </ScannerContainer>
        )}

        <StatusBar $error={!!error}>
          <StatusMessage $error={!!error}>
            {error
              ? error
              : status === "initializing"
              ? "Starting camera..."
              : status === "scanning"
              ? "Point camera at device QR code"
              : "Ready to scan"}
          </StatusMessage>
        </StatusBar>

        <ManualInput>
          <ManualInputLabel>
            Or enter serial number manually:
          </ManualInputLabel>
          <InputRow>
            <Input
              type="text"
              placeholder="e.g., SN-2024-001234"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleManualSubmit();
              }}
            />
            <Button
              $variant="primary"
              onClick={handleManualSubmit}
              disabled={!manualEntry.trim()}
            >
              Submit
            </Button>
          </InputRow>
        </ManualInput>

        <Footer>
          <Button onClick={handleClose}>Cancel</Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
