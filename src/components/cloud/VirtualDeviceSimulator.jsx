import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { DeviceAPI } from '../../scripts/back_door';
import { useAppContext } from '../../context/AppContext';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SimulatorCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.ui800} 0%, ${({ theme }) => theme.colors.ui700} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.card}`};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: #fff;
`;

const SimHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SimTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ui100};
  margin: 0;
`;

const DevBadge = styled.span`
  padding: 3px 8px;
  background: ${({ theme }) => theme.colors.warning500};
  color: ${({ theme }) => theme.colors.ui800};
  font-size: 10px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SimDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.ui400};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SimButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme, $variant }) => $variant === 'primary'
    ? theme.gradients.primary
    : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  border: 1px solid ${({ theme, $variant }) => $variant === 'primary'
    ? theme.colors.primary500
    : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 13px;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  transition: ${({ theme }) => theme.transitions.default};
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const MiniSpinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const StatusText = styled.div`
  font-size: 13px;
  color: ${({ theme, $type }) =>
    $type === 'success' ? theme.colors.success300 :
    $type === 'error'   ? theme.colors.red300 :
                          theme.colors.ui400};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SIM_DEVICE_SERIAL = 'BS-0000-SIM001';

/**
 * VirtualDeviceSimulator
 *
 * Dev-mode component for creating a virtual device and generating
 * simulated readings. Uses the existing DeviceAPI.emulateDevice() endpoint.
 */
export default function VirtualDeviceSimulator() {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [creating, setCreating] = useState(false);
  const [emulating, setEmulating] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusType, setStatusType] = useState('info');

  const handleCreateSimDevice = async () => {
    if (!user?.uid) {
      setStatus('Sign in first');
      setStatusType('error');
      return;
    }

    setCreating(true);
    setStatus('Creating virtual device...');
    setStatusType('info');

    try {
      await DeviceAPI.addDevice({
        serialNumber: SIM_DEVICE_SERIAL,
        name: 'Virtual WQM-1 Simulator',
        type: 'buoy',
      });

      setStatus(`Virtual device ${SIM_DEVICE_SERIAL} created. It should appear in your devices list.`);
      setStatusType('success');
      ACTIONS?.logNotification?.('success', `Virtual device ${SIM_DEVICE_SERIAL} created`);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Failed to create device';
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        setStatus(`Device ${SIM_DEVICE_SERIAL} already exists. Ready to emulate.`);
        setStatusType('success');
      } else {
        setStatus(`Error: ${msg}`);
        setStatusType('error');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEmulate = async () => {
    setEmulating(true);
    setStatus('Starting device emulation (readings every 60s)...');
    setStatusType('info');

    try {
      await DeviceAPI.emulateDevice(SIM_DEVICE_SERIAL, 60);
      setStatus('Emulation started. The device will send readings every 60 seconds. Check Live Data tab on the device detail page.');
      setStatusType('success');
      ACTIONS?.logNotification?.('success', 'Device emulation started');
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Failed to start emulation';
      setStatus(`Error: ${msg}`);
      setStatusType('error');
    } finally {
      setEmulating(false);
    }
  };

  return (
    <SimulatorCard>
      <SimHeader>
        <SimTitle>Virtual Device Simulator</SimTitle>
        <DevBadge>Dev</DevBadge>
      </SimHeader>
      <SimDescription>
        Create a virtual WQM-1 device ({SIM_DEVICE_SERIAL}) and generate simulated sensor readings
        for testing the dashboard without physical hardware.
      </SimDescription>
      <ButtonRow>
        <SimButton
          $variant="primary"
          onClick={handleCreateSimDevice}
          disabled={creating}
        >
          {creating && <MiniSpinner />}
          {creating ? 'Creating...' : 'Create Virtual Device'}
        </SimButton>
        <SimButton
          onClick={handleEmulate}
          disabled={emulating}
        >
          {emulating && <MiniSpinner />}
          {emulating ? 'Starting...' : 'Start Emulation'}
        </SimButton>
      </ButtonRow>
      {status && <StatusText $type={statusType}>{status}</StatusText>}
    </SimulatorCard>
  );
}
