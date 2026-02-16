/**
 * WQT Purchase Flow — multi-step credit purchase with payment + blockchain mint.
 * Steps: Review → Payment → Confirmation → Receipt
 */

import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';

const Page = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 24px;
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
    $done ? theme.colors.primary :
    $active ? theme.colors.primary :
    theme.colors.background};
  color: ${({ $active, $done, theme }) =>
    ($done || $active) ? theme.colors.textOnPrimary : theme.colors.textMuted};
  border: 2px solid ${({ $active, $done, theme }) =>
    ($done || $active) ? theme.colors.primary : theme.colors.border};
`;

const StepLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ $active, theme }) => $active ? theme.colors.text : theme.colors.textMuted};
  @media (max-width: 640px) { display: none; }
`;

const StepLine = styled.div`
  width: 40px;
  height: 2px;
  background: ${({ $done, theme }) => $done ? theme.colors.primary : theme.colors.border};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
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
  background: ${({ $selected, theme }) => $selected ? `${theme.colors.primary}08` : theme.colors.background};
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: pointer;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
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

const STEPS = ['Review', 'Payment', 'Confirm', 'Receipt'];

export function PurchaseFlowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [quantity, setQuantity] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  // Placeholder listing data
  const listing = {
    id,
    nutrientType: 'nitrogen',
    pricePerCredit: 8.42,
    available: 250,
    region: 'Virginia - James River Basin',
    seller: 'BlueSignal IoT',
    verificationLevel: 'sensor-verified',
  };

  const total = (quantity * listing.pricePerCredit).toFixed(2);

  const handlePurchase = useCallback(async () => {
    setProcessing(true);
    // TODO: Call /v2/credits/purchase then /v2/blockchain/mint
    await new Promise((r) => setTimeout(r, 2000)); // Simulate
    setProcessing(false);
    setStep(3);
  }, []);

  return (
    <Page>
      <StepIndicator>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <StepLine $done={step >= i} />}
            <Step>
              <StepCircle $active={step === i} $done={step > i}>
                {step > i ? '✓' : i + 1}
              </StepCircle>
              <StepLabel $active={step === i}>{s}</StepLabel>
            </Step>
          </React.Fragment>
        ))}
      </StepIndicator>

      <Card>
        {step === 0 && (
          <>
            <Title>Review Order</Title>
            <Desc>Confirm the details of your credit purchase.</Desc>
            <Row><RowLabel>Credit Type</RowLabel><RowValue>Nitrogen (N)</RowValue></Row>
            <Row><RowLabel>Region</RowLabel><RowValue>{listing.region}</RowValue></Row>
            <Row><RowLabel>Seller</RowLabel><RowValue>{listing.seller}</RowValue></Row>
            <Row><RowLabel>Verification</RowLabel><RowValue><Badge variant="verified" size="sm" dot>Sensor Verified</Badge></RowValue></Row>
            <Row><RowLabel>Price per Credit</RowLabel><RowValue>${listing.pricePerCredit.toFixed(2)}</RowValue></Row>
            <Row>
              <RowLabel>Quantity (kg)</RowLabel>
              <div style={{ width: 100 }}>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(listing.available, Math.max(1, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={listing.available}
                />
              </div>
            </Row>
            <TotalRow>
              <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
              <TotalValue>${total}</TotalValue>
            </TotalRow>
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={() => setStep(1)}>Continue to Payment</Button>
            </ButtonRow>
          </>
        )}

        {step === 1 && (
          <>
            <Title>Payment Method</Title>
            <Desc>Choose how you'd like to pay for {quantity} kg of nitrogen credits.</Desc>
            <PaymentOptions>
              <PaymentOption $selected={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')}>
                <div>
                  <PaymentLabel>💳 Credit / Debit Card</PaymentLabel>
                  <PaymentDesc>Processed securely via Stripe</PaymentDesc>
                </div>
              </PaymentOption>
              <PaymentOption $selected={paymentMethod === 'wallet'} onClick={() => setPaymentMethod('wallet')}>
                <div>
                  <PaymentLabel>🔗 Crypto Wallet</PaymentLabel>
                  <PaymentDesc>Pay with MATIC or USDC on Polygon</PaymentDesc>
                </div>
              </PaymentOption>
            </PaymentOptions>

            {paymentMethod === 'card' && (
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
                🔗 Wallet connection — integrates with ethers.js / wagmi
              </div>
            )}

            <TotalRow style={{ borderTop: `1px solid ${'' || '#eee'}` }}>
              <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
              <TotalValue>${total}</TotalValue>
            </TotalRow>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Review & Confirm</Button>
            </ButtonRow>
          </>
        )}

        {step === 2 && (
          <>
            <Title>Confirm Purchase</Title>
            <Desc>Your credits will be minted on Polygon and added to your portfolio.</Desc>
            <Row><RowLabel>Quantity</RowLabel><RowValue>{quantity} kg nitrogen</RowValue></Row>
            <Row><RowLabel>Price</RowLabel><RowValue>${listing.pricePerCredit.toFixed(2)} / credit</RowValue></Row>
            <Row><RowLabel>Payment</RowLabel><RowValue>{paymentMethod === 'card' ? 'Card' : 'Wallet'}</RowValue></Row>
            <Row><RowLabel>Network</RowLabel><RowValue>Polygon</RowValue></Row>
            <TotalRow>
              <RowLabel style={{ fontSize: 16, fontWeight: 600 }}>Total</RowLabel>
              <TotalValue>${total}</TotalValue>
            </TotalRow>
            <ButtonRow>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handlePurchase} disabled={processing}>
                {processing ? 'Processing…' : 'Confirm Purchase'}
              </Button>
            </ButtonRow>
          </>
        )}

        {step === 3 && (
          <>
            <SuccessIcon>✅</SuccessIcon>
            <SuccessTitle>Purchase Complete</SuccessTitle>
            <SuccessSub>
              {quantity} kg of nitrogen credits have been minted to your wallet
              and added to your portfolio.
            </SuccessSub>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <DataCard label="Credits" value={quantity.toString()} unit="kg N" compact />
              <DataCard label="Total Paid" value={`$${total}`} compact />
            </div>
            <Row><RowLabel>Transaction Hash</RowLabel><RowValue>0xabc…def (pending)</RowValue></Row>
            <Row><RowLabel>Token ID</RowLabel><RowValue>#1043</RowValue></Row>
            <ButtonRow>
              <Button variant="outline" onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
              <Button onClick={() => navigate('/portfolio')}>View Portfolio</Button>
            </ButtonRow>
          </>
        )}
      </Card>
    </Page>
  );
}
