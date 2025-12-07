// Quote Builder Component for Sales Configurator
import React from "react";
import styled from "styled-components";

const QuotePanel = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 380px;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const QuoteHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
`;

const QuoteTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: #e5e7eb;
    color: #1f2937;
  }
`;

const QuoteBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;

  h4 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #6b7280;
  }

  p {
    margin: 0;
    font-size: 13px;
  }
`;

const QuoteItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const ItemSubtitle = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;

  &:hover {
    background: #fef2f2;
  }
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  min-width: 24px;
  text-align: center;
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #059669;
`;

const QuoteFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const TotalValue = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #059669;
`;

const SubtotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant }) =>
    variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AddToQuoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    transform: translateY(-1px);
  }
`;

const QuoteCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FloatingQuoteButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.5);
  }
`;

// Main Quote Builder Component
export const QuoteBuilder = ({
  isOpen,
  onClose,
  quoteItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearQuote,
  onExportPDF,
  onShareQuote,
  products,
}) => {
  if (!isOpen) return null;

  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = quoteItems.reduce(
    (sum, item) => sum + products[item.productId].price * item.quantity,
    0
  );

  const handleShareQuote = () => {
    if (onShareQuote) {
      onShareQuote();
    }
  };

  return (
    <QuotePanel>
      <QuoteHeader>
        <QuoteTitle>Quote Builder ({totalItems} items)</QuoteTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </QuoteHeader>

      <QuoteBody>
        {quoteItems.length === 0 ? (
          <EmptyState>
            <h4>No items in quote</h4>
            <p>Click "Add to Quote" on any product to start building your quote.</p>
          </EmptyState>
        ) : (
          quoteItems.map((item) => {
            const product = products[item.productId];
            return (
              <QuoteItem key={item.productId}>
                <ItemHeader>
                  <div>
                    <ItemName>{product.name}</ItemName>
                    <ItemSubtitle>{product.subtitle}</ItemSubtitle>
                  </div>
                  <RemoveButton onClick={() => onRemoveItem(item.productId)}>
                    ×
                  </RemoveButton>
                </ItemHeader>
                <ItemControls>
                  <QuantityControl>
                    <QuantityButton
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </QuantityButton>
                    <QuantityValue>{item.quantity}</QuantityValue>
                    <QuantityButton
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </QuantityButton>
                  </QuantityControl>
                  <ItemPrice>
                    ${(product.price * item.quantity).toLocaleString()}
                  </ItemPrice>
                </ItemControls>
              </QuoteItem>
            );
          })
        )}
      </QuoteBody>

      <QuoteFooter>
        <SubtotalRow>
          <span>Subtotal ({totalItems} units)</span>
          <span>${subtotal.toLocaleString()}</span>
        </SubtotalRow>
        <TotalRow>
          <TotalLabel>Quote Total</TotalLabel>
          <TotalValue>${subtotal.toLocaleString()}</TotalValue>
        </TotalRow>
        <ActionButtons>
          <ActionButton
            onClick={onClearQuote}
            disabled={quoteItems.length === 0}
          >
            Clear
          </ActionButton>
          <ActionButton
            onClick={handleShareQuote}
            disabled={quoteItems.length === 0}
          >
            Share
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={onExportPDF}
            disabled={quoteItems.length === 0}
          >
            Export PDF
          </ActionButton>
        </ActionButtons>
      </QuoteFooter>
    </QuotePanel>
  );
};

// Floating button to open quote
export const QuoteFloatingButton = ({ itemCount, onClick }) => (
  <FloatingQuoteButton onClick={onClick} title="Open Quote Builder">
    📋
    {itemCount > 0 && <QuoteCount>{itemCount}</QuoteCount>}
  </FloatingQuoteButton>
);

// Add to quote button for product cards
export const AddToQuoteBtn = ({ onClick, inQuote }) => (
  <AddToQuoteButton onClick={onClick}>
    {inQuote ? "✓ In Quote" : "+ Add to Quote"}
  </AddToQuoteButton>
);

export default QuoteBuilder;
