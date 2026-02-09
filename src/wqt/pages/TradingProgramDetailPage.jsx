import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { TradingProgramAPI, EnrollmentAPI, DeviceAPI } from '../../scripts/back_door';
import { useAppContext } from '../../context/AppContext';
import { db } from '../../apis/firebase';
import { ref, get, push, set } from 'firebase/database';
import {
  PageShell,
  ContentWrapper,
  SectionHeading,
  Card,
  StatusBadge,
  BackButton,
  PrimaryButton,
  LoadingContainer,
  Spinner,
  ErrorBanner,
  SuccessBanner,
  WarningBanner,
} from '../../styles/uiPrimitives';

/* ---- page-specific styled components ---- */

const ProgramCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProgramHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProgramTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px 0;
`;

const ProgramType = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  text-transform: capitalize;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const IncentiveCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.success50} 0%, ${({ theme }) => theme.colors.success100} 100%);
  border: 1px solid ${({ theme }) => theme.colors.success200};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: ${({ theme }) => theme.spacing.card};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IncentiveRate = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success800};
  margin-bottom: 4px;
`;

const IncentiveDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.success700};
  margin: 0;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgAlt};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const DetailLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DevicesSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DeviceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DeviceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme, $selected }) => $selected ? theme.colors.success50 : theme.colors.bgAlt};
  border: 2px solid ${({ theme, $selected }) => $selected ? theme.colors.success500 : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme, $selected }) => $selected ? theme.colors.success50 : theme.colors.ui100};
  }
`;

const DeviceName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DeviceMeta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const CheckMark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme, $checked }) => $checked ? theme.colors.success500 : theme.colors.ui200};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
`;

const SelectHint = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textMuted};

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

/* ---- component ---- */

