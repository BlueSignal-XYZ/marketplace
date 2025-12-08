// Customer Name Modal - Collect customer info before PDF export
import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  margin: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const Description = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #1f2937;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #374151;

    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}
`;

const SkipNote = styled.p`
  margin: 16px 0 0;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
`;

const ErrorMessage = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: #dc2626;
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const CustomerNameModal = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
  error = null,
}) => {
  const [customerName, setCustomerName] = useState("");

  if (!isOpen) return null;

  const handleGenerate = () => {
    onGenerate(customerName.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isGenerating) {
      handleGenerate();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Generate Quote PDF</Title>
        <Description>
          Enter the customer name to include in the quote. This will be used in the PDF filename and header.
        </Description>

        <InputGroup>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            type="text"
            placeholder="e.g., Acme Corporation"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isGenerating}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputGroup>

        <ButtonGroup>
          <Button onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner />
                Generating...
              </>
            ) : (
              "Generate PDF"
            )}
          </Button>
        </ButtonGroup>

        <SkipNote>
          Leave blank to generate without customer name
        </SkipNote>
      </Modal>
    </Overlay>
  );
};

export default CustomerNameModal;
