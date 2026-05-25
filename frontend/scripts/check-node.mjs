const major = Number(process.versions.node.split('.')[0]);

if (major >= 23) {
  console.error(`
SignalDesk frontend requires Node.js 18–22 (Expo SDK 54).

You are on Node ${process.versions.node}.

Use Node 22 LTS (see .nvmrc and frontend/README.md).
`);
  process.exit(1);
}
