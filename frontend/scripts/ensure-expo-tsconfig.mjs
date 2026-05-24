/**
 * Expo tooling and some editors expect node_modules/expo/tsconfig.base.json.
 * Copy our committed base settings there after install when expo is present.
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const expoDir = join(root, 'node_modules', 'expo');
const target = join(expoDir, 'tsconfig.base.json');

const base = {
  $schema: 'https://json.schemastore.org/tsconfig',
  compilerOptions: {
    strict: true,
    forceConsistentCasingInFileNames: true,
    allowJs: true,
    esModuleInterop: true,
    jsx: 'react-native',
    lib: ['DOM', 'ESNext'],
    moduleResolution: 'node',
    noEmit: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    target: 'ESNext',
  },
};

if (!existsSync(expoDir)) {
  process.exit(0);
}

mkdirSync(expoDir, { recursive: true });
writeFileSync(target, `${JSON.stringify(base, null, 2)}\n`, 'utf8');
