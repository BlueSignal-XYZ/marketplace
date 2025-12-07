# BlueSignal Marketplace

A React-based platform for environmental credit trading, IoT device monitoring, and hardware sales. The application operates in **tri-mode architecture**, serving three distinct products from a single codebase.

---

## Overview

BlueSignal Marketplace is a unified frontend platform that provides:

| Mode | Domain | Purpose |
|------|--------|---------|
| **Marketplace** | [waterquality.trading](https://waterquality.trading) | Nutrient credit marketplace for buying/selling environmental certificates |
| **Cloud** | [cloud.bluesignal.xyz](https://cloud.bluesignal.xyz) | IoT device monitoring dashboard for water quality sensors |
| **Sales** | [sales.bluesignal.xyz](https://sales.bluesignal.xyz) | Hardware product configurator and sales portal |

All modes share the same codebase but dynamically render different UI, routing, and features based on hostname detection at runtime.

---

## Key Features

### Marketplace Mode (waterquality.trading)
- **Credit Trading** - Browse, buy, and sell nutrient credits (nitrogen, phosphorus removal)
- **Registry Explorer** - Public registry of verified environmental certificates
- **Interactive Map** - Geospatial visualization of credit sources
- **Seller Dashboard** - Manage listings, track sales, and view analytics
- **Certificate Verification** - Blockchain-backed certificate authenticity

### Cloud Mode (cloud.bluesignal.xyz)
- **Device Monitoring** - Real-time water quality sensor data visualization
- **Site Management** - Organize devices by installation sites
- **Alert System** - Configurable alerts for sensor thresholds
- **Commissioning Workflow** - Step-by-step device installation and activation
- **Role-Based Dashboards** - Buyer, Seller, and Installer specific views
- **Media Streaming** - Livepeer integration for live video feeds

### Sales Mode (sales.bluesignal.xyz)
- **Product Configurator** - Interactive hardware configuration tool
- **Quote Builder** - Generate quotes for custom sensor configurations
- **Technical Documentation** - Wiring diagrams, installation guides, calibration procedures
- **Enclosure Comparison** - Side-by-side hardware comparison

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + Vite |
| **Routing** | React Router v6 |
| **State Management** | React Context API (AppContext) |
| **Styling** | Styled Components |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Realtime Database |
| **Hosting** | Firebase Hosting (multi-site) |
| **Backend API** | Cloud Functions (Node.js) |
| **Blockchain** | Polygon (Amoy testnet / mainnet) via ethers.js |
| **Media Streaming** | Livepeer |
| **Charts** | Chart.js + react-chartjs-2 |
| **Maps** | Google Maps API, Mapbox GL |
| **Payments** | Stripe |
| **Testing** | Vitest + Testing Library |

---

## Prerequisites

- **Node.js** v20 or higher
- **Git** (authenticated to repository)
- **Firebase CLI** (`npm install -g firebase-tools`)

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/BlueSignal-XYZ/Marketplace.git
cd Marketplace

# Install dependencies
npm install

# Login to Firebase (for deployment)
firebase login
```

### Development

```bash
# Start development server (localhost:3000)
npm run dev

# Test different modes locally using query params:
# Marketplace: http://localhost:3000
# Cloud:       http://localhost:3000?app=cloud
# Sales:       http://localhost:3000?app=sales
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

---

## Build & Deployment

### Building

The project builds three separate bundles, one for each hosting target:

```bash
# Build all sites
npm run build

# Build individual sites
npm run build:wqt    # Marketplace (waterquality.trading)
npm run build:cloud  # Cloud (cloud.bluesignal.xyz)
npm run build:sales  # Sales (sales.bluesignal.xyz)
```

Each build outputs to a separate directory:
- `dist-wqt/` - Marketplace build
- `dist-cloud/` - Cloud build
- `dist-sales/` - Sales build

### Deployment

```bash
# Deploy all sites
firebase deploy

# Deploy individual sites
npm run deploy:wqt    # Deploy Marketplace
npm run deploy:cloud  # Deploy Cloud
npm run deploy:sales  # Deploy Sales
```

> **Note:** Deployment requires Firebase CLI authentication with project access.

---

## Architecture

### Mode Detection

The app detects which mode to render based on hostname at runtime:

```
┌─────────────────────────────────────────────────────────────┐
│                     Mode Detection Logic                     │
├─────────────────────────────────────────────────────────────┤
│ Sales Mode:                                                  │
│   • sales.bluesignal.xyz                                     │
│   • *.sales.bluesignal.xyz                                   │
│   • sales-bluesignal.web.app                                 │
│   • ?app=sales (dev/testing)                                 │
├─────────────────────────────────────────────────────────────┤
│ Cloud Mode:                                                  │
│   • cloud.bluesignal.xyz                                     │
│   • *.cloud.bluesignal.xyz                                   │
│   • cloud-bluesignal.web.app                                 │
│   • ?app=cloud (dev/testing)                                 │
├─────────────────────────────────────────────────────────────┤
│ Marketplace Mode (default):                                  │
│   • waterquality.trading                                     │
│   • *.waterquality.trading                                   │
│   • waterquality-trading.web.app                             │
│   • localhost                                                │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── apis/                 # Firebase and external API configs
├── assets/               # Images, animations, wallpapers
├── components/
│   ├── cloud/            # Cloud-specific components
│   ├── dashboards/       # Role-based dashboard components
│   ├── elements/         # Feature modules (livepeer, marketplace, contractUI)
│   ├── installer/        # Device commissioning workflow
│   ├── navigation/       # Headers and menus for each mode
│   ├── popups/           # Global modals and notifications
│   ├── routes/           # Nested route components
│   ├── shared/           # Reusable UI components
│   └── BlueSignalConfigurator/  # Product configurator (Sales mode)
├── context/              # React Context providers (AppContext)
├── data/                 # Static data and mock data
├── hooks/                # Custom React hooks
├── interfaces/           # TypeScript interfaces
├── routes/               # Top-level route components
├── scripts/              # Backend API integration (back_door.js)
├── utils/                # Utility functions (modeDetection, roleRouting)
└── wqt/                  # Marketplace-specific pages
```

### State Management

Global state is managed via `AppContext` (`src/context/AppContext.jsx`):

```javascript
import { useAppContext } from "./context/AppContext";

const { STATES, ACTIONS } = useAppContext();

// Available state
const { user, isMobile, isLoading, authLoading } = STATES;

// Available actions
ACTIONS.logNotification("success", "Operation complete");
ACTIONS.logConfirmation("Are you sure?", () => doAction());
ACTIONS.updateUser(uid);
ACTIONS.logout();
```

### Backend API Integration

API clients are centralized in `src/scripts/back_door.js`:

| API | Purpose |
|-----|---------|
| `UserAPI` | User account CRUD operations |
| `AccountAPI` | Blockchain account management |
| `DeviceAPI` | IoT device management |
| `SiteAPI` | Installation site management |
| `OrderAPI` | Order lifecycle management |
| `CommissionAPI` | Device commissioning workflow |
| `CustomerAPI` | Customer management |
| `MarketplaceAPI` | Credit listing and trading |
| `NPCCreditsAPI` | Nutrient credit operations |
| `LivepeerAPI` | Video streaming integration |
| `StripeAPI` | Payment processing |

### Blockchain Integration

The app integrates with Polygon blockchain for certificate verification:

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Testnet (Amoy) | 80002 | [amoy.polygonscan.com](https://amoy.polygonscan.com) |
| Mainnet | 137 | [polygonscan.com](https://polygonscan.com) |

Blockchain mode is configured in `configs.js`.

---

## Route Structure

### Marketplace Routes
| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Landing page / Login |
| `/marketplace` | No | Credit listings |
| `/marketplace/listing/:id` | No | Listing detail |
| `/registry` | No | Certificate registry |
| `/map` | No | Geospatial explorer |
| `/certificate/:id` | No | Certificate detail |
| `/marketplace/seller-dashboard` | Yes | Seller management |
| `/marketplace/tools/*` | Yes | Calculator, verification tools |

### Cloud Routes
| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Landing / Login |
| `/dashboard/main` | Yes | Overview dashboard |
| `/dashboard/:role` | Yes | Role-specific dashboard |
| `/cloud/devices` | Yes | Device list |
| `/cloud/devices/:id` | Yes | Device detail |
| `/cloud/sites` | Yes | Site list |
| `/cloud/sites/:id` | Yes | Site detail |
| `/cloud/alerts` | Yes | Alert management |
| `/cloud/commissioning` | Yes | Commissioning workflow |

### Sales Routes
| Route | Auth | Description |
|-------|------|-------------|
| `/` | No | Product configurator |
| `/configurator` | No | Product configurator |

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Livepeer (Media Streaming)
VITE_LIVEPEER_API_KEY=

# Build Version (auto-generated if not set)
VITE_BUILD_VERSION=
```

---

## Firebase Configuration

The project uses Firebase multi-site hosting with three targets:

| Target | Directory | Domain |
|--------|-----------|--------|
| `waterquality-trading` | `dist-wqt/` | waterquality.trading |
| `cloud-bluesignal` | `dist-cloud/` | cloud.bluesignal.xyz |
| `sales-bluesignal` | `dist-sales/` | sales.bluesignal.xyz |

Configuration is defined in `firebase.json` and `.firebaserc`.

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm test`
4. Build all targets: `npm run build`
5. Submit a pull request

---

## Support

For access requests, configuration help, or deployment issues:

**[hi@bluesignal.xyz](mailto:hi@bluesignal.xyz)**

---

## License

Proprietary - BlueSignal Technologies
