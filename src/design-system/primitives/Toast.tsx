/**
 * Toast — THE single notification system for both platforms.
 * Renders from useToast() hook data. Auto-dismiss, top-right, max 2 visible.
 * Replaces NotificationPopup, ResultPopup, NotificationBar.
 */

import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import type { Toast as ToastData, ToastType } from '../../shared/hooks/useToast';

// ── Types ─────────────────────────────────────────────────

export interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

// ── Icon helper ───────────────────────────────────────────

function getIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
  }
}

function getSemanticColors(type: ToastType, theme: import('styled-components').DefaultTheme) {
  const c = theme.components as Record<string, string>;
  switch (type) {
    case 'success':
      return { bg: c.toastSuccessBg, border: c.toastSuccessBorder };
    case 'error':
      return { bg: c.toastErrorBg, border: c.toastErrorBorder };
    case 'warning':
      return { bg: c.toastWarningBg, border: c.toastWarningBorder };
    case 'info':
      return { bg: c.toastInfoBg, border: c.toastInfoBorder };
  }
}

// ── Animations ────────────────────────────────────────────

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const _slideOut = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
`;

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  max-width: 420px;
  width: calc(100% - 32px);

  @media (max-width: 640px) {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 32px);
  }
`;

const ToastCard = styled.div<{ $type: ToastType }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme, $type }) => getSemanticColors($type, theme).bg};
  border-left: 3px solid ${({ theme, $type }) => getSemanticColors($type, theme).border};
  box-shadow: ${({ theme }) => theme.elevation.card};
  font-family: ${({ theme }) => theme.fonts.sans};
  animation: ${slideIn} ${({ theme }) => theme.animation.medium} forwards;
`;

const IconCircle = styled.span<{ $type: ToastType }>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme, $type }) => getSemanticColors($type, theme).border};
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

const Message = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const CloseBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  line-height: 1;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

// ── Toast Item ────────────────────────────────────────────

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const handleDismiss = useCallback(() => onDismiss(toast.id), [toast.id, onDismiss]);

  return (
    <ToastCard $type={toast.type}>
      <IconCircle $type={toast.type}>{getIcon(toast.type)}</IconCircle>
      <Content>
        {toast.title && <Title>{toast.title}</Title>}
        <Message>{toast.message}</Message>
      </Content>
      <CloseBtn onClick={handleDismiss} aria-label="Dismiss">
        ×
      </CloseBtn>
    </ToastCard>
  );
};

// ── Toast Container ───────────────────────────────────────

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </Container>
  );
};
