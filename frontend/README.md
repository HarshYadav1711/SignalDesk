# SignalDesk — Frontend

Expo (React Native) operations dashboard for triaging leads, escalations, and follow-ups.

**Status:** scaffold — not runnable yet.

## Contract

Implement against [../docs/product-contract.md](../docs/product-contract.md). Use `camelCase` in TypeScript and mock JSON; map to API `snake_case` at integration boundaries.

## Planned layout

```
frontend/
├── mock/             # API-shaped JSON for offline UI work
└── src/
    ├── components/   # Reusable UI
    ├── screens/      # Tab and stack screens
    ├── navigation/   # React Navigation
    ├── data/         # Mock loaders / future API client
    ├── theme/        # Colors, spacing tokens
    └── types/        # TypeScript types aligned with contract
```

## Planned stack (free, maintained)

- [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- TypeScript

Dependency manifests and screens will be added in the frontend implementation phase.

## Parallel work

Own everything under `frontend/`. Early UI work may use `mock/` only. Do not change `backend/` or the product contract without syncing both tracks.
