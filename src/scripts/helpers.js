export const STRING = {
  toTitleCase: (str) => {
    if (!str) return '';
    // Insert a space before all caps and trim the resulting string
    return String(str)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim();
  },
};

export const NUMBERS = {
  toNumber: (value) => {
    if (value == null) return 0;
    try {
      return value.toNumber();
    } catch {
      if (typeof value === 'number') {
        return value;
      } else {
        // Handle other potential types (like string)
        return parseInt(value, 10) || 0;
      }
    }
  },
  isValidAmount: (amount) => {
    return !isNaN(amount) && amount > 0;
  },
};

export const formatCertificate = (object) => {
  const result = {};

  // Iterate over the keys of the original object
  for (const key in object) {
    // Copy the value to the new object using the descriptive key
    if (object[key]?._isBigNumber) {
      result[key] = Number(object[key]);
    } else {
      result[key] = object[key];
    }
  }

  return result;
};

export const formatCertificateID = (number) => 'NPRC-' + String(number).padStart(7, '0');

export const timestampToLocale = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

export const handleViewCertificate = (id) => {
  const numId = id?.toNumber?.() ?? id ?? 0;
  const URL = `${window.location.origin}/certificate?id=${numId}`;
  window.open(URL, '_blank');
};

export const proxyLivepeerOriginEndpoint = (originalEndpoint) => {
  const baseUrl = 'https://origin.livepeer.com';
  const proxyBasePath = '/livepeer/origin';

  if (!originalEndpoint.startsWith(baseUrl)) {
    throw new Error('Original endpoint does not start with the base URL.');
  }

  const relativePath = originalEndpoint.substring(baseUrl.length);
  return `${proxyBasePath}${relativePath}`;
};

export const logDev = (title, vars = {}) => console.warn('@DEV: ', title, vars);
