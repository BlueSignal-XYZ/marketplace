/**
 * Auth service types — shared Firebase Auth + wallet integration.
 */

import type { Timestamped } from './common';

// ── User ──────────────────────────────────────────────────

export type UserRole = 'buyer' | 'seller' | 'admin' | 'installer' | 'viewer';

export interface User extends Timestamped {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  organizationId?: string;
  walletAddress?: string;
  /** Feature keys the user has dismissed (for useFirstTime hook) */
  dismissed: Record<string, boolean>;
  /** Whether user has BlueSignal devices (shows Cloud link in WQT) */
  hasDevices: boolean;
  /** Whether user has credits available to list */
  hasCredits: boolean;
  metadata: {
    lastLoginAt: string;
    provider: 'email' | 'google' | 'wallet';
  };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  organizationName?: string;
  walletAddress?: string;
}

// ── Auth Actions ──────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
}

export interface DismissFeatureRequest {
  userId: string;
  featureKey: string;
}
