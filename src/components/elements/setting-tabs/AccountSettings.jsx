import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../../shared/input/Input";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { Label } from "../../shared/Label/Label";
import FormSection from "../../shared/FormSection/FormSection";
import { ButtonDanger, ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import {auth} from "../../../apis/firebase";
import {useAppContext} from "../../../context/AppContext";

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  max-width: 320px;
  margin: 0 auto;
`;

const OptionGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const OptionLabel = styled.label`
  font-weight: bold;
  color: #333;
`;

const ToggleButton = styled(motion.div)`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${({ isActive }) => (isActive ? "#63c3d1" : "#aaa")};
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  background-color: ${({ danger }) => (danger ? "#e74c3c" : "#63c3d1")};

  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

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
    background-color: ${({ danger }) => (danger ? "#c0392b" : "#508a99")};
  }
`;

const ProfileForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap:24px;
`;

const AccountSettingsTab = () => {
  const { STATES, ACTIONS } = useAppContext();
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user } = STATES || {};
  const { logNotification } = ACTIONS || {};

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const resetPasswordInputs = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePasswordChange();
  };

  const handlePasswordChange = async () => {
    if (newPassword === confirmNewPassword) {
      try {
        const fbUser = await signInWithEmailAndPassword(
          auth,
          user?.email,
          currentPassword
        );
        if (fbUser?.user) {
          await updatePassword(fbUser.user, newPassword);
          logNotification("alert", "Password Changed!");
          resetPasswordInputs();
        } else {
          logNotification(
            "error",
            `SignIn Error: Check Password for ${user?.email}`
          );
        }
      } catch (error) {
        logNotification("error", error.message);
      }
    } else {
      logNotification("error", "Passwords do not match");
    }
  };

  const handle2FAToggle = () => {
    // Logic to enable/disable 2FA would be added here
    setTwoFactorAuth(!twoFactorAuth);
  };

  const handleDeactivate = () => {
    // Logic to deactivate account
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      // Logic to delete user account
    }
  };

  return (
    <AccountContainer>
      <ButtonSecondary
        active={showPasswordFields}
        onClick={togglePasswordFields}
      >
        Change Password{" "}
        <FontAwesomeIcon icon={showPasswordFields ? faCaretUp : faCaretDown} />
      </ButtonSecondary>
      {showPasswordFields && (
        <ProfileForm onSubmit={handleFormSubmit}>
          <FormSection label={"Current password"}>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            />
            </FormSection>


          <FormSection label={"New password"}>
          <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            />
            </FormSection>  

          <FormSection label={"Confirm New Password"}>
          <Input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            />
            </FormSection>
          <ButtonPrimary
                      type="submit"
          >
            Save Password Changes
          </ButtonPrimary>
        </ProfileForm>
      )}

      <ButtonSecondary >
        Manage Email Settings
      </ButtonSecondary>

      <FormSection>
        <Label>Two-Factor Authentication:</Label>
        <ButtonSecondary isActive={twoFactorAuth} onClick={handle2FAToggle}>
          {twoFactorAuth ? "Enabled" : "Disabled"}
        </ButtonSecondary>
      </FormSection>

      <ButtonDanger
        danger
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDeactivate}
      >
        Deactivate Account
      </ButtonDanger>

      <ButtonDanger
        danger
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDelete}
      >
        Delete Account
      </ButtonDanger>
    </AccountContainer>
  );
};

export default AccountSettingsTab;
