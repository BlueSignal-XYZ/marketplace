# Marketplace — BlueSignal Web Platform

## Description

A unified React platform supporting three services under one codebase:

| Service | Domain | Purpose |
|---------|--------|---------|
| Trading | waterquality.trading | Environmental nutrient credit trading marketplace |
| Cloud Console | cloud.bluesignal.xyz | IoT device monitoring, real-time dashboards |
| Landing Page | bluesignal.xyz | Product showcase and company information |

**Repo:** github.com/BlueSignal-XYZ/marketplace

## Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 4
- **Language:** TypeScript
- **Styling:** Styled Components
- **State Management:** React Context API + React Query

### Backend
- **Platform:** Firebase
  - Authentication
  - Realtime Database
  - Cloud Functions

### Blockchain
- **Network:** Polygon
- **Libraries:** ethers.js v6, Alchemy SDK
- **Purpose:** On-chain verification of nutrient credit transactions

### Integrations
- **Payments:** Stripe
- **Maps:** Google Maps, Mapbox GL
- **Video:** Livepeer
- **CRM:** HubSpot

### Testing
- **Framework:** Vitest + React Testing Library

## Key Features

- Real-time device dashboards with sensor data visualization
- Portfolio tracking for nutrient credits
- Blockchain-verified transactions
- Device commissioning workflows
- Geospatial mapping and interactive charts
- Payment processing (Stripe)
- Regulatory trading program support

## Key Development Areas

- React component development and optimization
- Firebase integration and real-time database management
- Blockchain/Web3 integration (Polygon, ethers.js)
- TypeScript type definitions and patterns
- Payment system implementation (Stripe)
- Performance optimization and code splitting
- Test coverage improvements (Vitest)
- Multi-service routing and configuration
