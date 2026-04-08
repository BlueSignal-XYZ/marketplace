/**
 * WQT Purchase Flow — multi-step credit purchase with payment + blockchain mint.
 * Steps: Review → Payment → Confirm → Receipt
 * Wired to /v2/market/listing/:id and /v2/credits/purchase.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { getListing, ApiError } from '../../../services/v2/client';
import { usePurchaseMutation } from '../../../shared/hooks/useApiQueries';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const Page = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 32px 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 48px 0;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  background: ${({ $active, $done, theme }) =>
    $done ? theme.colors.primary : $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, $done, theme }) =>
    $done || $active ? theme.colors.textOnPrimary : theme.colors.textMuted};
  border: 2px solid
    ${({ $active, $done, theme }) =>
      $done || $active ? theme.colors.primary : theme.colors.border};
`;

const StepLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ $active, theme }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  @media (max-width: 640px) {
    display: none;
  }
`;

const StepLine = styled.div`
  width: 40px;
  height: 2px;
  background: ${({ $done, theme }) => ($done ? theme.colors.primary : theme.colors.border)};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    width: 20px;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 20px 16px;
    border-radius: ${({ theme }) => theme.radius.md}px;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const RowLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RowValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TotalRow = styled(Row)`
  border-bottom: none;
  padding-top: 16px;
`;

const TotalValue = styled(RowValue)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  text-align: center;
  margin-bottom: 16px;
`;

const SuccessTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0 0 8px;
`;

const SuccessSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin: 0 0 24px;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.colors.primary}08` : theme.colors.background};
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PaymentLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PaymentDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorBanner = styled.div`
  padding: 16px 20px;
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.2);
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const SpinnerWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 16px;
  text-align: center;
`;

const SpinnerText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const STEPS = ['Review', 'Payment', 'Confirm', 'Receipt'];

function verificationLabel(level) {
  const map = {
    'sensor-verified': 'Sensor Verified',
    'third-party': 'Third-Party',
    'self-reported': 'Pending',
  };
  return map[level] || level || 'Unknown';
}

function LoadingSkeleton() {
  return (
    <Card>
      <Skeleton width={200} height={24} />
      <div style={{ height: 12 }} />
      <Skeleton width={300} height={14} />
      <div style={{ height: 24 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={14} />
        </div>
      ))}
    </Card>
  );
}

export function PurchaseFlowPage() {
  useEffect(() => {
    document.title = 'Purchase — WaterQuality.Trading';
  }, []);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const purchaseMutation = usePurchaseMutation();

  const [step, setStep] = useState(0);
  const [quantity, setQuantity] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  // Listing fetch state
  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [listingError, setListingError] = useState(null);

  // Purchase state
  const [purchaseError, setPurchaseError] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const processing = purchaseMutation.isPending;

  // Fetch listing on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setListingLoading(true);
      setListingError(null);
      try {
        const data = await getListing(id);
        if (!cancelled) {
          setListing(data);
          setQuantity(Math.min(50, data.quantity || 50));
        }
      } catch (err) {
        if (!cancelled) {
          setListingError(err instanceof ApiError ? err.message : 'Failed to load listing.');
        }
      } finally {
        if (!cancelled) setListingLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const total = listing ? (quantity * (listing.pricePerCredit || 0)).toFixed(2) : '0.00';
  const maxQty = listing?.quantity || 1;

  const handlePurchase = useCallback(() => {
    if (!listing) return;
    setPurchaseError(null);

    purchaseMutation.mutate(
      { listingId: id, quantity, paymentMethod },
      {
        onSuccess: (result) => {
          setPurchaseResult(result);
          setStep(3);
          toast({
            type: 'success',
            message: 'Purchase complete! Credits added to your portfolio.',
          });
        },
        onError: (err) => {
          const msg = err instanceof ApiError ? err.message : 'Purchase failed. Please try again.';
          setPurchaseError(msg);
          toast({ type: 'error', message: msg });
        },
      }
    );
  }, [listing, id, quantity, paymentMethod, toast, purchaseMutation]);

  const handleBack = useCallback(
    (targetStep) => {
      if (
        step >= 2 &&
        !window.confirm(
          'Are you sure you want to go back? Your progress on this step will be lost.'
        )
      )
        return;
      setStep(targetStep);
      setPurchaseError(null);
    },
    [step]
  );

  // Loading state
  if (listingLoading) {
    return (
      <Page>
        <StepIndicator>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <StepLine $done={false} />}
              <Step>
                <StepCircle $active={i === 0} $done={false}>
                  {i + 1}
                </StepCircle>
                <StepLabel $active={i === 0}>{s}</StepLabel>
              </Step>
            </React.Fragment>
          ))}
        </StepIndicator>
        <LoadingSkeleton />
      </Page>
    );
  }

  // Error loading listing
  if (listingError || !listing) {
    return (
      <Page>
        <Card>
          <Title>Listing not found</Title>
          <Desc>{listingError || 'This listing may no longer be available.'}</Desc>
          <ButtonRow>
            <Button variant="outline" onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </ButtonRow>
        </Card>
      </Page>
    );
  }

  const nutrientLabel =
    listing.nutrientType === 'nitrogen'
      ? 'Nitrogen (N)'
      : listing.nutrientType === 'phosphorus'
        ? 'Phosphorus (P)'
        : 'Combined';

  return (
    <Page>
      <StepIndicator>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <StepLine $done={step >= i} />}
            <Step>
              <StepCircle $active={step === i} $done={step > i}>
                {step > i ? '\u2713' : i + 1}
              </StepCircle>
              <StepLabel $active={step === i}>{s}</StepLabel>
            </Step>
          </React.Fragment>
        ))}
      </StepIndicator>

      <Card>
        {/* ── Step 0: Review ─── */}
        {step === 0 && (
          <>
            <Title>Review Order</Title>
            <Desc>Confirm the details of your credit purchase.</Desc>
            <Row>
              <RowLabel>Credit Type</RowLabel>
              <RowValue>{nutrientLabel}</RowValue>
            </Row>
            <Row>
              <RowLabel>Region</RowLabel>
              <RowValue>{listing.region || '\u2014'}</RowValue>
            </Row>
            <Row>
              <RowLabel>Seller</RowLabel>
              <RowValue>{listing.sellerName || '\u2014'}</RowValue>
            </Row>
            <Row>
              <RowLabel>Verification</RowLabel>
              <RowValue>
                <Badge variant="verified" size="sm" dot>
                  {verificationLabel(listing.verificationLevel)}
                </Badge>
              </RowValue>
            </Row>
            <Row>
              <RowLabel>Price per Credit</RowLabel>
              <RowValue>${(listing.pricePerCredit || 0).toFixed(2)}</RowValue>
            </Row>
            <Row>
              <RowLabel>Quantity (kg)</RowLabel>
              <div style={{ width: 100 }}>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                  min={1}
                  max={maxQty}
                />
              </div>
            </Row>
            <TotalRow>
              <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
              <TotalValue>${total}</TotalValue>
            </TotalRow>
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button onClick={() => setStep(1)}>Continue to Payment</Button>
            </ButtonRow>
          </>
        )}

        {/* ── Step 1: Payment ─── */}
        {step === 1 && (
          <>
            <Title>Payment Method</Title>
            <Desc>
              Choose how you&apos;d like to pay for {quantity} kg of {listing.nutrientType} credits.
            </Desc>
            <PaymentOptions>
              <PaymentOption
                $selected={paymentMethod === 'stripe'}
                onClick={() => setPaymentMethod('stripe')}
              >
                <div>
                  <PaymentLabel>Credit / Debit Card</PaymentLabel>
                  <PaymentDesc>Processed securely via Stripe</PaymentDesc>
                </div>
              </PaymentOption>
              <PaymentOption
                $selected={paymentMethod === 'wallet'}
                onClick={() => setPaymentMethod('wallet')}
              >
                <div>
                  <PaymentLabel>Crypto Wallet</PaymentLabel>
                  <PaymentDesc>Pay with MATIC or USDC on Polygon</PaymentDesc>
                </div>
              </PaymentOption>
            </PaymentOptions>

            {paymentMethod === 'stripe' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Card Number" placeholder="4242 4242 4242 4242" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input label="Expiry" placeholder="MM / YY" />
                  <Input label="CVC" placeholder="123" />
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div style={{ padding: 24, textAlign: 'center', color: '#888', fontSize: 14 }}>
                Your connected wallet will be used to pay with MATIC or USDC on Polygon. Ensure
                MetaMask is connected.
              </div>
            )}

            <TotalRow style={{ borderTop: '1px solid #eee' }}>
              <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
              <TotalValue>${total}</TotalValue>
            </TotalRow>
            <ButtonRow>
              <Button variant="outline" onClick={() => handleBack(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)}>Review &amp; Confirm</Button>
            </ButtonRow>
          </>
        )}

        {/* ── Step 2: Confirm ─── */}
        {step === 2 && (
          <>
            <Title>Confirm Purchase</Title>
            <Desc>Your credits will be minted on Polygon and added to your portfolio.</Desc>

            {purchaseError && (
              <ErrorBanner>
                <ErrorText>{purchaseError}</ErrorText>
                <Button variant="outline" size="sm" onClick={() => setPurchaseError(null)}>
                  Dismiss
                </Button>
              </ErrorBanner>
            )}

            {processing ? (
              <SpinnerWrap>
                <Skeleton width={48} height={48} />
                <SpinnerText>Processing your purchase...</SpinnerText>
                <SpinnerText style={{ fontSize: 12 }}>Please do not close this page.</SpinnerText>
              </SpinnerWrap>
            ) : (
              <>
                <Row>
                  <RowLabel>Quantity</RowLabel>
                  <RowValue>
                    {quantity} kg {listing.nutrientType}
                  </RowValue>
                </Row>
                <Row>
                  <RowLabel>Price</RowLabel>
                  <RowValue>${(listing.pricePerCredit || 0).toFixed(2)} / credit</RowValue>
                </Row>
                <Row>
                  <RowLabel>Payment</RowLabel>
                  <RowValue>{paymentMethod === 'stripe' ? 'Card' : 'Wallet'}</RowValue>
                </Row>
                <Row>
                  <RowLabel>Network</RowLabel>
                  <RowValue>Polygon</RowValue>
                </Row>
                <TotalRow>
                  <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
                  <TotalValue>${total}</TotalValue>
                </TotalRow>
                <ButtonRow>
                  <Button variant="outline" onClick={() => handleBack(1)}>
                    Back
                  </Button>
                  <Button onClick={handlePurchase}>Confirm Purchase</Button>
                </ButtonRow>
              </>
            )}
          </>
        )}

        {/* ── Step 3: Receipt ─── */}
        {step === 3 && (
          <>
            <SuccessIcon>{'\u2705'}</SuccessIcon>
            <SuccessTitle>Purchase Complete</SuccessTitle>
            <SuccessSub>
              {quantity} kg of {listing.nutrientType} credits have been added to your portfolio.
            </SuccessSub>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}
            >
              <DataCard
                label="Credits"
                value={quantity.toString()}
                unit={`kg ${listing.nutrientType === 'nitrogen' ? 'N' : 'P'}`}
                compact
              />
              <DataCard label="Total Paid" value={`$${total}`} compact />
            </div>
            <Row>
              <RowLabel>Purchase ID</RowLabel>
              <RowValue>{purchaseResult?.purchaseId || '\u2014'}</RowValue>
            </Row>
            <Row>
              <RowLabel>Status</RowLabel>
              <RowValue>
                <Badge
                  variant={purchaseResult?.status === 'confirmed' ? 'verified' : 'warning'}
                  size="sm"
                >
                  {purchaseResult?.status || 'pending'}
                </Badge>
              </RowValue>
            </Row>
            {purchaseResult?.transactionHash && (
              <Row>
                <RowLabel>Transaction Hash</RowLabel>
                <RowValue>{purchaseResult.transactionHash}</RowValue>
              </Row>
            )}
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate('/marketplace')}>
                Back to Marketplace
              </Button>
              <Button onClick={() => navigate('/portfolio')}>View Portfolio</Button>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
}

export default PurchaseFlowPage;
