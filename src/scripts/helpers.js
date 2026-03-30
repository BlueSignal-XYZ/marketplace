export const OBJECTS = {
  sanitizeObject: function(obj, depth = 0, maxDepth = 32, cache = new WeakMap()) {
    if (depth >= maxDepth) return null;
    if (cache.has(obj)) return null;

    if (Array.isArray(obj)) {
      cache.set(obj, true);
      return obj.map(item => this.sanitizeObject(item, depth + 1, maxDepth, cache));
    }

    if (obj !== null && typeof obj === 'object') {
      cache.set(obj, true);
      const sanitizedObj = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitizedObj[key] = this.sanitizeObject(value, depth + 1, maxDepth, cache);
      }
      return sanitizedObj;
    }

    return obj;
  },
  findValueByKey: function(obj, keyName) {
    return obj.hasOwnProperty(keyName) ? obj[keyName] : undefined;
  },
  ensureKeyFirst: function(obj, key) {
    if (obj?.hasOwnProperty(key)) {
      return {
        [key]: obj[key],
        ...obj
      };
    }
    return obj;
  },
  SEARCH: {
    containsQuery: function(obj, query) {
      if (typeof obj !== 'object' || obj === null) {
        return String(obj).toLowerCase().includes(query.toLowerCase());
      }

      if (Array.isArray(obj)) {
        return obj.some(item => this.containsQuery(item, query));
      }

      for (let key in obj) {
        if (this.containsQuery(obj[key], query)) {
          return true;
        }
      }

      return false;
    },
    filterObjectByQuery: function(obj, query) {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }

      if (Array.isArray(obj)) {
        return obj
          .filter(item => this.containsQuery(item, query))
          .map(item => this.filterObjectByQuery(item, query));
      }

      const filteredObj = {};

      for (let key in obj) {
        filteredObj[key] = this.filterObjectByQuery(obj[key], query);
      }

      return filteredObj;
    }
  }
};

export const STRING = {
  toTitleCase: (str) => {
    if (!str) return "";
    // Insert a space before all caps and trim the resulting string
    return String(str)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim();
  }
}

export const TIME = {
  /**
   * Converts a timestamp to a localized readable date string.
   *
   * @param {number} timestamp - The timestamp to convert, in milliseconds.
   *
   * @returns {string} - The localized date string.
   */
  timestampToLocalString: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}

export const NUMBERS = {
  toNumber: (value) => {
    if (value == null) return 0;
    try {
      return value.toNumber();
    } catch (e) {
      if (typeof value === "number") {
      return value;
    } else {
      // Handle other potential types (like string)
      return parseInt(value, 10) || 0;
    }}
  },
  isValidAmount: (amount) => {
    return !isNaN(amount) && amount > 0;
  }
}

export const FORM_DATA = {
  isValidEmail: (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}

export const formatCertificate = (object) => {
  const result = {};

  // Iterate over the keys of the original object
  for (const key in object) {
    // // Check if the key is a number or not
    // if (!isNaN(key)) {
    //   continue; // Skip number keys
    // }

    // Copy the value to the new object using the descriptive key
    if (object[key]?._isBigNumber) {
      result[key] = Number(object[key]);
    } else {
      result[key] = object[key];
    }
  }

  return result;
};

export const formatCertificateID = (number) =>
  "NPRC-" + String(number).padStart(7, "0");

export const createLookup = (arr) => {
  const lookup = {};
  for (const obj of arr) {
    lookup[obj.id] = obj;
  }
  return lookup;
};

export const timestampToLocale = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const handleViewCertificate = (id) => {
    const numId = id?.toNumber?.() ?? id ?? 0;
    const URL = `${window.location.origin}/certificate?id=${numId}`;
    window.open(URL, "_blank");
  };

  /**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const proxyLivepeerOriginEndpoint = (originalEndpoint) => {
  const baseUrl = 'https://origin.livepeer.com';
  const proxyBasePath = '/livepeer/origin';

  if (!originalEndpoint.startsWith(baseUrl)) {
    throw new Error('Original endpoint does not start with the base URL.');
  }

  const relativePath = originalEndpoint.substring(baseUrl.length);
  return `${proxyBasePath}${relativePath}`;
};


  export const logDev = (title, vars = {}) => console.warn("@DEV: ",title,vars);
