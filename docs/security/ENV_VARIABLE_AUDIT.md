# Environment Variable Audit Report

**Repository:** BlueSignal Marketplace
**Audit Date:** 2025-12-19
**Deployment:** Firebase Hosting (multi-site) + Firebase Functions

---

## Executive Summary

This audit identifies all environment variables, secrets, and API keys used across the BlueSignal Marketplace codebase, including frontend (Vite/React), backend (Firebase Functions), and CI/CD (GitHub Actions).

### Key Findings

| Category | Count | Status |
|----------|-------|--------|
| Frontend Env Vars | 11 | Mixed (some have hardcoded fallbacks) |
| GitHub Secrets | 3 | Required for CI/CD |
| Firebase Secrets | 1 | Required for Cloud Functions |
| Hardcoded API Keys | 3 | **Security Risk** |

---

## 1. Frontend Environment Variables (Vite)

These variables use the `import.meta.env.VITE_*` pattern and must be prefixed with `VITE_` for Vite to expose them.

### Firebase Configuration

| Variable | Location | Fallback | Status |
|----------|----------|----------|--------|
| `VITE_FIREBASE_API_KEY` | `src/apis/firebase.js:17` | `AIzaSyAE...` (hardcoded) | ⚠️ Has fallback |
| `VITE_FIREBASE_AUTH_DOMAIN` | `src/apis/firebase.js:18` | `waterquality-trading.firebaseapp.com` | ⚠️ Has fallback |
| `VITE_FIREBASE_PROJECT_ID` | `src/apis/firebase.js:19` | `waterquality-trading` | ⚠️ Has fallback |
| `VITE_FIREBASE_STORAGE_BUCKET` | `src/apis/firebase.js:20` | `waterquality-trading.firebasestorage.app` | ⚠️ Has fallback |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `src/apis/firebase.js:21` | `1006831487182` | ⚠️ Has fallback |
| `VITE_FIREBASE_APP_ID` | `src/apis/firebase.js:22` | `1:1006831487182:web:...` | ⚠️ Has fallback |
| `VITE_FIREBASE_MEASUREMENT_ID` | `src/apis/firebase.js:23` | `G-ECMFLV2Y6B` | ⚠️ Has fallback |

### Third-Party Services

| Variable | Location | Fallback | Status |
|----------|----------|----------|--------|
| `VITE_MAPBOX_TOKEN` | `src/wqt/pages/MapPage.tsx:10`, `PresalePage.tsx:18`, `src/components/shared/PropertyMap.jsx:9` | Placeholder token | ⚠️ Has fallback |
| `VITE_GOOGLE_MAPS_API_KEY` | `src/components/cloud/SiteDetailPage.jsx:315` | Empty string `""` | ⚠️ Empty fallback |

### Application Settings

| Variable | Location | Fallback | Status |
|----------|----------|----------|--------|
| `VITE_BUILD_VERSION` | `src/App.jsx:108` | Auto-generated | ✅ Optional |
| `VITE_DEMO_MODE` | `src/utils/demoMode.ts:9` | `false` | ✅ Optional |

### Documented but Unused Directly

| Variable | Documentation | Notes |
|----------|---------------|-------|
| `VITE_LIVEPEER_API_KEY` | `README.md:310` | Key is fetched from backend via `LivepeerAPI.getKey()` |

---

## 2. Build-Time Environment Variables

| Variable | Location | Purpose | Required |
|----------|----------|---------|----------|
| `BUILD_TARGET` | `vite.config.ts:12` | Determines build target (`wqt`, `cloud`, `sales`) | ✅ For multi-site builds |

Usage in `package.json` scripts:
- `build:wqt`: `BUILD_TARGET=wqt`
- `build:cloud`: `BUILD_TARGET=cloud`
- `build:sales`: `BUILD_TARGET=sales`

---

## 3. GitHub Actions Secrets

### Required for CI/CD

| Secret | Workflow | Purpose | Status |
|--------|----------|---------|--------|
| `GITHUB_TOKEN` | All workflows | Auto-provided by GitHub | ✅ Automatic |
| `FIREBASE_SERVICE_ACCOUNT_WATERQUALITY_TRADING` | `firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml` | Firebase Hosting deployment | ⬜ Verify set |
| `CLAUDE_CODE_OAUTH_TOKEN` | `claude-code-review.yml`, `claude.yml` | Claude Code AI integration | ⬜ Verify set |

### Workflow File References

**`firebase-hosting-merge.yml:24`:**
```yaml
firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_WATERQUALITY_TRADING }}'
```

**`claude-code-review.yml:38`:**
```yaml
claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

## 4. Firebase Cloud Functions Secrets

| Secret | Location | Purpose | Management |
|--------|----------|---------|------------|
| `HUBSPOT_ACCESS_TOKEN` | `functions/index.js:63`, `functions/hubspot.js:31` | HubSpot CRM API access | Firebase Secrets Manager |

Configuration in `functions/index.js`:
```javascript
exports.app = functions
  .runWith({
    secrets: ["HUBSPOT_ACCESS_TOKEN"],
    // ...
  })
