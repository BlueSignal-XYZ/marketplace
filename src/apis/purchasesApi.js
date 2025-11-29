// src/apis/purchasesApi.js

const MOCK_PURCHASES = [];

/**
 * Simulate a small network delay
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Submit a quote/purchase request for a credit.
 *
 * @param {Object} payload
 * @param {string} payload.creditId
 * @param {number} payload.requestedQuantity
 * @param {string} [payload.buyerNote]
 * @returns {Promise<{id: string, status: "received" | "in_review"}>}
 */
export async function requestQuote(payload) {
  await wait(400);

  const quote = {
    id: `qr_${Date.now()}`,
    creditId: payload.creditId,
    requestedQuantity: payload.requestedQuantity,
    buyerNote: payload.buyerNote || "",
    status: "received",
    createdAt: new Date().toISOString()
  };

  MOCK_PURCHASES.push(quote);
  return { id: quote.id, status: quote.status };
}

/**
 * Debug helper if you want to inspect in dev tools.
 */
export function __getMockPurchases() {
  return MOCK_PURCHASES;
}
