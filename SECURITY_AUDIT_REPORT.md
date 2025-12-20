# Security Audit Report

**Project:** BlueSignal Marketplace (WaterQuality.Trading)
**Audit Date:** December 20, 2025
**Auditor:** Claude Security Review
**Branch:** `claude/security-audit-review-KiNNo`

---

## Executive Summary

This security audit identified **12 Critical**, **8 High**, **11 Medium**, and **6 Low** severity findings across the React SPA + Firebase backend marketplace application. The most critical issues involve hardcoded API keys/credentials, missing authentication on API endpoints, overly permissive CORS configuration, and insufficient authorization controls.

**Priority Recommendations:**
1. Immediately rotate all exposed API keys and secrets
2. Implement authentication middleware on all Cloud Functions endpoints
3. Restrict CORS to specific allowed origins
4. Add server-side authorization for all data access operations
5. Implement rate limiting on public endpoints

---

## Findings by Severity

### Critical Findings (12)

---

#### C1: Hardcoded Firebase API Key with Fallback Exposure

**Severity:** Critical
**Category:** Security - Secrets Management
**Location:** `src/apis/firebase.js:17-23`

**Description:**
Firebase configuration includes hardcoded fallback API keys that are committed to the repository:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAESUVCltG4kviQLIiiygIROJ7BKMMgvX8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "waterquality-trading.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "waterquality-trading",
  // ... more hardcoded values
};
```

**Risk:**
- Attackers can use these credentials to abuse Firebase services
- Potential for unauthorized API usage and billing abuse
- Credentials are exposed in public repository history

**Recommendation:**
1. Remove all hardcoded fallback values
2. Require environment variables (fail if missing)
3. Rotate the exposed API key immediately
4. Add Firebase App Check for additional protection

**Effort:** Quick fix

---

#### C2: Hardcoded Alchemy RPC API Key

**Severity:** Critical
**Category:** Security - Secrets Management
**Location:** `configs.js:10`

**Description:**
Blockchain RPC endpoint contains hardcoded Alchemy API key:

```javascript
rpc: "https://polygon-amoy.g.alchemy.com/v2/xNT0Vs-Kpgg3Lgdlqjd_Qlg9XNQNfl75",
```

**Risk:**
- API key abuse and potential service disruption
- Financial liability for RPC usage
- Exposed in client-side code accessible to anyone

**Recommendation:**
1. Move RPC URL to backend proxy
2. Never expose RPC keys in frontend code
3. Rotate the exposed Alchemy key immediately
4. Use backend relay for blockchain calls

**Effort:** Moderate

---

#### C3: No Authentication on Backend API Endpoints

**Severity:** Critical
**Category:** Security - Authentication
**Location:** `src/scripts/back_door.js` (all endpoints)

**Description:**
All backend API calls are made without any authentication token or verification:

```javascript
const createAccount = async (userdata) =>
  (await axios.post(`${configs.server_url}/account/create`, userdata))?.data;

const getUserFromUID = async (uid) =>
  (await axios.post(`${configs.server_url}/db/user/get/from/uid`, { userUID: uid }))?.data;
