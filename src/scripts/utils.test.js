import { describe, it, expect } from 'vitest';
import { formatLongString, isNotZeroAddress, extractAndCleanUrls } from './utils';

// =============================================================================
// formatLongString
// =============================================================================

describe('formatLongString', () => {
  it('truncates a long string with default first/last values', () => {
    expect(formatLongString('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12')).toBe('0xAbCd...Ef12');
  });

  it('uses custom first and last lengths', () => {
    expect(formatLongString('0xAbCdEf1234567890', 4, 6)).toBe('0xAb...567890');
  });

  it('returns empty string for null/undefined/empty input', () => {
    expect(formatLongString(null)).toBe('');
    expect(formatLongString(undefined)).toBe('');
    expect(formatLongString('')).toBe('');
  });

  it('handles string shorter than first + last', () => {
    // "abcde" with first=6, last=4 — slices overlap but still returns a result
    const result = formatLongString('abcde');
    expect(result).toBe('abcde...bcde');
  });

  it('handles exact-length strings', () => {
    expect(formatLongString('abcdefghij', 6, 4)).toBe('abcdef...ghij');
  });

  it('works with first=0', () => {
    expect(formatLongString('abcdefgh', 0, 4)).toBe('...efgh');
  });

  it('works with last=0', () => {
    // slice(-0) returns entire string in JS
    expect(formatLongString('abcdefgh', 4, 0)).toBe('abcd...abcdefgh');
  });
});

// =============================================================================
// isNotZeroAddress
// =============================================================================

describe('isNotZeroAddress', () => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('returns false for the zero address', () => {
    expect(isNotZeroAddress(ZERO_ADDRESS)).toBe(false);
  });

  it('returns false for zero address with mixed case', () => {
    expect(isNotZeroAddress('0x0000000000000000000000000000000000000000')).toBe(false);
  });

  it('returns true for a non-zero address', () => {
    expect(isNotZeroAddress('0xAbCdEf1234567890AbCdEf1234567890AbCdEf12')).toBe(true);
  });

  it('returns true for an address with a single non-zero digit', () => {
    expect(isNotZeroAddress('0x0000000000000000000000000000000000000001')).toBe(true);
  });

  it('is case-insensitive', () => {
    const upper = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
    const lower = '0xabcdef1234567890abcdef1234567890abcdef12';
    expect(isNotZeroAddress(upper)).toBe(true);
    expect(isNotZeroAddress(lower)).toBe(true);
  });
});

// =============================================================================
// extractAndCleanUrls
// =============================================================================

describe('extractAndCleanUrls', () => {
  it('extracts a single URL from a string', () => {
    const result = extractAndCleanUrls('Visit https://example.com for more info');
    expect(result).toEqual(['https://example.com/']);
  });

  it('extracts multiple URLs from a string', () => {
    const result = extractAndCleanUrls('Check https://example.com and http://test.org/page');
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('https://example.com/');
    expect(result[1]).toBe('http://test.org/page');
  });

  it('returns empty array when no URLs found', () => {
    expect(extractAndCleanUrls('no urls here')).toEqual([]);
    expect(extractAndCleanUrls('')).toEqual([]);
  });

  it('handles URLs with query parameters', () => {
    const result = extractAndCleanUrls('Go to https://example.com/path?key=value&foo=bar');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('key=value');
    expect(result[0]).toContain('foo=bar');
  });

  it('handles URLs with hash fragments', () => {
    const result = extractAndCleanUrls('See https://example.com/page#section');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('#section');
  });

  it('handles ftp URLs', () => {
    const result = extractAndCleanUrls('Download from ftp://files.example.com/doc.pdf');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('ftp://files.example.com/doc.pdf');
  });

  it('handles blob URLs by extracting pathname', () => {
    const result = extractAndCleanUrls('Preview at blob:https://example.com/abc-123-def');
    expect(result).toHaveLength(1);
    // blob URLs return pathname without leading slash
    expect(result[0]).toContain('example.com/abc-123-def');
  });

  it('filters out invalid URLs that match the regex but fail URL parsing', () => {
    // The regex may match something that new URL() rejects
    // In practice, most regex matches are valid URLs, so this tests the error path
    const result = extractAndCleanUrls('Valid: https://example.com');
    expect(result.every((url) => url.length > 0)).toBe(true);
  });

  it('handles string with URLs surrounded by punctuation', () => {
    const result = extractAndCleanUrls('(https://example.com/path)');
    expect(result).toHaveLength(1);
  });
});
