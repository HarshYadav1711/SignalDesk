# SignalDesk — Frontend

Expo (React Native) ops dashboard—same triage flows as the API: home KPIs, leads, escalations, follow-ups, conversation detail (timeline + suggested SOP reply).

Overview, screenshots, mock-data rationale: **[../README.md](../README.md)**.

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

Data comes from [`mock/`](mock/) through [`src/data/mockData.ts`](src/data/mockData.ts). REST integration is planned; field names already follow the contract (`camelCase` in TS, `snake_case` on the wire).

## Screens

| Screen | Navigation |
|--------|------------|
| Home | Tab `Home` |
| Leads | Tab `Leads` |
| Escalations | Tab `Escalations` |
| Follow-ups | Tab `FollowUps` |
| Conversation detail | Stack `ConversationDetail` |

Components: [`src/components/`](src/components/) · Theme tokens: [`src/theme/`](src/theme/)
