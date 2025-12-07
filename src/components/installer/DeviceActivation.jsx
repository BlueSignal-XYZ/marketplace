// Device Activation Component - Activate device after successful commission
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DeviceAPI, CustomerAPI, CommissionAPI } from "../../scripts/back_door";
import commissionService from "../../services/commissionService";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
`;

const SuccessHeader = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 12px;
  margin-bottom: 32px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: #ffffff;
`;

const SuccessTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #166534;
`;

const SuccessSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: #15803d;
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const TestResults = styled.div`
  display: grid;
  gap: 8px;
`;

const TestRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: ${(props) => (props.passed ? "#f0fdf4" : "#fef2f2")};
  border-radius: 6px;
`;

const TestName = styled.span`
  font-size: 13px;
  color: #374151;
`;

const TestStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.passed ? "#16a34a" : "#dc2626")};
`;

const ScoreCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${(props) =>
    props.score >= 90
      ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      : props.score >= 70
      ? "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const ScoreValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

const ScoreLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
`;

const CustomerSelect = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
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

const ActivatedBanner = styled.div`
  text-align: center;
  padding: 32px 20px;
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 12px;
  margin-top: 24px;
`;

const ActivatedIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const ActivatedText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #166534;
  margin-bottom: 8px;
`;

const ActivatedSubtext = styled.div`
  font-size: 14px;
  color: #15803d;
`;

const DeviceActivation = () => {
  const navigate = useNavigate();
  const { commissionId } = useParams();
  const { ACTIONS } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState(null);
  const [commission, setCommission] = useState(null);
  const [device, setDevice] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    loadData();
  }, [commissionId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load commission with context
      const commissionData = await commissionService.getCommissionWithContext(commissionId);
      setCommission(commissionData);

      // Load device
      if (commissionData?.deviceId) {
        const deviceData = await DeviceAPI.getDeviceDetails(commissionData.deviceId);
        setDevice(deviceData);

        // Check if already activated
        if (deviceData?.lifecycle === "active") {
          setActivated(true);
        }
      }

      // Pre-select customer from order
      if (commissionData?.order?.customerId) {
        setSelectedCustomer(commissionData.order.customerId);
      }

      // Load customers for dropdown
      const customerList = await CustomerAPI.list({ limit: 100 });
      setCustomers(customerList || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }

    setActivating(true);
    setError(null);

    try {
      await commissionService.activateDevice(device.id, selectedCustomer);
      setActivated(true);
      ACTIONS?.logNotification?.("success", "Device activated successfully!");
    } catch (err) {
      console.error("Failed to activate device:", err);
      setError(err.message || "Failed to activate device");
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading...</LoadingState>
      </PageContainer>
    );
  }

  if (!commission || !commission.result) {
    return (
      <PageContainer>
        <ErrorMessage>Commission result not found</ErrorMessage>
      </PageContainer>
    );
  }

  const isPassed = commission.status === "passed";
  const score = commission.result?.overallScore || 0;

  return (
    <PageContainer>
      <SuccessHeader>
        <SuccessIcon>{isPassed ? "check" : "!"}</SuccessIcon>
        <SuccessTitle>
          {isPassed ? "Commission Passed!" : "Commission Complete"}
        </SuccessTitle>
        <SuccessSubtitle>
          Device {device?.id} has {isPassed ? "passed" : "completed"} all checks
        </SuccessSubtitle>
      </SuccessHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Card>
        <CardHeader>
          <CardTitle>Commission Summary</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <ScoreCircle score={score}>
              <ScoreValue>{score}%</ScoreValue>
              <ScoreLabel>Score</ScoreLabel>
            </ScoreCircle>
          </div>

          <SummaryGrid>
            <SummaryItem>
              <SummaryLabel>Device</SummaryLabel>
              <SummaryValue>{device?.id}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Model</SummaryLabel>
              <SummaryValue>{device?.deviceType || "BlueSignal"}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Site</SummaryLabel>
              <SummaryValue>{commission.site?.name || "N/A"}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Duration</SummaryLabel>
              <SummaryValue>
                {commission.startedAt && commission.completedAt
                  ? `${Math.round(
                      (new Date(commission.completedAt) - new Date(commission.startedAt)) /
                        60000
                    )} min`
                  : "N/A"}
              </SummaryValue>
            </SummaryItem>
          </SummaryGrid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardBody>
          <TestResults>
            {commission.result?.tests?.map((test) => (
              <TestRow key={test.id} passed={test.status === "passed"}>
                <TestName>{test.name}</TestName>
                <TestStatus passed={test.status === "passed"}>
                  {test.status === "passed" ? "PASS" : "FAIL"}
                </TestStatus>
              </TestRow>
            ))}
          </TestResults>
        </CardBody>
      </Card>

      {!activated && isPassed && (
        <Card>
          <CardHeader>
            <CardTitle>Activate Device</CardTitle>
          </CardHeader>
          <CardBody>
            <CustomerSelect>
              <Label>Assign to Customer</Label>
              <Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </Select>
            </CustomerSelect>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Activating the device will bind it to the selected customer and enable
              dashboard access. This action cannot be undone.
            </p>
          </CardBody>
        </Card>
      )}

      {activated && (
        <ActivatedBanner>
          <ActivatedIcon>ok</ActivatedIcon>
          <ActivatedText>Device Activated!</ActivatedText>
          <ActivatedSubtext>
            The device is now online and accessible via the customer dashboard.
          </ActivatedSubtext>
        </ActivatedBanner>
      )}

      <ButtonGroup>
        {activated ? (
          <>
            <Button onClick={() => navigate("/commissions")}>
              Back to Commissions
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/cloud/devices/${device?.id}`)}
            >
              View Device
            </Button>
          </>
        ) : isPassed ? (
          <>
            <Button onClick={() => navigate("/commissions")}>Later</Button>
            <Button
              variant="success"
              onClick={handleActivate}
              disabled={activating || !selectedCustomer}
            >
              {activating ? "Activating..." : "Activate Device"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/commissions")}>
              Back to Commissions
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/commissions/${commissionId}`)}
            >
              Review & Retry
            </Button>
          </>
        )}
      </ButtonGroup>
    </PageContainer>
  );
};

export default DeviceActivation;
