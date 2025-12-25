/**
 * BlueSignal Form Validation Utilities
 * Provides validation schemas and utilities for frontend forms
 */

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Create a validation result
 */
const createResult = (valid, error = null, value = null) => ({
  valid,
  error,
  value,
});

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (E.164 format)
 */
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * Serial number validation regex
 */
const SERIAL_REGEX = /^BS-\d{4}-\d{6}$/;

// =============================================================================
// FIELD VALIDATORS
// =============================================================================

const validators = {
  required: (value, message = "This field is required") => {
    if (value === null || value === undefined || value === "") {
      return createResult(false, message);
    }
    return createResult(true, null, value);
  },

  string: (value, options = {}) => {
    if (typeof value !== "string") {
      return createResult(false, "Must be a string");
    }

    if (options.minLength && value.length < options.minLength) {
      return createResult(false, `Must be at least ${options.minLength} characters`);
    }

    if (options.maxLength && value.length > options.maxLength) {
      return createResult(false, `Must be at most ${options.maxLength} characters`);
    }

    if (options.pattern && !options.pattern.test(value)) {
      return createResult(false, options.patternMessage || "Invalid format");
    }

    return createResult(true, null, value);
  },

  email: (value) => {
    if (!EMAIL_REGEX.test(value)) {
      return createResult(false, "Invalid email address");
    }
    return createResult(true, null, value);
  },

  phone: (value) => {
    if (!value) return createResult(true, null, value); // Optional
    if (!PHONE_REGEX.test(value)) {
      return createResult(false, "Invalid phone number");
    }
    return createResult(true, null, value);
  },

  number: (value, options = {}) => {
    const num = Number(value);
    if (isNaN(num)) {
      return createResult(false, "Must be a number");
    }

    if (options.min !== undefined && num < options.min) {
      return createResult(false, `Must be at least ${options.min}`);
    }

    if (options.max !== undefined && num > options.max) {
      return createResult(false, `Must be at most ${options.max}`);
    }

    if (options.positive && num <= 0) {
      return createResult(false, "Must be a positive number");
    }

    return createResult(true, null, num);
  },

  enum: (value, allowedValues, message) => {
    if (!allowedValues.includes(value)) {
      return createResult(false, message || `Must be one of: ${allowedValues.join(", ")}`);
    }
    return createResult(true, null, value);
  },

  coordinates: (value) => {
    if (!value || typeof value !== "object") {
      return createResult(false, "Coordinates required");
    }

    const { lat, lng } = value;

    if (typeof lat !== "number" || lat < -90 || lat > 90) {
      return createResult(false, "Invalid latitude");
    }

    if (typeof lng !== "number" || lng < -180 || lng > 180) {
      return createResult(false, "Invalid longitude");
    }

    return createResult(true, null, value);
  },

  serialNumber: (value) => {
    if (!SERIAL_REGEX.test(value)) {
      return createResult(false, "Invalid serial number format. Expected: BS-YYYY-NNNNNN");
    }
    return createResult(true, null, value);
  },
};

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

/**
 * User profile validation schema
 */
export const userProfileSchema = {
  displayName: {
    validate: (v) => validators.string(v, { minLength: 2, maxLength: 100 }),
    required: true,
  },
  email: {
    validate: validators.email,
    required: true,
  },
  phone: {
    validate: validators.phone,
    required: false,
  },
  company: {
    validate: (v) => validators.string(v, { minLength: 2, maxLength: 200 }),
    required: false,
  },
  role: {
    validate: (v) => validators.enum(v, ["buyer", "seller", "installer", "admin"]),
    required: true,
  },
};

/**
 * Site validation schema
 */
export const siteSchema = {
  name: {
    validate: (v) => validators.string(v, { minLength: 3, maxLength: 200 }),
    required: true,
  },
  type: {
    validate: (v) =>
      validators.enum(v, ["farm", "lake", "river", "pond", "treatment_plant", "stormwater"]),
    required: true,
  },
  coordinates: {
    validate: validators.coordinates,
    required: false,
  },
  address: {
    validate: (v) => validators.string(v, { maxLength: 500 }),
    required: false,
  },
  city: {
    validate: (v) => validators.string(v, { maxLength: 100 }),
    required: false,
  },
  state: {
    validate: (v) => validators.string(v, { maxLength: 50 }),
    required: false,
  },
  watershed: {
    validate: (v) => validators.string(v, { maxLength: 100 }),
    required: false,
  },
  area: {
    validate: (v) => validators.number(v, { positive: true }),
    required: false,
  },
};

