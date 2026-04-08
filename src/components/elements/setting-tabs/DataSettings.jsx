import styled from 'styled-components';
import { ButtonDanger, ButtonSecondary } from '../../shared/button/Button';
const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  max-width: 320px;
  margin: 0 auto;
`;

const DataSettingsTab = () => {
  const handleBackup = () => {
    // Logic to trigger data backup
  };

  const handleExport = () => {
    // Logic to export user data
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your data? This action is irreversible.')) {
      // Logic to delete user data
    }
  };

  return (
    <DataContainer>
      <ButtonSecondary
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBackup}
      >
        Backup My Data
      </ButtonSecondary>

      <ButtonSecondary
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
      >
        Export My Data
      </ButtonSecondary>

      <ButtonDanger whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDelete}>
        Delete My Data
      </ButtonDanger>
    </DataContainer>
  );
};

export default DataSettingsTab;
