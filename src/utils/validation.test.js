import { describe, it, expect } from 'vitest';
import {
  validators,
  validateField,
  validateSchema,
  createFormValidator,
  userProfileSchema,
  siteSchema,
  deviceRegistrationSchema,
  listingSchema,
  alertThresholdSchema,
  commissionStepSchemas,
  userProfileValidator,
  siteValidator,
  deviceRegistrationValidator,
  listingValidator,
  alertThresholdValidator,
} from './validation';

// =============================================================================
// FIELD VALIDATORS
// =============================================================================

describe('validators', () => {
  describe('required', () => {
    it('fails for null', () => {
      expect(validators.required(null)).toEqual({
        valid: false,
        error: 'This field is required',
        value: null,
      });
    });

    it('fails for undefined', () => {
      expect(validators.required(undefined).valid).toBe(false);
    });

    it('fails for empty string', () => {
      expect(validators.required('').valid).toBe(false);
    });

    it('passes for non-empty string', () => {
      expect(validators.required('hello')).toEqual({
        valid: true,
        error: null,
        value: 'hello',
      });
    });

    it('passes for zero', () => {
      expect(validators.required(0).valid).toBe(true);
    });

    it('passes for false', () => {
      expect(validators.required(false).valid).toBe(true);
    });

    it('uses custom error message', () => {
      expect(validators.required(null, 'Name needed').error).toBe('Name needed');
    });
  });

  describe('string', () => {
    it('fails for non-string value', () => {
      expect(validators.string(123).valid).toBe(false);
      expect(validators.string(123).error).toBe('Must be a string');
    });

    it('passes for plain string', () => {
      expect(validators.string('hello')).toEqual({
        valid: true,
        error: null,
        value: 'hello',
      });
    });

    it('enforces minLength', () => {
      expect(validators.string('a', { minLength: 2 }).valid).toBe(false);
      expect(validators.string('ab', { minLength: 2 }).valid).toBe(true);
    });

    it('enforces maxLength', () => {
      expect(validators.string('abc', { maxLength: 2 }).valid).toBe(false);
      expect(validators.string('ab', { maxLength: 2 }).valid).toBe(true);
    });

    it('enforces pattern', () => {
      expect(validators.string('abc', { pattern: /^\d+$/ }).valid).toBe(false);
      expect(validators.string('123', { pattern: /^\d+$/ }).valid).toBe(true);
    });

    it('uses custom patternMessage', () => {
      const result = validators.string('abc', {
        pattern: /^\d+$/,
        patternMessage: 'Numbers only',
      });
      expect(result.error).toBe('Numbers only');
    });

    it('uses default message when no patternMessage', () => {
      const result = validators.string('abc', { pattern: /^\d+$/ });
      expect(result.error).toBe('Invalid format');
    });
  });

  describe('email', () => {
    it.each(['user@example.com', 'first.last@domain.co', 'name+tag@sub.domain.org'])(
      'accepts valid email: %s',
      (email) => {
        expect(validators.email(email).valid).toBe(true);
        expect(validators.email(email).value).toBe(email);
      }
    );

    it.each(['no-at-sign', '@missing-local.com', 'missing@.domain', 'has space@domain.com', ''])(
      'rejects invalid email: %s',
      (email) => {
        expect(validators.email(email).valid).toBe(false);
        expect(validators.email(email).error).toBe('Invalid email address');
      }
    );
  });

  describe('phone', () => {
    it('treats empty/falsy as valid (optional)', () => {
      expect(validators.phone('').valid).toBe(true);
      expect(validators.phone(null).valid).toBe(true);
      expect(validators.phone(undefined).valid).toBe(true);
    });

    it.each(['+14155551234', '14155551234', '+442071234567'])(
      'accepts valid phone: %s',
      (phone) => {
        expect(validators.phone(phone).valid).toBe(true);
      }
    );

    it.each(['abc', '+0123456789', '+123456789012345678'])('rejects invalid phone: %s', (phone) => {
      expect(validators.phone(phone).valid).toBe(false);
    });
  });

  describe('number', () => {
    it('accepts numeric strings', () => {
      expect(validators.number('42').valid).toBe(true);
      expect(validators.number('42').value).toBe(42);
    });

    it('accepts actual numbers', () => {
      expect(validators.number(3.14).value).toBe(3.14);
    });

    it('rejects NaN inputs', () => {
      expect(validators.number('abc').valid).toBe(false);
      expect(validators.number('abc').error).toBe('Must be a number');
    });

    it('enforces min', () => {
      expect(validators.number(5, { min: 10 }).valid).toBe(false);
      expect(validators.number(5, { min: 10 }).error).toBe('Must be at least 10');
      expect(validators.number(10, { min: 10 }).valid).toBe(true);
    });

    it('enforces max', () => {
      expect(validators.number(20, { max: 10 }).valid).toBe(false);
      expect(validators.number(20, { max: 10 }).error).toBe('Must be at most 10');
      expect(validators.number(10, { max: 10 }).valid).toBe(true);
    });

    it('enforces positive', () => {
      expect(validators.number(0, { positive: true }).valid).toBe(false);
      expect(validators.number(-1, { positive: true }).valid).toBe(false);
      expect(validators.number(1, { positive: true }).valid).toBe(true);
    });
  });

  describe('enum', () => {
    it('accepts allowed value', () => {
      expect(validators.enum('a', ['a', 'b', 'c']).valid).toBe(true);
    });

    it('rejects disallowed value', () => {
      const result = validators.enum('d', ['a', 'b', 'c']);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Must be one of: a, b, c');
    });

    it('uses custom error message', () => {
      const result = validators.enum('d', ['a', 'b'], 'Pick a or b');
      expect(result.error).toBe('Pick a or b');
    });
  });

  describe('coordinates', () => {
    it('accepts valid coordinates', () => {
      const result = validators.coordinates({ lat: 40.7128, lng: -74.006 });
      expect(result.valid).toBe(true);
    });

    it('accepts boundary values', () => {
      expect(validators.coordinates({ lat: 90, lng: 180 }).valid).toBe(true);
      expect(validators.coordinates({ lat: -90, lng: -180 }).valid).toBe(true);
    });

    it('rejects null', () => {
      expect(validators.coordinates(null).valid).toBe(false);
      expect(validators.coordinates(null).error).toBe('Coordinates required');
    });

    it('rejects non-object', () => {
      expect(validators.coordinates('string').valid).toBe(false);
    });

    it('rejects out-of-range latitude', () => {
      expect(validators.coordinates({ lat: 91, lng: 0 }).error).toBe('Invalid latitude');
      expect(validators.coordinates({ lat: -91, lng: 0 }).error).toBe('Invalid latitude');
    });

    it('rejects out-of-range longitude', () => {
      expect(validators.coordinates({ lat: 0, lng: 181 }).error).toBe('Invalid longitude');
      expect(validators.coordinates({ lat: 0, lng: -181 }).error).toBe('Invalid longitude');
    });

    it('rejects non-number lat/lng', () => {
      expect(validators.coordinates({ lat: 'a', lng: 0 }).valid).toBe(false);
      expect(validators.coordinates({ lat: 0, lng: 'b' }).valid).toBe(false);
    });
  });

  describe('serialNumber', () => {
    it('accepts valid format BS-YYYY-NNNNNN', () => {
      expect(validators.serialNumber('BS-2024-000001').valid).toBe(true);
    });

    it.each(['BS2024000001', 'BS-24-000001', 'BS-2024-00001', 'XX-2024-000001', ''])(
      'rejects invalid serial: %s',
      (sn) => {
        expect(validators.serialNumber(sn).valid).toBe(false);
        expect(validators.serialNumber(sn).error).toContain('Invalid serial number');
      }
    );
  });
});