/**
 * Device registration validation schema
 */
export const deviceRegistrationSchema = {
  serialNumber: {
    validate: validators.serialNumber,
    required: true,
  },
  purchaseOrderId: {
    validate: (v) => validators.string(v, { maxLength: 50 }),
    required: false,
  },
};

/**
 * Listing validation schema
 */
export const listingSchema = {
  creditId: {
    validate: (v) => validators.string(v, { minLength: 1 }),
    required: true,
  },
  quantity: {
    validate: (v) => validators.number(v, { positive: true }),
    required: true,
  },
  pricePerUnit: {
    validate: (v) => validators.number(v, { positive: true }),
    required: true,
  },
  minPurchase: {
    validate: (v) => validators.number(v, { positive: true }),
    required: false,
    default: 1,
  },
  expiresInDays: {
    validate: (v) => validators.number(v, { min: 1, max: 365 }),
    required: false,
    default: 30,
  },
};

/**
 * Alert threshold validation schema
 */
export const alertThresholdSchema = {
  parameter: {
    validate: (v) =>
      validators.enum(v, [
        "nitrogen",
        "phosphorus",
        "dissolved_oxygen",
        "temperature",
        "ph",
        "turbidity",
        "conductivity",
      ]),
    required: true,
  },
  high: {
    validate: (v) => validators.number(v),
    required: false,
  },
  low: {
    validate: (v) => validators.number(v),
    required: false,
  },
  enabled: {
    validate: (v) => createResult(typeof v === "boolean", "Must be a boolean", v),
    required: false,
    default: true,
  },
};

/**
 * Commission step data schemas
 */
export const commissionStepSchemas = {
  device_scan: {
    method: {
      validate: (v) => validators.enum(v, ["qr_scan", "serial_manual"]),
      required: true,
    },
    serialNumber: {
      validate: validators.serialNumber,
      required: true,
    },
  },
  site_selection: {
    siteId: {
      validate: (v) => validators.string(v, { minLength: 1 }),
      required: true,
    },
  },
  location_capture: {
    coordinates: {
      validate: validators.coordinates,
      required: true,
    },
    method: {
      validate: (v) => validators.enum(v, ["gps", "map_pin", "address"]),
      required: false,
    },
    address: {
      validate: (v) => validators.string(v, { maxLength: 500 }),
      required: false,
    },
  },
  photo_upload: {
    photos: {
      validate: (v) => {
        if (!Array.isArray(v) || v.length === 0) {
          return createResult(false, "At least one photo is required");
        }
        return createResult(true, null, v);
      },
      required: true,
    },
  },
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate a single field against a schema
 */
export const validateField = (value, fieldSchema) => {
  // Check required
  if (fieldSchema.required) {
    const requiredResult = validators.required(value);
    if (!requiredResult.valid) {
      return requiredResult;
    }
  }

  // Skip validation if optional and empty
  if (!fieldSchema.required && (value === null || value === undefined || value === "")) {
    return createResult(true, null, fieldSchema.default ?? value);
  }

  // Run field-specific validation
  return fieldSchema.validate(value);
};

/**
 * Validate an object against a schema
 */
export const validateSchema = (data, schema) => {
  const errors = {};
  const values = {};
  let isValid = true;

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = data[fieldName];
    const result = validateField(value, fieldSchema);

    if (!result.valid) {
      errors[fieldName] = result.error;
      isValid = false;
    } else {
      values[fieldName] = result.value ?? value;
    }
  }

  return { isValid, errors, values };
};

/**
 * Create a form validation hook helper
 */
export const createFormValidator = (schema) => {
  return {
    validateField: (fieldName, value) => {
      const fieldSchema = schema[fieldName];
      if (!fieldSchema) return { valid: true, error: null };
      return validateField(value, fieldSchema);
    },

    validate: (data) => validateSchema(data, schema),

    getFieldNames: () => Object.keys(schema),

    getRequiredFields: () =>
      Object.entries(schema)
        .filter(([, s]) => s.required)
        .map(([name]) => name),
  };
};

// =============================================================================
// PRESET VALIDATORS FOR COMMON USE CASES
// =============================================================================

export const userProfileValidator = createFormValidator(userProfileSchema);
export const siteValidator = createFormValidator(siteSchema);
export const deviceRegistrationValidator = createFormValidator(deviceRegistrationSchema);
export const listingValidator = createFormValidator(listingSchema);
export const alertThresholdValidator = createFormValidator(alertThresholdSchema);

// Export validators for custom use
export { validators };
