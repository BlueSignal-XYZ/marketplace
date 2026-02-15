/**
 * useToast — THE single notification system for both platforms.
 *
 * Replaces NotificationPopup, ResultPopup, NotificationBar.
 * Auto-dismiss, top-right, max 2 visible at a time.
 *
 * Usage:
 *   // In a provider:
 *   <ToastProvider><App /></ToastProvider>
 *
 *   // In any component:
 *   const { toast, dismiss } = useToast();
 *   toast({ type: 'success', message: 'Credit purchased!' });
 *   toast({ type: 'error', message: 'Transaction failed', duration: 8000 });
 */

import { useState, useCallback, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  /** Optional title line above message */
  title?: string;
  /** Auto-dismiss after ms. Default: 5000. Set 0 for persistent. */
  duration: number;
  /** Timestamp for ordering */
  createdAt: number;
}

export interface ToastInput {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export interface UseToastResult {
  /** Currently visible toasts (max 2) */
  toasts: Toast[];
  /** Show a new toast */
  toast: (input: ToastInput) => string;
  /** Dismiss a specific toast by id */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

// ── Constants ─────────────────────────────────────────────

const MAX_VISIBLE = 2;
const DEFAULT_DURATION = 5000;

// ── Hook ──────────────────────────────────────────────────

let toastCounter = 0;

export function useToast(): UseToastResult {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = useCallback(
    (input: ToastInput): string => {
      const id = `toast-${++toastCounter}-${Date.now()}`;
      const duration = input.duration ?? DEFAULT_DURATION;

      const newToast: Toast = {
        id,
        type: input.type,
        message: input.message,
        title: input.title,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep only the most recent (MAX_VISIBLE - 1) to make room
        const trimmed = prev.slice(-(MAX_VISIBLE - 1));
        return [...trimmed, newToast];
      });

      // Auto-dismiss if duration > 0
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  return { toasts, toast, dismiss, dismissAll };
}