// =============================================================================
// VALIDATE FIELD
// =============================================================================

describe('validateField', () => {
  it('checks required fields', () => {
    const schema = { validate: validators.email, required: true };
    expect(validateField(null, schema).valid).toBe(false);
    expect(validateField(null, schema).error).toBe('This field is required');
  });

  it('runs validator after required check passes', () => {
    const schema = { validate: validators.email, required: true };
    expect(validateField('bad', schema).valid).toBe(false);
    expect(validateField('good@test.com', schema).valid).toBe(true);
  });

  it('skips validation for optional empty fields', () => {
    const schema = { validate: validators.email, required: false };
    expect(validateField(null, schema).valid).toBe(true);
    expect(validateField(undefined, schema).valid).toBe(true);
    expect(validateField('', schema).valid).toBe(true);
  });

  it('applies default value for optional empty fields', () => {
    const schema = { validate: validators.number, required: false, default: 42 };
    expect(validateField(null, schema).value).toBe(42);
  });

  it('preserves original value when no default for optional empty fields', () => {
    const schema = { validate: validators.number, required: false };
    expect(validateField(null, schema).value).toBe(null);
  });

  it('validates optional field when value is provided', () => {
    const schema = { validate: validators.email, required: false };
    expect(validateField('bad', schema).valid).toBe(false);
    expect(validateField('good@test.com', schema).valid).toBe(true);
  });
});

