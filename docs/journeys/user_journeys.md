# User Journey Maps

**Document:** Cross-Site User Journeys
**Date:** 2025-12-28

This document maps the key user journeys across all three BlueSignal sites, identifying entry points, decision moments, friction points, and opportunities for improvement.

---

## Journey A: Prospect → Customer → Active User

**User:** Prospective buyer (homeowner, business, organization) interested in water quality monitoring and/or credit generation.

### Current Flow (As-Is)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        DISCOVERY PHASE                           │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                         ┌────────────┼────────────┐
                                         ▼            ▼            ▼
                                    [Google]    [Referral]    [Installer]
                                         │            │            │
                                         └────────────┼────────────┘
                                                      │
                                                      ▼
                                    ┌─────────────────────────────────────┐
                                    │ ? WHICH SITE DO THEY LAND ON ?       │
                                    │                                      │
                                    │ • waterquality.trading - Confusing   │
                                    │ • sales.bluesignal.xyz - No context  │
                                    │ • Direct installer contact           │
                                    └─────────────────────────────────────┘
                                                      │
                                         ┌────────────┼────────────┐
                                         ▼            ▼            ▼
                              ┌─────────────┐  ┌───────────┐  ┌───────────┐
                              │ WQT Landing │  │ Sales     │  │ Installer │
                              │ (Confusing) │  │ Config    │  │ Meeting   │
                              └─────────────┘  └───────────┘  └───────────┘
                                         │            │            │
                                         │            │            │
                                         └────────────┼────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ No unified "I'm a prospect, show me what this is" experience     │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        EVALUATION PHASE                          │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    ┌─────────────────────────────────────┐
                                    │ ? HOW DO THEY EVALUATE ROI ?         │
                                    │                                      │
                                    │ Currently: Manual calculation or     │
                                    │ rely entirely on installer           │
                                    └─────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ No self-service ROI calculator / No clear "what will I get"      │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        PURCHASE DECISION                         │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    ┌─────────────────────────────────────┐
                                    │ Offline purchase via installer       │
                                    └─────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        INSTALLATION                              │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    ┌─────────────────────────────────────┐
                                    │ Installer handles device setup       │
                                    │ (Commissioning workflow in Cloud)    │
                                    └─────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ONBOARDING                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    ┌─────────────────────────────────────┐
                                    │ ? HOW DOES CUSTOMER GET ACCESS ?     │
                                    │                                      │
                                    │ cloud.bluesignal.xyz → Create acct   │
                                    │ → Link to their device somehow       │
                                    └─────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ Unclear handoff from installer to customer ownership             │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ACTIVE USE                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                         ┌────────────┴────────────┐
                                         ▼                        ▼
                              ┌─────────────────┐       ┌─────────────────┐
                              │ Monitoring      │       │ Credit Trading  │
                              │ (Cloud)         │       │ (WQT)           │
                              └─────────────────┘       └─────────────────┘
                                         │                        │
                                         │                        │
                                         ▼                        ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ Connection between monitoring data and credit generation unclear │
                        └─────────────────────────────────────────────────────────────────┘
