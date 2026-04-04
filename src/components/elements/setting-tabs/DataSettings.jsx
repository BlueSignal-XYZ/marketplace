import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {ButtonDanger, ButtonSecondary} from '../../shared/button/Button'
const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  max-width: 320px;
  margin: 0 auto;
`;

const Button = styled(motion.div)`
  padding: 10px 20px;
  background-color: #63c3d1;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  &:hover {
    background-color: #508a99;
  }
`;

const DangerButton = styled(Button)`
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const DataSettingsTab = () => {
  
  const handleBackup = () => {
    // Logic to trigger data backup
  };

  const handleExport = () => {
    // Logic to export user data
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your data? This action is irreversible.")) {
      // Logic to delete user data
    }
  };

  return (
    <DataContainer>
      <ButtonSecondary whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBackup}>
        Backup My Data
      </ButtonSecondary>

      <ButtonSecondary whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExport}>
        Export My Data
      </ButtonSecondary>

      <ButtonDanger whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDelete}>
        Delete My Data
      </ButtonDanger>
    </DataContainer>
  );
};

export default DataSettingsTab;
