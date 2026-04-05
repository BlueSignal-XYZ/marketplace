export const formatLongString = (address, first = 6, last = 4) => {
  if (!address) return '';
  const firstPart = address.slice(0, first);
  const lastPart = address.slice(-last);
  return `${firstPart}...${lastPart}`;
};

export function isNotZeroAddress(address) {
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  return address.toLowerCase() !== zeroAddress.toLowerCase();
}

/**
 * Extracts and cleans URLs from a given string.
 * Returns only the direct link components.
 *
 * @param {string} str - The string containing URLs.
 * @return {Array<string>} - An array of cleaned direct links.
 */
export const extractAndCleanUrls = (str) => {
  // Regular expression to match URLs
  const urlRegex = /((https?|ftp|file|blob):\/\/[^\s/$.?#].[^\s]*)/gi;

  // Find all matches in the input string
  const matches = str.match(urlRegex);

  if (!matches) {
    return [];
  }

  // Clean each matched URL
  const cleanedUrls = matches.map((url) => {
    try {
      const urlObj = new URL(url);

      // For blob URLs, return the pathname part
      if (urlObj.protocol === 'blob:') {
        return urlObj.pathname.replace(/^\//, '');
      }

      // For other URLs, return the href directly
      return urlObj.href;
    } catch (e) {
      // Handle any invalid URLs
      console.error('Invalid URL:', e);
      return '';
    }
  });

  // Filter out any empty results caused by invalid URLs
  return cleanedUrls.filter(Boolean);
};
