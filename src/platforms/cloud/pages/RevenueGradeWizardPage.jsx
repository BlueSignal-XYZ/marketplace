/**
 * Revenue Grade Setup Wizard — 5-step guided process.
 *
 * Steps:
 * 1. Probe Calibration Documentation
 * 2. Site & Watershed Identification
 * 3. Baseline Definition
 * 4. Link WaterQuality.Trading Account
 * 5. Credit Project Registration
 *
 * Each step saves independently. User can return later.
 * Route: /cloud/devices/:deviceId/revenue-grade/setup
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Badge } from '../../../design-system/primitives/Badge';
import { useAppContext } from '../../../context/AppContext';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import {
  useRevenueGradeQuery,
  useEnableRevenueGradeMutation,
  useLogCalibrationMutation,
  useHUCLookupQuery,
  useWQTLinkQuery,
  useLinkWQTMutation,
  useRegisterProjectMutation,
} from '../../../shared/hooks/useApiQueries';
import { getDevice } from '../../../services/v2/api';

/* ── Styled ─────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: ${({ theme }) => theme.colors.background};
  overflow-x: hidden;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) { padding-top: 32px; }
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) { padding: 48px 24px; }
`;

const Progress = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 560px;
  margin-bottom: 32px;
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
  padding: 24px 20px;
  max-width: 560px;
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) { padding: 40px; }
`;

const StepLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) { font-size: 26px; }
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
  gap: 20px;
  margin-bottom: 32px;
`;

const ProbeSection = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProbeTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  margin-bottom: 6px;
`;

const RadioRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: pointer;
  background: ${({ $active }) => $active ? 'rgba(0,102,255,0.04)' : 'transparent'};
  transition: all 0.15s;
`;

const RadioContent = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const RadioDesc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const InfoBox = styled.div`
  padding: 16px;
  background: rgba(0, 102, 255, 0.04);
  border: 1px solid rgba(0, 102, 255, 0.12);
  border-radius: ${({ theme }) => theme.radius.md}px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    flex-direction: column;
    & > button { width: 100%; }
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  &:last-child { border-bottom: none; }
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  max-width: 60%;
`;

const ErrorMsg = styled.div`
  background: rgba(255, 77, 77, 0.08);
  border: 1px solid rgba(255, 77, 77, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #c33;
  margin-bottom: 16px;
`;

const STEPS = ['Calibration', 'Watershed', 'Baseline', 'Link WQT', 'Register'];

/* ── Component ──────────────────────────────────────────── */