```

### Proposed Flow (To-Be)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        DISCOVERY PHASE                           │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                         ┌────────────┼────────────┐
                                         ▼            ▼            ▼
                                    [Google]    [Referral]    [Installer]
                                         │            │            │
                                         └────────────┼────────────┘
                                                      │
                                                      ▼
                              ┌─────────────────────────────────────────────────────┐
                              │            sales.bluesignal.xyz                      │
                              │                                                      │
                              │  ┌─────────────────────────────────────────────────┐ │
                              │  │  Hero: "Turn Water Quality Into Revenue"        │ │
                              │  │                                                 │ │
                              │  │  • Clear value proposition                      │ │
                              │  │  • Social proof (customers, stats)              │ │
                              │  │  • [Start Quote] [Watch Demo] CTAs              │ │
                              │  └─────────────────────────────────────────────────┘ │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        EVALUATION PHASE                          │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            sales.bluesignal.xyz (continued)          │
                              │                                                      │
                              │  1. Site Assessment (guided questions)               │
                              │  2. System Selection (smart recommendation)          │
                              │  3. ROI Calculator (clear payback period)  ✅        │
                              │  4. Proposal Generation (downloadable PDF) ✅        │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        PURCHASE DECISION                         │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                         ┌────────────┴────────────┐
                                         ▼                        ▼
                              ┌─────────────────┐       ┌─────────────────┐
                              │ Via Installer   │       │ Direct (future) │
                              └─────────────────┘       └─────────────────┘
                                         │                        │
                                         └────────────┬────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        INSTALLATION                              │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Installer Flow:                                     │
                              │  1. Commissioning wizard                             │
                              │  2. Device registration (QR scan)                    │
                              │  3. Customer account creation                        │
                              │  4. Device transfer to customer  ✅ (new)            │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ONBOARDING                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Customer receives:                                  │
                              │  • Welcome email with login link                     │
                              │  • Guided first-time experience  ✅ (new)            │
                              │  • Device(s) already linked                          │
                              │  • "What to expect" walkthrough                      │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ACTIVE USE                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Daily Experience:                                   │
                              │  • Dashboard with device health                      │
                              │  • Readings with context (good/warning/critical)     │
                              │  • Alerts when action needed                         │
                              │  • [Generate Credits] link → WQT  ✅ (cross-link)    │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                              ┌─────────────────────────────────────────────────────┐
                              │            waterquality.trading                      │
                              │                                                      │
                              │  Credit Generation:                                  │
                              │  • Portfolio dashboard                               │
                              │  • Create/manage listings                            │
                              │  • Transaction history                               │
                              │  • Compliance reports                                │
                              └─────────────────────────────────────────────────────┘
```

### Key Decision Moments

| Moment | Current State | Improvement Needed |
|--------|---------------|-------------------|
| First site visit | Confusing, no clear value | Sales hero with clear value prop |
| Understanding ROI | Manual/installer-dependent | Self-service ROI calculator |
| Getting a quote | Unclear process | Instant PDF proposal |
| Post-purchase access | Friction in account linking | Installer creates customer account |
| First device reading | No celebration/explanation | First-time experience walkthrough |
| Credit generation | Unclear path from data to credits | Clear cross-link from Cloud → WQT |

### Friction Points & Resolutions

| Friction Point | Resolution |
|----------------|------------|
| "Which site do I go to?" | All prospects → sales.bluesignal.xyz |
| "How much will I make?" | Prominent ROI calculator on sales |
| "How do I get access after purchase?" | Installer creates customer account during commissioning |
| "What do my readings mean?" | Contextual indicators (good/warning/critical) |
| "How do I generate credits?" | Persistent "Generate Credits" link in Cloud |

---

## Journey B: Installer Workflow

**User:** Certified BlueSignal installer managing multiple client sites and devices.

### Current Flow (As-Is)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        SALES PHASE                               │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            sales.bluesignal.xyz                      │
                              │                                                      │
                              │  Current:                                            │
                              │  • Configure system with prospect                    │
                              │  • Generate quote                                    │
                              │                                                      │
                              │  Missing:                                            │
                              │  • Can't save configurations                         │
                              │  • No demo mode for quick presentations              │
                              │  • No ROI calculator to show value                   │
                              │  • No PDF proposal to leave behind                   │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ Installer has to recreate config every time / No proposal output │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        CLOSE SALE                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    (Offline process - not addressed)
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        INSTALLATION PHASE                        │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Current:                                            │
                              │  • Create site                                       │
                              │  • Onboard devices (QR scan)                         │
                              │  • Complete commissioning workflow                   │
                              │                                                      │
                              │  Missing:                                            │
                              │  • No client management view                         │
                              │  • No fleet overview (all my devices)                │
                              │  • Not mobile-optimized for field work               │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ No unified view of "all my clients" / Workflow is desktop-first  │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ONGOING MANAGEMENT                        │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Current:                                            │
                              │  • View individual device status                     │
                              │  • Respond to alerts                                 │
                              │                                                      │
                              │  Missing:                                            │
                              │  • Fleet health overview                             │
                              │  • Bulk firmware updates                             │
                              │  • Maintenance scheduling                            │
                              │  • Service history tracking                          │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        CREDIT MANAGEMENT                         │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            waterquality.trading (if applicable)     │
                              │                                                      │
                              │  Current:                                            │
                              │  • View credits generated                            │
                              │  • Create listings                                   │
                              │                                                      │
                              │  Missing:                                            │
                              │  • Aggregate view across clients                     │
                              │  • Client credit reporting                           │
                              └─────────────────────────────────────────────────────┘
