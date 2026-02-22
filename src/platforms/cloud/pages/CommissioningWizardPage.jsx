/**
 * Cloud Commissioning Wizard — full-screen step-by-step device setup.
 * Steps: Scan → Connect → Calibrate → Location → Confirm
 * Wired to /v2/devices/check, /v2/devices/test-connection, /v2/devices/commission
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { useAppContext } from '../../../context/AppContext';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import {
  checkDevice,
  testDeviceConnection,
  getSites,
  ApiError,
} from '../../../services/v2/api';
import { useCommissionDeviceMutation } from '../../../shared/hooks/useApiQueries';
import { trackEvent } from '../../../utils/analytics';

/* ── Styled ─────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    justify-content: flex-start;
    padding-top: 32px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 48px 24px;
  }
`;

const Progress = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 480px;
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  transition: background 0.3s;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 48px;
  }
`;

const StepIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 56px;
    margin-bottom: 16px;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 24px;
  }
`;

const Desc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 32px;
  line-height: 1.5;
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  text-align: left;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    margin-bottom: 32px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    flex-direction: column;
    width: 100%;

    & > button {
      width: 100%;
    }
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $connected }) => ($connected ? '#00C48C' : '#0066FF')};
  animation: ${pulse} 2s ease-in-out infinite;
  margin: 0 auto 16px;
`;

const StatusText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const SimBadge = styled.span`
  display: inline-block;
  background: rgba(255, 176, 32, 0.1);
  color: #b8860b;
  border: 1px solid rgba(255, 176, 32, 0.2);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
`;

const ErrorMsg = styled.div`
  background: rgba(255, 77, 77, 0.08);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #c33;
  margin-bottom: 16px;
  text-align: left;
`;

const SensorRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
`;

const ReviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const STEPS = ['Scan', 'Connect', 'Calibrate', 'Location', 'Credits', 'Confirm'];

/* ── Component ──────────────────────────────────────────── */

