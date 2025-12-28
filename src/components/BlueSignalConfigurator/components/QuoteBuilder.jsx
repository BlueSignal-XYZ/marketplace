// Quote Builder Component for Sales Configurator
import React, { useState, useEffect } from "react";
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

// Saved Quotes Section
const SavedQuotesSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
  background: #f9fafb;
`;

const SavedQuotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SavedQuotesTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
`;

const SaveQuoteInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;

  input {
    flex: 1;
    padding: 8px 12px;
    font-size: 13px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    outline: none;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  }

  button {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    background: #059669;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #047857;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const SavedQuotesList = styled.div`
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SavedQuoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;

  .quote-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .quote-name {
      font-weight: 600;
      color: #1f2937;
    }

    .quote-meta {
      font-size: 11px;
      color: #9ca3af;
    }
  }

  .quote-actions {
    display: flex;
    gap: 4px;

    button {
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .load-btn {
      background: #3b82f6;
      color: white;
      border: none;

      &:hover {
        background: #2563eb;
      }
    }

    .delete-btn {
      background: none;
      color: #dc2626;
      border: 1px solid #fecaca;

      &:hover {
        background: #fef2f2;
      }
    }
  }
`;

const NoSavedQuotes = styled.div`
  text-align: center;
  padding: 16px;
  color: #9ca3af;
  font-size: 12px;
`;

// LocalStorage helpers for saved quotes
const SAVED_QUOTES_KEY = "bluesignal_saved_quotes";

const getSavedQuotes = () => {
  try {
    const saved = localStorage.getItem(SAVED_QUOTES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveQuoteToStorage = (name, items) => {
  const quotes = getSavedQuotes();
  const newQuote = {
    id: Date.now(),
    name,
    items,
    createdAt: new Date().toISOString(),
  };
  quotes.unshift(newQuote);
  // Keep only last 10 saved quotes
  const trimmed = quotes.slice(0, 10);
  localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(trimmed));
  return newQuote;
};

const deleteQuoteFromStorage = (id) => {
  const quotes = getSavedQuotes();
  const filtered = quotes.filter((q) => q.id !== id);
  localStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(filtered));
};

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
  onLoadQuote,
  products,
}) => {
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [saveQuoteName, setSaveQuoteName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Load saved quotes on mount
  useEffect(() => {
    if (isOpen) {
      setSavedQuotes(getSavedQuotes());
    }
  }, [isOpen]);

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

  const handleSaveQuote = () => {
    if (saveQuoteName.trim() && quoteItems.length > 0) {
      saveQuoteToStorage(saveQuoteName.trim(), quoteItems);
      setSavedQuotes(getSavedQuotes());
      setSaveQuoteName("");
      setShowSaveInput(false);
    }
  };

  const handleLoadQuote = (quote) => {
    if (onLoadQuote) {
      onLoadQuote(quote.items);
    }
  };

  const handleDeleteQuote = (id) => {
    deleteQuoteFromStorage(id);
    setSavedQuotes(getSavedQuotes());
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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

      {/* Saved Quotes Section */}
      <SavedQuotesSection>
        <SavedQuotesHeader>
          <SavedQuotesTitle>Saved Quotes</SavedQuotesTitle>
          {quoteItems.length > 0 && !showSaveInput && (
            <button
              onClick={() => setShowSaveInput(true)}
              style={{
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 600,
                background: "#059669",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save Current
            </button>
          )}
        </SavedQuotesHeader>

        {showSaveInput && (
          <SaveQuoteInput>
            <input
              type="text"
              placeholder="Quote name..."
              value={saveQuoteName}
              onChange={(e) => setSaveQuoteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveQuote()}
              autoFocus
            />
            <button onClick={handleSaveQuote} disabled={!saveQuoteName.trim()}>
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveInput(false);
                setSaveQuoteName("");
              }}
              style={{
                padding: "8px 12px",
                background: "#f3f4f6",
                color: "#6b7280",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </SaveQuoteInput>
        )}

        {savedQuotes.length === 0 ? (
          <NoSavedQuotes>No saved quotes yet</NoSavedQuotes>
        ) : (
          <SavedQuotesList>
            {savedQuotes.map((quote) => (
              <SavedQuoteItem key={quote.id}>
                <div className="quote-info">
                  <span className="quote-name">{quote.name}</span>
                  <span className="quote-meta">
                    {quote.items.length} items · {formatDate(quote.createdAt)}
                  </span>
                </div>
                <div className="quote-actions">
                  <button
                    className="load-btn"
                    onClick={() => handleLoadQuote(quote)}
                  >
                    Load
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteQuote(quote.id)}
                  >
                    ×
                  </button>
                </div>
              </SavedQuoteItem>
            ))}
          </SavedQuotesList>
        )}
      </SavedQuotesSection>

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
