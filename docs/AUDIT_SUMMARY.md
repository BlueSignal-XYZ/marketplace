# Virginia Nutrient Credit Exchange Integration - Codebase Audit Summary

## Audit Date: December 30, 2025

---

## 1. Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18 + Vite (SPA) |
| **Routing** | React Router v6 |
| **State Management** | React Context API (`AppContext.jsx`) |
| **Styling** | Styled Components |
| **Backend** | Firebase Cloud Functions (Node.js/Express) |
| **Database** | Firebase Realtime Database |
| **Authentication** | Firebase Authentication (Google OAuth) |
| **Blockchain** | Polygon (Amoy testnet / mainnet) via ethers.js |
| **Payments** | Stripe |
| **Maps** | Google Maps API, Mapbox GL |
| **Media** | Livepeer |

---

## 2. Architecture Overview

### Mode Detection
The app operates in **tri-mode architecture** based on hostname:
- **Marketplace** (`waterquality.trading`) - Nutrient credit marketplace
- **Cloud** (`cloud.bluesignal.xyz`) - Device monitoring dashboard
- **Sales** (`sales.bluesignal.xyz`) - Hardware sales portal

Mode detection: `src/utils/modeDetection.js`

### Key Directories
```
src/
├── apis/              # Firebase config
├── components/        # React components
│   ├── cloud/         # BlueSignal Cloud specific
│   ├── elements/
│   │   └── marketplace/  # Marketplace components
│   └── navigation/    # Headers and menus
├── context/           # AppContext (global state)
├── data/              # Mock data files
├── functions/         # Cloud Functions (backend)
├── hooks/             # Custom React hooks
├── routes/            # Top-level route components
├── scripts/           # API clients (back_door.js)
├── services/          # Business logic services
└── wqt/               # WaterQuality.Trading pages
```

---

## 3. Existing Data Models

### 3.1 Users (`/users/{uid}`)
```javascript
{
  profile: {
    email: string,
    displayName: string,
    phone: string,
    company: string,
    role: "buyer" | "seller" | "installer" | "admin",
    onboardingComplete: boolean
  },
  settings: { notifications, timezone, units },
  wallets: { polygon: { address, linked }, stripe: { customerId } },
  activity: [{ type, timestamp, metadata }]
}
```

### 3.2 Devices (`/devices/{serialNumber}`)
```javascript
{
  serialNumber: string,  // Format: pgw-XXXX
  type: "buoy" | "soil_probe" | "gateway" | "algae_control",
  sku: string,
  lifecycle: "inventory" | "allocated" | "shipped" | "installed" | "active" | "maintenance",
  ownership: { ownerId, purchaseDate, warrantyExpiry },
  installation: {
    status, siteId, installerId, commissionedAt,
    location: { lat, lng, accuracy, source }
  },
  configuration: { reportingInterval, alertThresholds, calibration }
}
```

### 3.3 Sites (`/sites/{siteId}`)
```javascript
{
  id: string,
  customerId: string,
  name: string,
  address: string,
  coordinates: { lat, lng },
  type: "residential" | "commercial" | "agricultural" | "municipal",
  waterBodyType: string,
  waterBodyName: string,
  deviceIds: [string],
  createdAt: timestamp
}
```

### 3.4 Credits (`/credits/{creditId}`)
```javascript
{
  type: "nitrogen" | "phosphorus" | "stormwater" | "thermal",
  status: "pending" | "verified" | "listed" | "sold",
  origin: {
    siteId: string,
    deviceId: string,
    watershed: string,
    generatedFrom: timestamp,
    generatedTo: timestamp,
    methodology: string
  },
  quantity: { amount: number, unit: "lbs" },
  verification: { verifiedAt, certificateHash, transactionHash },
  ownership: {
    currentOwner: uid,
    originalOwner: uid,
    transferHistory: []
  },
  listing: { listingId, price, listedAt }
}
```

