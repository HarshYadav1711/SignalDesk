# SignalDesk — Frontend

Expo (React Native) operations dashboard for triaging leads, escalations, and follow-ups.

## Contract

Implement against [../docs/product-contract.md](../docs/product-contract.md). Mock JSON uses `camelCase`; map to API `snake_case` at integration boundaries.

## Run

```bash
cd frontend
npm install
npm start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

```bash
npm run typecheck
```

## Layout

```
frontend/
├── mock/                    # API-shaped JSON (offline data)
│   ├── enquiries.json
│   ├── events.json
│   ├── followUps.json
│   └── dashboard.json
├── src/
│   ├── components/          # Badges, cards, timeline, layout, feed
│   ├── screens/             # Tab + conversation detail screens
│   ├── navigation/          # Bottom tabs + stack navigator
│   ├── data/mockData.ts     # Mock loaders (future API client)
│   ├── theme/               # Colors, spacing, typography tokens
│   ├── types/               # TypeScript types aligned with contract
│   └── utils/labels.ts      # Labels and date formatting
├── App.tsx
└── package.json
```

## Screens

| Tab / screen | Purpose |
|--------------|---------|
| **Home** | KPI metrics, priority queue, activity feed |
| **Leads** | Inbound enquiry inbox |
| **Escalations** | Cases needing human action |
| **Follow-ups** | Due callbacks grouped by urgency |
| **Conversation detail** | Message, SOP suggestion, timeline |

All data is loaded from `mock/` via `src/data/mockData.ts` — no backend or auth.

## Stack

- [Expo](https://expo.dev/) SDK 52 + React Native
- [React Navigation](https://reactnavigation.org/) (bottom tabs + native stack)
- TypeScript with theme tokens (`StyleSheet` + shared design tokens)
