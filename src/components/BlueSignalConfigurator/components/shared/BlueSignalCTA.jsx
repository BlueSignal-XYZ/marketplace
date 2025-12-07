// BlueSignal CTA Component - Cross-linking to BlueSignal.xyz
import React from 'react';
import styled from 'styled-components';

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CTALink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #60a5fa;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    color: #93c5fd;
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CTABanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const BannerText = styled.div`
  font-size: 14px;
  color: #e2e8f0;

  strong {
    color: #60a5fa;
  }
`;

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
);

/**
 * BlueSignal CTA Component
 * @param {Object} props
 * @param {string} props.productSlug - Product identifier for tracking
 * @param {'button' | 'link' | 'banner'} props.variant - Display variant
 * @param {string} props.text - Custom text (optional)
 */
export const BlueSignalCTA = ({ productSlug, variant = 'button', text }) => {
  const href = `https://bluesignal.xyz${productSlug ? `?product=${productSlug}` : ''}${productSlug ? '&' : '?'}source=wqt`;

  if (variant === 'link') {
    return (
      <CTALink href={href} target="_blank" rel="noopener noreferrer">
        {text || 'Contact BlueSignal for Hardware'} <ArrowIcon />
      </CTALink>
    );
  }

  if (variant === 'banner') {
    return (
      <CTABanner>
        <BannerText>
          <strong>Ready to order?</strong> Get a custom quote from BlueSignal for hardware, installation, and support.
        </BannerText>
        <CTAButton href={href} target="_blank" rel="noopener noreferrer">
          Get a Quote <ArrowIcon />
        </CTAButton>
      </CTABanner>
    );
  }

  return (
    <CTAButton href={href} target="_blank" rel="noopener noreferrer">
      {text || 'Get a Quote'} <ArrowIcon />
    </CTAButton>
  );
};

/**
 * Small footer link for auth pages
 */
export const BlueSignalFooterLink = styled.footer`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || '#6b7280'};

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default BlueSignalCTA;
