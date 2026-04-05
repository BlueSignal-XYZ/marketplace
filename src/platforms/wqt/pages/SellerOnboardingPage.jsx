/**
 * WQT Seller Onboarding — 5-step guided wizard.
 * Steps: Welcome → Organization → Verification → Devices → Review
 */

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import { Badge } from '../../../design-system/primitives/Badge';
import { useToastContext } from '../../../shared/providers/ToastProvider';
const Page = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Progress = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  transition: background 0.2s;
`;

const StepLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const InfoBox = styled.div`
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.primary}08`};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  border-radius: ${({ theme }) => theme.radius.md}px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin-bottom: 24px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const ReviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
`;

const ReviewLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReviewValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const STEPS = ['Welcome', 'Organization', 'Verification', 'Devices', 'Review'];

export function SellerOnboardingPage() {
  useEffect(() => { document.title = 'Seller Onboarding — WaterQuality.Trading'; }, []);
  const { toast } = useToastContext();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    orgName: '',
    orgType: '',
    contactName: '',
    contactEmail: '',
    region: '',
    programId: '',
    verificationMethod: 'sensor',
    deviceCount: '',
    acceptTerms: false,
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Page>
      <Progress>
        {STEPS.map((_, i) => (
          <ProgressBar key={i} $active={i <= step} />
        ))}
      </Progress>

      <StepLabel>Step {step + 1} of {STEPS.length}</StepLabel>

      <Card>
        {step === 0 && (
          <>
            <Title>Become a Seller</Title>
            <Desc>
              List your verified environmental credits on WaterQuality.Trading.
              Our sensor-verified marketplace is designed for trust and transparency.
            </Desc>
            <InfoBox>
              <strong>Quality Commitment:</strong> All credits listed on WQT undergo verification.
              Sensor-verified credits receive the highest trust rating and command premium prices.
              Credits backed by BlueSignal WQM-1 devices are automatically sensor-verified.
            </InfoBox>
            <ButtonRow>
              <Button onClick={() => setStep(1)}>Get Started</Button>
            </ButtonRow>
          </>
        )}

        {step === 1 && (
          <>
            <Title>Organization Details</Title>
            <Desc>Tell us about your organization or operation.</Desc>
            <FormGrid>
              <Input label="Organization Name" value={form.orgName} onChange={(e) => update('orgName', e.target.value)} placeholder="e.g. EcoRestore LLC" />
              <FormRow>
                <Input label="Organization Type" value={form.orgType} onChange={(e) => update('orgType', e.target.value)} placeholder="e.g. Farm, Municipality, NGO" />
                <Input label="Region" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="e.g. Virginia - James River" />
              </FormRow>
              <FormRow>
                <Input label="Contact Name" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Your name" />
                <Input label="Contact Email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="you@org.com" />
              </FormRow>
            </FormGrid>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </ButtonRow>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Verification Method</Title>
            <Desc>How will your credits be verified? Higher verification levels command better prices.</Desc>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { id: 'sensor', label: 'Sensor Verified', desc: 'BlueSignal WQM-1 device data. Highest trust.', badge: 'verified' },
                { id: 'third-party', label: 'Third-Party Verified', desc: 'Independent lab or auditor verification.', badge: 'positive' },
                { id: 'self-reported', label: 'Self-Reported', desc: 'Manual reporting. Subject to review.', badge: 'warning' },
              ].map((opt) => (
                <CheckItem key={opt.id} onClick={() => update('verificationMethod', opt.id)}>
                  <input type="radio" checked={form.verificationMethod === opt.id} readOnly />
                  <div>
                    <div style={{ fontWeight: 600 }}>{opt.label} <Badge variant={opt.badge} size="sm">{opt.badge === 'verified' ? 'Premium' : opt.badge === 'positive' ? 'Standard' : 'Basic'}</Badge></div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </CheckItem>
              ))}
            </div>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </ButtonRow>
          </>
        )}

        {step === 3 && (
          <>
            <Title>Device Setup</Title>
            <Desc>If using sensor verification, tell us about your monitoring devices.</Desc>
            {form.verificationMethod === 'sensor' ? (
              <FormGrid>
                <Input label="Number of Devices" type="number" value={form.deviceCount} onChange={(e) => update('deviceCount', e.target.value)} placeholder="e.g. 2" />
                <InfoBox>
                  Each BlueSignal WQM-1 device will be registered and linked to your account.
                  Device data feeds directly into the verification pipeline.
                </InfoBox>
              </FormGrid>
            ) : (
              <InfoBox>
                Without sensor verification, your credits will require manual review before listing.
                Consider upgrading to BlueSignal WQM-1 for automated, premium-priced verification.
              </InfoBox>
            )}
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Review Application</Button>
            </ButtonRow>
          </>
        )}

        {step === 4 && (
          <>
            <Title>Review & Submit</Title>
            <Desc>Please review your seller application before submitting.</Desc>
            <div style={{ marginBottom: 24 }}>
              <ReviewRow><ReviewLabel>Organization</ReviewLabel><ReviewValue>{form.orgName || '—'}</ReviewValue></ReviewRow>
              <ReviewRow><ReviewLabel>Type</ReviewLabel><ReviewValue>{form.orgType || '—'}</ReviewValue></ReviewRow>
              <ReviewRow><ReviewLabel>Region</ReviewLabel><ReviewValue>{form.region || '—'}</ReviewValue></ReviewRow>
              <ReviewRow><ReviewLabel>Contact</ReviewLabel><ReviewValue>{form.contactName || '—'}</ReviewValue></ReviewRow>
              <ReviewRow><ReviewLabel>Email</ReviewLabel><ReviewValue>{form.contactEmail || '—'}</ReviewValue></ReviewRow>
              <ReviewRow><ReviewLabel>Verification</ReviewLabel><ReviewValue>{form.verificationMethod}</ReviewValue></ReviewRow>
              {form.verificationMethod === 'sensor' && (
                <ReviewRow><ReviewLabel>Devices</ReviewLabel><ReviewValue>{form.deviceCount || '—'}</ReviewValue></ReviewRow>
              )}
            </div>
            <CheckItem>
              <input type="checkbox" checked={form.acceptTerms} onChange={(e) => update('acceptTerms', e.target.checked)} />
              <span style={{ fontSize: 13 }}>
                I agree to the WQT Seller Terms and understand that submitted credits are subject to verification review.
              </span>
            </CheckItem>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button disabled={!form.acceptTerms} onClick={() => toast({ type: 'success', message: 'Application submitted! We\'ll review and get back to you.' })}>
                Submit Application
              </Button>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
}

export default SellerOnboardingPage;