// =============================================================================
// VALIDATE SCHEMA
// =============================================================================

describe('validateSchema', () => {
  const schema = {
    name: {
      validate: (v) => validators.string(v, { minLength: 2 }),
      required: true,
    },
    age: {
      validate: (v) => validators.number(v, { min: 0 }),
      required: false,
      default: 0,
    },
  };

  it('returns valid for correct data', () => {
    const result = validateSchema({ name: 'Alice', age: 30 }, schema);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.values).toEqual({ name: 'Alice', age: 30 });
  });

  it('collects errors for invalid fields', () => {
    const result = validateSchema({ name: '', age: 'bad' }, schema);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.age).toBeDefined();
  });

  it('applies defaults for missing optional fields', () => {
    const result = validateSchema({ name: 'Bob' }, schema);
    expect(result.isValid).toBe(true);
    expect(result.values.age).toBe(0);
  });

  it('ignores extra fields not in schema', () => {
    const result = validateSchema({ name: 'Eve', extra: 'ignored' }, schema);
    expect(result.isValid).toBe(true);
    expect(result.values.extra).toBeUndefined();
  });
});

// =============================================================================
// CREATE FORM VALIDATOR
// =============================================================================

describe('createFormValidator', () => {
  const formValidator = createFormValidator({
    email: { validate: validators.email, required: true },
    phone: { validate: validators.phone, required: false },
  });

  it('validateField validates a single named field', () => {
    expect(formValidator.validateField('email', 'a@b.c').valid).toBe(true);
    expect(formValidator.validateField('email', 'bad').valid).toBe(false);
  });

  it('validateField returns valid for unknown fields', () => {
    expect(formValidator.validateField('unknown', 'anything')).toEqual({
      valid: true,
      error: null,
    });
  });

  it('validate runs full schema validation', () => {
    const result = formValidator.validate({ email: 'a@b.c' });
    expect(result.isValid).toBe(true);
  });

  it('getFieldNames returns all field names', () => {
    expect(formValidator.getFieldNames()).toEqual(['email', 'phone']);
  });

  it('getRequiredFields returns only required fields', () => {
    expect(formValidator.getRequiredFields()).toEqual(['email']);
  });
});

// =============================================================================
// SCHEMA INTEGRATION TESTS
// =============================================================================

describe('userProfileSchema', () => {
  it('accepts a valid profile', () => {
    const result = validateSchema(
      { displayName: 'Jane', email: 'jane@test.com', role: 'buyer' },
      userProfileSchema
    );
    expect(result.isValid).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = validateSchema({}, userProfileSchema);
    expect(result.isValid).toBe(false);
    expect(result.errors.displayName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.role).toBeDefined();
  });

  it('rejects invalid role', () => {
    const result = validateSchema(
      { displayName: 'Jane', email: 'jane@test.com', role: 'hacker' },
      userProfileSchema
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.role).toBeDefined();
  });

  it('allows optional phone and company', () => {
    const result = validateSchema(
      { displayName: 'Jane', email: 'jane@test.com', role: 'seller' },
      userProfileSchema
    );
    expect(result.isValid).toBe(true);
  });
});

