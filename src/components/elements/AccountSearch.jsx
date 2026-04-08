import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCertificateID, handleViewCertificate } from '../../scripts/helpers';
import { NPCCreditsAPI } from '../../scripts/back_door';

const entranceAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

const Input = styled.input`
  padding: 8px;
  margin-right: 8px;
  width: 200px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 8px;
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #222;
  color: #fff;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Loading = styled.div`
  margin-top: 16px;
  animation: ${entranceAnimation} 0.3s ease-in-out;
`;

const Error = styled.div`
  margin-top: 16px;
  color: red;
  animation: ${entranceAnimation} 0.3s ease-in-out;
`;

const Result = styled.div`
  margin-top: 16px;
  text-align: center;
  trasition: 0.5s ease-in-out;
  animation: ${entranceAnimation} 0.3s ease-in-out;

  p {
    color: white;
    background: #01090d;
    box-shadow:
      2.5px 2.5px 5px #223844,
      -2.5px -2.5px 5px #223844;
    border-radius: 5px;
    padding: 7px 10px;
    margin: auto;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
`;

const List = styled.div`
  overflow-y: auto;
  max-height: 200px;
`;

const Card = styled.div`
  padding: 8px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 8px;
  background-color: #f1f1f1;
  text-align: center;
  justify-content: center;
  border-radius: 10px;
  width: 75%;
  cursor: pointer;

  display: flex;
  transition: 0.3s ease-in-out;

  background-color: #0d5b84;
  color: white;
  background: #0d5b84;
  box-shadow:
    2px 2px 2px #052637,
    -2px -2px 2px #052637;
  &:hover {
    scale: 1.1;
  }
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const PopupContainer = styled(Container)`
  background: #fff;
  border-radius: 10px;
  width: auto;
  height: auto;
  max-width: 80%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
`;

const Form = styled(motion.form)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AccountSearch = ({ isOpen, setIsOpen }) => {
  const [accountID, setAccountID] = useState('');
  const [currAccount, setCurrAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState('');
  const [certificates, setCertificates] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCurrAccount('');
    setBalance('');
    setCertificates([]);

    try {
      setCurrAccount(accountID);
      const accountBalance = await NPCCreditsAPI.getAccountCreditBalance({
        accountID,
        producer: '',
        verifier: '',
        creditType: '',
      });
      setBalance(accountBalance.toString());
      const accountCertificates = await NPCCreditsAPI.getAccountCertificates(accountID);
      setCertificates(accountCertificates);
    } catch {
      setError('Error retrieving data');
    } finally {
      setLoading(false);
    }
  };
  const closePopup = (e) => {
    if (e.target.id === 'backdrop') {
      setIsOpen(false);
    }
  };
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Backdrop
          id="backdrop"
          onClick={closePopup}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PopupContainer
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <Form layout onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Enter Account ID"
                value={accountID}
                onChange={(e) => setAccountID(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </Form>
            {balance && (
              <Result>
                <h3>{currAccount.toUpperCase()}</h3>
                <p>Balance: {balance + ' NPCs'}</p>
                <h2>Owned Certificates</h2>
                <List>
                  {certificates.map((certificate, index) => (
                    <Card key={index} onClick={() => handleViewCertificate(certificate)}>
                      {formatCertificateID(certificate.toNumber())}
                    </Card>
                  ))}
                </List>
              </Result>
            )}
            {loading && <Loading>Loading...</Loading>}
            {error && <Error>{error}</Error>}
          </PopupContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default AccountSearch;
