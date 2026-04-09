/**
 * Fetch wrapper that adds an AbortController timeout.
 * Drop-in replacement for bare fetch() calls that may hang indefinitely.
 *
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} timeoutMs - Timeout in milliseconds (default: 30000)
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
