import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import NeptuneIcon from '../../../assets/icon.png';
import { ButtonPrimary, ButtonSecondary } from '../../shared/button/Button';
import FormSection from '../../shared/FormSection/FormSection';
import { Input } from '../../shared/input/Input';
import { useAppContext } from '../../../context/AppContext';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;

  ${ButtonPrimary} {
    margin-top: 24px;
  }
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Section = styled.div`
  width: 100%;
  height: auto;
  max-width: 400px;
  //overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .profile-image-section {
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 992px) {
    width: 100%;
  }
`;

const ProfileImage = styled(motion.img)`
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  transition: 0.3s ease-in-out;
`;

const ProfileForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ProfileSettingsTab = () => {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};
  const { logNotification } = ACTIONS || {};

  const [imagePreview, setImagePreview] = useState(NeptuneIcon);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [role, setRole] = useState(user?.role || '');

  // Sync from user context when it changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setUsername(user.username || '');
      setRole(user.role || '');
    }
  }, [user]);

  const handleImageClick = () => {
    document.getElementById('profileImageInput').click();
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDisplayName(user?.displayName || '');
    setUsername(user?.username || '');
    setRole(user?.role || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      setEditing(true);
      return;
    }

    if (!displayName?.trim()) {
      logNotification?.('error', 'Display name is required.');
      return;
    }

    if (!username?.trim()) {
      logNotification?.('error', 'Username is required.');
      return;
    }

    if (!navigator.onLine) {
      logNotification?.('error', 'You are offline. Please check your connection and try again.');
      return;
    }

    if (!user?.uid) return;
    setSaving(true);
    try {
      const trimmedName = displayName.trim();
      const trimmedUsername = username.trim();
      // Role is intentionally NOT sent — the profile update endpoint
      // rejects it (role changes require admin). Role is shown read-only.
      const result = await ACTIONS.saveProfile(user.uid, {
        displayName: trimmedName,
        username: trimmedUsername,
      });

      if (!result.success) {
        logNotification?.('error', result.error || 'Failed to save profile. Please try again.');
        return;
      }

      logNotification?.('success', 'Profile updated successfully!');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileContainer>
      <Section>
        <div className="profile-image-section">
          <ProfileImage src={imagePreview} onClick={handleImageClick} />
          <ButtonSecondary onClick={handleImageClick}>Upload Profile Image</ButtonSecondary>
        </div>
        <Input
          type="file"
          id="profileImageInput"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <ProfileForm onSubmit={handleSubmit}>
          <FormSection label={'Display Name'}>
            <Input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              readOnly={!editing}
            />
          </FormSection>
          <FormSection label={'Username'}>
            <Input
              type="text"
              id="username"
              value={username}
              readOnly={!editing}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormSection>
          <FormSection label={'Email'}>
            <Input type="email" id="email" value={user?.email || ''} readOnly />
          </FormSection>
          <FormSection label={'Account type'}>
            <Input type="text" id="type" value={role} readOnly />
          </FormSection>

          {editing ? (
            <ButtonRow>
              <ButtonPrimary
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </ButtonPrimary>
              <ButtonSecondary
                type="button"
                onClick={handleCancel}
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </ButtonSecondary>
            </ButtonRow>
          ) : (
            <ButtonPrimary type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Edit Profile
            </ButtonPrimary>
          )}
        </ProfileForm>
      </Section>
    </ProfileContainer>
  );
};

export default ProfileSettingsTab;
