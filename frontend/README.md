# SignalDesk Mobile

React Native (Expo) operations dashboard for business owners. Uses **mock JSON only** — no backend integration per assignment scope.

See the [root README](../README.md) for monorepo setup and the combined walkthrough video.

## Quick start

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` for Android / iOS simulators.

## Screens

| Tab / screen | Purpose |
|--------------|---------|
| Home | Metrics + priority queue |
| Leads | Inbound lead inbox |
| Escalations | Human escalation queue |
| Follow-ups | Due callbacks and promises |
| Conversation Detail | Stack screen from Leads or Escalations |

Mock data lives in `/mock` as API-shaped JSON. See `src/data/loadMock.ts` for imports.

## Styling: StyleSheet vs NativeWind

**Choice: React Native `StyleSheet`**

| | StyleSheet | NativeWind |
|---|------------|------------|
| Setup | Built-in | Tailwind + Babel + RN preset |
| Debuggability | Standard RN tooling | Extra indirection |
| Fit here | Small, fixed screen set | Better for large design systems |

NativeWind is excellent when a team already ships Tailwind on web. For this focused mobile dashboard, explicit tokens in `src/theme/` keep styles easy to review without build complexity.

## Screenshots & video

Add captures under `../docs/screenshots/`:

- `home.png`
- `leads.png`
- `escalations.png`
- `followups.png`
- `conversation-detail.png`

Record the combined walkthrough per root README (`../docs/walkthrough.md`).

## Known limitations

- Mock data only — no live API or pull-to-refresh.
- Conversation detail exists for a subset of IDs in `mock/conversations.json`.
- No push notifications, auth, or offline sync (out of assignment scope).
