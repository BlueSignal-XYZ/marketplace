import { useState } from 'react';
import styled from 'styled-components';
import { trackCTA } from '../utils/analytics';

const FormWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  text-align: left;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.w50};
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w15};
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.w30};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue};
  }
`;

const Select = styled.select`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.w15};
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23808080' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue};
  }

  option {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: 1fr;
  }
`;

const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 28px;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: scale(1.04);
    box-shadow: 0 0 24px rgba(255,255,255,0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.red};
  text-align: center;
`;

const SuccessWrapper = styled.div`
  text-align: center;
  padding: 24px 0;
`;

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.greenDim};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.colors.green};
  }
`;

const SuccessTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
`;

const SuccessDesc = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.w50};
  line-height: 1.6;
`;

const CLOUD_FN_URL = 'https://us-central1-app-neptunechain.cloudfunctions.net/app';

const PreOrderForm = () => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    useCase: '',
    quantity: '1',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;

    setStatus('submitting');
    setErrorMsg('');
    trackCTA('preorder_submit', 'CTA Form');

    try {
      const res = await fetch(`${CLOUD_FN_URL}/preOrderCapture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name || undefined,
          useCase: form.useCase || undefined,
          quantity: form.quantity,
          source: 'landing',
        }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setErrorMsg('Something went wrong. Please email hello@bluesignal.xyz directly.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <SuccessWrapper>
        <SuccessIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </SuccessIcon>
        <SuccessTitle>Reserved.</SuccessTitle>
        <SuccessDesc>
          We&rsquo;ll email you when dev kits ship Q2&nbsp;2026.
        </SuccessDesc>
      </SuccessWrapper>
    );
  }

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="po-email">Email *</Label>
          <Input
            id="po-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="po-name">Name</Label>
          <Input
            id="po-name"
            name="name"
            type="text"
            placeholder="Optional"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
        </FieldGroup>

        <Row>
          <FieldGroup>
            <Label htmlFor="po-usecase">Use Case</Label>
            <Select
              id="po-usecase"
              name="useCase"
              value={form.useCase}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="aquaculture">Aquaculture</option>
              <option value="algae-control">Algae Control</option>
              <option value="stormwater">Stormwater</option>
              <option value="residential">Residential</option>
              <option value="research">Research</option>
              <option value="other">Other</option>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="po-quantity">Quantity</Label>
            <Select
              id="po-quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2-5">2 – 5</option>
              <option value="6-10">6 – 10</option>
              <option value="10+">10+</option>
            </Select>
          </FieldGroup>
        </Row>

        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

        <SubmitBtn type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Reserving...' : 'Reserve Your Dev Kit'}
          {status !== 'submitting' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </SubmitBtn>
      </Form>
    </FormWrapper>
  );
};

export default PreOrderForm;
