# Deployment Instructions for Cloud & Marketplace Fix

## Problem
cloud.bluesignal.xyz is currently serving WaterQuality.Trading HTML instead of BlueSignal Monitoring HTML.

## Verified Working Local Build
The local dist folders are correct:
- `dist-cloud/index.html` → "BlueSignal Monitoring" ✓
- `dist-wqt/index.html` → "WaterQuality.Trading" ✓

## Deploy Instructions

### Option 1: Deploy Cloud Only (Recommended)

```bash
# Ensure you're in the project directory
cd /home/user/Marketplace

# Switch to correct Firebase project
firebase use waterquality-trading

# Deploy ONLY the cloud site
firebase deploy --only hosting:cloud-bluesignal

# Expected output should show:
# ✔ Deploy complete!
# Hosting URL: https://cloud-bluesignal.web.app
```

### Option 2: Deploy Both Sites

```bash
firebase use waterquality-trading
firebase deploy
```

### Option 3: If Firebase Project Switching Fails

```bash
# Deploy with explicit project flag
firebase deploy --project waterquality-trading --only hosting:cloud-bluesignal
```

## Validation After Deploy

Run this command to verify the fix worked:

```bash
curl -s https://cloud.bluesignal.xyz | grep -E '<title>|og:title|og:site_name'
```

**Expected output:**
```html
<title>BlueSignal Monitoring</title>
<meta property="og:title" content="BlueSignal Monitoring">
<meta property="og:site_name" content="BlueSignal">
```

## If Still Wrong After Deploy

If cloud.bluesignal.xyz still shows wrong branding after deployment:

1. **Check Firebase Console** → Hosting → Verify that:
   - `cloud-bluesignal` hosting site is connected to `cloud.bluesignal.xyz` domain
   - Latest deployment shows correct timestamp

2. **Clear Cloudflare cache** (if using Cloudflare):
   - Log into Cloudflare dashboard
   - Select the bluesignal.xyz domain
   - Caching → Purge Everything

3. **Check deployment log** for errors:
   ```bash
   firebase hosting:channel:list --site cloud-bluesignal --project waterquality-trading
   ```

## Notes
- Default Firebase project in `.firebaserc` is `neptunechain-network` but hosting targets are under `waterquality-trading`
- Always use `firebase use waterquality-trading` or `--project waterquality-trading` flag
- Local builds are confirmed correct - deployment is the issue
