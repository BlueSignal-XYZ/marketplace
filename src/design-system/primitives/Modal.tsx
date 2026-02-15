/**
 * Modal — confirmation dialogs ONLY.
 * For destructive actions: delete device, cancel listing, retire credits.
 * NOT for onboarding, info, or page-load popups.
 */

import React, { useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Destructive styling for confirm button */
  destructive?: boolean;
  /** Loading state on confirm button */
  loading?: boolean;
  children?: React.ReactNode;
}

// ── Animation ─────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

// ── Styled ────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 150ms ease-out;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  box-shadow: ${({ theme }) => theme.elevation.modal};
  max-width: 440px;
  width: 100%;
  animation: ${scaleIn} 200ms ease-out;
`;

const Header = styled.div`
  padding: 24px 24px 0;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 8px 0 0;
  line-height: 1.5;
`;

const Body = styled.div`
  padding: 16px 24px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Btn = styled.button<{ $variant: 'cancel' | 'confirm' | 'destructive' }>`
  padding: 8px 16px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.fast};
  border: 1px solid;

  ${({ $variant, theme }) => {
    if ($variant === 'cancel') return `
      background: transparent;
      color: ${theme.colors.textSecondary};
      border-color: ${theme.colors.border};
      &:hover { background: ${theme.colors.background}; }
    `;
    if ($variant === 'destructive') return `
      background: #EF4444;
      color: #FFFFFF;
      border-color: transparent;
      &:hover { background: #DC2626; }
    `;
    return `
      background: ${theme.colors.primary};
      color: ${theme.colors.textOnPrimary};
      border-color: transparent;
      &:hover { opacity: 0.9; }
    `;
  }}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ── Component ─────────────────────────────────────────────

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
  loading = false,
  children,
}) => {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open, handleKey]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Header>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </Header>
        {children && <Body>{children}</Body>}
        <Footer>
          <Btn $variant="cancel" onClick={onClose}>{cancelLabel}</Btn>
          <Btn
            $variant={destructive ? 'destructive' : 'confirm'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </Btn>
        </Footer>
      </Dialog>
    </Overlay>
  );
};
