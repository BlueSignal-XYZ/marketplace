/**
 * Recursive function to search within an object or value.
 * @param {Object|any} obj - The value or object to search within.
 * @param {string} query - The search query.
 * @returns {boolean} - Whether the value or object contains the search query.
 */
const containsQuery = (obj, query) => {
  if (typeof obj !== 'object' || obj === null) {
    return String(obj).toLowerCase().includes(query.toLowerCase());
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => containsQuery(item, query));
  }

  for (let key in obj) {
    if (containsQuery(obj[key], query)) {
      return true;
    }
  }

  return false;
};

/**
 * Filters an object based on a search query, targeting every array within.
 * @param {Object} obj - The object to filter.
 * @param {string} query - The search query.
 * @returns {Object|Array} - The filtered object or array.
 */
export const filterObjectByQuery = (obj, query) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => containsQuery(item, query))
      .map((item) => filterObjectByQuery(item, query));
  }

  const filteredObj = {};

  for (let key in obj) {
    filteredObj[key] = filterObjectByQuery(obj[key], query);
  }

  return filteredObj;
};
