# SignalDesk — Frontend

Expo (React Native) operations dashboard for triaging leads, escalations, and follow-ups.

**Full documentation:** [../README.md](../README.md) (screenshots, architecture, styling rationale).

## Quick start

**Node.js:** use **v22 LTS** (or v20). See `.nvmrc`. **Expo SDK 54** requires Node 18–22; Node 23+ is not supported.

From the repository root:

```bash
cd frontend
node -v    # should report v20.x or v22.x
npm install
npm start
```

With [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows):

```bash
cd frontend
nvm install
nvm use
npm install
npm start
```

On Windows without nvm, install [Node.js 22 LTS](https://nodejs.org/) or use `winget install -e --id OpenJS.NodeJS.22`. If Node 25 is installed via a different package id, uninstall it before installing 22, then restart your terminal.

Optional Windows helper (winget switch from Node 25 → 22):

```powershell
cd frontend
.\fix-node22.ps1
npm run setup
npm start
```

`npm run setup` runs a clean install script on Windows (`setup.ps1`). On other platforms, use `npm install` and, if needed:

```bash
npx expo install expo-asset expo-font expo-constants expo-file-system babel-preset-expo
```

Use Expo Go or a simulator (`i` / `a` in the Expo terminal). Typecheck: `npm run typecheck`.

### If `npm start` fails with `MODULE_NOT_FOUND`

Corrupted `node_modules` from a partial install. Clean and reinstall:

```bash
cd frontend
rm -rf node_modules package-lock.json   # Windows: Remove-Item -Recurse -Force node_modules; Remove-Item package-lock.json
npm install
npx expo install expo-asset expo-font expo-constants expo-file-system
npm start
```

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
