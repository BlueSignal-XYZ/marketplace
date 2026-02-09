/**
 * WQT Data Service
 * 
 * Provides real-time data access for WaterQuality.Trading marketplace pages.
 * Reads from Firebase RTDB (credits, listings, sites) and transforms data
 * into the shapes expected by UI components. Falls back to empty arrays
 * if RTDB is unavailable or empty.
 */

import { db } from '../apis/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { CreditsMarketplaceAPI, DeviceAPI, GeocodingAPI } from '../scripts/back_door';

// ============================================================
// CREDITS (for Registry and Recent Removals pages)
// ============================================================

/**
 * Fetches all credits from RTDB /credits/ and transforms to RegistryCredit shape.
 * Used by RegistryPage and RecentRemovalsPage.
 */
export const fetchRegistryCredits = async () => {
  try {
    // Try backend API first
    const creditsRef = ref(db, 'credits');
    const snapshot = await get(creditsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const creditsData = snapshot.val();
    return Object.entries(creditsData).map(([id, credit]) => transformCreditToRegistry(id, credit));
  } catch (error) {
    console.error('Failed to fetch registry credits:', error);
    return [];
  }
};

/**
 * Fetches credits filtered by type.
 */
export const fetchCreditsByType = async (type) => {
  const credits = await fetchRegistryCredits();
  if (type === 'all') return credits;
  return credits.filter(c => c.type === type);
};

/**
 * Fetches retired credits for Recent Removals page.
 */
export const fetchRetiredCredits = async () => {
  const credits = await fetchRegistryCredits();
  return credits.filter(c => c.status === 'retired');
};

/**
 * Searches credits by query string (ID, project name, location).
 */
export const searchCredits = (credits, query) => {
  if (!query) return credits;
  const q = query.toLowerCase();
  return credits.filter(c =>
    c.id.toLowerCase().includes(q) ||
    c.projectName.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  );
};

/**
 * Transforms RTDB credit record to RegistryCredit shape expected by UI.
 */
const transformCreditToRegistry = (id, credit) => ({
  id: id,
  type: credit.type || 'nitrogen',
  quantity: credit.quantity?.amount || 0,
  unit: credit.quantity?.unit || 'lbs',
  projectName: credit.origin?.watershed || 'Unknown Project',
  projectId: credit.origin?.siteId || '',
  location: credit.origin?.watershed || 'Unknown Location',
  issueDate: credit.verification?.verifiedAt
    ? new Date(credit.verification.verifiedAt).toISOString()
    : new Date().toISOString(),
  retirementDate: credit.status === 'retired' && credit.verification?.verifiedAt
    ? new Date(credit.verification.verifiedAt + 86400000).toISOString()
    : null,
  status: credit.status === 'retired' ? 'retired' : 'active',
  verificationId: credit.verification?.certificateHash || `VER-${id.slice(0, 8)}`,
  verifier: credit.ownership?.originalOwner || 'BlueSignal Verification',
});


// ============================================================
// LISTINGS (for Marketplace Browse and Presale pages)
// ============================================================

/**
 * Fetches all active listings from RTDB /listings/.
 * Used by Marketplace browse page.
 */
export const fetchListings = async () => {
  try {
    // Try backend API first
    try {
      const response = await CreditsMarketplaceAPI.getListings();
      if (response?.listings && response.listings.length > 0) {
        return response.listings.map(transformListingToCard);
      }
    } catch (e) {
      // Fall through to RTDB
    }

    // Direct RTDB read
    const listingsRef = ref(db, 'listings');
    const snapshot = await get(listingsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const listingsData = snapshot.val();
    return Object.entries(listingsData)
      .map(([id, listing]) => transformListingToCard(listing, id))
      .filter(l => l.status === 'active');
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return [];
  }
};

/**
 * Fetches a single listing by ID.
 */
export const fetchListingById = async (listingId) => {
  try {
    const listingRef = ref(db, `listings/${listingId}`);
    const snapshot = await get(listingRef);

    if (!snapshot.exists()) {
      return null;
    }

    return transformListingToCard(snapshot.val(), listingId);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return null;
  }
};

/**
 * Transforms RTDB listing record to card shape expected by marketplace UI.
 */
const transformListingToCard = (listing, id) => ({
  id: id || listing.id || listing.listingId,
  name: listing.details?.creditType
    ? `${listing.details.creditType.charAt(0).toUpperCase() + listing.details.creditType.slice(1)} Credits`
    : 'Water Quality Credits',
  type: listing.details?.creditType || 'nitrogen',
  quantity: listing.details?.quantity || 0,
  pricePerUnit: listing.details?.pricePerUnit || 0,
  totalPrice: listing.details?.totalPrice || 0,
  currency: listing.details?.currency || 'USD',
  minPurchase: listing.details?.minPurchase || 1,
  seller: listing.sellerId || '',
  status: listing.status || 'active',
  location: listing.location?.state || '',
  watershed: listing.location?.watershed || '',
  lat: listing.location?.coordinates?.lat || 0,
  lng: listing.location?.coordinates?.lng || 0,
  siteId: listing.location?.siteId || '',
  creditId: listing.creditId || '',
  createdAt: listing.timestamps?.created || Date.now(),
  views: listing.metadata?.views || 0,
});


// ============================================================
// SITES / MAP PROJECTS (for Map page)
// ============================================================

/**
 * Fetches all sites from backend API and transforms to MapProject shape.
 * Used by MapPage.
 */
export const fetchMapProjects = async () => {
  try {
    // Try backend API
    try {
      const response = await GeocodingAPI.listSites({});
      if (response?.sites && response.sites.length > 0) {
        return response.sites.map(transformSiteToMapProject);
      }
    } catch (e) {
      // Fall through to RTDB
    }

    // Direct RTDB read
    const sitesRef = ref(db, 'sites');
    const snapshot = await get(sitesRef);

    if (!snapshot.exists()) {
      return [];
    }

    const sitesData = snapshot.val();
    return Object.entries(sitesData).map(([id, site]) => transformSiteToMapProject(site, id));
  } catch (error) {
    console.error('Failed to fetch map projects:', error);
    return [];
  }
};

/**
 * Transforms RTDB site to MapProject shape expected by MapPage.
 */
const transformSiteToMapProject = (site, id) => ({
  id: id || site.id || site.siteId,
  name: site.name || 'Unnamed Site',
  description: site.metadata?.waterBodyType
    ? `${site.type || 'Site'} - ${site.metadata.waterBodyType}`
    : site.type || 'Water Quality Monitoring Site',
  lat: site.location?.coordinates?.lat || 0,
  lng: site.location?.coordinates?.lng || 0,
  creditTypes: site.credits?.eligible ? ['nitrogen'] : [],
  totalCredits: site.credits?.totalGenerated || 0,
  owner: site.ownerId || '',
  acreage: site.metadata?.area || null,
  status: 'active',
  boundary: site.location?.boundary || null,
});


// ============================================================
// ORDERS / TRANSACTIONS (for Transaction page and dashboards)
// ============================================================

/**
 * Fetches orders for a specific user.
 * Used by TransactionPage and dashboard components.
 */
export const fetchUserOrders = async (userId) => {
  try {
    const ordersRef = ref(db, 'orders');
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
      return [];
    }

    const ordersData = snapshot.val();
    return Object.entries(ordersData)
      .map(([id, order]) => transformOrderToTransaction(id, order))
      .filter(o => o.buyerId === userId || o.sellerId === userId);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
};

/**
 * Transforms RTDB order to transaction shape.
 */
const transformOrderToTransaction = (id, order) => ({
  id,
  type: order.type || 'credit_purchase',
  status: order.status || 'pending',
  buyerId: order.buyer?.uid || '',
  buyerEmail: order.buyer?.email || '',
  buyerCompany: order.buyer?.company || '',
  sellerId: order.seller?.uid || '',
  sellerEmail: order.seller?.email || '',
  sellerCompany: order.seller?.company || '',
  amount: order.payment?.amount || 0,
  currency: order.payment?.currency || 'USD',
  paymentStatus: order.payment?.status || 'pending',
  createdAt: order.timestamps?.created || Date.now(),
  completedAt: order.timestamps?.completed || null,
});


// ============================================================
// USER CREDITS (for Buyer/Seller dashboards)
// ============================================================

/**
 * Fetches credits owned by a specific user.
 * Used by BuyerDashboard and credit portfolio.
 */
export const fetchUserCredits = async (userId) => {
  try {
    const creditsRef = ref(db, 'credits');
    const snapshot = await get(creditsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const creditsData = snapshot.val();
    return Object.entries(creditsData)
      .map(([id, credit]) => transformCreditToRegistry(id, credit))
      .filter(c => {
        const raw = creditsData[c.id.startsWith('credit-') ? c.id : c.id];
        return raw?.ownership?.currentOwner === userId;
      });
  } catch (error) {
    console.error('Failed to fetch user credits:', error);
    return [];
  }
};

/**
 * Fetches listings created by a specific seller.
 * Used by SellerDashboard.
 */
export const fetchSellerListings = async (sellerId) => {
  try {
    const listingsRef = ref(db, 'listings');
    const snapshot = await get(listingsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const listingsData = snapshot.val();
    return Object.entries(listingsData)
      .map(([id, listing]) => transformListingToCard(listing, id))
      .filter(l => l.seller === sellerId);
  } catch (error) {
    console.error('Failed to fetch seller listings:', error);
    return [];
  }
};


// ============================================================
// DEVICES (for cross-platform visibility)
// ============================================================

/**
 * Fetches devices owned by a user via backend API.
 * Used by WQT dashboards to show Cloud-commissioned devices.
 */
export const fetchUserDevices = async () => {
  try {
    const response = await DeviceAPI.getDevices();
    if (response?.devices) {
      return response.devices;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user devices:', error);
    return [];
  }
};
