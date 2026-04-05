/**
 * ContactPage — public contact form for waterquality.trading.
 * Submits to the same Google Sheets endpoint used by BlueSignal.xyz landing.
 */

import { useState, useEffect } from 'react';
import styled from 'styled-components';

const CONTACT_EMAIL = 'hello@bluesignal.xyz';
const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbw0ixNkMTXHbLsykRpiQ-KTlIWkBZ8yTlD9R5QjAs4jT_9b1GrZnHeSbvVSuiLqNMWARA/exec';

const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a subject...' },
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Credit Programs', label: 'Credit Programs' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Press / Media', label: 'Press / Media' },
];

// ── Styled Components ────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  padding: 64px 24px 64px;
  background: #0b1120;
  color: #ffffff;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 96px 24px 80px;
  }
`;

const HeroInner = styled.div`
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin: 0 0 16px;
`;

const HeroSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  max-width: 520px;
  margin: 0 auto;
`;

const FormSection = styled.section`
  padding: 64px 24px 80px;
  background: ${({ theme }) => theme.colors.background};

  @media (max-width: 640px) {
    padding: 40px 16px 56px;
  }
`;

const FormCard = styled.div`
  max-width: 640px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 40px;

  @media (max-width: 640px) {
    padding: 24px 20px;
    border-radius: ${({ theme }) => theme.radius.md}px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const RequiredStar = styled.span`
  color: ${({ theme }) => theme.colors.negative};
  margin-left: 2px;
`;

const Input = styled.input`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? theme.colors.negative : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.negative : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ $hasError, theme }) => ($hasError ? 'rgba(239, 68, 68, 0.1)' : theme.colors.focus)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 12px 14px;
  padding-right: 40px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ $hasError, theme }) => ($hasError ? theme.colors.negative : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 12px 14px;
  outline: none;
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ $hasError, theme }) =>
      $hasError ? theme.colors.negative : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${({ $hasError, theme }) => ($hasError ? 'rgba(239, 68, 68, 0.1)' : theme.colors.focus)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FieldError = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.negative};
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  min-height: 52px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 200ms;
  box-shadow: 0 4px 24px rgba(0, 82, 204, 0.3);
  margin-top: 4px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 82, 204, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 48px 32px;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: ${({ theme }) => theme.colors.positive};
`;

const SuccessTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const SuccessDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const ErrorBanner = styled.div`
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.radius.md}px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.negative};
  text-align: center;
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.colors.negative};
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  margin-top: 16px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }
`;

const InfoSection = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 0 0;
  text-align: center;
`;

const InfoText = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 6px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PoweredBy = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 24px 0 0;
`;

// ── Component ────────────────────────────────────────────────

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us — WaterQuality.Trading';
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', company: '', subject: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const subjectLabel =
      SUBJECT_OPTIONS.find((t) => t.value === form.subject)?.label || 'General Inquiry';

    const data = {
      Name: form.name.trim(),
      Email: form.email.trim(),
      Company: form.company?.trim() || '',
      InquiryType: `[WQT] ${subjectLabel}`,
      Message: form.message.trim(),
    };

    const body = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => body.append(k, v));

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body,
      });
      setStatus('success');
      resetForm();
      return;
    } catch (_err) {
      // fetch failed, try sendBeacon
    }

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([body.toString()], {
          type: 'application/x-www-form-urlencoded',
        });
        const queued = navigator.sendBeacon(GOOGLE_SHEETS_URL, blob);
        if (queued) {
          setStatus('success');
          resetForm();
          return;
        }
      } catch {
        // sendBeacon failed, try iframe
      }
    }

    try {
      const frameName = 'gs-submit-' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = GOOGLE_SHEETS_URL;
      hiddenForm.target = frameName;

      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();

      setTimeout(() => {
        if (document.body.contains(hiddenForm)) document.body.removeChild(hiddenForm);
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      }, 30000);

      setStatus('success');
      resetForm();
    } catch {
      setErrorMsg(`Unable to submit. Please email ${CONTACT_EMAIL} directly.`);
      setStatus('error');
    }
  };

  const renderForm = () => {
    if (status === 'success') {
      return (
        <SuccessCard>
          <SuccessIcon>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </SuccessIcon>
          <SuccessTitle>Message sent!</SuccessTitle>
          <SuccessDesc>Thanks &mdash; we&apos;ll be in touch within 24&nbsp;hours.</SuccessDesc>
        </SuccessCard>
      );
    }

    if (status === 'error') {
      return (
        <SuccessCard>
          <SuccessIcon style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </SuccessIcon>
          <SuccessTitle>Something went wrong</SuccessTitle>
          <SuccessDesc>
            {errorMsg || 'We could not submit your message.'} You can email us directly at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#0052CC', fontWeight: 600 }}>
              {CONTACT_EMAIL}
            </a>
          </SuccessDesc>
          <RetryButton
            type="button"
            onClick={() => {
              setStatus('idle');
              setErrorMsg('');
            }}
          >
            Try Again
          </RetryButton>
        </SuccessCard>
      );
    }

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <FieldRow>
          <FieldGroup>
            <Label htmlFor="wqt-name">
              Name<RequiredStar>*</RequiredStar>
            </Label>
            <Input
              id="wqt-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              $hasError={!!errors.name}
              disabled={status === 'submitting'}
              autoComplete="name"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="wqt-email">
              Email<RequiredStar>*</RequiredStar>
            </Label>
            <Input
              id="wqt-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              $hasError={!!errors.email}
              disabled={status === 'submitting'}
              autoComplete="email"
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </FieldGroup>
        </FieldRow>

        <FieldRow>
          <FieldGroup>
            <Label htmlFor="wqt-company">Company / Organization</Label>
            <Input
              id="wqt-company"
              name="company"
              type="text"
              placeholder="Optional"
              value={form.company}
              onChange={handleChange}
              disabled={status === 'submitting'}
              autoComplete="organization"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="wqt-subject">Subject</Label>
            <Select
              id="wqt-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={status === 'submitting'}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FieldGroup>
        </FieldRow>

        <FieldGroup>
          <Label htmlFor="wqt-message">
            Message<RequiredStar>*</RequiredStar>
          </Label>
          <TextArea
            id="wqt-message"
            name="message"
            placeholder="Tell us about your question, project, or partnership interest..."
            value={form.message}
            onChange={handleChange}
            $hasError={!!errors.message}
            disabled={status === 'submitting'}
            rows={5}
          />
          {errors.message && <FieldError>{errors.message}</FieldError>}
        </FieldGroup>

        {errorMsg && (
          <ErrorBanner>
            {errorMsg} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </ErrorBanner>
        )}

        <SubmitButton type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Spinner /> Sending...
            </>
          ) : (
            'Send Message'
          )}
        </SubmitButton>
      </Form>
    );
  };

  return (
    <Page>
      <Hero>
        <HeroInner>
          <HeroTitle>Contact Us</HeroTitle>
          <HeroSub>
            Questions about the marketplace, credit programs, or partnerships? We&apos;d love to
            hear from you.
          </HeroSub>
        </HeroInner>
      </Hero>

      <FormSection>
        <FormCard>{renderForm()}</FormCard>

        <InfoSection>
          <InfoText>
            Or email us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </InfoText>
        </InfoSection>
      </FormSection>
    </Page>
  );
}