```

### Proposed Flow (To-Be)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        SALES PHASE                               │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            sales.bluesignal.xyz                      │
                              │                                                      │
                              │  Enhanced Installer Tools:                           │
                              │  ✅ Save/load configurations                         │
                              │  ✅ Demo mode with pre-filled examples               │
                              │  ✅ ROI calculator (show client the value)           │
                              │  ✅ PDF proposal generation                          │
                              │  ✅ Mobile-optimized for on-site use                 │
                              │  ✅ Customer management (saved prospects)            │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        CLOSE SALE                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                    (Offline or via checkout flow)
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        INSTALLATION PHASE                        │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Streamlined Field Workflow:                         │
                              │  1. ✅ Quick-add client (or select existing)         │
                              │  2. ✅ Create site with location capture             │
                              │  3. ✅ QR scan to register device                    │
                              │  4. ✅ Run commissioning checklist                   │
                              │  5. ✅ Create customer account                       │
                              │  6. ✅ Transfer device ownership                     │
                              │  7. ✅ Confirm activation                            │
                              │                                                      │
                              │  All mobile-optimized with large touch targets       │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ONGOING MANAGEMENT                        │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            cloud.bluesignal.xyz                      │
                              │                                                      │
                              │  Installer Dashboard:                                │
                              │  ✅ Fleet overview map (all devices)                 │
                              │  ✅ Status summary (healthy/warning/critical)        │
                              │  ✅ Client list with device counts                   │
                              │  ✅ Alert queue (prioritized)                        │
                              │  ✅ Bulk actions (firmware, config)                  │
                              │  ✅ Maintenance calendar                             │
                              │  ✅ Service history per device                       │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        CREDIT MANAGEMENT                         │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │            waterquality.trading                      │
                              │                                                      │
                              │  Installer Credit View:                              │
                              │  ✅ Aggregate credits across all clients             │
                              │  ✅ Per-client credit breakdown                      │
                              │  ✅ Client credit reports (exportable)               │
                              │  ✅ "Generate credits" on behalf of client           │
                              └─────────────────────────────────────────────────────┘
```

### Key Installer Pain Points

| Pain Point | Current Impact | Solution |
|------------|---------------|----------|
| Can't save configs | Recreate from scratch each time | Local storage + cloud sync |
| No proposal output | Manual quote creation | PDF proposal generator |
| Desktop-first | Awkward on-site | Mobile-optimized views |
| No fleet overview | Check each device individually | Fleet dashboard with map |
| No client grouping | Devices not organized | Client management section |
| No bulk actions | Update one device at a time | Bulk firmware/config tools |

---

## Journey C: Utility/Municipality

**User:** Environmental compliance officer or utility manager exploring water quality credit programs.

### Current Flow (As-Is)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        DISCOVERY PHASE                           │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Arrives at waterquality.trading                      │
                              │                                                      │
                              │ Looking for:                                         │
                              │ • What is this platform?                             │
                              │ • How does it work?                                  │
                              │ • Can we integrate via API?                          │
                              │ • What registries are connected?                     │
                              │ • Compliance/reporting capabilities?                 │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ FRICTION POINT                         │
                        │ No clear "For Utilities" or "For Developers" entry point         │
                        │ No API documentation visible                                     │
                        │ No partnership/integration information                           │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        EVALUATION PHASE                          │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Manual exploration:                                  │
                              │ • Browse marketplace listings                        │
                              │ • View registry                                      │
                              │ • Look at map                                        │
                              │                                                      │
                              │ Missing:                                             │
                              │ • Case studies for municipalities                    │
                              │ • API documentation                                  │
                              │ • Integration guides                                 │
                              │ • Pricing/partnership models                         │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ❌ DROP-OFF                               │
                        │ No clear path forward for enterprise/utility use cases           │
                        └─────────────────────────────────────────────────────────────────┘
