#!/usr/bin/env node
/**
 * Seed script — populates Firebase RTDB with sample marketplace data.
 *
 * Prerequisites:
 *   firebase login                 (authenticate CLI)
 *   firebase use waterquality-trading  (select project)
 *
 * Usage:
 *   node scripts/seed-data.js          (seed data)
 *   node scripts/seed-data.js --clear  (clear seeded data)
 *
 * Or via npm:
 *   npm run seed
 *   npm run seed:clear
 */

const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'waterquality-trading',
  databaseURL: 'https://waterquality-trading-default-rtdb.firebaseio.com',
});

const rtdb = admin.database();

const CLEAR_MODE = process.argv.includes('--clear');

// ── Listings (RTDB /listings/) ────────────────────────────────
// Shape matches what wqtDataService.transformListingToCard expects.

const LISTINGS = {
  'WQC-2026-001': {
    creditId: 'WQC-2026-001',
    sellerId: 'seller-001',
    status: 'active',
    details: {
      creditType: 'nitrogen',
      quantity: 150,
      pricePerUnit: 24.50,
      totalPrice: 3675.00,
      currency: 'USD',
      minPurchase: 10,
    },
    location: {
      state: 'Maryland',
      watershed: 'Youghiogheny River',
      siteId: 'site-001',
      coordinates: { lat: 39.5156, lng: -79.3453 },
    },
    timestamps: { created: Date.now() - 86400000 * 19 },
    metadata: { views: 42 },
  },
  'WQC-2026-002': {
    creditId: 'WQC-2026-002',
    sellerId: 'seller-002',
    status: 'active',
    details: {
      creditType: 'phosphorus',
      quantity: 85,
      pricePerUnit: 38.75,
      totalPrice: 3293.75,
      currency: 'USD',
      minPurchase: 5,
    },
    location: {
      state: 'Maryland',
      watershed: 'Severn River',
      siteId: 'site-002',
      coordinates: { lat: 38.9784, lng: -76.5739 },
    },
    timestamps: { created: Date.now() - 86400000 * 15 },
    metadata: { views: 67 },
  },
  'WQC-2026-003': {
    creditId: 'WQC-2026-003',
    sellerId: 'seller-003',
    status: 'active',
    details: {
      creditType: 'nitrogen',
      quantity: 500,
      pricePerUnit: 12.00,
      totalPrice: 6000.00,
      currency: 'USD',
      minPurchase: 25,
    },
    location: {
      state: 'Texas',
      watershed: 'Colorado River',
      siteId: 'site-003',
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    timestamps: { created: Date.now() - 86400000 * 10 },
    metadata: { views: 31 },
  },
  'WQC-2026-004': {
    creditId: 'WQC-2026-004',
    sellerId: 'seller-004',
    status: 'active',
    details: {
      creditType: 'nitrogen',
      quantity: 200,
      pricePerUnit: 22.00,
      totalPrice: 4400.00,
      currency: 'USD',
      minPurchase: 10,
    },
    location: {
      state: 'Texas',
      watershed: 'San Jacinto River',
      siteId: 'site-004',
      coordinates: { lat: 29.9195, lng: -95.2568 },
    },
    timestamps: { created: Date.now() - 86400000 * 8 },
    metadata: { views: 55 },
  },
  'WQC-2026-005': {
    creditId: 'WQC-2026-005',
    sellerId: 'seller-005',
    status: 'active',
    details: {
      creditType: 'phosphorus',
      quantity: 45,
      pricePerUnit: 42.00,
      totalPrice: 1890.00,
      currency: 'USD',
      minPurchase: 5,
    },
    location: {
      state: 'Virginia',
      watershed: 'Potomac River',
      siteId: 'site-005',
      coordinates: { lat: 38.8462, lng: -77.3064 },
    },
    timestamps: { created: Date.now() - 86400000 * 5 },
    metadata: { views: 89 },
  },
};

// ── Credits (RTDB /credits/) ──────────────────────────────────
// Shape matches what wqtDataService.transformCreditToRegistry expects.

const CREDITS = {
  'credit-001': {
    type: 'nitrogen',
    quantity: { amount: 150, unit: 'kg' },
    status: 'active',
    origin: {
      watershed: 'Deep Creek Lake Remediation',
      siteId: 'site-001',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 36,
      certificateHash: '0xabc123def456',
    },
    ownership: {
      originalOwner: 'Garrett County Water Authority',
    },
  },
  'credit-002': {
    type: 'phosphorus',
    quantity: { amount: 85, unit: 'kg' },
    status: 'active',
    origin: {
      watershed: 'Chesapeake Bay Tributary Program',
      siteId: 'site-002',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 31,
      certificateHash: '0xdef789abc012',
    },
    ownership: {
      originalOwner: 'Bay Watershed Alliance',
    },
  },
  'credit-003': {
    type: 'nitrogen',
    quantity: { amount: 500, unit: 'kg' },
    status: 'active',
    origin: {
      watershed: 'Hill Country Erosion Prevention',
      siteId: 'site-003',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 20,
      certificateHash: '0x789012abc345',
    },
    ownership: {
      originalOwner: 'Central Texas Water Cooperative',
    },
  },
  'credit-004': {
    type: 'nitrogen',
    quantity: { amount: 200, unit: 'kg' },
    status: 'active',
    origin: {
      watershed: 'Lake Houston Protection Initiative',
      siteId: 'site-004',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 18,
      certificateHash: '0x345678def901',
    },
    ownership: {
      originalOwner: 'Houston Metro Water District',
    },
  },
  'credit-005': {
    type: 'phosphorus',
    quantity: { amount: 45, unit: 'kg' },
    status: 'active',
    origin: {
      watershed: 'Virginia Nutrient Credit Exchange',
      siteId: 'site-005',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 23,
      certificateHash: '0x901234abc567',
    },
    ownership: {
      originalOwner: 'NoVA Clean Water Fund',
    },
  },
  'credit-006': {
    type: 'nitrogen',
    quantity: { amount: 100, unit: 'kg' },
    status: 'retired',
    origin: {
      watershed: 'James River Cleanup',
      siteId: 'site-006',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 170,
      certificateHash: '0x567890def123',
    },
    ownership: {
      originalOwner: 'Richmond Municipal Authority',
    },
  },
  'credit-007': {
    type: 'phosphorus',
    quantity: { amount: 60, unit: 'kg' },
    status: 'retired',
    origin: {
      watershed: 'Rappahannock Basin Restoration',
      siteId: 'site-007',
    },
    verification: {
      verifiedAt: Date.now() - 86400000 * 140,
      certificateHash: '0xaaa111bbb222',
    },
    ownership: {
      originalOwner: 'Fredericksburg Water Authority',
    },
  },
};

// ── Seed / Clear ──────────────────────────────────────────────

async function seedAll() {
  console.log('Seeding RTDB with marketplace data...\n');

  console.log('  Writing /listings/ ...');
  await rtdb.ref('listings').set(LISTINGS);
  console.log(`  ✓ ${Object.keys(LISTINGS).length} listings written`);

  console.log('  Writing /credits/ ...');
  await rtdb.ref('credits').set(CREDITS);
  console.log(`  ✓ ${Object.keys(CREDITS).length} credits written`);

  console.log('\nDone! Seed data written to RTDB.');
  console.log('  - Marketplace should show 5 active listings');
  console.log('  - Registry should show 7 credits (5 active, 2 retired)');
  console.log('  - Recent Removals should show 2 retired credits');
  process.exit(0);
}

async function clearAll() {
  console.log('Clearing seeded RTDB data...\n');

  console.log('  Removing /listings/ ...');
  await rtdb.ref('listings').remove();
  console.log('  ✗ Listings cleared');

  console.log('  Removing /credits/ ...');
  await rtdb.ref('credits').remove();
  console.log('  ✗ Credits cleared');

  console.log('\nDone! Seeded data removed.');
  process.exit(0);
}

if (CLEAR_MODE) {
  clearAll().catch((err) => {
    console.error('Clear failed:', err.message);
    process.exit(1);
  });
} else {
  seedAll().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  });
}
