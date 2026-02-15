/**
 * Shared hooks — barrel export.
 *
 * Usage:
 *   import { useMode, useToast, useFirstTime } from '../shared/hooks';
 */

export { useMode } from './useMode';
export type { AppMode, UseModeResult } from './useMode';

export { useToast } from './useToast';
export type { Toast, ToastInput, ToastType, UseToastResult } from './useToast';

export { useFirstTime } from './useFirstTime';
export type { UseFirstTimeResult } from './useFirstTime';
