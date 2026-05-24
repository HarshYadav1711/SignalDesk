# SignalDesk — Frontend

Expo (React Native) operations dashboard for triaging leads, escalations, and follow-ups.

**Full documentation:** [../README.md](../README.md) (screenshots, architecture, styling rationale).

## Quick start

```bash
cd frontend
npm install
npm start
```

`npm run typecheck` — TypeScript check.

## Screens

| Screen | Route |
|--------|--------|
| Home | Tab `Home` |
| Leads | Tab `Leads` |
| Escalations | Tab `Escalations` |
| Follow-ups | Tab `FollowUps` |
| Conversation detail | Stack `ConversationDetail` |

Mock data: `mock/` · Loaders: `src/data/mockData.ts` · Contract: [../docs/product-contract.md](../docs/product-contract.md)

UI captures: [../docs/screenshots/README.md](../docs/screenshots/README.md)
