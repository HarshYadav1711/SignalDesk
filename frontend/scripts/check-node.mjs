const major = Number(process.versions.node.split('.')[0]);

if (major >= 23) {
  console.error(`
SignalDesk frontend requires Node.js 18–22 (Expo SDK 52).

You are on Node ${process.versions.node}.

Windows — pick one:
  winget install -e --id OpenJS.NodeJS.22
  (restart the terminal, then run npm start again)

Or install NVM for Windows, then: nvm install 22 && nvm use 22
  winget install -e --id CoreyButler.NVMforWindows

See frontend/README.md for details.
`);
  process.exit(1);
}
