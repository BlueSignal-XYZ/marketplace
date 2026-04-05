import { faCalculator, faHome, faShop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logoColors } from '../styles/colors';


const FloatingMenu = ({handleCalculatorClick}) => {
    const navigate = useNavigate();
  
    const handleMarketplaceClick = () => {
      navigate('/marketplace');
    };

    const handleHomeClick = () => {
      navigate('/dashboard/main');
    };
  
    return (
      <FloatingContainer>
        <FloatButton
          onClick={handleCalculatorClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faCalculator} />
        </FloatButton>
        <FloatButton
          onClick={handleMarketplaceClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faShop} />
        </FloatButton>
        <FloatButton
          onClick={handleHomeClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faHome} />
        </FloatButton>
      </FloatingContainer>
    );
  }

  const FloatingContainer = styled(motion.div)`
  position: fixed;
  right: 1.5rem;
  top: 12rem;
  width: 5%;
  border-radius: 10px;
  box-shadow: 1px 2px 2px 0px #000;
  background-color: #134b5f;

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  font-size: 24px; // Icon size

  z-index: 1000; 
`;

const FloatButton = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${logoColors.accent};
  color: white;
  border: 1px solid ${logoColors.accent};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 1);
  z-index: 1000; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; // Icon size
`;
  
  export default FloatingMenu