/**
 * Credit Audit Trail — client-side reader.
 *
 * Reads append-only entries from RTDB `/creditAuditLog/{creditId}`. Writes
 * are server-only (functions/creditGeneration.js). See CLAUDE.md ADR
 * "Credit audit trail as immutable RTDB node — 2026-04-12".
 *
 * Consumers: Cloud device detail page, WQT certificate page, admin review.
 *
 * Access is gated by database.rules.json — the reader will see only audit
 * entries they own or where they are admin.
 */

import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';

export interface CreditAuditEntry {
  creditId: string;
  trigger: 'onReadingCreated' | 'calculateCredits' | 'manualAdjust';
  deviceId: string;
  enrollmentId?: string;
  programId: string;
  programType?: string;
  methodology: string;
  verificationTier: string;
  formula: string;
  qualifyingReadingCount?: number;
  owner: string;
  writtenAt: number;
  schemaVersion: number;
  inputs: Record<string, unknown>;
  result: {
    creditAmount: number;
    unit: string;
  };
  confidenceFlags: string[];
}

/**
 * Fetch a single audit entry by creditId. Returns null if the current user
 * lacks read access or no entry exists.
 */
export async function getCreditAudit(creditId: string): Promise<CreditAuditEntry | null> {
  if (!creditId) return null;
  try {
    const snap = await get(ref(getDatabase(), `creditAuditLog/${creditId}`));
    if (!snap.exists()) return null;
    return snap.val() as CreditAuditEntry;
  } catch (err) {
    console.warn('[creditAuditService] getCreditAudit failed:', err);
    return null;
  }
}

/**
 * Fetch all audit entries for a device. Surfaced on the device detail page
 * as the expandable audit-trail panel.
 */
export async function getAuditTrailForDevice(deviceId: string): Promise<CreditAuditEntry[]> {
  if (!deviceId) return [];
  try {
    const q = query(
      ref(getDatabase(), 'creditAuditLog'),
      orderByChild('deviceId'),
      equalTo(deviceId)
    );
    const snap = await get(q);
    if (!snap.exists()) return [];
    const val = snap.val() as Record<string, CreditAuditEntry>;
    // Sort descending by writtenAt so newest appears first in the UI.
    return Object.values(val).sort((a, b) => (b.writtenAt || 0) - (a.writtenAt || 0));
  } catch (err) {
    console.warn('[creditAuditService] getAuditTrailForDevice failed:', err);
    return [];
  }
}

/**
 * Returns a human-readable single-line summary of an audit entry — used in
 * row density where the full expandable row is too much.
 *
 * Example: "2026-04-12 14:03  nitrogen  auto-N-programX  0.01 lbs  [calibration-expired]"
 */
export function summarizeAudit(entry: CreditAuditEntry): string {
  const ts = new Date(entry.writtenAt || Date.now()).toISOString().replace('T', ' ').slice(0, 16);
  const flags = entry.confidenceFlags?.length ? ` [${entry.confidenceFlags.join(', ')}]` : '';
  return `${ts}  ${entry.programType || 'credit'}  ${entry.methodology}  ${entry.result.creditAmount} ${entry.result.unit}${flags}`;
}
