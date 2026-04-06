import { describe, it, expect, vi } from 'vitest';
import {
  OBJECTS,
  STRING,
  TIME,
  NUMBERS,
  FORM_DATA,
  formatCertificate,
  formatCertificateID,
  createLookup,
  timestampToLocale,
  handleViewCertificate,
  capitalizeFirstLetter,
  proxyLivepeerOriginEndpoint,
  logDev,
} from './helpers';

// =============================================================================
// OBJECTS
// =============================================================================

describe('OBJECTS', () => {
  describe('sanitizeObject', () => {
    it('returns primitives as-is', () => {
      expect(OBJECTS.sanitizeObject('hello')).toBe('hello');
      expect(OBJECTS.sanitizeObject(42)).toBe(42);
      expect(OBJECTS.sanitizeObject(true)).toBe(true);
      expect(OBJECTS.sanitizeObject(null)).toBe(null);
    });

    it('deep-clones a flat object', () => {
      const obj = { a: 1, b: 'two' };
      const result = OBJECTS.sanitizeObject(obj);
      expect(result).toEqual({ a: 1, b: 'two' });
      expect(result).not.toBe(obj);
    });

    it('deep-clones nested objects', () => {
      const obj = { a: { b: { c: 3 } } };
      const result = OBJECTS.sanitizeObject(obj);
      expect(result).toEqual({ a: { b: { c: 3 } } });
      expect(result.a).not.toBe(obj.a);
    });

    it('deep-clones arrays', () => {
      const arr = [1, [2, 3], { x: 4 }];
      const result = OBJECTS.sanitizeObject(arr);
      expect(result).toEqual([1, [2, 3], { x: 4 }]);
      expect(result).not.toBe(arr);
      expect(result[2]).not.toBe(arr[2]);
    });

    it('handles circular references by returning null', () => {
      const obj = { a: 1 };
      obj.self = obj;
      const result = OBJECTS.sanitizeObject(obj);
      expect(result.a).toBe(1);
      expect(result.self).toBe(null);
    });

    it('returns null when maxDepth is exceeded', () => {
      const deep = { a: { b: { c: { d: 'end' } } } };
      const result = OBJECTS.sanitizeObject(deep, 0, 2);
      // At depth 2, nested objects beyond that become null
      expect(result.a.b).toBe(null);
    });
  });

  describe('findValueByKey', () => {
    it('returns the value for an existing key', () => {
      expect(OBJECTS.findValueByKey({ name: 'Alice' }, 'name')).toBe('Alice');
    });

    it('returns undefined for a missing key', () => {
      expect(OBJECTS.findValueByKey({ name: 'Alice' }, 'age')).toBeUndefined();
    });

    it('returns falsy values correctly', () => {
      expect(OBJECTS.findValueByKey({ count: 0 }, 'count')).toBe(0);
      expect(OBJECTS.findValueByKey({ flag: false }, 'flag')).toBe(false);
      expect(OBJECTS.findValueByKey({ val: null }, 'val')).toBe(null);
    });
  });

  describe('ensureKeyFirst', () => {
    it('moves the specified key to the front', () => {
      const obj = { b: 2, a: 1, c: 3 };
      const result = OBJECTS.ensureKeyFirst(obj, 'a');
      const keys = Object.keys(result);
      expect(keys[0]).toBe('a');
      expect(result.a).toBe(1);
    });

    it('returns the object unchanged if key does not exist', () => {
      const obj = { b: 2, c: 3 };
      expect(OBJECTS.ensureKeyFirst(obj, 'z')).toBe(obj);
    });

    it('handles null/undefined input gracefully', () => {
      expect(OBJECTS.ensureKeyFirst(null, 'a')).toBe(null);
      expect(OBJECTS.ensureKeyFirst(undefined, 'a')).toBe(undefined);
    });
  });

  describe('SEARCH.containsQuery', () => {
    it('matches string values case-insensitively', () => {
      expect(OBJECTS.SEARCH.containsQuery('Hello World', 'hello')).toBe(true);
      expect(OBJECTS.SEARCH.containsQuery('Hello World', 'xyz')).toBe(false);
    });

    it('converts non-object primitives to string for matching', () => {
      expect(OBJECTS.SEARCH.containsQuery(42, '42')).toBe(true);
      expect(OBJECTS.SEARCH.containsQuery(true, 'true')).toBe(true);
    });

    it('searches within object values', () => {
      const obj = { name: 'Alice', city: 'Wonderland' };
      expect(OBJECTS.SEARCH.containsQuery(obj, 'wonder')).toBe(true);
      expect(OBJECTS.SEARCH.containsQuery(obj, 'bob')).toBe(false);
    });

    it('searches within arrays', () => {
      const arr = ['apple', 'banana', 'cherry'];
      expect(OBJECTS.SEARCH.containsQuery(arr, 'ban')).toBe(true);
      expect(OBJECTS.SEARCH.containsQuery(arr, 'grape')).toBe(false);
    });

    it('searches nested structures', () => {
      const data = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
      expect(OBJECTS.SEARCH.containsQuery(data, 'bob')).toBe(true);
    });

    it('returns false for null input', () => {
      expect(OBJECTS.SEARCH.containsQuery(null, 'test')).toBe(false);
    });
  });

  describe('SEARCH.filterObjectByQuery', () => {
    it('returns primitives as-is', () => {
      expect(OBJECTS.SEARCH.filterObjectByQuery('hello', 'hel')).toBe('hello');
      expect(OBJECTS.SEARCH.filterObjectByQuery(42, '42')).toBe(42);
      expect(OBJECTS.SEARCH.filterObjectByQuery(null, 'x')).toBe(null);
    });

    it('filters array items that match the query', () => {
      const arr = ['apple', 'banana', 'cherry'];
      const result = OBJECTS.SEARCH.filterObjectByQuery(arr, 'an');
      expect(result).toEqual(['banana']);
    });

    it('recursively filters nested object values', () => {
      const obj = { fruits: ['apple', 'banana'], vegs: ['carrot'] };
      const result = OBJECTS.SEARCH.filterObjectByQuery(obj, 'an');
      expect(result.fruits).toEqual(['banana']);
      expect(result.vegs).toEqual([]);
    });
  });
});

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
// TIME
// =============================================================================

