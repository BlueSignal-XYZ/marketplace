# Deploy Smoke Test Checklist

Run through these steps after every production deploy to verify core flows.

## User Flow
- [ ] Sign up with a new email → verify email verification is sent
- [ ] Complete email verification → confirm redirect to onboarding
- [ ] Complete onboarding wizard (select role, fill profile) → confirm profile writes to RTDB
- [ ] Confirm role-based redirect: buyer → buyer dashboard, seller → seller dashboard, installer → installer dashboard
- [ ] Open Profile page → confirm data hydrated from RTDB matches what was entered
- [ ] Edit profile field → save → refresh → confirm persistence
- [ ] Sign out → sign in → confirm session restores to correct dashboard
- [ ] Let session expire (or manually invalidate token) → confirm session expired handling triggers re-auth

## Device Flow (requires deployed Cloud Functions + TTN config)
- [ ] Navigate to Cloud Overview dashboard → confirm it loads without errors (may show empty state)
- [ ] If TTN is configured: send a test uplink → confirm reading appears in RTDB
- [ ] Navigate to Sites list → confirm sites load from v2 endpoint
- [ ] Open a Site Detail page → confirm devices for that site are displayed
- [ ] Open a Device Detail page → confirm device info loads from v2
- [ ] Trigger an alert condition → confirm alert appears in Installer Dashboard
- [ ] Acknowledge → resolve → reopen alert → confirm state transitions persist
- [ ] Toggle demo mode → confirm mock data loads cleanly, toggle back → confirm real data returns

## Admin Flow
- [ ] Hit seed endpoint to bootstrap admin user
- [ ] Confirm admin can access admin dashboard
- [ ] Confirm admin role routing is separate from buyer/seller/installer
