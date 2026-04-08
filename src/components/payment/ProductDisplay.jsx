/**
 * Product Display Component
 *
 * Purpose: Displays details of display as well as a Map of the product location.
 */
import React from 'react';
import { FaLayerGroup, FaTractor } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import styled from 'styled-components';
import { ButtonPrimary } from '../../components/shared/button/Button';
import FormSection from '../shared/FormSection/FormSection';
import { Input } from '../shared/input/Input';
import { presaleProducer } from './data';
import { CardContent, InfoBox } from './styled';
const StyledWrapper = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    grid-template-columns: 6fr 6fr;
    gap: 32px;
  }

  ${ButtonPrimary} {
    margin-top: 12px;
  }

  .form-section {
    margin-top: 40px;
    max-width: 400px;
  }

  .disclaimer {
    max-width: 400px;
  }
`;

const ProductDisplay = ({ isLoading, supplyManagement, handlePayment }) => {
  const { amount, setAmount } = supplyManagement || {};
  const [amountError, setAmountError] = React.useState('');

  // ##TO_DO Check if amount is available from credit supply
  function isValidAmount(amount) {
    // amount parsed
    if (parseInt(amount) > 0) {
      handlePayment();
    } else {
      setAmountError('Please enter an amount');
    }
  }

  return (
    <StyledWrapper>
      <InfoBox>
        <CardContent>
          <h3>A farmer near you is selling now</h3>
          <div className="card-stats">
            <div className="card-stat">
              <FaLocationDot />
              <p>{presaleProducer?.location}</p>
            </div>

            <div className="card-stat">
              <FaLayerGroup />
              <p>{presaleProducer?.totalLandArea} acres</p>
            </div>

            <div className="card-stat">
              <FaTractor />
              <p className="subtext">Supplier: {presaleProducer?.producer.toUpperCase()}</p>
            </div>
          </div>
          <FormSection
            error={amountError}
            className={'form-section'}
            label={'Nutrient Pollution Certificates'}
          >
            <Input
              type="number"
              value={amount}
              onFocus={() => setAmountError('')}
              onChange={(e) => setAmount?.(e.target.value)}
              placeholder="Enter your amount"
            />
          </FormSection>
          <div>
            <ButtonPrimary
              id="remove-carbon-button"
              onClick={() => {
                isValidAmount(amount);
              }}
            >
              {isLoading ? 'Processing...' : 'Buy Offsets'}
            </ButtonPrimary>
          </div>
          <span className="disclaimer">
            This is a pre-order for verified impact certificates. Detailed information about the
            farmer and supply will be provided with the launch of our marketplace.
          </span>
        </CardContent>
      </InfoBox>
    </StyledWrapper>
  );
};

export default ProductDisplay;
