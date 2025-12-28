# WaterQuality.Trading Audit

**Site:** waterquality.trading
**Purpose:** Marketplace and platform for water quality credits - enabling utilities, municipalities, and third parties to interact with water monitoring and credit trading
**Audit Date:** 2025-12-28

---

## 1. Current Route Inventory

### Public Routes (No Auth Required)

| Route | Component | Current Purpose | Notes |
|-------|-----------|-----------------|-------|
| `/` | MarketplaceLanding | Landing/auth redirect | Redirects authenticated users to `/marketplace` |
| `/marketplace` | Marketplace | Main marketplace listing | Core feature - KEEP |
| `/marketplace/listing/:id` | ListingPage | Individual listing details | Core feature - KEEP |
| `/registry` | RegistryPage | Nutrient credit registry browser | Core feature - KEEP |
| `/map` | MapPage | Geographic visualization | Core feature - KEEP |
| `/recent-removals` | RecentRemovalsPage | Credit removals tracking | Core feature - KEEP |
| `/certificate/:id` | CertificatePage | Certificate verification | Core feature - KEEP |
| `/presale` | PresalePage | Presale announcements | Marketing - KEEP but review |
| `/sales/configurator` | BlueSignalConfigurator | Hardware configurator | **RELOCATE** - belongs on sales site |
| `/sales/enclosure` | EnclosurePage | Enclosure details | **RELOCATE** - belongs on sales site |

### Auth-Gated Routes (Requires user.uid)

| Route | Component | Current Purpose | Notes |
|-------|-----------|-----------------|-------|
| `/dashboard/buyer` | BuyerDashboard | Buyer account & purchases | Core feature - KEEP |
| `/dashboard/seller` | SellerDashboard_Role | Seller account & listings | Core feature - KEEP |
| `/dashboard/installer` | InstallerDashboard | Installer account | **RELOCATE** - belongs on cloud site |
| `/marketplace/tools/calculator` | NutrientCalculator | Nutrient calculation | Evaluate - may need context |
| `/marketplace/tools/live` | Livepeer | Live streaming | **REMOVE** - not core to trading |
| `/marketplace/tools/upload` | Livepeer | Media upload | **REMOVE** - not core to trading |
| `/marketplace/tools/verification` | VerificationUI | Contract verification | Core feature - KEEP |
| `/marketplace/seller-dashboard` | SellerDashboard | Legacy seller dashboard | Consolidate with /dashboard/seller |
| `/marketplace/create-listing` | CreateListingPage | Create/edit listings | Core feature - KEEP |
| `/dashboard/financial` | FinancialDashboard | Financial reports | Core feature - KEEP |

---

## 2. Navigation Structure Analysis

### Current Marketplace Menu Sections

```
EXPLORE
├─ Marketplace Home     → /marketplace
├─ Recent Removals      → /recent-removals
├─ Registry             → /registry
├─ Map                  → /map
└─ Presale              → /presale

TOOLS (auth-gated)
├─ Nutrient Calculator  → /marketplace/tools/calculator
├─ Live Stream          → /marketplace/tools/live       ⚠️ DOESN'T BELONG
├─ Upload Media         → /marketplace/tools/upload     ⚠️ DOESN'T BELONG
└─ Verification         → /marketplace/tools/verification

ACCOUNT (auth-gated)
├─ My Dashboard         → /dashboard/buyer
├─ Seller Dashboard     → /marketplace/seller-dashboard
├─ Create Listing       → /marketplace/create-listing
└─ Financial Dashboard  → /dashboard/financial
```

### Navigation Issues

1. **"TOOLS" section is cluttered** - Live streaming and media upload don't serve traders
2. **Duplicate seller dashboards** - `/dashboard/seller` and `/marketplace/seller-dashboard`
3. **Missing clear marketplace hierarchy** - Buyers vs Sellers not well separated
4. **Missing "Developers/API" section** - Critical for utility/municipality users
5. **Presale in Explore** - Mixes transactional content with exploration

---

## 3. Feature Analysis

### Features That BELONG Here

| Feature | Current State | Recommendation |
|---------|---------------|----------------|
| Credit Marketplace | ✅ Functional | Enhance listing discovery & filters |
| Registry Browser | ✅ Functional | Keep - core to compliance |
| Geographic Map | ✅ Functional | Keep - valuable visualization |
| Recent Removals | ✅ Functional | Keep - transparency feature |
| Certificate Verification | ✅ Functional | Keep - core trust feature |
| Buyer Dashboard | ✅ Functional | Enhance with portfolio view |
| Seller Dashboard | ⚠️ Duplicate | Consolidate two versions |
| Financial Dashboard | ✅ Functional | Keep - core to trading |
| Create Listing | ✅ Functional | Keep - core seller workflow |

### Features That Should Be REMOVED or RELOCATED

| Feature | Current Location | Recommendation | Reason |
|---------|-----------------|----------------|--------|
| Live Streaming | `/marketplace/tools/live` | **REMOVE** | Not related to credit trading |
| Media Upload | `/marketplace/tools/upload` | **REMOVE** | Not related to credit trading |
| Hardware Configurator | `/sales/configurator` | **RELOCATE → sales** | Sales tool, not trading tool |
| Enclosure Page | `/sales/enclosure` | **RELOCATE → sales** | Sales content |
| Installer Dashboard | `/dashboard/installer` | **RELOCATE → cloud** | Device management, not trading |
| Nutrient Calculator | `/marketplace/tools/calculator` | **EVALUATE** | May fit better on cloud for device owners |

### Features That Should Be ADDED