### 3.5 Listings (`/listings/{listingId}`)
```javascript
{
  creditId: string,
  sellerId: uid,
  details: {
    creditType: string,
    quantity: number,
    pricePerUnit: number,
    totalPrice: number,
    currency: "USD",
    minPurchase: number
  },
  location: { watershed, state, siteId, coordinates },
  status: "active" | "sold" | "cancelled" | "expired",
  timestamps: { created, updated, expires, sold },
  metadata: { views, inquiries, featured }
}
```

### 3.6 Orders (`/orders/{orderId}`)
```javascript
{
  type: "credit_purchase",
  status: "pending" | "completed" | "cancelled",
  buyer: { uid, email, company },
  seller: { uid, email, company },
  items: [{
    type: "credit",
    itemId, listingId, quantity, unitPrice, totalPrice, creditType
  }],
  payment: { method, stripePaymentIntentId, amount, currency, status },
  timestamps: { created, updated, completed }
}
```

---

## 4. API Endpoint Inventory

### Backend API (Cloud Functions at `/app`)

#### User & Auth
- `POST /user/profile/get` - Get user profile
- `POST /user/profile/update` - Update profile
- `POST /user/role/update` - Update user role
- `POST /user/onboarding/complete` - Complete onboarding

#### Devices & Sites
- `POST /device/qr/generate` - Generate device QR
- `POST /device/register` - Register device
- `POST /site/create` - Create site
- `POST /site/get` - Get site
- `POST /site/update` - Update site
- `POST /site/add-device` - Add device to site

#### Commissioning
- `POST /commission/initiate` - Start commission
- `POST /commission/complete` - Complete commission
- `POST /commission/list` - List commissions

#### Readings & Alerts
- `POST /readings/get` - Get device readings
- `POST /readings/stats` - Get device stats
- `POST /alerts/active` - Get active alerts

#### Marketplace
- `POST /marketplace/listing/create` - Create listing
- `POST /marketplace/listing/get` - Get listing
- `POST /marketplace/listings/search` - Search listings
- `POST /marketplace/purchase` - Initiate purchase
- `POST /marketplace/purchase/complete` - Complete purchase
- `POST /credits/create` - Create credit
- `POST /credits/user` - Get user's credits

---

## 5. Frontend Component Structure

### WQT (WaterQuality.Trading) Pages
- `src/wqt/pages/RegistryPage.tsx` - Public credit registry
- `src/wqt/pages/MapPage.tsx` - Geographic credit view
- `src/wqt/pages/RecentRemovalsPage.tsx` - Recent retirements
- `src/wqt/pages/PresalePage.tsx` - Presale interface

### Marketplace Components
- `src/components/elements/marketplace/CreateListingPage.jsx` - Create listing
- `src/components/elements/marketplace/ListingPage.jsx` - View listing
- `src/components/elements/marketplace/SellerDashboard.jsx` - Seller portal
- `src/components/elements/marketplace/PurchaseFlow.jsx` - Purchase workflow

### Cloud Components
- `src/components/cloud/SitesListPage.jsx` - Site management
- `src/components/cloud/DevicesListPage.jsx` - Device inventory
- `src/components/cloud/DeviceDetailPage.jsx` - Device details

---

## 6. Integration Points with BlueSignal Cloud

### Current Integration
1. **Devices** - Same Firebase database, shared device records
2. **Sites** - Sites can have devices linked, location data stored
3. **Readings** - `ReadingsAPI.get()` fetches sensor data from devices
4. **Alerts** - Alert system monitors device thresholds

### How Credits Connect to Devices
1. Credits have `origin.siteId` and `origin.deviceId` fields
2. Site contains `coordinates` and `waterBodyName`
3. Device readings could feed into credit calculations

### Webhook Endpoint for BlueSignal
Currently uses database triggers, not webhooks. Device readings ingested via:
- `POST /readings/ingest` - Raw sensor data ingestion endpoint

---

## 7. Gaps for Virginia Credit Mechanics

### Missing Entities

