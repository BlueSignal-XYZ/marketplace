/**
 * Cloud Commissioning Wizard — full-screen step-by-step device setup.
 * Steps: Scan → Connect → Calibrate → Location → Confirm
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: ${({ theme }) => theme.colors.background};
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
  padding: 48px;
  max-width: 480px;
  width: 100%;
  text-align: center;
`;

const StepIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
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
  margin-bottom: 32px;
  text-align: left;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $connected, theme }) => ($connected ? '#00C48C' : theme.colors.primary)};
  animation: ${pulse} 2s ease-in-out infinite;
  margin: 0 auto 16px;
`;

const StatusText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const STEPS = ['Scan', 'Connect', 'Calibrate', 'Location', 'Confirm'];

export function CommissioningWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    serialNumber: '',
    deviceName: '',
    latitude: '',
    longitude: '',
    siteName: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Page>
      <Progress>
        {STEPS.map((_, i) => (
          <ProgressBar key={i} $active={i <= step} />
        ))}
      </Progress>

      <Card>
        {step === 0 && (
          <>
            <StepIcon>📡</StepIcon>
            <Title>Scan Device</Title>
            <Desc>Enter or scan the serial number from your BlueSignal WQM-1 device.</Desc>
            <FormArea>
              <Input
                label="Serial Number"
                value={form.serialNumber}
                onChange={(e) => update('serialNumber', e.target.value)}
                placeholder="e.g. BS-WQM-1042"
              />
            </FormArea>
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate('/dashboard/main')}>Cancel</Button>
              <Button onClick={() => setStep(1)} disabled={!form.serialNumber}>Next</Button>
            </ButtonRow>
          </>
        )}

        {step === 1 && (
          <>
            <StatusDot $connected={false} />
            <Title>Connecting…</Title>
            <Desc>Establishing connection to {form.serialNumber || 'device'}. Make sure the device is powered on and in range.</Desc>
            <StatusText>Searching for device via LTE-M / BLE…</StatusText>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Simulate Connect</Button>
            </ButtonRow>
          </>
        )}

        {step === 2 && (
          <>
            <StepIcon>🔧</StepIcon>
            <Title>Calibrate Sensors</Title>
            <Desc>
              Follow the on-screen instructions to calibrate each sensor.
              This typically takes 2-3 minutes.
            </Desc>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#666' }}>pH Sensor</span>
                <span style={{ fontSize: 13, color: '#00C48C', fontWeight: 600 }}>✓ Calibrated</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#666' }}>TDS Sensor</span>
                <span style={{ fontSize: 13, color: '#00C48C', fontWeight: 600 }}>✓ Calibrated</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#666' }}>Turbidity Sensor</span>
                <span style={{ fontSize: 13, color: '#0066FF', fontWeight: 600 }}>Calibrating…</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#666' }}>Temperature Sensor</span>
                <span style={{ fontSize: 13, color: '#999' }}>Waiting</span>
              </div>
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </ButtonRow>
          </>
        )}

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
              <Button onClick={() => setStep(4)}>Review</Button>
            </ButtonRow>
          </>
        )}

        {step === 4 && (
          <>
            <StepIcon>✅</StepIcon>
            <Title>Ready to Go</Title>
            <Desc>Your device is configured and will begin collecting data immediately.</Desc>
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              {[
                ['Serial', form.serialNumber],
                ['Name', form.deviceName || '—'],
                ['Site', form.siteName || '—'],
                ['Location', `${form.latitude || '—'}, ${form.longitude || '—'}`],
                ['Sensors', '4 calibrated'],
                ['Network', 'LTE-M connected'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 }}>
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => navigate('/dashboard/main')}>Activate Device</Button>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
}
