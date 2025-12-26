// /src/components/elements/marketplace/PurchaseFlow.jsx
/**
 * Purchase Flow Component - Modal/page for buying credits
 */
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { CreditsMarketplaceAPI } from "../../../scripts/back_door";
import { ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import { Input } from "../../shared/input/Input";

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

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
  padding: 20px;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors?.ui100 || "#f4f4f5"};
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui200 || "#e4e4e7"};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ListingInfo = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const ListingTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  margin-bottom: 8px;
`;

const ListingMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
`;

const HelpText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#71717a"};
  margin-top: 6px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.ui300 || "#d4d4d8"};
  background: #ffffff;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.ui100 || "#f4f4f5"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled(Input)`
  width: 120px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const PriceSummary = styled.div`
  background: ${({ theme }) => theme.colors?.primary50 || "#e0f2ff"};
  border: 1px solid ${({ theme }) => theme.colors?.primary200 || "#bae6fd"};
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui700 || "#374151"};

  &:last-child {
    border-top: 1px solid ${({ theme }) => theme.colors?.primary200 || "#bae6fd"};
    margin-top: 8px;
    padding-top: 16px;
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const Step = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $active, $completed, theme }) =>
    $completed
      ? theme.colors?.primary500 || "#0284c7"
      : $active
      ? theme.colors?.primary100 || "#e0f2ff"
      : theme.colors?.ui100 || "#f4f4f5"};
  color: ${({ $active, $completed, theme }) =>
    $completed
      ? "#ffffff"
      : $active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui500 || "#71717a"};
  border: 2px solid
    ${({ $active, $completed, theme }) =>
      $active || $completed
        ? theme.colors?.primary500 || "#0284c7"
        : theme.colors?.ui200 || "#e4e4e7"};
`;

const StepConnector = styled.div`
  width: 40px;
  height: 2px;
  background: ${({ $completed, theme }) =>
    $completed ? theme.colors?.primary500 || "#0284c7" : theme.colors?.ui200 || "#e4e4e7"};
  align-self: center;
`;

const SuccessContent = styled.div`
  text-align: center;
  padding: 32px 0;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d1fae5;
  color: #16a34a;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const SuccessTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  margin-bottom: 8px;
`;

const SuccessMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  margin-bottom: 24px;
`;

const OrderDetails = styled.div`
  background: ${({ theme }) => theme.colors?.ui50 || "#fafafa"};
  border-radius: 8px;
  padding: 16px;
  text-align: left;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors?.red50 || "#fef2f2"};
  border: 1px solid ${({ theme }) => theme.colors?.red200 || "#fecaca"};
  color: ${({ theme }) => theme.colors?.red700 || "#b91c1c"};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const PaymentMethodCard = styled.div`
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors?.primary500 || "#0284c7" : theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.15s ease-out;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#22d3ee"};
  }
`;

const PaymentMethodTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaymentMethodDesc = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  margin-top: 4px;
`;

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function PurchaseFlow({ listing, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { STATES, ACTIONS } = useAppContext();
  const { user } = STATES || {};

  const [step, setStep] = useState(1); // 1: quantity, 2: payment, 3: confirm, 4: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(listing?.minimumPurchase || 1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderResult, setOrderResult] = useState(null);

  const pricePerUnit = listing?.pricePerUnit || 0;
  const subtotal = quantity * pricePerUnit;
  const serviceFee = subtotal * 0.025; // 2.5% service fee
  const total = subtotal + serviceFee;

  const handleQuantityChange = (value) => {
    const num = Math.max(listing?.minimumPurchase || 1, Math.min(listing?.quantity || 1, value));
    setQuantity(num);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleConfirmPurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await CreditsMarketplaceAPI.purchaseCredits({
        listingId: listing.id,
        buyerId: user?.uid,
        quantity,
        paymentMethod,
      });

      setOrderResult(result);
      setStep(4);

      ACTIONS?.logNotification?.("success", "Purchase completed successfully!");
      onSuccess?.(result);
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err.message || "Failed to complete purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = () => {
    onClose?.();
    navigate("/dashboard/buyer");
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && step !== 4 && onClose?.()}>
      <Modal>
        <ModalHeader>
          <h2>{step === 4 ? "Purchase Complete" : "Purchase Credits"}</h2>
          {step !== 4 && (
            <CloseButton onClick={onClose}>X</CloseButton>
          )}
        </ModalHeader>

        <ModalBody>
          {step !== 4 && (
            <StepIndicator>
              <Step $active={step === 1} $completed={step > 1}>
                {step > 1 ? "done" : "1"}
              </Step>
              <StepConnector $completed={step > 1} />
              <Step $active={step === 2} $completed={step > 2}>
                {step > 2 ? "done" : "2"}
              </Step>
              <StepConnector $completed={step > 2} />
              <Step $active={step === 3} $completed={step > 3}>
                3
              </Step>
            </StepIndicator>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Step 1: Select Quantity */}
          {step === 1 && (
            <>
              <ListingInfo>
                <ListingTitle>{listing?.title || "Credit Listing"}</ListingTitle>
                <ListingMeta>
                  <span>
                    {listing?.creditType?.replace("_", " ").toUpperCase() || "Credits"}
                  </span>
                  <span>
                    ${pricePerUnit.toFixed(2)}/{listing?.unit || "kg"}
                  </span>
                  <span>{listing?.quantity || 0} available</span>
                </ListingMeta>
              </ListingInfo>

              <FormGroup>
                <Label>Quantity to Purchase</Label>
                <QuantitySelector>
                  <QuantityButton
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= (listing?.minimumPurchase || 1)}
                  >
                    -
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    min={listing?.minimumPurchase || 1}
                    max={listing?.quantity}
                  />
                  <QuantityButton
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= listing?.quantity}
                  >
                    +
                  </QuantityButton>
                </QuantitySelector>
                <HelpText>
                  Min: {listing?.minimumPurchase || 1} | Max: {listing?.quantity}{" "}
                  {listing?.unit}
                </HelpText>
              </FormGroup>

              <PriceSummary>
                <PriceRow>
                  <span>
                    {quantity} {listing?.unit} x ${pricePerUnit.toFixed(2)}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Service Fee (2.5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </PriceRow>
              </PriceSummary>
            </>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <>
              <FormGroup>
                <Label>Select Payment Method</Label>

                <PaymentMethodCard
                  $selected={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                >
                  <PaymentMethodTitle>
                    Credit/Debit Card
                  </PaymentMethodTitle>
                  <PaymentMethodDesc>
                    Pay securely with Visa, Mastercard, or American Express
                  </PaymentMethodDesc>
                </PaymentMethodCard>

                <PaymentMethodCard
                  $selected={paymentMethod === "ach"}
                  onClick={() => setPaymentMethod("ach")}
                >
                  <PaymentMethodTitle>
                    Bank Transfer (ACH)
                  </PaymentMethodTitle>
                  <PaymentMethodDesc>
                    Direct bank transfer - may take 3-5 business days
                  </PaymentMethodDesc>
                </PaymentMethodCard>

                <PaymentMethodCard
                  $selected={paymentMethod === "crypto"}
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <PaymentMethodTitle>
                    Cryptocurrency
                  </PaymentMethodTitle>
                  <PaymentMethodDesc>
                    Pay with USDC or other supported tokens
                  </PaymentMethodDesc>
                </PaymentMethodCard>
              </FormGroup>

              <PriceSummary>
                <PriceRow>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </PriceRow>
              </PriceSummary>
            </>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <>
              <ListingInfo>
                <ListingTitle>Order Summary</ListingTitle>
              </ListingInfo>

              <div style={{ marginBottom: 16 }}>
                <PriceRow style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
                  <span>Credits</span>
                  <span>
                    {quantity} {listing?.unit} {listing?.creditType}
                  </span>
                </PriceRow>
                <PriceRow style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
                  <span>Seller</span>
                  <span>{listing?.sellerName || "Verified Seller"}</span>
                </PriceRow>
                <PriceRow style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
                  <span>Payment Method</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {paymentMethod === "ach" ? "Bank Transfer" : paymentMethod}
                  </span>
                </PriceRow>
              </div>

              <PriceSummary>
                <PriceRow>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </PriceRow>
              </PriceSummary>

              <div style={{ marginTop: 16, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
                By confirming, you agree to our Terms of Service and acknowledge
                that credits are non-refundable once transferred.
              </div>
            </>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <SuccessContent>
              <SuccessIcon>check</SuccessIcon>
              <SuccessTitle>Purchase Complete!</SuccessTitle>
              <SuccessMessage>
                Your credits have been added to your account.
              </SuccessMessage>

              <OrderDetails>
                <PriceRow>
                  <span>Order ID</span>
                  <span>{orderResult?.orderId || "ORD-" + Date.now()}</span>
                </PriceRow>
                <PriceRow>
                  <span>Credits Purchased</span>
                  <span>
                    {quantity} {listing?.unit}
                  </span>
                </PriceRow>
                <PriceRow>
                  <span>Total Paid</span>
                  <span>${total.toFixed(2)}</span>
                </PriceRow>
              </OrderDetails>
            </SuccessContent>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 1 && (
            <>
              <ButtonSecondary onClick={onClose}>Cancel</ButtonSecondary>
              <ButtonPrimary onClick={handleNext}>Continue</ButtonPrimary>
            </>
          )}

          {step === 2 && (
            <>
              <ButtonSecondary onClick={handleBack}>Back</ButtonSecondary>
              <ButtonPrimary onClick={handleNext}>Review Order</ButtonPrimary>
            </>
          )}

          {step === 3 && (
            <>
              <ButtonSecondary onClick={handleBack}>Back</ButtonSecondary>
              <ButtonPrimary onClick={handleConfirmPurchase} disabled={loading}>
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </ButtonPrimary>
            </>
          )}

          {step === 4 && (
            <ButtonPrimary onClick={handleViewOrder} fullWidth>
              View My Orders
            </ButtonPrimary>
          )}
        </ModalFooter>
      </Modal>
    </Overlay>
  );
}