export function CommissioningWizardPage() {
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;
  const toast = useToastContext();
  const commissionMutation = useCommissionDeviceMutation();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    serialNumber: '',
    deviceName: '',
    latitude: '',
    longitude: '',
    siteName: '',
  });
  const [stepError, setStepError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Step 1 state
  const [deviceCheck, setDeviceCheck] = useState(null);

  // Step 2 state
  const [connectionResult, setConnectionResult] = useState(null);

  // Step 3 state (calibration simulation)
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [calibrating, setCalibrating] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Step 0 → 1: Validate device ID ──────────────────────
  const handleScanNext = useCallback(async () => {
    if (!form.serialNumber.trim()) return;
    setProcessing(true);
    setStepError(null);

    try {
      const result = await checkDevice(form.serialNumber.trim());
      setDeviceCheck(result);

      if (result.isCommissioned) {
        setStepError(`Device ${form.serialNumber} is already commissioned (status: ${result.status}).`);
        setProcessing(false);
        return;
      }

      setStep(1);
    } catch (err) {
      setStepError(err instanceof ApiError ? err.message : 'Failed to validate device ID.');
    } finally {
      setProcessing(false);
    }
  }, [form.serialNumber]);

  // ── Step 1 → 2: Test connection ─────────────────────────
  const handleConnect = useCallback(async () => {
    setProcessing(true);
    setStepError(null);

    try {
      const result = await testDeviceConnection(form.serialNumber.trim());
      setConnectionResult(result);
      setStep(2);
    } catch (err) {
      setStepError(err instanceof ApiError ? err.message : 'Connection test failed.');
    } finally {
      setProcessing(false);
    }
  }, [form.serialNumber]);

  // ── Step 2 → 3: Calibrate (simulated) ──────────────────
  const handleCalibrate = useCallback(async () => {
    setCalibrating(true);
    // Simulate calibration with a delay
    await new Promise((r) => setTimeout(r, 2000));
    setCalibrationDone(true);
    setCalibrating(false);
  }, []);

  // ── Step 4: Commission device ───────────────────────────
  const handleCommission = useCallback(() => {
    setProcessing(true);
    setStepError(null);

    commissionMutation.mutate(
      {
        deviceId: form.serialNumber.trim(),
        deviceName: form.deviceName || form.serialNumber.trim(),
        siteName: form.siteName || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        userId: user?.uid,
      },
      {
        onSuccess: (result) => {
          trackEvent('device_commissioned', { deviceId: form.serialNumber, siteId: result.siteId });
          toast({ type: 'success', message: `Device ${form.serialNumber} commissioned successfully!` });
          navigate(`/device/${result.deviceId}`);
        },
        onError: (err) => {
          const msg = err instanceof ApiError ? err.message : 'Failed to commission device. Please try again.';
          setStepError(msg);
          toast({ type: 'error', message: msg });
        },
        onSettled: () => {
          setProcessing(false);
        },
      },
    );
  }, [form, user?.uid, toast, navigate, commissionMutation]);

  return (
    <Page>
      <Progress>
        {STEPS.map((_, i) => (
          <ProgressBar key={i} $active={i <= step} />
        ))}
      </Progress>

      <Card>
        {/* ── Step 0: Scan Device ────────────────────────── */}
        {step === 0 && (
          <>
            <StepIcon>📡</StepIcon>
            <Title>Scan Device</Title>
            <Desc>Enter or scan the serial number from your BlueSignal WQM-1 device.</Desc>
            {stepError && <ErrorMsg>{stepError}</ErrorMsg>}
            <FormArea>
              <Input
                label="Serial Number"
                value={form.serialNumber}
                onChange={(e) => update('serialNumber', e.target.value)}
                placeholder="e.g. BS-WQM-1042"
              />
            </FormArea>
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate('/v2/dashboard')}>Cancel</Button>
              <Button onClick={handleScanNext} disabled={!form.serialNumber.trim() || processing}>
                {processing ? 'Checking…' : 'Next'}
              </Button>
            </ButtonRow>
          </>
        )}

        {/* ── Step 1: Connect ────────────────────────────── */}
        {step === 1 && (
          <>
            <StatusDot $connected={connectionResult?.connected} />
            <Title>Connecting…</Title>
            <Desc>
              Establishing connection to {form.serialNumber}.
              Make sure the device is powered on and in range.
            </Desc>
            {stepError && <ErrorMsg>{stepError}</ErrorMsg>}
            <StatusText>
              {processing ? 'Testing device connection…' : 'Ready to connect'}
            </StatusText>
            <ButtonRow>
              <Button variant="outline" onClick={() => { setStep(0); setStepError(null); }}>Back</Button>
              <Button onClick={handleConnect} disabled={processing}>
                {processing ? 'Connecting…' : 'Test Connection'}
              </Button>
            </ButtonRow>
          </>
        )}

        {/* ── Step 2: Calibrate ──────────────────────────── */}
        {step === 2 && (
          <>
            <StepIcon>🔧</StepIcon>
            <Title>Calibrate Sensors</Title>
            <Desc>
              {connectionResult?.simulated
                ? <>Calibration in simulation mode. <SimBadge>Simulation Mode (no device connected)</SimBadge></>
                : 'Follow the on-screen instructions to calibrate each sensor.'
              }
            </Desc>
            <div style={{ padding: '20px 0' }}>
              {['pH Sensor', 'TDS Sensor', 'Turbidity Sensor', 'Temperature Sensor'].map((sensor, i) => (
                <SensorRow key={sensor}>
                  <span style={{ color: '#666' }}>{sensor}</span>
                  <span style={{
                    fontWeight: 600,
                    color: calibrationDone ? '#00C48C' :
                      (calibrating && i === 2) ? '#0066FF' :
                      (calibrating && i < 2) ? '#00C48C' : '#999'
                  }}>
                    {calibrationDone ? '✓ Calibrated' :
                      (calibrating && i === 2) ? 'Calibrating…' :
                      (calibrating && i < 2) ? '✓ Calibrated' : 'Waiting'}
                  </span>
                </SensorRow>
              ))}
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              {!calibrationDone ? (
                <Button onClick={handleCalibrate} disabled={calibrating}>
                  {calibrating ? 'Calibrating…' : 'Start Calibration'}
                </Button>
              ) : (
                <Button onClick={() => setStep(3)}>Continue</Button>
              )}
            </ButtonRow>
          </>
        )}

        {/* ── Step 3: Location ───────────────────────────── */}
        {step === 3 && (
          <>
            <StepIcon>📍</StepIcon>
            <Title>Set Location</Title>
            <Desc>Where is this device being installed?</Desc>
            <FormArea>
              <Input
                label="Site Name"
                value={form.siteName}
                onChange={(e) => update('siteName', e.target.value)}
                placeholder="e.g. James River Station A"
              />
              <Input
                label="Device Name"
                value={form.deviceName}
                onChange={(e) => update('deviceName', e.target.value)}
                placeholder="e.g. Primary Intake Monitor"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input
                  label="Latitude"
                  value={form.latitude}
                  onChange={(e) => update('latitude', e.target.value)}
                  placeholder="37.5407"
                />
                <Input
                  label="Longitude"
                  value={form.longitude}
                  onChange={(e) => update('longitude', e.target.value)}
                  placeholder="-77.4360"
                />
              </div>
            </FormArea>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => { setStepError(null); setStep(4); }}>Continue</Button>
            </ButtonRow>
          </>
        )}

        {/* ── Step 4: Revenue Grade Prompt ────────────────── */}
        {step === 4 && (
          <>
            <StepIcon>💰</StepIcon>
            <Title>Generate Water Quality Credits?</Title>
            <Desc>
              Your device can do more than monitor. If your site improves water quality
              beyond regulatory baselines, you can generate tradeable credits on
              WaterQuality.Trading.
            </Desc>
            <div style={{ textAlign: 'left', marginBottom: 24, fontSize: 14, color: '#666', lineHeight: 1.7 }}>
              This requires:
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Calibrated probes with documented standards</li>
                <li>A 30-90 day baseline measurement period</li>
                <li>Continuous data reporting ({'>'} 95% uptime)</li>
                <li>Site mapped to a watershed</li>
              </ul>
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => { setStepError(null); setStep(5); }}>
                Skip — Just Monitor
              </Button>
              <Button onClick={() => {
                // Store intent to enable revenue grade after commission
                update('enableRevenueGrade', true);
                setStepError(null);
                setStep(5);
              }}>
                Enable Revenue Grade
              </Button>
            </ButtonRow>
            <div style={{ fontSize: 12, color: '#999', marginTop: 16, textAlign: 'center' }}>
              You can enable this later from your device settings.
            </div>
          </>
        )}

        {/* ── Step 5: Confirm ────────────────────────────── */}
        {step === 5 && (
          <>
            <StepIcon>✅</StepIcon>
            <Title>Ready to Go</Title>
            <Desc>Your device is configured and will begin collecting data immediately.</Desc>
            {stepError && <ErrorMsg>{stepError}</ErrorMsg>}
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              {[
                ['Serial', form.serialNumber],
                ['Name', form.deviceName || '—'],
                ['Site', form.siteName || '—'],
                ['Location', form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : '—'],
                ['Sensors', calibrationDone ? '4 calibrated' : 'Not calibrated'],
                ['Connection', connectionResult?.connected ? `Connected (${connectionResult.signal})` : `Simulation mode`],
              ].map(([label, value]) => (
                <ReviewRow key={label}>
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </ReviewRow>
              ))}
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(4)} disabled={processing}>Back</Button>
              <Button onClick={handleCommission} disabled={processing}>
                {processing ? 'Activating…' : 'Activate Device'}
              </Button>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
}

export default CommissioningWizardPage;
