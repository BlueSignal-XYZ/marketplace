import { describe, it, expect, vi } from 'vitest';
import {
  STRING,
  NUMBERS,
  formatCertificate,
  formatCertificateID,
  timestampToLocale,
  handleViewCertificate,
  proxyLivepeerOriginEndpoint,
  logDev,
} from './helpers';

// =============================================================================
// STRING
// =============================================================================

describe('STRING', () => {
  describe('toTitleCase', () => {
    it('inserts spaces before capital letters and capitalizes first', () => {
      expect(STRING.toTitleCase('helloWorld')).toBe('Hello World');
    });

    it('handles already-capitalized first letter', () => {
      expect(STRING.toTitleCase('HelloWorld')).toBe('Hello World');
    });

    it('returns empty string for falsy input', () => {
      expect(STRING.toTitleCase('')).toBe('');
      expect(STRING.toTitleCase(null)).toBe('');
      expect(STRING.toTitleCase(undefined)).toBe('');
    });

    it('converts non-string values via String()', () => {
      expect(STRING.toTitleCase(123)).toBe('123');
    });

    it('handles all-lowercase string', () => {
      expect(STRING.toTitleCase('hello')).toBe('Hello');
    });
  });
});

// =============================================================================
// NUMBERS
// =============================================================================

describe('NUMBERS', () => {
  describe('toNumber', () => {
    it('returns 0 for null or undefined', () => {
      expect(NUMBERS.toNumber(null)).toBe(0);
      expect(NUMBERS.toNumber(undefined)).toBe(0);
    });

    it('calls .toNumber() if available on the value', () => {
      const bigNum = { toNumber: () => 42 };
      expect(NUMBERS.toNumber(bigNum)).toBe(42);
    });

    it('returns the number directly if .toNumber() throws', () => {
      expect(NUMBERS.toNumber(99)).toBe(99);
    });

    it('parses string values as integers', () => {
      expect(NUMBERS.toNumber('123')).toBe(123);
    });

    it('returns 0 for unparseable strings', () => {
      expect(NUMBERS.toNumber('abc')).toBe(0);
    });
  });

  describe('isValidAmount', () => {
    it('returns true for positive numbers', () => {
      expect(NUMBERS.isValidAmount(10)).toBe(true);
      expect(NUMBERS.isValidAmount(0.5)).toBe(true);
    });

    it('returns false for zero', () => {
      expect(NUMBERS.isValidAmount(0)).toBe(false);
    });

    it('returns false for negative numbers', () => {
      expect(NUMBERS.isValidAmount(-5)).toBe(false);
    });

    it('returns false for NaN', () => {
      expect(NUMBERS.isValidAmount(NaN)).toBe(false);
    });

    it('returns false for non-numeric values', () => {
      expect(NUMBERS.isValidAmount('abc')).toBe(false);
    });
  });
});

// =============================================================================
// formatCertificate
// =============================================================================

describe('formatCertificate', () => {
  it('copies plain values as-is', () => {
    const input = { name: 'Test', value: 42 };
    expect(formatCertificate(input)).toEqual({ name: 'Test', value: 42 });
  });

  it('converts BigNumber-like objects to Number', () => {
    const input = {
      id: { _isBigNumber: true, toString: () => '100' },
      name: 'cert',
    };
    const result = formatCertificate(input);
    expect(typeof result.id).toBe('number');
    expect(result.name).toBe('cert');
  });

  it('returns empty object for empty input', () => {
    expect(formatCertificate({})).toEqual({});
  });
});

// =============================================================================
// formatCertificateID
// =============================================================================

describe('formatCertificateID', () => {
  it('pads short numbers with leading zeros', () => {
    expect(formatCertificateID(1)).toBe('NPRC-0000001');
    expect(formatCertificateID(42)).toBe('NPRC-0000042');
  });

  it('handles large numbers that exceed 7 digits', () => {
    expect(formatCertificateID(12345678)).toBe('NPRC-12345678');
  });

  it('handles zero', () => {
    expect(formatCertificateID(0)).toBe('NPRC-0000000');
  });
});

// =============================================================================
// timestampToLocale
// =============================================================================

describe('timestampToLocale', () => {
  it('converts a unix timestamp (seconds) to a locale string', () => {
    const ts = Math.floor(new Date('2024-06-01T00:00:00Z').getTime() / 1000);
    const result = timestampToLocale(ts);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// handleViewCertificate
// =============================================================================

describe('handleViewCertificate', () => {
  it('opens a new window with the certificate URL', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    handleViewCertificate(5);
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('/certificate?id=5'), '_blank');
    openSpy.mockRestore();
  });

  it('calls .toNumber() on BigNumber-like ids', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    handleViewCertificate({ toNumber: () => 99 });
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('/certificate?id=99'), '_blank');
    openSpy.mockRestore();
  });

  it('defaults to 0 for null/undefined id', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    handleViewCertificate(null);
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('/certificate?id=0'), '_blank');
    openSpy.mockRestore();
  });
});

// =============================================================================
// proxyLivepeerOriginEndpoint
// =============================================================================

describe('proxyLivepeerOriginEndpoint', () => {
  it('replaces the livepeer origin base URL with proxy path', () => {
    const input = 'https://origin.livepeer.com/webrtc/video123';
    expect(proxyLivepeerOriginEndpoint(input)).toBe('/livepeer/origin/webrtc/video123');
  });

  it('throws for non-livepeer URLs', () => {
    expect(() => proxyLivepeerOriginEndpoint('https://example.com/path')).toThrow(
      'Original endpoint does not start with the base URL.'
    );
  });

  it('handles the base URL with no extra path', () => {
    expect(proxyLivepeerOriginEndpoint('https://origin.livepeer.com')).toBe('/livepeer/origin');
  });
});

// =============================================================================
// logDev
// =============================================================================

describe('logDev', () => {
  it('calls console.warn with the dev prefix', () => {
    // console.warn is mocked in test setup
    logDev('test message', { key: 'val' });
    expect(console.warn).toHaveBeenCalledWith('@DEV: ', 'test message', { key: 'val' });
  });

  it('defaults vars to empty object', () => {
    logDev('no vars');
    expect(console.warn).toHaveBeenCalledWith('@DEV: ', 'no vars', {});
  });
});
