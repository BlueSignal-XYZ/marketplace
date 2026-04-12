/**
 * Credit audit service — guardrail tests.
 *
 * These verify the summarizeAudit helper's output shape. The DB-read functions
 * are integration-tested at the Firebase rules level (see
 * docs/security/v1.1-hardening-audit.md SR-06); here we lock in the
 * human-facing formatting contract so UI copy doesn't drift.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet, mockQuery, mockRef, mockOrderByChild, mockEqualTo } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockQuery: vi.fn((_ref: unknown, ..._constraints: unknown[]) => ({ _query: true })),
  mockRef: vi.fn((_db: unknown, path: string) => ({ _ref: true, path })),
  mockOrderByChild: vi.fn((field: string) => ({ _orderBy: field })),
  mockEqualTo: vi.fn((val: unknown) => ({ _equalTo: val })),
}));

vi.mock('firebase/database', () => ({
  getDatabase: () => ({ _mockDb: true }),
  ref: mockRef,
  get: mockGet,
  query: mockQuery,
  orderByChild: mockOrderByChild,
  equalTo: mockEqualTo,
}));

import {
  summarizeAudit,
  getCreditAudit,
  getAuditTrailForDevice,
  type CreditAuditEntry,
} from './creditAuditService';

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

describe('getCreditAudit', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockRef.mockClear();
  });

  it('returns null for empty creditId without hitting the DB', async () => {
    const result = await getCreditAudit('');
    expect(result).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('returns parsed entry when the node exists', async () => {
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => baseEntry,
    });

    const result = await getCreditAudit('credit-abc');
    expect(result).toEqual(baseEntry);
    expect(mockRef).toHaveBeenCalledWith(expect.anything(), 'creditAuditLog/credit-abc');
  });

  it('returns null when the node does not exist', async () => {
    mockGet.mockResolvedValue({
      exists: () => false,
      val: () => null,
    });

    const result = await getCreditAudit('credit-missing');
    expect(result).toBeNull();
  });

  it('swallows DB read errors and returns null (permission denied path)', async () => {
    mockGet.mockRejectedValue(new Error('permission_denied'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await getCreditAudit('credit-abc');
    expect(result).toBeNull();
    warn.mockRestore();
  });
});

describe('getAuditTrailForDevice', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockQuery.mockClear();
    mockOrderByChild.mockClear();
    mockEqualTo.mockClear();
  });

  it('returns [] for empty deviceId without hitting the DB', async () => {
    const result = await getAuditTrailForDevice('');
    expect(result).toEqual([]);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('queries by deviceId and sorts newest-first', async () => {
    const older = { ...baseEntry, creditId: 'c1', writtenAt: 100 };
    const newer = { ...baseEntry, creditId: 'c2', writtenAt: 500 };
    mockGet.mockResolvedValue({
      exists: () => true,
      val: () => ({ c1: older, c2: newer }),
    });

    const result = await getAuditTrailForDevice('BS-2025-000001');
    expect(result).toHaveLength(2);
    expect(result[0]?.creditId).toBe('c2');
    expect(result[1]?.creditId).toBe('c1');
    expect(mockOrderByChild).toHaveBeenCalledWith('deviceId');
    expect(mockEqualTo).toHaveBeenCalledWith('BS-2025-000001');
  });

  it('returns [] when the query has no results', async () => {
    mockGet.mockResolvedValue({
      exists: () => false,
      val: () => null,
    });

    const result = await getAuditTrailForDevice('BS-none');
    expect(result).toEqual([]);
  });

  it('returns [] and warns on DB errors', async () => {
    mockGet.mockRejectedValue(new Error('network'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await getAuditTrailForDevice('BS-2025-000001');
    expect(result).toEqual([]);
    warn.mockRestore();
  });
});
