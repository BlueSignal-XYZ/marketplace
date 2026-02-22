# Deploy Smoke Test Checklist

Run through these steps after every production deploy to verify core flows.

Items marked ✅ have automated integration test coverage (run `npm run test:integration`).
Items marked 🔲 still require manual verification.

## User Flow
- ✅ Sign up with a new email → verify email verification is sent (user-flows.test.ts)
- ✅ Complete email verification → confirm redirect to onboarding (user-flows.test.ts)
- ✅ Complete onboarding wizard (select role, fill profile) → confirm profile writes to RTDB (user-flows.test.ts)
- ✅ Confirm role-based redirect: buyer → buyer dashboard, seller → seller dashboard, installer → installer dashboard (user-flows.test.ts)
- ✅ Open Profile page → confirm data hydrated from RTDB matches what was entered (user-flows.test.ts)
- 🔲 Edit profile field → save → refresh → confirm persistence
- 🔲 Sign out → sign in → confirm session restores to correct dashboard
- ✅ Let session expire (or manually invalidate token) → confirm session expired handling triggers re-auth (user-flows.test.ts)

## Device Flow (requires deployed Cloud Functions + TTN config)
- 🔲 Navigate to Cloud Overview dashboard → confirm it loads without errors (may show empty state)
- 🔲 If TTN is configured: send a test uplink → confirm reading appears in RTDB
- 🔲 Navigate to Sites list → confirm sites load from v2 endpoint
- 🔲 Open a Site Detail page → confirm devices for that site are displayed
- ✅ Open a Device Detail page → confirm device info loads from v2 (device-flows.test.ts)
- ✅ Trigger an alert condition → confirm alert appears (device-flows.test.ts)
- ✅ Acknowledge → resolve → reopen alert → confirm state transitions persist (device-flows.test.ts)
- 🔲 Toggle demo mode → confirm mock data loads cleanly, toggle back → confirm real data returns

## Commissioning Flow
- ✅ Initiate commissioning for a registered device (device-flows.test.ts)
- ✅ Run commissioning tests → verify pass/fail results (device-flows.test.ts)
- ✅ Complete commissioning → verify device status updated (device-flows.test.ts)
- ✅ Verify commission appears in device's commission history (device-flows.test.ts)

## Admin Flow
- 🔲 Hit seed endpoint to bootstrap admin user
- 🔲 Confirm admin can access admin dashboard
- 🔲 Confirm admin role routing is separate from buyer/seller/installer
