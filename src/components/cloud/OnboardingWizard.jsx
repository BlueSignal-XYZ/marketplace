// /src/components/cloud/OnboardingWizard.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { UserProfileAPI } from '../../scripts/back_door';
import { ButtonPrimary, ButtonSecondary } from '../shared/button/Button';
import { Input } from '../shared/input/Input';

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors?.background || '#FAFAFA'};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors?.surface || '#FFFFFF'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E5E7EB'};
  border-radius: ${({ theme }) => theme.radius?.lg || 16}px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors?.background || '#FAFAFA'};
`;

const ProgressStep = styled.div`
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 12px;
  font-weight: 600;
  color: ${({ $active, $completed, theme }) =>
    $active
      ? theme.colors?.primary || '#0066FF'
      : $completed
        ? theme.colors?.primary || '#0066FF'
        : theme.colors?.textMuted || '#9CA3AF'};
  border-bottom: 3px solid
    ${({ $active, $completed, theme }) =>
      $active
        ? theme.colors?.primary || '#0066FF'
        : $completed
          ? theme.colors?.accent || '#06B6D4'
          : 'transparent'};
  transition: all 0.2s ease-out;
`;

const Content = styled.div`
  padding: 32px;
`;

const StepTitle = styled.h2`
  margin: 0 0 8px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
`;

const StepDescription = styled.p`
  margin: 0 0 32px;
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  line-height: 1.6;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RoleCard = styled.button`
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors?.primaryLight || '#E8F0FE' : theme.colors?.surface || '#FFFFFF'};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors?.primary || '#0066FF' : theme.colors?.border || '#E5E7EB'};
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#0066FF'};
    background: ${({ theme }) => theme.colors?.background || '#FAFAFA'};
  }
`;

const RoleIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const RoleName = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#1A1A1A'};
  margin-bottom: 8px;
`;

const RoleDescription = styled.div`
  font-family: ${({ theme }) => theme.fonts?.sans || 'inherit'};
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#6B7280'};
  line-height: 1.4;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || '#374151'};
`;

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.colors?.ui50 || '#fafafa'};
  padding: 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors?.ui800 || '#27272a'};
  width: 100%;
  min-height: 80px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || '#d4d4d8'};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || '#1D7072'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors?.primary50 || '#EFFBFB'};
  }
`;

const FeatureList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors?.ui800 || '#27272a'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui100 || '#f4f4f5'};

  &:last-child {
    border-bottom: none;
  }
`;

const FeatureCheck = styled.span`
  color: #16a34a;
  font-size: 18px;