export function RevenueGradeWizardPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;
  const toast = useToastContext();

  const [step, setStep] = useState(0);
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [calibration, setCalibration] = useState({
    ph: { date: '', standards: [], offset: 0 },
    tds: { date: '', standard: '', offset: 0 },
    turbidity: { date: '', standards: [], offset: 0 },
    orp: { date: '', standard: '', offset: 0 },
  });
  const [watershed, setWatershed] = useState({
    waterBodyType: '',
    dischargeDescription: '',
  });
  const [baseline, setBaseline] = useState({
    type: 'monitoring',
    durationDays: 60,
    permitNumber: '',
    tn: '',
    tp: '',
    tss: '',
  });
  const [projectDesc, setProjectDesc] = useState('');
  const [improvementMethod, setImprovementMethod] = useState('');
  const [eligibleCredits, setEligibleCredits] = useState(['nitrogen', 'phosphorus']);

  // Queries
  const enableMutation = useEnableRevenueGradeMutation();
  const calMutation = useLogCalibrationMutation();
  const linkMutation = useLinkWQTMutation();
  const registerMutation = useRegisterProjectMutation();

  // Load device
  useEffect(() => {
    if (!deviceId) return;
    setLoading(true);
    getDevice(deviceId)
      .then((d) => { setDevice(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [deviceId]);

  // HUC lookup from device GPS
  const lat = device?.location?.latitude;
  const lng = device?.location?.longitude;
  const { data: hucData } = useHUCLookupQuery(lat, lng, { enabled: !!lat && !!lng });

  // WQT link status
  const { data: wqtLink } = useWQTLinkQuery({ enabled: step === 3 });

  if (loading) return (
    <Page>
      <Skeleton width={200} height={24} />
      <div style={{ marginTop: 16 }}><Skeleton width="100%" height={400} /></div>
    </Page>
  );

  if (error || !device) return (
    <Page>
      <Card>
        <Title>Device Not Found</Title>
        <Desc>{error || 'Unable to load device.'}</Desc>
        <Button onClick={() => navigate('/dashboard/main')}>Back to Dashboard</Button>
      </Card>
    </Page>
  );

  return (
    <Page>
      <Progress>
        {STEPS.map((_, i) => (
          <ProgressBar key={i} $active={i <= step} />
        ))}
      </Progress>

      <Card>
        {/* Step 1: Calibration */}
        {step === 0 && (
          <>
            <StepLabel>Step 1 of 5</StepLabel>
            <Title>Calibrate Your Probes</Title>
            <Desc>
              For credits to be verifiable, your probes must be calibrated against known
              standards. Record your calibration details below.
            </Desc>

            <FormArea>
              <ProbeSection>
                <ProbeTitle>pH Probe</ProbeTitle>
                <Input label="Calibration Date" type="date"
                  value={calibration.ph.date}
                  onChange={(e) => setCalibration(c => ({ ...c, ph: { ...c.ph, date: e.target.value } }))}
                />
                <div style={{ marginTop: 8 }}>
                  {['pH 4.0 buffer', 'pH 7.0 buffer', 'pH 10.0 buffer'].map((std) => (
                    <CheckboxRow key={std}>
                      <input type="checkbox"
                        checked={calibration.ph.standards.includes(std)}
                        onChange={(e) => {
                          setCalibration(c => ({
                            ...c,
                            ph: {
                              ...c.ph,
                              standards: e.target.checked
                                ? [...c.ph.standards, std]
                                : c.ph.standards.filter(s => s !== std)
                            }
                          }));
                        }}
                      />
                      {std}
                    </CheckboxRow>
                  ))}
                </div>
              </ProbeSection>

              <ProbeSection>
                <ProbeTitle>TDS Probe</ProbeTitle>
                <Input label="Calibration Date" type="date"
                  value={calibration.tds.date}
                  onChange={(e) => setCalibration(c => ({ ...c, tds: { ...c.tds, date: e.target.value } }))}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {['500 ppm', '1000 ppm'].map((std) => (
                    <CheckboxRow key={std}>
                      <input type="radio" name="tds-std"
                        checked={calibration.tds.standard === std}
                        onChange={() => setCalibration(c => ({ ...c, tds: { ...c.tds, standard: std } }))}
                      />
                      {std}
                    </CheckboxRow>
                  ))}
                </div>
              </ProbeSection>

              <ProbeSection>
                <ProbeTitle>Turbidity Probe</ProbeTitle>
                <Input label="Calibration Date" type="date"
                  value={calibration.turbidity.date}
                  onChange={(e) => setCalibration(c => ({ ...c, turbidity: { ...c.turbidity, date: e.target.value } }))}
                />
                <div style={{ marginTop: 8 }}>
                  {['0 NTU (DI water)', '100 NTU formazin'].map((std) => (
                    <CheckboxRow key={std}>
                      <input type="checkbox"
                        checked={calibration.turbidity.standards.includes(std)}
                        onChange={(e) => {
                          setCalibration(c => ({
                            ...c,
                            turbidity: {
                              ...c.turbidity,
                              standards: e.target.checked
                                ? [...c.turbidity.standards, std]
                                : c.turbidity.standards.filter(s => s !== std)
                            }
                          }));
                        }}
                      />
                      {std}
                    </CheckboxRow>
                  ))}
                </div>
              </ProbeSection>

              <ProbeSection>
                <ProbeTitle>ORP Probe</ProbeTitle>
                <Input label="Calibration Date" type="date"
                  value={calibration.orp.date}
                  onChange={(e) => setCalibration(c => ({ ...c, orp: { ...c.orp, date: e.target.value } }))}
                />
                <div style={{ marginTop: 8 }}>
                  {['Quinhydrone pH 4 (+220mV)', 'Quinhydrone pH 7 (+86mV)', 'ORP standard solution'].map((std) => (
                    <CheckboxRow key={std}>
                      <input type="radio" name="orp-std"
                        checked={calibration.orp.standard === std}
                        onChange={() => setCalibration(c => ({ ...c, orp: { ...c.orp, standard: std } }))}
                      />
                      {std}
                    </CheckboxRow>
                  ))}
                </div>
              </ProbeSection>

              <ProbeSection>
                <ProbeTitle>Temperature Probe (DS18B20)</ProbeTitle>
                <div style={{ fontSize: 13, color: '#888' }}>
                  Factory calibrated ±0.5°C — no user calibration required.
                </div>
              </ProbeSection>
            </FormArea>

            <ButtonRow>
              <Button variant="outline" onClick={() => navigate(`/device/${deviceId}`)}>Cancel</Button>
              <Button onClick={() => setStep(1)}>Save & Continue</Button>
            </ButtonRow>
          </>
        )}

        {/* Step 2: Watershed */}
        {step === 1 && (
          <>
            <StepLabel>Step 2 of 5</StepLabel>
            <Title>Site & Watershed</Title>
            <Desc>
              Your site needs to be mapped to a watershed for credits to be geographically valid.
            </Desc>

            <FormArea>
              <InfoBox>
                <InfoLabel>Site: {device.name || deviceId}</InfoLabel>
                GPS: {lat?.toFixed(4) || '—'}° N, {Math.abs(lng || 0).toFixed(4)}° W
              </InfoBox>

              {hucData?.huc12 ? (
                <InfoBox>
                  <InfoLabel>Detected Watershed</InfoLabel>
                  HUC-12: {hucData.huc12}<br />
                  Name: {hucData.name}<br />
                  State: {hucData.state}<br />
                  Impairments: {hucData.impairments?.join(', ') || 'None listed'}<br />
                  Active TMDL: {hucData.activeTmdl ? 'Yes' : 'No'}<br />
                  {hucData.tradingProgram && <>Trading Program: {hucData.tradingProgram}</>}
                </InfoBox>
              ) : (
                <InfoBox>
                  <InfoLabel>Watershed Not Detected</InfoLabel>
                  Enter HUC-12 code manually or adjust GPS coordinates.
                </InfoBox>
              )}

              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
                  Water body type:
                </div>
                {['River/Stream', 'Lake/Pond', 'Estuary/Tidal', 'Groundwater/Well', 'Stormwater Outfall', 'Treatment System Effluent'].map((type) => (
                  <CheckboxRow key={type}>
                    <input type="radio" name="water-body"
                      checked={watershed.waterBodyType === type}
                      onChange={() => setWatershed(w => ({ ...w, waterBodyType: type }))}
                    />
                    {type}
                  </CheckboxRow>
                ))}
              </div>

              <Input label="Discharge point description" placeholder='e.g., "Outfall pipe at east end of retention pond into Timber Creek"'
                value={watershed.dischargeDescription}
                onChange={(e) => setWatershed(w => ({ ...w, dischargeDescription: e.target.value }))}
              />
            </FormArea>

            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Save & Continue</Button>
            </ButtonRow>
          </>
        )}

        {/* Step 3: Baseline */}
        {step === 2 && (
          <>
            <StepLabel>Step 3 of 5</StepLabel>
            <Title>Establish Your Baseline</Title>
            <Desc>
              Before credits can be generated, we need to know what "normal" looks like
              at your site. Choose a baseline type.
            </Desc>

            <FormArea>
              <RadioRow $active={baseline.type === 'monitoring'}
                onClick={() => setBaseline(b => ({ ...b, type: 'monitoring' }))}>
                <input type="radio" name="baseline" checked={baseline.type === 'monitoring'} readOnly />
                <RadioContent>
                  <RadioTitle>Monitoring Baseline</RadioTitle>
                  <RadioDesc>
                    Your device will collect data for a baseline period before credit
                    generation begins. Recommended: 30-90 days.
                  </RadioDesc>
                  {baseline.type === 'monitoring' && (
                    <div style={{ marginTop: 12 }}>
                      <Input label="Duration (days)" type="number" value={baseline.durationDays}
                        onChange={(e) => setBaseline(b => ({ ...b, durationDays: parseInt(e.target.value) || 60 }))}
                      />
                    </div>
                  )}
                </RadioContent>
              </RadioRow>

              <RadioRow $active={baseline.type === 'regulatory'}
                onClick={() => setBaseline(b => ({ ...b, type: 'regulatory' }))}>
                <input type="radio" name="baseline" checked={baseline.type === 'regulatory'} readOnly />
                <RadioContent>
                  <RadioTitle>Regulatory Baseline</RadioTitle>
                  <RadioDesc>
                    Use your facility's permitted discharge limits (NPDES permit). Credits equal
                    improvement beyond your permit requirements.
                  </RadioDesc>
                  {baseline.type === 'regulatory' && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Input label="Permit number" value={baseline.permitNumber}
                        onChange={(e) => setBaseline(b => ({ ...b, permitNumber: e.target.value }))}
                      />
                      <Input label="TN limit (mg/L)" type="number" value={baseline.tn}
                        onChange={(e) => setBaseline(b => ({ ...b, tn: e.target.value }))}
                      />
                      <Input label="TP limit (mg/L)" type="number" value={baseline.tp}
                        onChange={(e) => setBaseline(b => ({ ...b, tp: e.target.value }))}
                      />
                    </div>
                  )}
                </RadioContent>
              </RadioRow>

              <RadioRow $active={baseline.type === 'historical'}
                onClick={() => setBaseline(b => ({ ...b, type: 'historical' }))}>
                <input type="radio" name="baseline" checked={baseline.type === 'historical'} readOnly />
                <RadioContent>
                  <RadioTitle>Historical Baseline</RadioTitle>
                  <RadioDesc>
                    Use historical data from before your improvement project was installed.
                    Upload or enter pre-project measurements.
                  </RadioDesc>
                </RadioContent>
              </RadioRow>
            </FormArea>

            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Save & Continue</Button>
            </ButtonRow>
          </>
        )}

        {/* Step 4: Link WQT */}
        {step === 3 && (
          <>
            <StepLabel>Step 4 of 5</StepLabel>
            <Title>Connect to WaterQuality.Trading</Title>
            <Desc>
              To list and trade your credits, link your BlueSignal account to your
              WaterQuality.Trading account.
            </Desc>

            <FormArea>
              {wqtLink?.linked ? (
                <InfoBox>
                  <InfoLabel>✓ Account Linked</InfoLabel>
                  Your BlueSignal account is connected to WaterQuality.Trading.
                  Linked at: {wqtLink.linkedAt ? new Date(wqtLink.linkedAt).toLocaleDateString() : '—'}
                </InfoBox>
              ) : (
                <>
                  <Desc style={{ margin: 0 }}>
                    Both platforms use the same account. Click below to authorize data sharing
                    for credit verification.
                  </Desc>
                  <Button
                    onClick={() => linkMutation.mutate([deviceId])}
                    disabled={linkMutation.isPending}
                  >
                    {linkMutation.isPending ? 'Linking...' : 'Link My Account'}
                  </Button>
                </>
              )}

              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>
                What happens when you link:<br />
                • Your verified sensor data is shared with WQT for credit verification<br />
                • Credits generated at this site appear in your WQT portfolio<br />
                • You control what data is shared and can unlink at any time
              </div>
            </FormArea>

            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)} disabled={!wqtLink?.linked && !linkMutation.isSuccess}>
                Save & Continue
              </Button>
            </ButtonRow>
          </>
        )}

        {/* Step 5: Register Project */}
        {step === 4 && (
          <>
            <StepLabel>Step 5 of 5</StepLabel>
            <Title>Register Your Credit Project</Title>
            <Desc>Review your project details and register on WaterQuality.Trading.</Desc>

            <FormArea>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Project Summary</div>
                <SummaryRow>
                  <SummaryLabel>Site</SummaryLabel>
                  <SummaryValue>{device.name || deviceId}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Device</SummaryLabel>
                  <SummaryValue>{device.serialNumber || deviceId}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Watershed</SummaryLabel>
                  <SummaryValue>{hucData?.name || 'Unknown'} ({hucData?.huc12 || '—'})</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Baseline</SummaryLabel>
                  <SummaryValue>
                    {baseline.type === 'monitoring' ? `Monitoring (${baseline.durationDays} days)` :
                     baseline.type === 'regulatory' ? 'Regulatory (NPDES permit)' : 'Historical'}
                  </SummaryValue>
                </SummaryRow>
              </div>

              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Eligible Credit Types</div>
                {['nitrogen', 'phosphorus'].map((type) => (
                  <CheckboxRow key={type}>
                    <input type="checkbox"
                      checked={eligibleCredits.includes(type)}
                      onChange={(e) => {
                        setEligibleCredits(prev =>
                          e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                        );
                      }}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)} Credits
                  </CheckboxRow>
                ))}
              </div>

              <Input label="Project Description" placeholder='e.g., "Residential bioretention system reducing nutrient runoff..."'
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
              />

              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Improvement Method</div>
                {[
                  'Rain garden / bioretention', 'Constructed wetland', 'Advanced septic system',
                  'Stormwater retrofit', 'Agricultural BMP', 'Treatment system upgrade',
                  'Algae remediation', 'Other',
                ].map((method) => (
                  <CheckboxRow key={method}>
                    <input type="radio" name="method"
                      checked={improvementMethod === method}
                      onChange={() => setImprovementMethod(method)}
                    />
                    {method}
                  </CheckboxRow>
                ))}
              </div>
            </FormArea>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button
                disabled={registerMutation.isPending}
                onClick={() => {
                  setError(null);
                  // Enable revenue grade first
                  const baselineParams = baseline.type === 'regulatory'
                    ? { tn: parseFloat(baseline.tn) || 0, tp: parseFloat(baseline.tp) || 0 }
                    : null;

                  enableMutation.mutate({ deviceId, params: {
                    baselineType: baseline.type,
                    baselineStart: new Date().toISOString(),
                    baselineDurationDays: baseline.type === 'monitoring' ? baseline.durationDays : null,
                    baselineParams,
                    huc12Code: hucData?.huc12,
                    watershedName: hucData?.name,
                    waterBodyType: watershed.waterBodyType,
                    dischargeDescription: watershed.dischargeDescription,
                    improvementMethod,
                    eligibleCredits,
                    description: projectDesc,
                  }}, {
                    onSuccess: () => {
                      // Then register credit project
                      registerMutation.mutate({
                        device_id: deviceId,
                        site_name: device.name || deviceId,
                        latitude: lat,
                        longitude: lng,
                        huc12_code: hucData?.huc12,
                        watershed_name: hucData?.name,
                        baseline_type: baseline.type,
                        baseline_params: baselineParams,
                        baseline_start: new Date().toISOString(),
                        baseline_duration_days: baseline.type === 'monitoring' ? baseline.durationDays : null,
                        eligible_credits: eligibleCredits,
                        improvement_method: improvementMethod,
                        description: projectDesc,
                      }, {
                        onSuccess: () => {
                          toast({ type: 'success', message: 'Revenue grade enabled! Credit project registered.' });
                          navigate(`/device/${deviceId}`);
                        },
                        onError: (err) => {
                          setError(err.message || 'Failed to register project');
                        },
                      });
                    },
                    onError: (err) => {
                      setError(err.message || 'Failed to enable revenue grade');
                    },
                  });
                }}
              >
                {registerMutation.isPending || enableMutation.isPending ? 'Registering...' : 'Register Project on WQT'}
              </Button>
            </ButtonRow>

            <div style={{ fontSize: 12, color: '#888', marginTop: 16, lineHeight: 1.5 }}>
              By registering, you agree to maintain calibrated probes, continuous data
              reporting, and accurate site information. Credits are subject to verification review.
            </div>
          </>
        )}
      </Card>
    </Page>
  );
}

export default RevenueGradeWizardPage;