```

### Proposed Flow (To-Be)

```
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        DISCOVERY PHASE                           │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Arrives at waterquality.trading                      │
                              │                                                      │
                              │ Clear entry points:                                  │
                              │ ✅ "For Buyers" → Marketplace browsing               │
                              │ ✅ "For Sellers" → Listing management                │
                              │ ✅ "For Developers" → API & Integrations             │
                              │ ✅ "For Utilities" → Enterprise solutions            │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        EVALUATION PHASE                          │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Developer Portal:                                    │
                              │                                                      │
                              │ ✅ API Overview (what's possible)                    │
                              │ ✅ API Reference (endpoints, auth)                   │
                              │ ✅ Code examples (Python, JS, etc.)                  │
                              │ ✅ Webhook documentation                             │
                              │ ✅ Sandbox environment                               │
                              │ ✅ Rate limits & pricing                             │
                              └─────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Enterprise/Utility Information:                      │
                              │                                                      │
                              │ ✅ Case studies (municipalities, utilities)          │
                              │ ✅ Compliance reporting capabilities                 │
                              │ ✅ Registry connections (EPA, state programs)        │
                              │ ✅ Volume discounts / partnership models             │
                              │ ✅ Contact for enterprise inquiry                    │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ONBOARDING PHASE                          │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ API Onboarding:                                      │
                              │                                                      │
                              │ 1. Create account                                    │
                              │ 2. Generate API keys                                 │
                              │ 3. Configure webhooks                                │
                              │ 4. Test in sandbox                                   │
                              │ 5. Go live                                           │
                              └─────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                        ┌─────────────────────────────────────────────────────────────────┐
                        │                        ACTIVE USE                                │
                        └─────────────────────────────────────────────────────────────────┘
                                                      │
                              ┌─────────────────────────────────────────────────────┐
                              │ Utility Dashboard:                                   │
                              │                                                      │
                              │ ✅ Aggregated data across region                     │
                              │ ✅ Credit trading volume                             │
                              │ ✅ Compliance reports (export)                       │
                              │ ✅ API usage metrics                                 │
                              │ ✅ Billing/invoicing                                 │
                              └─────────────────────────────────────────────────────┘
```

---

## Cross-Site Navigation Summary

### Entry Points by User Type

| User Type | Primary Entry | Secondary Entry | Tertiary |
|-----------|--------------|-----------------|----------|
| Prospect (consumer) | sales.bluesignal.xyz | Installer referral | Google search |
| Installer | cloud.bluesignal.xyz | sales.bluesignal.xyz | - |
| Device Owner | cloud.bluesignal.xyz | - | - |
| Credit Trader | waterquality.trading | - | - |
| Developer/Utility | waterquality.trading/developers | - | - |

### Cross-Site Links (To Implement)

| From Site | To Site | Link Text | Context |
|-----------|---------|-----------|---------|
| Cloud | WQT | "Generate Credits" | Device detail page |
| Cloud | Sales | "Get Quote" | Add device modal |
| Sales | Cloud | "Set Up Devices" | Post-purchase/proposal |
| WQT | Cloud | "View Source Devices" | Credit detail page |
| WQT | Sales | "Need Hardware?" | Landing page |

---

## Priority Improvements by Journey

### Journey A (Prospect → Customer)
1. **Sales landing page** with clear value proposition
2. **ROI calculator** for self-service evaluation
3. **PDF proposal** for installers to leave with prospects
4. **First-time experience** in Cloud after purchase
5. **Credit generation cross-link** from Cloud to WQT

### Journey B (Installer)
1. **Save/load configurations** in Sales
2. **Mobile optimization** across all sites
3. **Fleet dashboard** in Cloud
4. **Client management** in Cloud
5. **Aggregate credit view** in WQT

### Journey C (Utility)
1. **Developer portal** on WQT
2. **API documentation**
3. **Enterprise case studies**
4. **Compliance reporting** features
5. **Partnership/pricing** information
