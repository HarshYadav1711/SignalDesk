# SignalDesk — Frontend

Expo (React Native) operations dashboard for triaging leads, escalations, and follow-ups.

**Full documentation:** [../README.md](../README.md) (screenshots, architecture, styling rationale).

## Quick start

**Node.js:** use **v22 LTS** (or v20). **Expo SDK 54** (matches current Expo Go from the Play Store). Node 25 is not recommended.

### Windows (no `nvm` installed)

Install Node 22, **restart your terminal**, then set up the app:

Node 25 (`OpenJS.NodeJS`) and Node 22 (`OpenJS.NodeJS.22`) are **different** winget packages. If `node -v` still shows v25 after install, remove 25 first:

```powershell
cd D:\Fun\SignalDesk\frontend
.\fix-node22.ps1
```

Or manually:

```powershell
winget uninstall -e --id OpenJS.NodeJS
winget install -e --id OpenJS.NodeJS.22
```

**Close and reopen** the terminal (required for PATH), then check `node -v` shows **v22.x**.

After that:

```powershell
cd frontend
node -v          # should show v22.x
npm run setup    # clean install + Expo peer deps
npm start
```

Optional: [NVM for Windows](https://github.com/coreybutler/nvm-windows) — `winget install -e --id CoreyButler.NVMforWindows`, then `nvm install 22` and `nvm use 22`.

### macOS / Linux (with nvm)

```bash
cd frontend
nvm install 22
nvm use 22
npm run setup
npm start
```

### If `npm start` fails with `MODULE_NOT_FOUND` (e.g. `minipass`)

Corrupted `node_modules` from a partial install. Clean and reinstall:

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npx expo install expo-asset expo-font expo-constants expo-file-system
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

UI captures: [../docs/screenshots/README.md](../docs/screenshots/README.md) · API reference: [../docs/api/README.md](../docs/api/README.md) · Walkthrough: [../docs/walkthrough/README.md](../docs/walkthrough/README.md)