describe('TIME', () => {
  describe('timestampToLocalString', () => {
    it('converts a millisecond timestamp to a locale string', () => {
      const ts = new Date('2024-01-15T12:00:00Z').getTime();
      const result = TIME.timestampToLocalString(ts);
      // Just verify it returns a non-empty string (locale-dependent)
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
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
// FORM_DATA
// =============================================================================

describe('FORM_DATA', () => {
  describe('isValidEmail', () => {
    it('accepts valid email addresses', () => {
      expect(FORM_DATA.isValidEmail('user@example.com')).toBe(true);
      expect(FORM_DATA.isValidEmail('first.last@domain.co')).toBe(true);
      expect(FORM_DATA.isValidEmail('user-name@sub.domain.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(FORM_DATA.isValidEmail('no-at-sign')).toBe(false);
      expect(FORM_DATA.isValidEmail('@missing-local.com')).toBe(false);
      expect(FORM_DATA.isValidEmail('')).toBe(false);
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
// createLookup
// =============================================================================

describe('createLookup', () => {
  it('creates a lookup object keyed by id', () => {
    const arr = [
      { id: 'a', name: 'Alice' },
      { id: 'b', name: 'Bob' },
    ];
    const result = createLookup(arr);
    expect(result).toEqual({
      a: { id: 'a', name: 'Alice' },
      b: { id: 'b', name: 'Bob' },
    });
  });

  it('returns empty object for empty array', () => {
    expect(createLookup([])).toEqual({});
  });

  it('last item wins for duplicate ids', () => {
    const arr = [
      { id: 'x', v: 1 },
      { id: 'x', v: 2 },
    ];
    expect(createLookup(arr).x.v).toBe(2);
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
// capitalizeFirstLetter
// =============================================================================

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('leaves already-capitalized strings unchanged', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('returns falsy input as-is', () => {
    expect(capitalizeFirstLetter('')).toBe('');
    expect(capitalizeFirstLetter(null)).toBe(null);
    expect(capitalizeFirstLetter(undefined)).toBe(undefined);
  });

  it('handles single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
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
