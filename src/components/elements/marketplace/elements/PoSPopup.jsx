import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { ButtonPrimary } from "../../../shared/button/Button";
import FormSection from "../../../shared/FormSection/FormSection";
import { Input } from "../../../shared/input/Input";
import { FaXmark } from "react-icons/fa6";

const colors = {
  primary: '#005A87',
  secondary: '#003F5E',
  accent: '#007BB5', 
  white: '#FFFFFF',
  lightGrey: '#F2F2F2',
  darkGrey: '#333333',
};

 const PoSPopupWrapper = styled(motion.div)`
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 width: 100%;
 max-width: 400px;
 background-color: white;
 padding: 2rem;
 border-radius: 10px;
 box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
 z-index: 100;
 margin: 0 auto;
 position: relative;
 .close-button { 
  position: absolute;
  top: 8px; 
  background-color: white;
  right: 8px;
  width: 16px;
  height: 16px;
  border: none;
  padding: 0px; 
  svg {
    color: ${({theme}) => theme.colors.ui600}; 
    font-size: 16px;
    height: 16px; 
    width: 16px;
    margin: 0px;
  }
 }
  
 h3 { 
  text-align: left;
  color: ${({theme}) => theme.colors.ui800};
 }

 @media (min-width: 768px) {
   max-height: 80vh;
 }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;


const SubmitButton = styled.button`
  padding: 0.8rem;
  border-radius: 4px;
  background-color: ${colors.accent};
  color: ${colors.white};
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.primary};
  }

  &:disabled {
    background-color: ${colors.darkGrey};
    cursor: not-allowed;
  }
`;

const Receipt = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: ${colors.lightGrey};
  border: 1px solid ${colors.secondary};
  border-radius: 8px;
  width: 100%;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;

const formatHash = (address, first = 6, last = 4) => {
    if (!address) return '';
    const firstPart = address.slice(0, first);
    const lastPart = address.slice(-last);
    return `${firstPart}...${lastPart}`;
  };

const PoSPopup = ({ closePopup, actionType, listingId, buyNFT, placeBid, listingPrice }) => {
  const [value, setValue] = useState(actionType === 'buy' ? listingPrice : 0);
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const txReceipt = actionType === 'buy'
        ? await buyNFT(listingId, String(value))
        : await placeBid(listingId, String(value));

      setReceipt(txReceipt);
    } catch (error) {
      console.error('Transaction error:', error);
    }

    setIsLoading(false);
  };

  return (
    <PoSPopupWrapper
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <button onClick={closePopup} className="close-button">
      <FaXmark />
      </button>
      <h3 className="">{actionType === 'buy' ? 'Buy NFT' : 'Place a Bid'}</h3>
      <Form onSubmit={handleSubmit}>
        <FormSection label="Price">
         <Input
           type="number"
           value={value}
           onChange={(e) => setValue(e.target.value)}
           placeholder="Enter amount"
           disabled={actionType === 'buy'}
           required
         /> 
        </FormSection>
        <ButtonPrimary type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit'}
        </ButtonPrimary>
      </Form>

      {receipt && (
        <Receipt>
          <p><strong>Transaction Receipt:</strong></p>
          <button>View <FontAwesomeIcon icon={faEye} /></button>
          {/* Format and display transaction receipt details */}
          <p>Transaction Hash: {formatHash(receipt.hash)}</p>
          {/* ... Other receipt details */}
        </Receipt>
      )}
    </PoSPopupWrapper>
  );
};

export default PoSPopup;