| Feature | Priority | Purpose |
|---------|----------|---------|
| **Developer Portal** | High | API docs, integration guides for DERAPI/utilities |
| **API Documentation** | High | RESTful API reference for programmatic access |
| **Webhook Configuration** | Medium | Allow integrators to receive credit events |
| **Portfolio Overview** | High | Aggregated view of all credits owned/listed |
| **Transaction History** | High | Complete history of all trades |
| **Compliance Reports** | High | Export-ready reports for regulatory needs |
| **Credit Calculator** | Medium | Estimate potential credits from data sources |
| **Price Analytics** | Medium | Market trends, price history charts |
| **Notification Center** | Low | Alerts for price changes, listing activity |

---

## 4. UX Pain Points

### Critical Issues

1. **Unclear Value Proposition**
   - Landing page doesn't explain what water quality credits are
   - No clear path for different user types (buyer vs seller vs utility)
   - Missing "how it works" content

2. **Navigation Confusion**
   - Tools section includes features that don't belong
   - Two seller dashboards create confusion
   - No clear distinction between public exploration and account management

3. **Missing User Journeys**
   - No onboarding flow for new buyers or sellers
   - No guided first listing creation
   - No API quickstart for developers

4. **Information Architecture**
   - Marketplace home doesn't surface key marketplace metrics
   - No portfolio view for credit holders
   - Financial dashboard buried in menu

### Medium Issues

1. **Empty States**
   - No listings state shows bare table
   - No transactions shows blank
   - Missing helpful CTAs in empty states

2. **Mobile Experience**
   - Menu is functional but not optimized
   - Listing cards may not be mobile-optimal
   - Map interactions untested on mobile

3. **Search & Discovery**
   - No advanced filtering on marketplace
   - No saved searches
   - No "similar listings" recommendations

### Minor Issues

1. **Branding Consistency**
   - "WaterQuality.Trading" vs "BlueSignal" confusion
   - Logo doesn't clearly convey purpose
   - Color palette underutilized

2. **Microcopy**
   - Generic button labels ("Submit", "Continue")
   - Technical jargon in user-facing content
   - Missing tooltips on complex features

---

## 5. Proposed Information Architecture

### New Navigation Structure

```
WaterQuality.Trading
│
├── MARKETPLACE
│   ├── Browse Credits        → /marketplace (enhanced with filters)
│   ├── Recent Activity       → /recent-removals
│   └── Registry              → /registry
│
├── MY PORTFOLIO (auth-gated)
│   ├── Dashboard Overview    → /dashboard (new unified dashboard)
│   ├── My Credits            → /portfolio/credits (new)
│   ├── My Listings           → /portfolio/listings (new)
│   ├── Transaction History   → /portfolio/transactions (new)
│   └── Financial Reports     → /dashboard/financial
│
├── SELL (auth-gated, seller role)
│   ├── Create Listing        → /sell/new
│   ├── Manage Listings       → /sell/listings
│   └── Seller Analytics      → /sell/analytics (new)
│
├── DEVELOPERS
│   ├── API Overview          → /developers (new)
│   ├── API Reference         → /developers/api (new)
│   ├── Webhooks              → /developers/webhooks (new)
│   └── Integrations          → /developers/integrations (new)
│
├── EXPLORE
│   ├── Map View              → /map
│   ├── How It Works          → /about (new)
│   └── Certificate Lookup    → /certificate/:id
│
└── ACCOUNT (auth-gated)
    ├── Settings              → /account/settings (new)
    ├── API Keys              → /account/api-keys (new)
    └── Notifications         → /account/notifications (new)
```

### Removed from WQT (to relocate)

- `/sales/*` routes → Move to sales.bluesignal.xyz
- `/marketplace/tools/live` → Remove entirely
- `/marketplace/tools/upload` → Remove entirely
- `/dashboard/installer` → Move to cloud.bluesignal.xyz
- `/marketplace/tools/calculator` → Evaluate, possibly move to cloud

---

## 6. Competitive Analysis Gaps

Compared to carbon credit marketplaces (e.g., Puro.earth, Verra):

1. **Missing: Clear credit type categorization**
2. **Missing: Verification status badges/indicators**
3. **Missing: Third-party verification integration**
4. **Missing: Bulk purchase workflows**
5. **Missing: API for programmatic trading**
6. **Missing: Real-time price feeds**

---

## 7. Technical Debt

1. **Duplicate Components**
   - `SellerDashboard` (2 versions in different locations)
   - `NutrientCalculator` wrapper inconsistency

2. **Legacy Routes**
   - `/marketplace/seller-dashboard` should redirect to `/dashboard/seller`
   - Various `/features/*` paths still referenced

3. **Inconsistent Patterns**
   - Some routes use `/marketplace/X`, others use `/dashboard/X`
   - Role-based routing could be cleaner

---

## 8. Recommendations Summary

### Immediate (Phase 2 - WQT Cleanup)

1. Remove `/marketplace/tools/live` and `/marketplace/tools/upload`
2. Redirect `/sales/*` to sales.bluesignal.xyz
3. Consolidate seller dashboards into one
4. Add cross-link to cloud.bluesignal.xyz for device management

### Short-term

1. Build unified portfolio dashboard
2. Create developer portal skeleton
3. Add API documentation pages
4. Implement transaction history view

### Medium-term

1. Add advanced marketplace filtering
2. Build compliance reporting tools
3. Implement webhook system
4. Create price analytics dashboard

---

## 9. Success Metrics

Track these to measure improvement:

1. **User Clarity:** Time to first listing creation
2. **Navigation Efficiency:** Clicks to reach key pages
3. **Feature Discoverability:** Usage of portfolio/financial features
4. **Developer Adoption:** API key generation rate
5. **Conversion:** Browse to purchase rate