export function TradingProgramDetailPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [program, setProgram] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgram();
    if (user?.uid) loadDevices();
  }, [programId, user?.uid]);

  const loadProgram = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        const response = await TradingProgramAPI.get(programId);
        if (response) {
          setProgram(response);
          setLoading(false);
          return;
        }
      } catch { /* Fall through */ }

      const programRef = ref(db, `tradingPrograms/${programId}`);
      const snapshot = await get(programRef);
      if (snapshot.exists()) {
        setProgram({ id: programId, ...snapshot.val() });
      }
    } catch (err) {
      console.error('Failed to load program:', err);
      setError('Unable to load program details.');
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await DeviceAPI.getDevices();
      const deviceList = response?.devices || [];
      setDevices(Array.isArray(deviceList) ? deviceList : []);
    } catch {
      setDevices([]);
    }
  };

  const toggleDevice = (deviceId) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleOptIn = async () => {
    if (selectedDevices.length === 0) return;
    setEnrolling(true);

    try {
      for (const deviceId of selectedDevices) {
        try {
          await EnrollmentAPI.create({
            userId: user.uid,
            deviceId,
            programId,
          });
        } catch {
          const enrollmentsRef = ref(db, 'enrollments');
          const newRef = push(enrollmentsRef);
          await set(newRef, {
            userId: user.uid,
            deviceId,
            programId,
            status: 'enrolled',
            enrolledAt: Date.now(),
            activatedAt: null,
            creditsGenerated: 0,
            creditsTraded: 0,
            creditsAvailable: 0,
          });
        }
      }

      setEnrolled(true);
      ACTIONS?.logNotification?.('success', `Successfully enrolled ${selectedDevices.length} device(s) in ${program.name}`);
    } catch (err) {
      console.error('Enrollment failed:', err);
      ACTIONS?.logNotification?.('error', 'Failed to enroll devices. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <ContentWrapper $maxWidth="900px">
          <LoadingContainer><Spinner /></LoadingContainer>
        </ContentWrapper>
      </PageShell>
    );
  }

  if (!program) {
    return (
      <PageShell>
        <ContentWrapper $maxWidth="900px">
          <BackButton onClick={() => navigate('/programs')}>Back to Programs</BackButton>
          <EmptyText>
            <h3>Program Not Found</h3>
            <p>This trading program does not exist or has been removed.</p>
          </EmptyText>
        </ContentWrapper>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ContentWrapper $maxWidth="900px">
        <BackButton onClick={() => navigate('/programs')}>
          ← Back to Programs
        </BackButton>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {enrolled && (
          <SuccessBanner>
            Your devices have been enrolled in this program. Credits will begin generating once enrollment is activated.
          </SuccessBanner>
        )}

        <ProgramCard>
          <ProgramHeader>
            <div>
              <ProgramTitle>{program.name}</ProgramTitle>
              <ProgramType>{program.type} trading program</ProgramType>
            </div>
            <StatusBadge $status={program.status}>{program.status}</StatusBadge>
          </ProgramHeader>

          {program.incentives?.ratePerUnit > 0 && (
            <IncentiveCard>
              <IncentiveRate>
                ${program.incentives.ratePerUnit}/{program.incentives.unit || 'unit'}
              </IncentiveRate>
              <IncentiveDescription>
                {program.incentives.description || 'Earn credits for qualifying water quality improvements'}
              </IncentiveDescription>
            </IncentiveCard>
          )}

          <Section>
            <SectionHeading>Program Details</SectionHeading>
            <DetailGrid>
              {program.requirements?.complianceStandard && (
                <DetailItem>
                  <DetailLabel>Compliance Standard</DetailLabel>
                  <DetailValue>{program.requirements.complianceStandard}</DetailValue>
                </DetailItem>
              )}
              {program.requirements?.minReadingFrequency && (
                <DetailItem>
                  <DetailLabel>Min Reading Frequency</DetailLabel>
                  <DetailValue>Every {program.requirements.minReadingFrequency}s</DetailValue>
                </DetailItem>
              )}
              {program.requirements?.minSensors && (
                <DetailItem>
                  <DetailLabel>Required Sensors</DetailLabel>
                  <DetailValue>
                    {Array.isArray(program.requirements.minSensors)
                      ? program.requirements.minSensors.join(', ')
                      : 'pH, TDS, Turbidity'}
                  </DetailValue>
                </DetailItem>
              )}
              {program.geography?.postalCodes && (
                <DetailItem>
                  <DetailLabel>Service Area</DetailLabel>
                  <DetailValue>
                    {program.geography.postalCodes.length} ZIP codes covered
                  </DetailValue>
                </DetailItem>
              )}
            </DetailGrid>
          </Section>
        </ProgramCard>

        {/* Device Opt-In Section */}
        {program.status === 'active' && (
          <DevicesSection>
            <SectionHeading>Enroll Your Devices</SectionHeading>

            {!user?.uid ? (
              <WarningBanner>
                <p>Sign in to enroll your monitoring devices in this trading program.</p>
                <PrimaryButton onClick={() => navigate('/')}>Sign In</PrimaryButton>
              </WarningBanner>
            ) : enrolled ? (
              <EmptyText>
                <p>Your selected devices are now enrolled. Visit the BlueSignal Cloud dashboard to monitor credit generation.</p>
              </EmptyText>
            ) : devices.length === 0 ? (
              <EmptyText>
                <h3>No Devices Found</h3>
                <p>Commission a device in BlueSignal Cloud first, then come back to enroll it in this program.</p>
              </EmptyText>
            ) : (
              <>
                <SelectHint>
                  Select the devices you want to enroll in this trading program.
                  Each device will begin generating credits once activated.
                </SelectHint>
                <DeviceList>
                  {devices.map(device => {
                    const id = device.id || device.serialNumber;
                    return (
                      <DeviceItem
                        key={id}
                        $selected={selectedDevices.includes(id)}
                        onClick={() => toggleDevice(id)}
                      >
                        <div>
                          <DeviceName>{device.name || device.serialNumber || id}</DeviceName>
                          <DeviceMeta>
                            {device.type || device.deviceType || 'WQM-1'} •{' '}
                            {device.installation?.status || device.lifecycle || 'Unknown status'}
                          </DeviceMeta>
                        </div>
                        <CheckMark $checked={selectedDevices.includes(id)}>
                          {selectedDevices.includes(id) ? '✓' : ''}
                        </CheckMark>
                      </DeviceItem>
                    );
                  })}
                </DeviceList>
                <PrimaryButton
                  $size="lg"
                  disabled={selectedDevices.length === 0 || enrolling}
                  onClick={handleOptIn}
                  style={{ width: '100%', marginTop: '24px' }}
                >
                  {enrolling
                    ? 'Enrolling...'
                    : selectedDevices.length === 0
                      ? 'Select devices to enroll'
                      : `Enroll ${selectedDevices.length} Device${selectedDevices.length > 1 ? 's' : ''}`}
                </PrimaryButton>
              </>
            )}
          </DevicesSection>
        )}
      </ContentWrapper>
    </PageShell>
  );
}
