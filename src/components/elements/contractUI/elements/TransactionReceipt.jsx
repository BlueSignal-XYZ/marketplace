import { useState } from 'react';
import styled from 'styled-components';

const ReceiptModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow-y: auto;
  max-height: 80vh;
  @media (min-width: 768px) {
    width: 70%;
    max-width: 700px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
`;

const KeyValue = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  &:last-child {
    margin-bottom: 1.5rem;
  }
`;

const Key = styled.span`
  font-weight: 600;
  color: #555;
`;

const Value = styled.span`
  word-break: break-all;
  color: #777;
  font-weight: 300;
`;

const Logs = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const LogItem = styled.div`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const LogDetails = styled.div`
  background-color: #f8f9fa;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  display: none;
  &.open {
    display: block;
  }
`;

const ExpandButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const TransactionReceipt = ({ receipt, onClose }) => {
  const [openLogs, setOpenLogs] = useState({});

  const toggleLogDetail = (index) => {
    setOpenLogs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (!receipt) return null;

  return (
    <ReceiptModal>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Title>Transaction Receipt</Title>
      {Object.entries(receipt)
        .filter(([key]) => key !== 'logs')
        .map(([key, value], index) => (
          <KeyValue key={index}>
            <Key>{key}:</Key>
            <Value>{value?.toString()}</Value>
          </KeyValue>
        ))}
    </ReceiptModal>
  );
};

export default TransactionReceipt;
