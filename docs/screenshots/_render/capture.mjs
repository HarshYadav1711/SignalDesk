/**
 * Renders static HTML mocks and captures PNG screenshots for submission docs.
 * Run from repo root: node docs/screenshots/_render/capture.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..');

const screens = [
  { html: 'home.html', png: 'home.png' },
  { html: 'leads.html', png: 'leads.png' },
  { html: 'escalations.html', png: 'escalations.png' },
  { html: 'follow-ups.html', png: 'follow-ups.png' },
  { html: 'conversation-detail.html', png: 'conversation-detail.png' },
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 430, height: 920 },
  deviceScaleFactor: 2,
});

for (const { html, png } of screens) {
  const fileUrl = `file:///${path.join(__dirname, html).replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.locator('.phone').screenshot({
    path: path.join(outDir, png),
    type: 'png',
  });
  console.log(`Wrote ${png}`);
}

await browser.close();
