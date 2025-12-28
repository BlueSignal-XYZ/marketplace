# WaterQuality.Trading Feature Triage

**Document:** WQT Feature Cleanup Decisions
**Date:** 2025-12-28
**Purpose:** Determine which features to KEEP, RELOCATE, or REMOVE from WaterQuality.Trading

---

## Triage Summary

| Decision | Count | Impact |
|----------|-------|--------|
| KEEP (Core to Trading) | 12 | No change |
| RELOCATE (Move to other site) | 5 | Route changes + redirects |
| REMOVE (No longer serve any site) | 3 | Delete routes + components |
| ADD (Missing core features) | 8 | New development |

---

## Feature Triage Table

### KEEP (Core to Trading/Platform)

These features directly serve the marketplace's purpose of water quality credit trading.

| Feature | Current Route | Component | Reason to Keep |
|---------|--------------|-----------|----------------|
| **Marketplace Listings** | `/marketplace` | `Marketplace.jsx` | Core trading functionality |
| **Listing Details** | `/marketplace/listing/:id` | `ListingPage.jsx` | Essential for transactions |
| **Registry Browser** | `/registry` | `RegistryPage.tsx` | Compliance & discovery |
| **Geographic Map** | `/map` | `MapPage.tsx` | Credit source visualization |
| **Recent Removals** | `/recent-removals` | `RecentRemovalsPage.tsx` | Transparency & tracking |
| **Certificate Verification** | `/certificate/:id` | `CertificatePage.jsx` | Trust & verification |
| **Buyer Dashboard** | `/dashboard/buyer` | `BuyerDashboard.jsx` | Buyer account management |
| **Seller Dashboard** | `/dashboard/seller` | `SellerDashboard_Role.jsx` | Seller account management |
| **Create Listing** | `/marketplace/create-listing` | `CreateListingPage.jsx` | Core seller workflow |
| **Financial Dashboard** | `/dashboard/financial` | `FinancialDashboard.jsx` | Trading analytics |
| **Contract Verification** | `/marketplace/tools/verification` | `VerificationUI.jsx` | Transaction validation |
| **Presale Page** | `/presale` | `PresalePage.tsx` | Marketing/announcements |

### RELOCATE (Move to Cloud or Sales)

These features don't belong on a trading platform.

| Feature | Current Route | Move To | New Route | Reason |
|---------|--------------|---------|-----------|--------|
| **Hardware Configurator** | `/sales/configurator` | sales.bluesignal.xyz | `/` or `/configurator` | Sales tool, not trading tool |
| **Enclosure Page** | `/sales/enclosure` | sales.bluesignal.xyz | `/enclosure` | Sales content |
| **Installer Dashboard** | `/dashboard/installer` | cloud.bluesignal.xyz | `/dashboard/installer` | Device management context |
| **Nutrient Calculator** | `/marketplace/tools/calculator` | cloud.bluesignal.xyz | `/cloud/tools/nutrient-calculator` | More relevant to device owners |
| **Legacy Seller Dashboard** | `/marketplace/seller-dashboard` | CONSOLIDATE | `/dashboard/seller` | Duplicate - redirect to main |

### REMOVE (Doesn't Serve Any Site)

These features don't align with any site's purpose.

| Feature | Current Route | Component | Reason to Remove |
|---------|--------------|-----------|------------------|
| **Live Streaming** | `/marketplace/tools/live` | `Livepeer.jsx` | Not related to credit trading |
| **Media Upload** | `/marketplace/tools/upload` | `Livepeer.jsx` | Not related to credit trading |
| **Generic Livepeer Service** | `/features/:serviceID` | `Livepeer.jsx` | Legacy route, no clear purpose |

---

## Detailed Recommendations

### High Priority Relocations

#### 1. Hardware Configurator → Sales

**Current State:**
- Route: `/sales/configurator` on WQT
- Component: `BlueSignalConfigurator.jsx`

**Action Required:**
1. Keep configurator accessible on sales.bluesignal.xyz (already is)
2. Remove `/sales/*` routes from WQT's `MarketplaceRoutes()`
3. Add redirect: `waterquality.trading/sales/*` → `sales.bluesignal.xyz/*`

**Code Change:**
```jsx
// In App.jsx MarketplaceRoutes - REMOVE these:
// <Route path="/sales/configurator" element={<BlueSignalConfigurator />} />
// <Route path="/sales/enclosure" element={<EnclosurePage />} />
```

#### 2. Installer Dashboard → Cloud

**Current State:**
- Route: `/dashboard/installer` on both WQT and Cloud
- Component: `InstallerDashboard.jsx`

**Action Required:**
1. Remove from WQT `MarketplaceRoutes()`
2. Keep on Cloud (already there)
3. If user lands on WQT with installer role, redirect to Cloud

**Code Change:**
```jsx
// In MarketplaceRoutes - REMOVE:
// <Route path="/dashboard/installer" element={<InstallerDashboard />} />
```

#### 3. Consolidate Seller Dashboards

**Current State:**
- `/dashboard/seller` → `SellerDashboard_Role.jsx`
- `/marketplace/seller-dashboard` → `SellerDashboard.jsx` (legacy)

**Action Required:**
1. Redirect `/marketplace/seller-dashboard` → `/dashboard/seller`
2. Merge any unique functionality from legacy into main
3. Eventually remove legacy component

**Code Change:**
```jsx
// Replace route with redirect:
<Route path="/marketplace/seller-dashboard" element={<Navigate to="/dashboard/seller" replace />} />
```

### Medium Priority Removals

#### 4. Remove Livepeer Tools from WQT

**Current State:**
- `/marketplace/tools/live` and `/marketplace/tools/upload`
- Used Livepeer for video but not relevant to trading