```

**Risk:**
- Anyone can create accounts without verification
- User data can be accessed by knowing a UID
- Credit operations can be performed without authorization
- Complete bypass of frontend authentication

**Recommendation:**
1. Add Firebase ID token to all API requests
2. Verify tokens on backend before processing
3. Implement middleware pattern for auth checks

```javascript
// Example fix
const createAccount = async (userdata) => {
  const token = await auth.currentUser?.getIdToken();
  return axios.post(`${configs.server_url}/account/create`, userdata, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

**Effort:** Significant refactor

---

#### C4: Overly Permissive CORS Configuration

**Severity:** Critical
**Category:** Security - CORS
**Location:** `functions/index.js:20`

**Description:**
Cloud Functions use wildcard CORS that allows any origin:

```javascript
app.use(cors({ origin: true }));
```

**Risk:**
- Any website can make authenticated requests to your API
- Enables CSRF-like attacks from malicious sites
- Cross-origin credential theft possible

**Recommendation:**
```javascript
const allowedOrigins = [
  'https://waterquality.trading',
  'https://cloud.bluesignal.xyz',
  'https://sales.bluesignal.xyz',
  // Add staging domains as needed
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**Effort:** Quick fix

---

#### C5: Hardcoded Default PIN in Registration

**Severity:** Critical
**Category:** Security - Authentication
**Location:** `src/routes/components/welcome/RegisterForm.jsx:157, 237, 253`

**Description:**
New user accounts are created with a hardcoded default PIN:

```javascript
const newUser = {
  uid: user.uid,
  username: trimmedUsername.toLowerCase(),
  email: googleEmail,
  role: "farmer",
  PIN: 123456,  // Hardcoded default PIN
};
```

**Risk:**
- All new accounts share the same PIN
- If PIN is used for sensitive operations, all accounts are vulnerable
- Attackers can guess PIN for any account

**Recommendation:**
1. Remove hardcoded PIN from frontend
2. Generate secure random PIN on backend
3. Force PIN change on first login
4. Or remove PIN requirement entirely

**Effort:** Quick fix

---

#### C6: Credit Transfer/Buy Operations Without Authorization Verification

**Severity:** Critical
**Category:** Security - Authorization
**Location:** `src/scripts/back_door.js:457-500`

**Description:**
Credit operations (buy, transfer, issue) only pass user IDs without server-side ownership verification:

```javascript
const buyCredits = async (accountID, producer, verifier, creditType, amount, price) =>
  (await axios.post(`${configs.server_url}/npc_credits/buy`, {
    accountID, producer, verifier, creditType, amount, price,
  }))?.data;

const transferCredits = async (senderID, recipientID, producer, verifier, creditType, amount, price) =>
  (await axios.post(`${configs.server_url}/npc_credits/transfer`, {
    senderID, recipientID, producer, verifier, creditType, amount, price
  }))?.data;
```

**Risk:**
- Anyone can initiate transfers from any account
- No verification that senderID matches authenticated user
- Potential for unauthorized credit theft
- Financial loss for users

**Recommendation:**
1. Extract user ID from authenticated token on server
2. Never trust client-provided user IDs for authorization
3. Implement transaction signing

**Effort:** Significant refactor

---

#### C7: Missing Webhook Signature Verification

**Severity:** Critical
**Category:** Security - Input Validation
**Location:** `functions/index.js:342-370`

**Description:**
HubSpot webhooks are processed without signature verification:

```javascript
exports.hubspotWebhook = functions
  .https.onRequest(async (req, res) => {
    // No signature verification
    const events = req.body;
    for (const event of events) {
      await hubspot.processWebhookEvent(event);
    }
    res.status(200).send("OK");
  });
```

**Risk:**
- Attackers can forge webhook events
- Malicious order/customer modifications possible
- Data integrity compromise

**Recommendation:**
```javascript
const crypto = require('crypto');

function verifyHubSpotSignature(req) {
  const signature = req.headers['x-hubspot-signature'];
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const expectedHash = crypto
    .createHmac('sha256', clientSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  return signature === expectedHash;
}
```

**Effort:** Quick fix

---

#### C8: Device/Order Access Without Owner Verification (IDOR)

**Severity:** Critical
**Category:** Security - Authorization
**Location:** `src/scripts/back_door.js:812-846`

**Description:**
Device operations don't verify ownership:

```javascript
const getDeviceDetails = async (deviceID) =>
  (await axios.post(`${configs.server_url}/device/details`, { deviceID }))?.data;

const editDevice = async (deviceID, updateData) =>
  (await axios.post(`${configs.server_url}/device/edit`, { deviceID, updateData }))?.data;

const removeDevice = async (deviceID) =>
  (await axios.post(`${configs.server_url}/device/remove`, { deviceID }))?.data;
```

**Risk:**
- Users can access/modify/delete devices belonging to other users
- IDOR (Insecure Direct Object Reference) vulnerability
- Complete bypass of access controls

**Recommendation:**
1. Server must verify device ownership before operations
2. Extract authenticated user ID from token
3. Check device.ownerId matches authenticated user

**Effort:** Moderate

---

#### C9: Session Storage for Sensitive User Data

**Severity:** Critical
**Category:** Security - Data Storage
**Location:** `src/context/AppContext.jsx:51, 62, 75, 103`

**Description:**
User data including role is stored in sessionStorage:

```javascript
sessionStorage.setItem("user", JSON.stringify(userdata));
```

**Risk:**
- XSS attacks can steal session data
- Role can be manipulated client-side if not verified server-side
- User impersonation if session data is accessible

**Recommendation:**
1. Use httpOnly cookies for session management
2. Verify all role/permission claims server-side
3. Never trust client-side role storage for authorization

**Effort:** Significant refactor

---

#### C10: API Key Endpoints Without Authentication

**Severity:** Critical
**Category:** Security - Authentication
**Location:** `src/scripts/back_door.js:275-306, 375-392`

**Description:**
Endpoints that return API keys (Livepeer, Maps) have no authentication:

```javascript
const getLivepeerKey = async () =>
  (await axios.post(`${configs.server_url}/livepeer/key`))?.data;

const getMapsKey = async () =>
  (await axios.post(`${configs.server_url}/maps/get/key`))?.data;
```

**Risk:**
- Anyone can obtain third-party API keys
- Credential theft and abuse
- Billing fraud

**Recommendation:**
1. Require authentication for all key endpoints
2. Consider proxying these services instead of exposing keys

**Effort:** Moderate

---

#### C11: Stripe Config/Payment Intent Without User Verification

**Severity:** Critical
**Category:** Security - Payment Processing
**Location:** `src/scripts/back_door.js:721-761`

**Description:**
Payment endpoints are accessible without authentication:

```javascript
const getStripeConfig = async () =>
  (await axios.post(`${configs.server_url}/stripe/config`))?.data;

const createPaymentIntent = async (amount, currency, optional_params) =>
  (await axios.post(`${configs.server_url}/stripe/create/payment_intent`,
    { amount, currency, optional_params }))?.data;
```

**Risk:**
- Unauthenticated payment intent creation
- Price manipulation if amount comes from client
- Potential for payment fraud

**Recommendation:**
1. Require authentication for payment operations
2. Calculate amounts server-side, never trust client values
3. Associate payments with authenticated user

**Effort:** Moderate

---

#### C12: User Data Accessible by UID Without Authentication

**Severity:** Critical
**Category:** Security - Authorization
**Location:** `src/scripts/back_door.js:64-76`

**Description:**
User data is retrievable by knowing a UID:

```javascript
const getUserFromUID = async (uid) =>
  (await axios.post(`${configs.server_url}/db/user/get/from/uid`, { userUID: uid }))?.data;
```

**Risk:**
- Enumeration of user data
- Privacy violation
- Information disclosure

**Recommendation:**
1. Require authentication token
2. Only return data for authenticated user
3. Or implement proper access control for admin operations

**Effort:** Quick fix

---

### High Severity Findings (8)

---

#### H1: XSS via innerHTML in Chart Tooltip

**Severity:** High
**Category:** Security - XSS
**Location:** `src/components/elements/cards/ChartCard.jsx:93, 116, 126, 131`

**Description:**
Chart tooltip uses innerHTML with potentially user-controlled data:

```javascript
tooltipEl.innerHTML = "<table></table>";
// ...
innerHtml += "<tr><th>" + title + "</th></tr>";
innerHtml += "<tr><td>" + span + body + "</td></tr>";
// ...
tableRoot.innerHTML = innerHtml;
```

**Risk:**
- If chart data contains user input, XSS is possible
- Script injection through chart labels/values

**Recommendation:**
```javascript
// Use textContent for text nodes
const th = document.createElement('th');
th.textContent = title;

// Or sanitize input
import DOMPurify from 'dompurify';
tableRoot.innerHTML = DOMPurify.sanitize(innerHtml);
```

**Effort:** Quick fix

---

#### H2: Missing Security Headers in Firebase Hosting

**Severity:** High
**Category:** Security - Headers
**Location:** `firebase.json`

**Description:**
Firebase hosting configuration lacks security headers:
- No Content-Security-Policy (CSP)
- No X-Frame-Options
- No X-Content-Type-Options
- No Referrer-Policy
- No Strict-Transport-Security (HSTS)

**Risk:**
- Clickjacking attacks possible
- XSS vulnerabilities harder to mitigate
- MIME type sniffing attacks

**Recommendation:**
Add to `firebase.json`:
```json
{
  "source": "**",
  "headers": [
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
    { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
    { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; ..." }
  ]
}
```

**Effort:** Quick fix

---

#### H3: Client-Side Role-Based Access Control Only

**Severity:** High
**Category:** Security - Authorization
**Location:** `src/App.jsx:653-676`, `src/utils/roleRouting.js`

**Description:**
Route protection is client-side only:

```javascript
{user?.uid && (
  <>
    <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
    <Route path="/marketplace/seller-dashboard" element={<SellerDashboard />} />
  </>
)}
```

**Risk:**
- Users can manipulate client state to access restricted routes
- Backend doesn't verify role for data access
- Authorization bypass via developer tools

**Recommendation:**
1. Implement role verification on all backend endpoints
2. Store role as Firebase custom claim
3. Verify claims server-side before returning data

**Effort:** Significant refactor

---

#### H4: Sensitive Debug Logging

**Severity:** High
**Category:** Security - Information Disclosure
**Location:** Multiple files

**Description:**
Extensive console logging includes sensitive information:

```javascript
console.log("✅ User loaded:", userdata.uid, "| Role:", userdata.role || "none");
console.log("RegisterForm → newUser:", newUser);
console.log("🔐 Firebase auth state changed:", firebaseUser?.uid || "signed out");
```

**Risk:**
- User data visible in browser console
- Aids attackers in understanding system behavior
- May leak credentials or tokens

**Recommendation:**
1. Remove or conditionalize debug logging for production
2. Use structured logging that can be disabled
```javascript
const isDev = import.meta.env.DEV;
const log = isDev ? console.log : () => {};
```

**Effort:** Moderate

---

#### H5: No Rate Limiting on API Endpoints

**Severity:** High
**Category:** Security - DoS Prevention
**Location:** `functions/index.js`

**Description:**
Cloud Functions have no rate limiting:

```javascript
exports.app = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "256MB",
  })
  .https.onRequest(app);
```

**Risk:**
- API abuse and DoS attacks
- Automated enumeration attacks
- Billing explosion from abuse

**Recommendation:**
1. Implement rate limiting middleware
2. Use Firebase App Check
3. Consider Cloud Armor for DDoS protection

**Effort:** Moderate

---

#### H6: Sensitive Data in Error Messages

**Severity:** High
**Category:** Security - Information Disclosure
**Location:** `functions/hubspot.js:68-73, 86-91`

**Description:**
Error messages may leak sensitive information:

```javascript
res.status(error.response?.status || 500).json({
  error: error.response?.data?.message || error.message,
});
```

**Risk:**
- Stack traces or internal errors exposed to clients
- Aids attackers in understanding system internals

**Recommendation:**
```javascript
res.status(500).json({
  error: 'An error occurred. Please try again.'
});
// Log full error server-side only
console.error('Full error:', error);
```

**Effort:** Quick fix

---

#### H7: User Role Self-Assignment

**Severity:** High
**Category:** Security - Authorization
**Location:** `src/routes/components/welcome/RegisterForm.jsx:156, 247`

**Description:**
User role is set client-side during registration:

```javascript
const newUser = {
  uid: user.uid,
  role: "farmer",  // Role set by client
  PIN: 123456,
};
```

**Risk:**
- Users could modify request to assign admin role
- Privilege escalation if backend doesn't validate

**Recommendation:**
1. Assign roles server-side only
2. New users get default role (e.g., "buyer")
3. Role changes require admin approval

**Effort:** Quick fix

---

#### H8: Customer/Order Data Accessible Without Authorization

**Severity:** High
**Category:** Security - Authorization
**Location:** `src/scripts/back_door.js:961-1046, 1166-1308`

**Description:**
Customer and order endpoints don't verify caller authorization:

```javascript
const getCustomer = async (customerId) =>
  (await axios.post(`${configs.server_url}/customer/get`, { customerId }))?.data;

const getOrder = async (orderId) =>
  (await axios.post(`${configs.server_url}/order/get`, { orderId }))?.data;
```

**Risk:**
- Unauthorized access to customer PII
- Order details visible to anyone
- GDPR/privacy compliance violation

**Recommendation:**
1. Require authentication for all customer/order endpoints
2. Verify requester has access to specific records

**Effort:** Moderate

---

### Medium Severity Findings (11)

---

#### M1: Weak Password Policy

**Severity:** Medium
**Category:** Security - Authentication
**Location:** `src/routes/components/welcome/RegisterForm.jsx:218`

**Description:**
Only minimum length (8 chars) is validated:

```javascript
if (!password || password.length < 8) {
  setError("Password must be at least 8 characters long.");
  return;
}
```

**Risk:**
- Weak passwords allowed (e.g., "password1")
- Brute force attacks easier

**Recommendation:**
1. Require complexity (uppercase, lowercase, numbers, special chars)
2. Check against common password lists
3. Use Firebase Auth password strength validation

**Effort:** Quick fix

---

#### M2: Missing Input Validation on API Calls

**Severity:** Medium
**Category:** Security - Input Validation
**Location:** `src/scripts/back_door.js` (throughout)

**Description:**
No client-side validation before sending data to API:

```javascript
const createCustomer = async (customerData) => {
  // No validation of customerData structure
  const response = await axios.post(`${configs.server_url}/customer/create`, { customerData });
  return response?.data;
};
```

**Risk:**
- Malformed data sent to backend
- Potential for injection if backend also lacks validation

**Recommendation:**
1. Validate all inputs before API calls
2. Use a validation library (Yup, Zod)
3. Implement schema validation on backend

**Effort:** Moderate

---

#### M3: Email Regex Validation Bypass

**Severity:** Medium
**Category:** Security - Input Validation
**Location:** `src/routes/components/welcome/LoginForm.jsx:143-146`

**Description:**
Email validation regex is permissive:

```javascript
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(String(email).toLowerCase());
}
```

**Risk:**
- Some invalid emails may pass validation
- Bypass Firebase's stricter validation

**Recommendation:**
Use a robust email validation library or rely on Firebase Auth validation.

**Effort:** Quick fix

---

#### M4: Error Messages Reveal System Information

**Severity:** Medium
**Category:** Security - Information Disclosure
**Location:** `src/routes/components/welcome/LoginForm.jsx:201, 227`

**Description:**
Firebase auth errors are passed directly to users:

```javascript
handleError(err?.message || "Unable to sign in. Please try again.");
```

**Risk:**
- Error messages may reveal user existence
- "Email already in use" aids enumeration

**Recommendation:**
Use generic error messages for security-sensitive operations.

**Effort:** Quick fix

---

#### M5: No CSRF Protection on State-Changing Operations

**Severity:** Medium
**Category:** Security - CSRF
**Location:** Cloud Functions API endpoints

**Description:**
POST endpoints don't implement CSRF token verification.

**Risk:**
- Cross-site request forgery possible
- Unauthorized actions from malicious sites

**Recommendation:**
1. Implement CSRF tokens for state-changing operations
2. Verify origin header
3. Use SameSite cookies

**Effort:** Moderate

---

#### M6: Debug/Development Code in Production

**Severity:** Medium
**Category:** Security - Information Disclosure
**Location:** `src/App.jsx:123-131`

**Description:**
Extensive diagnostic logging in production:

```javascript
console.log("BUILD:", BUILD_VERSION);
console.log("MODE:", mode);
console.log("AUTH_LOADING:", authLoading);
console.log("USER:", user?.uid || "null");
console.log("ROLE:", user?.role || "null");
console.log("ROUTE:", window.location.pathname);
```

**Risk:**
- Information disclosure in browser console
- Aids attackers in understanding application state

**Recommendation:**
Wrap in development-only conditionals.

**Effort:** Quick fix

---

#### M7: Version Bubble Visible in Production

**Severity:** Medium
**Category:** Security - Information Disclosure
**Location:** `src/App.jsx:180-203`

**Description:**
Build version displayed in production UI.

**Risk:**
- Reveals deployment dates
- May aid in identifying vulnerable versions

**Recommendation:**
Hide in production or only show to admins.

**Effort:** Quick fix

---

#### M8: Backup/Alternative Files Not in .gitignore

**Severity:** Medium
**Category:** Security - Information Disclosure
**Location:** `.gitignore`

**Description:**
`.gitignore` doesn't include common sensitive patterns like:
- `.env.local.backup`
- `*.bak`
- `secrets/`

**Risk:**
- Accidental commit of sensitive files

**Recommendation:**
Expand `.gitignore` with additional patterns.

**Effort:** Quick fix

---

#### M9: No Account Lockout Mechanism

**Severity:** Medium
**Category:** Security - Brute Force Prevention
**Location:** Login flow

**Description:**
No protection against brute force login attempts.

**Risk:**
- Password guessing attacks possible
- Account compromise

**Recommendation:**
1. Implement progressive delays after failed attempts
2. Use Firebase's built-in abuse protection
3. Add CAPTCHA after failed attempts

**Effort:** Moderate

---

#### M10: Source Maps Disabled But Not Verified

**Severity:** Medium
**Category:** Security - Information Disclosure
**Location:** `vite.config.ts:24`

**Description:**
```javascript
sourcemap: false,
```

**Risk:**
- Source maps could be accidentally enabled
- Verify this is enforced in CI/CD

**Recommendation:**
Verify source maps are never deployed to production.

**Effort:** Quick fix

---

#### M11: Mock Data Contains Real-Looking Coordinates

**Severity:** Medium
**Category:** Security - Data Integrity
**Location:** `src/apis/creditsApi.js`

**Description:**
Mock data uses specific real-world coordinates which could be confused with real data.

**Risk:**
- Confusion between test and production data
- Potential privacy issues if mistakenly associated with real entities

**Recommendation:**
Use obviously fake coordinates or clear "MOCK" indicators.

**Effort:** Quick fix

---

### Low Severity Findings (6)

---

#### L1: Multiple TODO Comments for Security-Related Features

**Severity:** Low
**Category:** Maintainability
**Location:** Multiple files

**Description:**
TODO comments indicate incomplete implementations:
- "TODO: Replace with real API calls"
- "TODO: Implement actual API call to acknowledge alert"

**Risk:**
- Incomplete security controls
- Technical debt

**Effort:** Varies

---

#### L2: Inconsistent Error Handling

**Severity:** Low
**Category:** Code Quality
**Location:** `src/scripts/back_door.js`

**Description:**
Some API calls throw errors, others swallow them.

**Risk:**
- Inconsistent user experience
- Silent failures

**Effort:** Moderate

---

#### L3: Default Role Fallback to "buyer"

**Severity:** Low
**Category:** Security - Authorization
**Location:** `src/utils/roleRouting.js:22-23`

**Description:**
Missing role defaults to "buyer" which may grant unintended access.

**Risk:**
- Users without proper role assignment get buyer privileges

**Effort:** Quick fix

---

#### L4: Unused API Endpoints/Code

**Severity:** Low
**Category:** Code Quality
**Location:** `src/scripts/back_door.js:1483-1500`

**Description:**
MetricsAPI returns hardcoded values:

```javascript
const getMetric = async (metric, uid) => {
  return "10";  // Hardcoded value
};
```

**Risk:**
- Technical debt
- Confusion about actual functionality

**Effort:** Quick fix

---

#### L5: Console Logging Firebase Events

**Severity:** Low
**Category:** Security - Information Disclosure
**Location:** `src/apis/firebase.js:33`

**Description:**
```javascript
console.log(`Firebase initialized for mode: ${mode}`);
```

**Risk:**
- Minor information disclosure
- Clutters production console

**Effort:** Quick fix

---

#### L6: Commented Code in Production

**Severity:** Low
**Category:** Code Quality
**Location:** Various files

**Description:**
Commented-out code exists in production files.

**Risk:**
- Code maintenance issues
- Potential confusion

**Effort:** Quick fix

---

## Dependency Analysis

### Outdated Dependencies with Known Vulnerabilities

Run `npm audit` to get current vulnerability report. Based on package.json review:

| Package | Version | Notes |
|---------|---------|-------|
| axios | ^1.5.0 | Check for latest security patches |
| firebase | ^10.8.1 | Keep updated for security fixes |
| ethers | ^6.8.1 | Review for blockchain security updates |

**Recommendation:** Run `npm audit fix` and review all High/Critical vulnerabilities.

---

## Architecture Recommendations

### 1. Implement Backend Authentication Middleware

```javascript
// functions/middleware/auth.js
const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

### 2. Add Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use(apiLimiter);
```

### 3. Implement Proper CORS

See recommendation in C4.

### 4. Add Security Headers

See recommendation in H2.

---

## Compliance Considerations

### GDPR/Privacy
- User data accessible without proper authorization
- No data retention policies visible
- Consider adding data export/deletion capabilities

### PCI DSS (if handling payments)
- Stripe integration should be reviewed
- Never log card data
- Ensure proper key rotation

### SOC 2
- Implement audit logging
- Add access controls
- Document security policies

---

## Remediation Priority

### Immediate (Week 1)
1. Rotate all exposed API keys (C1, C2)
2. Add authentication to API endpoints (C3, C10, C11, C12)
3. Fix CORS configuration (C4)
4. Remove hardcoded PIN (C5)
5. Add security headers (H2)

### Short-term (Month 1)
1. Implement authorization on all endpoints (C6, C8, H3, H8)
2. Add webhook signature verification (C7)
3. Fix XSS in chart tooltip (H1)
4. Implement rate limiting (H5)
5. Add proper error handling (H6)

### Medium-term (Quarter 1)
1. Migrate to httpOnly cookies (C9)
2. Implement server-side role verification (H3)
3. Add CSRF protection (M5)
4. Remove debug logging (H4, M6, M7)
5. Address all TODO items (L1)

---

## Conclusion

This marketplace application has significant security vulnerabilities that require immediate attention, particularly around authentication, authorization, and secrets management. The client-only authentication model presents the most critical risk, as it allows complete bypass of access controls.

Priority should be given to:
1. Securing all backend API endpoints with authentication
2. Implementing proper authorization checks server-side
3. Rotating all exposed credentials
4. Adding security headers and CORS restrictions

With proper remediation, the application can achieve a reasonable security posture for production use.

---

*Report generated as part of security audit. All findings should be verified and prioritized by the development team.*
