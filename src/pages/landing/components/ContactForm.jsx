import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trackCTA } from '../utils/analytics';
import { firestore } from '../utils/firebase';

// ─── Configuration ───────────────────────────────────────────────────────────
const CONTACT_EMAIL = 'hello@bluesignal.xyz';
// ─────────────────────────────────────────────────────────────────────────────

const FormWrapper = styled.div`
  max-width: 520px;
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
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.red : theme.colors.w15};
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.w30};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.red : theme.colors.blue};
  }
`;

const TextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $hasError }) => $hasError ? theme.colors.red : theme.colors.w15};
  border-radius: 10px;
  padding: 12px 16px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.w30};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.red : theme.colors.blue};
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

const FieldError = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.red};
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

  a {
    color: ${({ theme }) => theme.colors.blueB};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const INQUIRY_TYPES = [
  { value: '', label: 'Select...' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'quote', label: 'Installation Quote' },
  { value: 'pilot', label: 'Pilot Program' },
  { value: 'devkit', label: 'Dev Kit Order' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'installer', label: 'Installer Network' },
];

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | mailto | error
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  // Listen for prefill-inquiry events (e.g. from Installation Quote CTA)
  useEffect(() => {
    const handler = (e) => {
      if (e.detail) {
        setForm((prev) => ({ ...prev, inquiryType: e.detail }));
      }
    };
    window.addEventListener('prefill-inquiry', handler);
    return () => window.removeEventListener('prefill-inquiry', handler);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    trackCTA('contact_submit', 'Contact Form');

    const inquiryLabel =
      INQUIRY_TYPES.find((t) => t.value === form.inquiryType)?.label || 'General Inquiry';

    // Primary: Firestore write
    if (firestore) {
      try {
        // Race addDoc against a 10-second timeout so the form never hangs
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );
        await Promise.race([
          addDoc(collection(firestore, 'contact_submissions'), {
            name: form.name,
            email: form.email,
            company: form.company || null,
            phone: null,
            inquiryType: inquiryLabel,
            message: form.message,
            source: 'landing-contact',
            createdAt: serverTimestamp(),
            status: 'new',
          }),
          timeout,
        ]);
        setStatus('success');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Firebase submission error:', err);
        // Auto-fallback to mailto so the inquiry still reaches the team
        const subject = encodeURIComponent(
          `BlueSignal ${inquiryLabel} — ${form.name}`
        );
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || 'N/A'}\nInquiry Type: ${inquiryLabel}\n\n${form.message}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setTimeout(() => setStatus('mailto'), 500);
      }
    } else {
      // Fallback: mailto — opens user's email client with pre-filled message
      const subject = encodeURIComponent(
        `BlueSignal ${inquiryLabel} — ${form.name}`
      );
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || 'N/A'}\nInquiry Type: ${inquiryLabel}\n\n${form.message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setTimeout(() => setStatus('mailto'), 500);
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
        <SuccessTitle>Message sent!</SuccessTitle>
        <SuccessDesc>
          Thanks! We&rsquo;ll be in touch within 24&nbsp;hours.
        </SuccessDesc>
      </SuccessWrapper>
    );
  }

  if (status === 'mailto') {
    return (
      <SuccessWrapper>
        <SuccessIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13 2 4" />
          </svg>
        </SuccessIcon>
        <SuccessTitle>Email prepared!</SuccessTitle>
        <SuccessDesc>
          Your email client should have opened with a pre-filled message.
          If it didn&rsquo;t, email us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </SuccessDesc>
      </SuccessWrapper>
    );
  }

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          <FieldGroup>
            <Label htmlFor="cf-name">Name *</Label>
            <Input
              id="cf-name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              $hasError={!!errors.name}
              autoComplete="name"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="cf-email">Email *</Label>
            <Input
              id="cf-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              $hasError={!!errors.email}
              autoComplete="email"
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </FieldGroup>
        </Row>

        <Row>
          <FieldGroup>
            <Label htmlFor="cf-company">Company</Label>
            <Input
              id="cf-company"
              name="company"
              type="text"
              placeholder="Optional"
              value={form.company}
              onChange={handleChange}
              autoComplete="organization"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="cf-inquiry">Inquiry Type</Label>
            <Select
              id="cf-inquiry"
              name="inquiryType"
              value={form.inquiryType}
              onChange={handleChange}
            >
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </FieldGroup>
        </Row>

        <FieldGroup>
          <Label htmlFor="cf-message">Message *</Label>
          <TextArea
            id="cf-message"
            name="message"
            placeholder="Tell us about your project or question..."
            value={form.message}
            onChange={handleChange}
            $hasError={!!errors.message}
          />
          {errors.message && <FieldError>{errors.message}</FieldError>}
        </FieldGroup>

        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

        <SubmitBtn type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
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

export default ContactForm;