| Entity | Status | Notes |
|--------|--------|-------|
| **Basin** | Missing | Virginia has 5 watersheds (ES, James, Potomac, Rappahannock, York) |
| **ComplianceYear** | Missing | Annual tracking with deadlines |
| **Project** | Missing | Sites exist but lack baseline loads, practice types |
| **DeliveryFactor** | Missing | Basin-specific nutrient delivery factors |
| **UncertaintyRatio** | Missing | Point vs nonpoint source ratios |
| **CreditSerial** | Partial | Credits lack Virginia-format serial numbers |

### Missing Logic

1. **Credit Calculation** - No delivery factor or uncertainty ratio applied
2. **Basin Trading Rules** - No cross-basin restrictions implemented
3. **Compliance Year Validity** - No credit expiration by year
4. **Baseline Establishment** - No baseline load tracking
5. **Credit Generation** - Currently manual, needs sensor-based calculation

---

## 8. Recommended Implementation Approach

### Phase 1: Data Model Extensions

Add new Firebase nodes:
```
/virginia/
  basins/          # VA watershed definitions
  complianceYears/ # Annual compliance periods
  projects/        # Extended site concept with baselines
  credits/         # Virginia-specific credit records
```

Extend existing:
- Credits: Add `basin`, `complianceYear`, `deliveryFactor`, `uncertaintyRatio`, `serialNumber`
- Sites: Add `basinId`, `practiceType`, `baselineLoads`

### Phase 2: Services

Create Virginia-specific services:
- `src/services/virginia/basinService.js` - Basin management
- `src/services/virginia/creditCalculator.js` - Credit calculation with VA rules
- `src/services/virginia/complianceService.js` - Compliance year tracking

### Phase 3: API Endpoints

Add to Cloud Functions:
```
POST /virginia/basins - Get all basins
POST /virginia/projects/create - Create credit project
POST /virginia/credits/calculate - Calculate credits
POST /virginia/credits/generate - Generate credits from readings
```

### Phase 4: Frontend

New components:
- Virginia basin selector
- Project management (extended site concept)
- Credit calculator interface
- Virginia credit registry view with basin filters

---

## 9. Key Questions Answered

1. **What ORM is used?** - None. Direct Firebase Realtime Database access via `admin.database()` and client SDK.

2. **Existing Organization/User model?** - Users have `profile.company` field. No separate Organization entity.

3. **Existing project/site concepts?** - Sites exist with location data. Can be extended to include baseline loads for Virginia projects.

4. **Existing Device model?** - Yes, comprehensive device management in Cloud mode. Can link devices to credit projects.

5. **Frontend stack?** - React 18 + Vite, Styled Components, React Router v6.

6. **Existing marketplace/transaction system?** - Yes, full marketplace with listings, purchases, and orders.

7. **Deployment?** - Firebase Hosting (multi-site) + Cloudflare CDN.

---

## 10. Files to Modify/Create

### Modify
- `src/data/mockRegistryData.ts` - Add Virginia mock data
- `src/wqt/pages/RegistryPage.tsx` - Add basin filters
- `src/scripts/back_door.js` - Add Virginia API calls
- `functions/index.js` - Add Virginia endpoints
- `database.rules.json` - Add Virginia node rules

### Create
- `src/services/virginia/` - Virginia-specific services
- `src/data/virginiaBasins.ts` - Basin definitions and delivery factors
- `src/components/virginia/` - Virginia-specific components
- `functions/virginia.js` - Virginia Cloud Functions

---

## Summary

The codebase has a solid foundation with existing credit marketplace functionality. Virginia integration requires:

1. **Minimal structural changes** - Extend existing models rather than replace
2. **New Virginia namespace** - Keep Virginia-specific logic isolated
3. **Service layer additions** - Credit calculation with VA rules
4. **Frontend enhancements** - Basin filters and project management

The existing device-site-credit pipeline can be extended to support sensor-backed credit generation with Virginia's delivery factors and uncertainty ratios.
