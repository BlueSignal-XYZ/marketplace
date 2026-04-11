# Tech Stack — Cross-Project Conventions

## Languages by Project

| Project | Primary Language | Secondary |
|---------|-----------------|-----------|
| WQM-1 | Python | Shell, HTML/CSS |
| Marketplace | TypeScript | — |

## Shared Patterns

### Version Control
- GitHub for all repos (github.com/BlueSignal-XYZ)
- Feature branches with pull requests
- CI/CD via GitHub Actions

### Data Flow
```
WQM-1 Sensors → SQLite (local) → LoRaWAN → Cloud Gateway → Firebase Realtime DB → Marketplace Dashboard
```

### Backend
- **Firebase** is the primary backend platform
  - Authentication for user management
  - Realtime Database for sensor data and application state
  - Cloud Functions for serverless logic

### Blockchain
- **Polygon** network for on-chain verification
- ethers.js v6 for blockchain interactions
- Alchemy as the node provider

## Python Conventions (WQM-1)

- Use `logging` module, not `print()`
- SQLite with WAL mode for data storage
- Cayenne LPP for LoRa payload encoding
- Raspberry Pi OS Lite as the target platform

## TypeScript/React Conventions (Marketplace)

- React 18 with functional components and hooks
- Styled Components for CSS-in-JS
- React Context API + React Query for state
- Vitest + React Testing Library for tests
- Vite 4 for builds

## Deployment

- **WQM-1:** Direct deployment to Raspberry Pi devices via SSH/SD card
- **Marketplace:** Firebase Hosting (likely) — verify with current deployment config