```

---

## 5. Backend-Managed API Keys

These API keys are stored on the backend server and fetched at runtime via API calls:

| Key Type | Fetch Endpoint | Client Usage |
|----------|----------------|--------------|
| Google Maps API Key | `/maps/get/api` | `MapsAPI.getAPI()` in `back_door.js:387` |
| Livepeer API Key | `/livepeer/key` | `LivepeerAPI.getKey()` in `back_door.js:277` |
| Stripe Publishable Key | `/stripe/config` | Fetched in `CheckoutForm.jsx:188` |

---

## 6. Security Concerns: Hardcoded API Keys

### Critical Issues

| Location | Issue | Risk Level | Recommendation |
|----------|-------|------------|----------------|
| `configs.js:10` | Alchemy RPC URL with API key `xNT0Vs-Kpgg3Lgdlqjd_Qlg9XNQNfl75` | **HIGH** | Move to environment variable |
| `src/apis/firebase.js:17-23` | Firebase config with hardcoded fallbacks | **MEDIUM** | Remove fallbacks, require env vars |
| `src/wqt/pages/MapPage.tsx:10` | Mapbox placeholder token | **LOW** | Appears to be invalid/placeholder |

### Recommended Fixes

1. **Alchemy API Key** - Add `VITE_ALCHEMY_API_KEY` environment variable:
   ```javascript
   // configs.js
   rpc: `https://polygon-amoy.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
   ```

2. **Firebase Config** - Remove fallbacks to enforce env var usage:
   ```javascript
   // src/apis/firebase.js
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     // ... throw error if not defined
   };
   ```

---

## 7. Complete Environment Variable Checklist

### Local Development (`.env` file)

```env
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Third-Party Services (Required for full functionality)
VITE_MAPBOX_TOKEN=
VITE_GOOGLE_MAPS_API_KEY=

# Blockchain (Recommended to externalize)
VITE_ALCHEMY_API_KEY=

# Optional
VITE_BUILD_VERSION=
VITE_DEMO_MODE=
```

### GitHub Repository Secrets

| Secret Name | Status | Action Required |
|-------------|--------|-----------------|
| `FIREBASE_SERVICE_ACCOUNT_WATERQUALITY_TRADING` | ⬜ | Verify in GitHub Settings > Secrets |
| `CLAUDE_CODE_OAUTH_TOKEN` | ⬜ | Verify in GitHub Settings > Secrets |

### Firebase Secrets (Cloud Functions)

| Secret Name | Status | Action Required |
|-------------|--------|-----------------|
| `HUBSPOT_ACCESS_TOKEN` | ⬜ | Verify via `firebase functions:secrets:access` |

---

## 8. Verification Commands

### Check GitHub Secrets
```bash
# Via GitHub CLI
gh secret list
```

### Check Firebase Secrets
```bash
# List secrets
firebase functions:secrets:access HUBSPOT_ACCESS_TOKEN

# Set a secret
firebase functions:secrets:set HUBSPOT_ACCESS_TOKEN
```

### Verify Env Vars in Build
```bash
# Build will fail if required vars are missing (after removing fallbacks)
npm run build
```

---

## 9. Production vs Preview Environment Matrix

| Variable | Production | Preview | Notes |
|----------|------------|---------|-------|
| `VITE_FIREBASE_*` | Production Firebase project | Same | Single Firebase project for all modes |
| `VITE_MAPBOX_TOKEN` | Production token | Same or staging | Consider separate tokens |
| `VITE_GOOGLE_MAPS_API_KEY` | Production key | Same or staging | Consider API key restrictions |
| `VITE_DEMO_MODE` | `false` | `true` (optional) | Enable demo mode for previews |

---

## 10. Action Items

### Immediate (Security)

- [ ] Rotate Alchemy API key exposed in `configs.js`
- [ ] Move Alchemy API key to environment variable
- [ ] Review Firebase API key restrictions in Firebase Console

### Short-term (Best Practices)

- [ ] Remove hardcoded fallbacks from Firebase config
- [ ] Create `.env.example` file for documentation
- [ ] Add environment variable validation at app startup
- [ ] Document required vs optional environment variables

### Long-term (Infrastructure)

- [ ] Consider using Firebase Remote Config for runtime configuration
- [ ] Implement environment-specific builds (staging vs production)
- [ ] Set up secret rotation policies

---

## Appendix: File References

| File | Environment Variables Used |
|------|---------------------------|
| `src/apis/firebase.js` | `VITE_FIREBASE_*` (7 vars) |
| `src/App.jsx` | `VITE_BUILD_VERSION` |
| `src/utils/demoMode.ts` | `VITE_DEMO_MODE` |
| `src/wqt/pages/MapPage.tsx` | `VITE_MAPBOX_TOKEN` |
| `src/wqt/pages/PresalePage.tsx` | `VITE_MAPBOX_TOKEN` |
| `src/components/shared/PropertyMap.jsx` | `VITE_MAPBOX_TOKEN` |
| `src/components/cloud/SiteDetailPage.jsx` | `VITE_GOOGLE_MAPS_API_KEY` |
| `configs.js` | Hardcoded Alchemy URLs |
| `vite.config.ts` | `BUILD_TARGET` |
| `functions/hubspot.js` | `HUBSPOT_ACCESS_TOKEN` |
| `.github/workflows/*.yml` | `FIREBASE_SERVICE_ACCOUNT_*`, `CLAUDE_CODE_OAUTH_TOKEN` |