describe('siteSchema', () => {
  it('accepts valid site with required fields', () => {
    const result = validateSchema({ name: 'River Site', type: 'river' }, siteSchema);
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid site type', () => {
    const result = validateSchema({ name: 'My Site', type: 'ocean' }, siteSchema);
    expect(result.isValid).toBe(false);
  });

  it('validates optional coordinates', () => {
    const result = validateSchema(
      { name: 'Site', type: 'lake', coordinates: { lat: 999, lng: 0 } },
      siteSchema
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.coordinates).toBe('Invalid latitude');
  });
});

describe('deviceRegistrationSchema', () => {
  it('accepts valid serial', () => {
    const result = validateSchema({ serialNumber: 'BS-2024-000001' }, deviceRegistrationSchema);
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid serial', () => {
    const result = validateSchema({ serialNumber: 'INVALID' }, deviceRegistrationSchema);
    expect(result.isValid).toBe(false);
  });
});

describe('listingSchema', () => {
  it('accepts valid listing', () => {
    const result = validateSchema(
      { creditId: 'cr-1', quantity: 10, pricePerUnit: 25 },
      listingSchema
    );
    expect(result.isValid).toBe(true);
  });

  it('applies defaults for optional fields', () => {
    const result = validateSchema(
      { creditId: 'cr-1', quantity: 10, pricePerUnit: 25 },
      listingSchema
    );
    expect(result.values.minPurchase).toBe(1);
    expect(result.values.expiresInDays).toBe(30);
  });

  it('rejects non-positive quantity', () => {
    const result = validateSchema(
      { creditId: 'cr-1', quantity: 0, pricePerUnit: 25 },
      listingSchema
    );
    expect(result.isValid).toBe(false);
  });
});

describe('alertThresholdSchema', () => {
  it('accepts valid threshold', () => {
    const result = validateSchema({ parameter: 'ph', high: 9, low: 5 }, alertThresholdSchema);
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid parameter', () => {
    const result = validateSchema({ parameter: 'salinity' }, alertThresholdSchema);
    expect(result.isValid).toBe(false);
  });

  it('applies default enabled=true', () => {
    const result = validateSchema({ parameter: 'nitrogen' }, alertThresholdSchema);
    expect(result.values.enabled).toBe(true);
  });
});

describe('commissionStepSchemas', () => {
  it('validates device_scan step', () => {
    const result = validateSchema(
      { method: 'qr_scan', serialNumber: 'BS-2024-000001' },
      commissionStepSchemas.device_scan
    );
    expect(result.isValid).toBe(true);
  });

  it('rejects invalid device_scan method', () => {
    const result = validateSchema(
      { method: 'bluetooth', serialNumber: 'BS-2024-000001' },
      commissionStepSchemas.device_scan
    );
    expect(result.isValid).toBe(false);
  });

  it('validates photo_upload requires at least one photo', () => {
    expect(validateSchema({ photos: [] }, commissionStepSchemas.photo_upload).isValid).toBe(false);
    expect(
      validateSchema({ photos: ['img.jpg'] }, commissionStepSchemas.photo_upload).isValid
    ).toBe(true);
  });

  it('validates location_capture with coordinates', () => {
    const result = validateSchema(
      { coordinates: { lat: 40, lng: -74 } },
      commissionStepSchemas.location_capture
    );
    expect(result.isValid).toBe(true);
  });
});

// =============================================================================
// PRESET VALIDATORS
// =============================================================================

describe('preset validators', () => {
  it('userProfileValidator has correct required fields', () => {
    expect(userProfileValidator.getRequiredFields()).toEqual(['displayName', 'email', 'role']);
  });

  it('siteValidator has correct required fields', () => {
    expect(siteValidator.getRequiredFields()).toEqual(['name', 'type']);
  });

  it('deviceRegistrationValidator has correct required fields', () => {
    expect(deviceRegistrationValidator.getRequiredFields()).toEqual(['serialNumber']);
  });

  it('listingValidator has correct required fields', () => {
    expect(listingValidator.getRequiredFields()).toEqual(['creditId', 'quantity', 'pricePerUnit']);
  });

  it('alertThresholdValidator has correct required fields', () => {
    expect(alertThresholdValidator.getRequiredFields()).toEqual(['parameter']);
  });
});
