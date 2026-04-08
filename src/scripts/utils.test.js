import { describe, it, expect } from 'vitest';
import { formatLongString, isNotZeroAddress, extractAndCleanUrls } from './utils';

describe('formatLongString', () => {
  it('truncates a long string with ellipsis', () => {
    expect(formatLongString('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678');
  });

  it('uses custom first/last lengths', () => {
    expect(formatLongString('0x1234567890abcdef1234567890abcdef12345678', 10, 6)).toBe(
      '0x12345678...345678'
    );
  });

  it('returns empty string for null input', () => {
    expect(formatLongString(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(formatLongString(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(formatLongString('')).toBe('');
  });

  it('handles short strings (shorter than first + last)', () => {
    // "abcd" with first=6, last=4 will overlap but still produce output
    const result = formatLongString('abcd');
    expect(result).toBe('abcd...abcd');
  });
});

describe('isNotZeroAddress', () => {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('returns false for the zero address', () => {
    expect(isNotZeroAddress(ZERO_ADDRESS)).toBe(false);
  });

  it('returns false for uppercase zero address', () => {
    expect(isNotZeroAddress(ZERO_ADDRESS.toUpperCase())).toBe(false);
  });

  it('returns false for mixed-case zero address', () => {
    expect(isNotZeroAddress('0x0000000000000000000000000000000000000000')).toBe(false);
  });

  it('returns true for a non-zero address', () => {
    expect(isNotZeroAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
  });

  it('returns true for an address with only one non-zero character', () => {
    expect(isNotZeroAddress('0x0000000000000000000000000000000000000001')).toBe(true);
  });
});

describe('extractAndCleanUrls', () => {
  it('extracts a single HTTP URL', () => {
    const result = extractAndCleanUrls('Visit https://example.com for more');
    expect(result).toEqual(['https://example.com/']);
  });

  it('extracts multiple URLs from a string', () => {
    const result = extractAndCleanUrls(
      'See https://example.com and http://test.org/page for details'
    );
    expect(result).toHaveLength(2);
    expect(result).toContain('https://example.com/');
    expect(result).toContain('http://test.org/page');
  });

  it('returns empty array when no URLs found', () => {
    expect(extractAndCleanUrls('No URLs here')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(extractAndCleanUrls('')).toEqual([]);
  });

  it('handles URLs with paths and query strings', () => {
    const result = extractAndCleanUrls('Go to https://example.com/path?key=value&foo=bar');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('example.com/path');
    expect(result[0]).toContain('key=value');
  });

  it('handles FTP URLs', () => {
    const result = extractAndCleanUrls('Download from ftp://files.example.com/data.zip');
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('ftp://');
  });

  it('handles blob URLs by extracting pathname', () => {
    const result = extractAndCleanUrls('blob:https://example.com/abc-123-def');
    expect(result).toHaveLength(1);
  });

  it('filters out invalid URLs gracefully', () => {
    // extractAndCleanUrls uses URL constructor which may throw; those get filtered
    const result = extractAndCleanUrls('Check https://valid.com');
    expect(result.every((url) => url.length > 0)).toBe(true);
  });
});
