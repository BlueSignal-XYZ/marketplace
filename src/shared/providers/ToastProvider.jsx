/**
 * ToastProvider — wraps useToast hook in React Context.
 * Renders the ToastContainer at the root level.
 *
 * Usage:
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 *   // In any child component:
 *   const { toast, dismiss } = useToastContext();
 *   toast({ type: 'success', message: 'Done!' });
 */

import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../../design-system/primitives/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const { toasts, toast, dismiss, dismissAll } = useToast();

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access the toast system from any component.
 */
export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful fallback — if no provider, return no-ops
    return {
      toast: () => '',
      dismiss: () => {},
      dismissAll: () => {},
    };
  }
  return ctx;
}
