import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../data/styles';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  min-height: 50px;
  border-radius: 20px;
  overflow: hidden;
  overflow-wrap: break-word;
  margin-bottom: 25px;
  padding: 10px;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  transition: 0.3s ease-in-out;

  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;
    padding: 5px;
  }
`;

const Producer = styled(Row)`
  width: 95%;
  background: ${colors.accent};
  color: white;
  cursor: pointer;
  justify-content: space-between;
  margin: 10px auto;
  border-radius: 20px;
  padding: 10px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Key = styled.span`
  font-weight: bold;
  margin-right: 10px;
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const Value = styled.span`
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    white-space: normal;
  }
`;

const TableContainer = styled(motion.div)`
  border: 2px solid black;
  padding: 5px;
  border-radius: 20px;

  ${({ isOpen }) => !isOpen && 'display: none;'}

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const TitleRow = styled(Row)`
  width: 95%;
  margin: auto;
  border-bottom: 1px solid #22222250;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  font-weight: bold;
  background: ${colors.accentLight};
  color: ${colors.primaryDark};

  @media (max-width: 768px) {
    font-size: 2.5vw;
  }
`;

const VerifierRow = styled(TitleRow)`
  font-weight: normal;
  background: none;
  color: ${colors.primaryDark};
`;
const CreditType = styled.span`
  flex-basis: 30%;
`;

const Verifier = styled.span`
  flex-basis: 30%;
`;

const AvailableNPC = styled.span`
  flex-basis: 13%;
  text-align: center;
`;

const SoldNPC = styled.span`
  flex-basis: 13%;
  text-align: center;
`;

const DonatedNPC = styled.span`
  flex-basis: 13%;
  text-align: center;
`;

const ProducersData = ({ producersData }) => {
  const [expandedProducer, setExpandedProducer] = useState(null);

  const handleExpand = (producer) => {
    if (expandedProducer === producer) {
      setExpandedProducer(null);
    } else {
      setExpandedProducer(producer);
    }
  };

  const containerVariants = {
    expanded: { height: 'auto', opacity: 1, overflow: 'visible' },
    collapsed: { height: '0', opacity: 0, overflow: 'hidden' },
  };

  return (
    <Container
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: [1, 1.05, 1] }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
    >
      {producersData?.map((producerData) => (
        <div key={producerData.producer}>
          <Producer onClick={() => handleExpand(producerData.producer)}>
            <Value>{producerData.producer.toUpperCase()}</Value>
            <FontAwesomeIcon
              icon={expandedProducer === producerData.producer ? faAngleUp : faAngleDown}
            />
          </Producer>
          <TableContainer
            animate={expandedProducer === producerData.producer ? 'expanded' : 'collapsed'}
            variants={containerVariants}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <TitleRow>
              <CreditType>TYPE</CreditType>
              <Verifier>VERIFIER</Verifier>
              <AvailableNPC>Total Issued</AvailableNPC>
              <SoldNPC>Available</SoldNPC>
              <DonatedNPC>Donated</DonatedNPC>
            </TitleRow>
            {producerData.verifiers.map((verifierData, index) => (
              <div key={index}>
                {verifierData.Supplies?.map((supply, index) => {
                  return (
                    <VerifierRow key={index}>
                      <CreditType>{supply.creditType}</CreditType>
                      <Verifier>{verifierData.verifier?.toUpperCase() ?? '—'}</Verifier>
                      <AvailableNPC>{supply.issuedSupply}</AvailableNPC>
                      <SoldNPC>{supply.availableSupply}</SoldNPC>
                      <DonatedNPC>{supply.donatedSupply}</DonatedNPC>
                    </VerifierRow>
                  );
                })}
              </div>
            ))}
          </TableContainer>
        </div>
      ))}
    </Container>
  );
};

export default ProducersData;