**Action Required:**
1. Remove routes from `MarketplaceRoutes()`
2. Remove from `MarketplaceMenu.jsx` navigation
3. Do NOT delete components (still used in Cloud)

**Code Changes:**
```jsx
// In App.jsx MarketplaceRoutes - REMOVE:
// <Route path="/marketplace/tools/live" element={<Livepeer serviceID="stream" />} />
// <Route path="/marketplace/tools/upload" element={<Livepeer serviceID="upload" />} />

// In MarketplaceMenu.jsx - REMOVE:
// <MenuItem to="/marketplace/tools/live">Live Stream</MenuItem>
// <MenuItem to="/marketplace/tools/upload">Upload Media</MenuItem>
```

### Low Priority (Evaluate)

#### 5. Nutrient Calculator

**Current State:**
- Available on both WQT (`/marketplace/tools/calculator`) and Cloud (`/cloud/tools/nutrient-calculator`)

**Decision:** KEEP on Cloud, REMOVE from WQT

**Rationale:**
- Calculator is more relevant for device owners estimating credit potential
- Traders already know what credits they want to buy/sell
- Reduces clutter in WQT tools section

**Code Changes:**
```jsx
// In App.jsx MarketplaceRoutes - REMOVE:
// <Route path="/marketplace/tools/calculator" element={<NutrientCalculator />} />

// In MarketplaceMenu.jsx - REMOVE:
// <MenuItem to="/marketplace/tools/calculator">Nutrient Calculator</MenuItem>
```

---

## Navigation Updates Required

### Current MarketplaceMenu.jsx Structure

```jsx
// TOOLS section currently shows:
<MenuSection title="TOOLS">
  <MenuItem to="/marketplace/tools/calculator">Nutrient Calculator</MenuItem>  // REMOVE
  <MenuItem to="/marketplace/tools/live">Live Stream</MenuItem>                // REMOVE
  <MenuItem to="/marketplace/tools/upload">Upload Media</MenuItem>             // REMOVE
  <MenuItem to="/marketplace/tools/verification">Verification</MenuItem>       // KEEP
</MenuSection>
```

### Proposed MarketplaceMenu.jsx Structure

```jsx
// TOOLS section after cleanup:
<MenuSection title="TOOLS">
  <MenuItem to="/marketplace/tools/verification">Verification</MenuItem>
</MenuSection>

// Or rename section if only one item:
<MenuSection title="VERIFY">
  <MenuItem to="/marketplace/verification">Verify Transaction</MenuItem>
</MenuSection>
```

---

## Missing Features to ADD

These are critical features that WQT should have but currently lacks:

| Feature | Priority | Proposed Route | Purpose |
|---------|----------|----------------|---------|
| **Portfolio Dashboard** | High | `/portfolio` | Unified view of owned credits |
| **Transaction History** | High | `/portfolio/transactions` | Complete trade history |
| **Developer Portal** | High | `/developers` | API overview for integrators |
| **API Documentation** | High | `/developers/api` | REST API reference |
| **Webhook Configuration** | Medium | `/developers/webhooks` | Event notifications |
| **Compliance Reports** | High | `/reports` | Exportable compliance data |
| **API Key Management** | Medium | `/account/api-keys` | Developer self-service |
| **Notification Settings** | Low | `/account/notifications` | Alert preferences |

---

## Implementation Checklist

### Phase 2: WQT Cleanup

- [ ] Remove `/sales/*` routes from MarketplaceRoutes
- [ ] Remove `/marketplace/tools/live` route
- [ ] Remove `/marketplace/tools/upload` route
- [ ] Remove `/marketplace/tools/calculator` route
- [ ] Remove `/dashboard/installer` route from WQT
- [ ] Add redirect: `/marketplace/seller-dashboard` → `/dashboard/seller`
- [ ] Update MarketplaceMenu.jsx to remove relocated/removed items
- [ ] Add external links to Cloud and Sales in navigation
- [ ] Test all remaining routes work correctly
- [ ] Verify no broken internal links

### Post-Cleanup Verification

- [ ] All core marketplace routes functional
- [ ] No 404s on legitimate marketplace paths
- [ ] Navigation reflects new structure
- [ ] Cross-site links working
- [ ] No console errors related to removed routes

---

## Route Summary After Cleanup

### WQT Routes (Cleaned)

```
PUBLIC:
/                           → Landing (auth redirect)
/marketplace                → Marketplace listings
/marketplace/listing/:id    → Listing details
/registry                   → Registry browser
/map                        → Geographic map
/recent-removals            → Removal tracking
/certificate/:id            → Certificate verification
/presale                    → Presale announcements

AUTH-GATED:
/dashboard/buyer            → Buyer dashboard
/dashboard/seller           → Seller dashboard
/marketplace/create-listing → Create/edit listings
/dashboard/financial        → Financial reports
/marketplace/tools/verification → Transaction verification

REDIRECTS:
/marketplace/seller-dashboard → /dashboard/seller
/sales/*                      → sales.bluesignal.xyz (external)
/dashboard/installer          → cloud.bluesignal.xyz (external)
```

### Removed Routes

```
REMOVED:
/marketplace/tools/live     → Deleted (not relevant)
/marketplace/tools/upload   → Deleted (not relevant)
/marketplace/tools/calculator → Deleted (moved to Cloud only)
/features/:serviceID        → Deleted (legacy)
```

---

## Sign-Off

**Before implementing Phase 2, confirm:**

1. [ ] All KEEP decisions are correct
2. [ ] All RELOCATE destinations are appropriate
3. [ ] All REMOVE decisions are safe (no dependencies)
4. [ ] ADD features priority is correct

**Approval:** _________________ Date: _________
