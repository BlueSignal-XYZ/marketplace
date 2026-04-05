import { useState } from 'react';
import styled from 'styled-components';
import FormSection from '../../shared/FormSection/FormSection';
import { Label } from '../../shared/Label/Label';
import { RadioWithLabel } from '../../shared/Radio/RadioButton';
import { Select } from "../../shared/Select/Select";
import {useAppContext} from '../../../context/AppContext';

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
    gap:4px;
  }

`;

const PrivacySettingsTab = () => {
  const { STATES } = useAppContext();
  const [profileVisibility, setProfileVisibility] = useState("Everyone");
  const [activityStatus, setActivityStatus] = useState(true);
  const [transactionPrivacy, setTransactionPrivacy] = useState(true);
  const [dataUploadPrivacy, setDataUploadPrivacy] = useState(true);

  const { user } = STATES || {};
  const _accountType = user?.role;
  // account type loaded

  return (
    <PrivacyContainer>
      <FormSection>
        <Label>Profile Visibility:</Label>
        <Select value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)}>
          <option value="Everyone">Everyone</option>
          <option value="Only Verifiers">Only Verifiers</option>
          <option value="No one">No one</option>
        </Select>
      </FormSection>

      <FormSection>
        <Label>Activity Status:</Label>
        <div className='radio-button-area'>

   <RadioWithLabel onChange={() => {
     setActivityStatus(true)
    }} label={"Visible"} checked={activityStatus} />
   <RadioWithLabel 
    onChange={() => { 
      setActivityStatus(false)
    }}
    label={"Hidden"} checked={!activityStatus} />
    </div>
        
      </FormSection>

      <FormSection>
            <Label>Transaction Privacy:</Label>
            <div className='radio-button-area'>
            <RadioWithLabel 
              label={"Public"}
              checked={transactionPrivacy}
              onChange={() => setTransactionPrivacy(true)}
            />
            <RadioWithLabel
              label={"Private"}
              checked={!transactionPrivacy}
              onChange={() => setTransactionPrivacy(false)}
            />
            </div>
      </FormSection>

    <FormSection>
    <Label>Data Upload Privacy:</Label>
    <div className='radio-button-area'>
    <RadioWithLabel
      label={"Public"}
      checked={dataUploadPrivacy}
      onChange={() => setDataUploadPrivacy(true)}
    />
    <RadioWithLabel
      label={"Private"}
      checked={!dataUploadPrivacy}
      onChange={() => setDataUploadPrivacy(false)}
    />
    </div>  
    </FormSection>


    </PrivacyContainer>
  );
};

export default PrivacySettingsTab;
