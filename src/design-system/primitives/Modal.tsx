/**
 * Modal — confirmation dialogs ONLY.
 * For destructive actions: delete device, cancel listing, retire credits.
 * NOT for onboarding, info, or page-load popups.
 */

import React, { useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface ModalProps {
  /** Control open/close with boolean */
  open?: boolean;
  /** Alternative: use isOpen (alias for open) */
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** If not provided, footer with confirm/cancel buttons is hidden (info modal) */
  onConfirm?: () => void;
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 0;
    align-items: stretch;
  }
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  box-shadow: ${({ theme }) => theme.elevation.modal};
  max-width: 440px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${scaleIn} 200ms ease-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    border-radius: 0;
    animation: none;
  }
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
    if ($variant === 'cancel')
      return `
      background: transparent;
      color: ${theme.colors.textSecondary};
      border-color: ${theme.colors.border};
      &:hover { background: ${theme.colors.background}; }
    `;
    if ($variant === 'destructive')
      return `
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ── Component ─────────────────────────────────────────────

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${({ theme }) => theme.colors.background};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.animation.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Modal: React.FC<ModalProps> = ({
  open,
  isOpen,
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
  const isVisible = open ?? isOpen ?? false;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isVisible, handleKey]);

  if (!isVisible) return null;

  return (
    <Overlay onClick={onClose}>
      <Dialog
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ position: 'relative', maxWidth: onConfirm ? 440 : 560 }}
      >
        <CloseBtn onClick={onClose} aria-label="Close">
          ×
        </CloseBtn>
        <Header>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </Header>
        {children && <Body>{children}</Body>}
        {onConfirm && (
          <Footer>
            <Btn $variant="cancel" onClick={onClose}>
              {cancelLabel}
            </Btn>
            <Btn
              $variant={destructive ? 'destructive' : 'confirm'}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : confirmLabel}
            </Btn>
          </Footer>
        )}
      </Dialog>
    </Overlay>
  );
};
