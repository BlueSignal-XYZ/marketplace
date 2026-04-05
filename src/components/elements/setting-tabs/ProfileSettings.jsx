import { motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';
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

const PasswordButton = styled(motion.div)`
  background: none;
  border: none;
  color: #63c3d1;
  font-weight: bold;
  cursor: pointer;
  padding: 5px;
  border-radius: 25%;
  margin-bottom: 10px;
  transition: all 0.3s ease-in-out;

  ${({ active }) =>
    active &&
    `
       padding: 10px;
       border-radius: 0;
    background: #333;
    color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 2px #000;
    `}
  &:hover {
    text-decoration: underline;
  }
`;

const SaveButton = styled(motion.div)`
  padding: 10px 20px;
  background-color: #63c3d1;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #508a99;
  }
`;

const ProfileSettingsTab = () => {
  const { STATES } = useAppContext();

  const [imagePreview, setImagePreview] = useState(NeptuneIcon);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const { user } = STATES || {};

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // edit profile mode activated
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
          <FormSection label={'Username'}>
            <Input type="text" id="username" value={user?.username} readOnly />
          </FormSection>
          <FormSection label={'Email'}>
            <Input type="email" id="email" value={user?.email} readOnly />
          </FormSection>

          <FormSection label={'Account type'}>
            <Input type="text" id="type" value={user?.role} readOnly />
          </FormSection>

          <ButtonPrimary whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Edit Profile
          </ButtonPrimary>
        </ProfileForm>
      </Section>

      {/* <Section>
        <PasswordButton active={showPasswordFields} onClick={togglePasswordFields}>Change Password <FontAwesomeIcon icon={showPasswordFields ? faCaretUp : faCaretDown} /></PasswordButton>
        {showPasswordFields && (
          <ProfileForm>
            <Label htmlFor="currentPassword">Current Password:</Label>
            <Input type="password" id="currentPassword" />

            <Label htmlFor="newPassword">New Password:</Label>
            <Input type="password" id="newPassword" />

            <Label htmlFor="confirmNewPassword">Confirm New Password:</Label>
            <Input type="password" id="confirmNewPassword" />
            <SaveButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Save Changes
            </SaveButton>
          </ProfileForm>
        )}
      </Section> */}
    </ProfileContainer>
  );
};

export default ProfileSettingsTab;
