/**
 * Credit audit service — guardrail tests.
 *
 * These verify the summarizeAudit helper's output shape. The DB-read functions
 * are integration-tested at the Firebase rules level (see
 * docs/security/v1.1-hardening-audit.md SR-06); here we lock in the
 * human-facing formatting contract so UI copy doesn't drift.
 */

import { describe, it, expect } from 'vitest';
import { summarizeAudit, type CreditAuditEntry } from './creditAuditService';

const baseEntry: CreditAuditEntry = {
  creditId: 'credit-abc',
  trigger: 'onReadingCreated',
  deviceId: 'BS-2025-000001',
  programId: 'program-N-va',
  programType: 'nitrogen',
  methodology: 'auto-nitrogen-program-N-va',
  verificationTier: 'auto',
  formula: 'creditAmount = ratePerUnit * qualityMultiplier * qualifyingReadingCount',
  qualifyingReadingCount: 1,
  owner: 'uid-123',
  writtenAt: new Date('2026-04-12T14:03:00Z').getTime(),
  schemaVersion: 1,
  inputs: { ratePerUnit: 0.01 },
  result: { creditAmount: 0.01, unit: 'lbs' },
  confidenceFlags: [],
};

describe('summarizeAudit', () => {
  it('formats a healthy audit entry without flag suffix', () => {
    const summary = summarizeAudit(baseEntry);
    expect(summary).toContain('2026-04-12 14:03');
    expect(summary).toContain('nitrogen');
    expect(summary).toContain('auto-nitrogen-program-N-va');
    expect(summary).toContain('0.01 lbs');
    expect(summary).not.toContain('[');
  });

  it('appends confidence flags in bracketed suffix', () => {
    const entry = { ...baseEntry, confidenceFlags: ['calibration-expired', 'no-site-assignment'] };
    const summary = summarizeAudit(entry);
    expect(summary).toContain('[calibration-expired, no-site-assignment]');
  });

  it('falls back to "credit" label when programType missing', () => {
    const entry = { ...baseEntry, programType: undefined };
    const summary = summarizeAudit(entry);
    expect(summary).toContain('credit');
  });
});
