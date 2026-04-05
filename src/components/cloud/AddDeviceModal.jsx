// /src/components/cloud/AddDeviceModal.jsx
// Modal for adding new devices to inventory (admin only)

import { useState, useEffect } from "react";
import styled from "styled-components";
import DeviceService from "../../services/deviceService";
import { useAppContext } from "../../context/AppContext";

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Body = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#0284c7"};
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#0284c7"};
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#0284c7"};
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors?.ui100 || "#f3f4f6"};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }
`;

const HelpText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #dc2626;
`;

const ProductInfo = styled.div`
  margin-top: 12px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
`;

const ProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  margin-bottom: 4px;
`;

const ProductPrice = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#4b5563"};
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 100px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d1d5db"};
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  }
`;

const SubmitButton = styled(Button)`
  background: ${({ theme }) => theme.colors?.primary600 || "#0284c7"};
  border: none;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.primary700 || "#0369a1"};
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function AddDeviceModal({ isOpen, onClose, onSuccess }) {
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES;
  const { logNotification } = ACTIONS;

  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [serialPrefix, setSerialPrefix] = useState("pgw-");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products on mount
  useEffect(() => {
    const availableProducts = DeviceService.getAvailableProducts();
    setProducts(availableProducts);
  }, []);

  // Update selected product when SKU changes
  useEffect(() => {
    if (sku) {
      const product = DeviceService.getProductBySku(sku);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [sku]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSku("");
      setQuantity(1);
      setSerialPrefix("pgw-");
      setNotes("");
      setErrors({});
      setSelectedProduct(null);
    }
  }, [isOpen]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!sku) {
      newErrors.sku = "Please select a product";
    }

    if (!quantity || quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    } else if (quantity > 50) {
      newErrors.quantity = "Maximum quantity is 50";
    }

    if (!serialPrefix || serialPrefix.length < 2) {
      newErrors.serialPrefix = "Prefix must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Check admin role
    if (user?.role !== "admin") {
      logNotification("error", "Only administrators can add devices");
      return;
    }

    setLoading(true);

    try {
      const result = await DeviceService.createDeviceBatch(sku, quantity, user.uid, {
        serialPrefix,
        notes,
      });

      if (result.success) {
        const message =
          quantity === 1
            ? `Created device ${result.firstSerial}`
            : `Created ${result.count} devices (${result.firstSerial} to ${result.lastSerial})`;

        logNotification("success", message);

        if (onSuccess) {
          onSuccess(result);
        }

        onClose();
      }
    } catch (error) {
      console.error("Error creating devices:", error);
      logNotification("error", error.message || "Failed to create devices");
    } finally {
      setLoading(false);
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, loading, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal role="dialog" aria-labelledby="add-device-title">
        <Header>
          <Title id="add-device-title">Add Devices to Inventory</Title>
          <CloseButton onClick={onClose} disabled={loading} aria-label="Close">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <Body>
            <FormGroup>
              <Label htmlFor="sku">Product SKU *</Label>
              <Select
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={loading}
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product.sku} value={product.sku}>
                    {product.sku} - {product.name} (${product.price.toLocaleString()})
                  </option>
                ))}
              </Select>
              {errors.sku && <ErrorText>{errors.sku}</ErrorText>}

              {selectedProduct && (
                <ProductInfo>
                  <ProductName>{selectedProduct.name}</ProductName>
                  <ProductPrice>
                    Unit Price: ${selectedProduct.price.toLocaleString()}
                  </ProductPrice>
                </ProductInfo>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                disabled={loading}
              />
              <HelpText>Create 1-50 devices in a single batch</HelpText>
              {errors.quantity && <ErrorText>{errors.quantity}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="serialPrefix">Serial Number Prefix</Label>
              <Input
                id="serialPrefix"
                type="text"
                value={serialPrefix}
                onChange={(e) => setSerialPrefix(e.target.value)}
                placeholder="pgw-"
                disabled={loading}
              />
              <HelpText>
                Default: pgw- (generates pgw-0001, pgw-0002, etc.)
              </HelpText>
              {errors.serialPrefix && <ErrorText>{errors.serialPrefix}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <TextArea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this batch..."
                disabled={loading}
              />
            </FormGroup>
          </Body>

          <Footer>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading || !sku}>
              {loading && <LoadingSpinner />}
              {loading ? "Creating..." : `Create ${quantity > 1 ? `${quantity} Devices` : "Device"}`}
            </SubmitButton>
          </Footer>
        </form>
      </Modal>
    </Overlay>
  );
}