`;

const Footer = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  display: flex;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors?.red50 || '#fef2f2'};
  border: 1px solid ${({ theme }) => theme.colors?.red200 || '#fecaca'};
  color: ${({ theme }) => theme.colors?.red700 || '#b91c1c'};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                     */
/* -------------------------------------------------------------------------- */

const STEPS = ['Role', 'Profile', 'Review'];

const ROLES = [
  {
    id: 'buyer',
    icon: '🛒',
    name: 'Buyer',
    description: 'Purchase nutrient credits to offset environmental impact',
    features: [
      'Browse and purchase credits',
      'Track your portfolio',
      'Verify certificates on blockchain',
    ],
  },
  {
    id: 'seller',
    icon: '🌱',
    name: 'Seller',
    description: 'List and sell nutrient credits from your operations',
    features: ['Create credit listings', 'Manage inventory', 'Track sales and revenue'],
  },
  {
    id: 'installer',
    icon: '🔧',
    name: 'Installer',
    description: 'Deploy and commission monitoring devices',
    features: [
      'Scan and register devices',
      'Commission equipment on-site',
      'Monitor device health',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function OnboardingWizard() {
  useEffect(() => {
    document.title = 'Onboarding — BlueSignal Cloud';
  }, []);
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    role: '',
    displayName: user?.displayName || '',
    company: '',
    phone: '',
    bio: '',
  });

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);

    if (step === 0 && !formData.role) {
      setError('Please select a role to continue');
      return;
    }

    if (step === 1 && !formData.displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setError(null);

    if (!formData.displayName?.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!formData.role) {
      setError('Please select a role.');
      return;
    }

    setLoading(true);

    try {
      // completeOnboarding is the single endpoint authorized to set role
      // and flip onboardingComplete. Role cannot be changed via the generic
      // profile update endpoint after this point.
      const onboardingPayload = {
        displayName: formData.displayName.trim(),
        company: formData.company,
        phone: formData.phone,
        bio: formData.bio,
        role: formData.role,
      };

      await UserProfileAPI.completeOnboarding(user.uid, onboardingPayload);

      // Sync local context with the new fields (updateUser now re-fetches from backend).
      await ACTIONS.updateUser(user.uid, {
        ...user,
        ...onboardingPayload,
        onboardingComplete: true,
      });

      const dashboardRoutes = {
        buyer: '/dashboard/buyer',
        seller: '/dashboard/seller',
        installer: '/dashboard/installer',
      };

      navigate(dashboardRoutes[formData.role] || '/dashboard/main');
    } catch (err) {
      console.error('Onboarding failed:', err?.response?.data || err.message || err);
      const serverMsg = err?.response?.data?.error;
      setError(serverMsg || err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find((r) => r.id === formData.role);

  return (
    <Container>
      <Card>
        <ProgressBar>
          {STEPS.map((s, idx) => (
            <ProgressStep key={s} $active={idx === step} $completed={idx < step}>
              {s}
            </ProgressStep>
          ))}
        </ProgressBar>

        <Content>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Step 1: Role Selection */}
          {step === 0 && (
            <>
              <StepTitle>Choose Your Role</StepTitle>
              <StepDescription>
                Select how you&apos;ll primarily use BlueSignal. You can change this later in
                settings.
              </StepDescription>

              <RoleGrid>
                {ROLES.map((role) => (
                  <RoleCard
                    key={role.id}
                    type="button"
                    $selected={formData.role === role.id}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <RoleIcon>{role.icon}</RoleIcon>
                    <RoleName>{role.name}</RoleName>
                    <RoleDescription>{role.description}</RoleDescription>
                  </RoleCard>
                ))}
              </RoleGrid>
            </>
          )}

          {/* Step 2: Profile Info */}
          {step === 1 && (
            <>
              <StepTitle>Tell Us About Yourself</StepTitle>
              <StepDescription>Help us personalize your experience.</StepDescription>

              <FormGroup>
                <Label htmlFor="displayName">Your Name *</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="Full name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="company">Company / Organization</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bio">About You (optional)</Label>
                <TextArea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself or your organization..."
                />
              </FormGroup>
            </>
          )}

          {/* Step 3: Review */}
          {step === 2 && (
            <>
              <StepTitle>You&apos;re All Set!</StepTitle>
              <StepDescription>Review your setup before getting started.</StepDescription>

              <div
                style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontSize: '48px' }}>{selectedRole?.icon}</div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>
                      {formData.displayName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {selectedRole?.name} Account
                    </div>
                    {formData.company && (
                      <div style={{ fontSize: '13px', color: '#9ca3af' }}>{formData.company}</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: '600', marginBottom: '12px' }}>
                What you&apos;ll be able to do:
              </div>

              <FeatureList>
                {selectedRole?.features.map((feature, idx) => (
                  <FeatureItem key={idx}>
                    <FeatureCheck>✓</FeatureCheck>
                    {feature}
                  </FeatureItem>
                ))}
              </FeatureList>
            </>
          )}
        </Content>

        <Footer>
          {step > 0 ? (
            <ButtonSecondary type="button" onClick={handleBack}>
              Back
            </ButtonSecondary>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <ButtonPrimary type="button" onClick={handleNext}>
              Continue
            </ButtonPrimary>
          ) : (
            <ButtonPrimary type="button" onClick={handleComplete} disabled={loading}>
              {loading ? 'Setting up...' : 'Get Started'}
            </ButtonPrimary>
          )}
        </Footer>
      </Card>
    </Container>
  );
}
