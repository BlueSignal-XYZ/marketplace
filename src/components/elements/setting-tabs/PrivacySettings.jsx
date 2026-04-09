import { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormSection from '../../shared/FormSection/FormSection';
import { Label } from '../../shared/Label/Label';
import { RadioWithLabel } from '../../shared/Radio/RadioButton';
import { Select } from '../../shared/Select/Select';
import { ButtonPrimary } from '../../shared/button/Button';
import { useAppContext } from '../../../context/AppContext';
import { UserProfileAPI } from '../../../scripts/back_door';

const PrivacyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  max-width: 320px;
  margin: 0 auto;

  .radio-button-area {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

const PrivacySettingsTab = () => {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};
  const { logNotification } = ACTIONS || {};

  const [profileVisibility, setProfileVisibility] = useState('Everyone');
  const [activityStatus, setActivityStatus] = useState(true);
  const [transactionPrivacy, setTransactionPrivacy] = useState(true);
  const [dataUploadPrivacy, setDataUploadPrivacy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load privacy settings from backend on mount
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    UserProfileAPI.get(user.uid)
      .then((data) => {
        const privacy = data?.privacy;
        if (privacy) {
          if (privacy.profileVisibility) setProfileVisibility(privacy.profileVisibility);
          if (privacy.activityStatus !== undefined) setActivityStatus(privacy.activityStatus);
          if (privacy.transactionPrivacy !== undefined)
            setTransactionPrivacy(privacy.transactionPrivacy);
          if (privacy.dataUploadPrivacy !== undefined)
            setDataUploadPrivacy(privacy.dataUploadPrivacy);
        }
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await UserProfileAPI.update(user.uid, {
        privacy: {
          profileVisibility,
          activityStatus,
          transactionPrivacy,
          dataUploadPrivacy,
        },
      });
      logNotification?.('success', 'Privacy settings saved!');
    } catch {
      logNotification?.('error', 'Failed to save privacy settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PrivacyContainer>
      <FormSection>
        <Label>Profile Visibility:</Label>
        <Select
          value={profileVisibility}
          onChange={(e) => setProfileVisibility(e.target.value)}
          disabled={loading}
        >
          <option value="Everyone">Everyone</option>
          <option value="Only Verifiers">Only Verifiers</option>
          <option value="No one">No one</option>
        </Select>
      </FormSection>

      <FormSection>
        <Label>Activity Status:</Label>
        <div className="radio-button-area">
          <RadioWithLabel
            onChange={() => {
              setActivityStatus(true);
            }}
            label={'Visible'}
            checked={activityStatus}
          />
          <RadioWithLabel
            onChange={() => {
              setActivityStatus(false);
            }}
            label={'Hidden'}
            checked={!activityStatus}
          />
        </div>
      </FormSection>

      <FormSection>
        <Label>Transaction Privacy:</Label>
        <div className="radio-button-area">
          <RadioWithLabel
            label={'Public'}
            checked={transactionPrivacy}
            onChange={() => setTransactionPrivacy(true)}
          />
          <RadioWithLabel
            label={'Private'}
            checked={!transactionPrivacy}
            onChange={() => setTransactionPrivacy(false)}
          />
        </div>
      </FormSection>

      <FormSection>
        <Label>Data Upload Privacy:</Label>
        <div className="radio-button-area">
          <RadioWithLabel
            label={'Public'}
            checked={dataUploadPrivacy}
            onChange={() => setDataUploadPrivacy(true)}
          />
          <RadioWithLabel
            label={'Private'}
            checked={!dataUploadPrivacy}
            onChange={() => setDataUploadPrivacy(false)}
          />
        </div>
      </FormSection>

      <ButtonPrimary
        onClick={handleSave}
        disabled={saving || loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {saving ? 'Saving...' : 'Save Privacy Settings'}
      </ButtonPrimary>
    </PrivacyContainer>
  );
};

export default PrivacySettingsTab;
