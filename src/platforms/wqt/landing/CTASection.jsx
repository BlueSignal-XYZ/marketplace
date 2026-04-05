/**
 * CTASection — final CTA with contact form for waterquality.trading.
 * Uses same Google Sheets backend as BlueSignal, with source field to distinguish leads.
 */

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import RevealOnScroll from './RevealOnScroll';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw0ixNkMTXHbLsykRpiQ-KTlIWkBZ8yTlD9R5QjAs4jT_9b1GrZnHeSbvVSuiLqNMWARA/exec';
const CONTACT_EMAIL = 'hello@bluesignal.xyz';

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.7; }
`;

const Section = styled.section`
  position: relative;
  padding: 48px clamp(16px, 5vw, 48px);
  background: #0B1120;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 64px clamp(20px, 5vw, 48px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 100px clamp(20px, 5vw, 48px);
  }
`;

const BlueGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(280px, 80vw, 600px);
  height: clamp(180px, 60vw, 400px);
  background: radial-gradient(ellipse, rgba(6, 182, 212, 0.06) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  animation: ${pulse} 8s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Inner = styled.div`
  position: relative;
  max-width: 560px;
  margin: 0 auto;
  z-index: 1;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 16px;
  letter-spacing: -0.03em;
  text-wrap: balance;
`;

const SectionSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(15px, 1.4vw, 17px);
  color: rgba(255, 255, 255, 0.5);
  margin: 0 auto 48px;
  line-height: 1.7;
  max-width: 480px;
  text-wrap: pretty;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 32px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  text-decoration: none;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  white-space: nowrap;
  margin-bottom: 40px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }
  &:active { transform: translateY(0); }
`;

/* ── Form ──────────────────────────────────────────────── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
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
  color: rgba(255, 255, 255, 0.45);
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ $hasError }) => $hasError ? '#EF4444' : 'rgba(255, 255, 255, 0.12)'};
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  transition: border-color 200ms;

  &::placeholder { color: rgba(255, 255, 255, 0.25); }
  &:focus { border-color: ${({ $hasError }) => $hasError ? '#EF4444' : '#3B82F6'}; }
`;

const Select = styled.select`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 200ms;

  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }

  option {
    background: #1a1f2e;
    color: #FFFFFF;
  }
`;

const TextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  min-height: 100px;
  resize: vertical;
  transition: border-color 200ms;

  &::placeholder { color: rgba(255, 255, 255, 0.25); }
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const SubmitBtn = styled.button`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 200ms;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0, 82, 204, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  text-align: center;
  background: ${({ $type }) => $type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${({ $type }) => $type === 'success' ? '#10B981' : '#EF4444'};
`;

const SecondaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 200ms;

  &:hover { color: rgba(255, 255, 255, 0.7); }
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: #EF4444;
`;

const INQUIRY_OPTIONS = [
  'Utility Program Demo',
  'Become a Participant',
  'Partnership Inquiry',
  'General Inquiry',
];

export function CTASection({ audience: _audience, content }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    inquiry: INQUIRY_OPTIONS[0],
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('submitting');

    const payload = new FormData();
    payload.append('name', form.name.trim());
    payload.append('email', form.email.trim());
    payload.append('company', form.company.trim());
    payload.append('inquiry', form.inquiry);
    payload.append('message', form.message.trim());
    payload.append('source', 'waterquality.trading');

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      });
      setStatus('success');
      setForm({ name: '', email: '', company: '', inquiry: INQUIRY_OPTIONS[0], message: '' });
    } catch {
      // Fallback: sendBeacon
      try {
        const urlParams = new URLSearchParams();
        urlParams.append('name', form.name.trim());
        urlParams.append('email', form.email.trim());
        urlParams.append('company', form.company.trim());
        urlParams.append('inquiry', form.inquiry);
        urlParams.append('message', form.message.trim());
        urlParams.append('source', 'waterquality.trading');
        navigator.sendBeacon(GOOGLE_SHEETS_URL, urlParams);
        setStatus('success');
        setForm({ name: '', email: '', company: '', inquiry: INQUIRY_OPTIONS[0], message: '' });
      } catch {
        setStatus('error');
      }
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <Section id="contact">
      <BlueGlow />
      <Inner>
        <RevealOnScroll>
          <SectionTitle>{content?.headline || 'Start Earning From Your Water Generator'}</SectionTitle>
          <SectionSub>
            Tell us about your home, facility, or utility. We&rsquo;ll show you how to
            get started with an AWG and start earning water credits.
          </SectionSub>
          {content?.href && (
            <CTAButton href={content.href}>{content.label}</CTAButton>
          )}
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          {status === 'success' ? (
            <StatusMessage $type="success">
              Thanks! We'll be in touch within 24 hours.
            </StatusMessage>
          ) : (
            <Form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <Label htmlFor="wqt-name">Name *</Label>
                <Input
                  id="wqt-name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange('name')}
                  $hasError={!!errors.name}
                />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="wqt-email">Email *</Label>
                <Input
                  id="wqt-email"
                  type="email"
                  placeholder="you@utility.gov"
                  value={form.email}
                  onChange={handleChange('email')}
                  $hasError={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="wqt-company">Company / Utility</Label>
                <Input
                  id="wqt-company"
                  type="text"
                  placeholder="Organization name"
                  value={form.company}
                  onChange={handleChange('company')}
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="wqt-inquiry">Inquiry Type</Label>
                <Select
                  id="wqt-inquiry"
                  value={form.inquiry}
                  onChange={handleChange('inquiry')}
                >
                  {INQUIRY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="wqt-message">Message *</Label>
                <TextArea
                  id="wqt-message"
                  placeholder="Tell us about your project or utility..."
                  value={form.message}
                  onChange={handleChange('message')}
                />
                {errors.message && <ErrorText>{errors.message}</ErrorText>}
              </FieldGroup>

              <SubmitBtn type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Get in Touch'}
              </SubmitBtn>

              {status === 'error' && (
                <StatusMessage $type="error">
                  Something went wrong. Please try again or email us at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#EF4444', textDecoration: 'underline' }}>
                    {CONTACT_EMAIL}
                  </a>
                </StatusMessage>
              )}
            </Form>
          )}

          <SecondaryLink href="/registry">
            Or explore the Credit Registry <span aria-hidden>→</span>
          </SecondaryLink>
        </RevealOnScroll>
      </Inner>
    </Section>
  );
}
