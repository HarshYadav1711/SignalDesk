# SignalDesk — Frontend

Expo (React Native) operations dashboard for the same triage flows the API implements: home KPIs, leads inbox, escalations, follow-ups, and conversation detail with timeline and suggested SOP reply.

Product overview, screenshots, and architecture: **[../README.md](../README.md)**.

## Run locally

**Node 20 or 22** (Expo SDK 54). Check with `node -v`; use [.nvmrc](.nvmrc) if you use nvm.

```bash
cd frontend
npm install
npm start
```

Expo Go or simulator: `i` (iOS) / `a` (Android). Typecheck: `npm run typecheck`.

| Topic | Notes |
|-------|--------|
| Windows + Node 22 | [fix-node22.ps1](fix-node22.ps1) or install Node 22 LTS; avoid Node 23+ |
| Clean reinstall | Remove `node_modules` and `package-lock.json`, then `npm install` |
| Domain contract | [../docs/product-contract.md](../docs/product-contract.md) |
| UI captures | [../docs/screenshots/README.md](../docs/screenshots/README.md) |

Data loads from [`mock/`](mock/) via [`src/data/mockData.ts`](src/data/mockData.ts). API integration is planned; field names already mirror the contract (`camelCase` in TS, `snake_case` in API).

## Screens

| Screen | Navigation |
|--------|------------|
| Home | Tab `Home` |
| Leads | Tab `Leads` |
| Escalations | Tab `Escalations` |
| Follow-ups | Tab `FollowUps` |
| Conversation detail | Stack `ConversationDetail` |

Components: [`src/components/`](src/components/) · Theme tokens: [`src/theme/`](src/theme/)
