// UploadProgress.js
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {logoColors} from '../../../styles/colors';

const ProgressContainer = styled.div`
  width: 70%;
  background-color: #e0e0df;
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

@media (max-width: 769px) {
width: 90%;
}

`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: ${logoColors.secondary};
  border-radius: 50px;

  border: 2px solid black;
`;

const ProgressText = styled.div`
  text-align: center;
  font-weight: bold;
  color: #333;
`;

const UploadProgress = ({ progress }) => {
  return (
    <ProgressContainer>
      <ProgressText>Uploading:</ProgressText>
      <ProgressBar
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
      <ProgressText>{progress}%</ProgressText>
    </ProgressContainer>
  );
};

export default UploadProgress;
