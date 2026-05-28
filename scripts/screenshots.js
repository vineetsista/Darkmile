// Capture screenshots of running Darkmile dev server.
// Run with: node scripts/screenshots.js
// Requires: npm i -D playwright && npx playwright install chromium
//           dev server running at http://localhost:3002

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const SHOTS_DIR = path.join(__dirname, "..", ".github", "screenshots");
fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function capture(page, name, url, opts = {}) {
  console.log(`→ ${name}: ${url}`);
  await page.goto(`http://localhost:3002${url}`, { waitUntil: "networkidle", timeout: 30_000 });
  // Wait extra for fonts + animations to settle
  await page.waitForTimeout(opts.wait ?? 1500);
  if (opts.scrollTo) await page.evaluate((y) => window.scrollTo(0, y), opts.scrollTo);
  if (opts.scrollTo) await page.waitForTimeout(500);
  const fullPage = opts.fullPage ?? false;
  const target = path.join(SHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: target, fullPage });
  console.log(`  saved ${target}`);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // retina
    colorScheme: "dark",
  });
  const page = await ctx.newPage();

  // Sign in once (demo accepts anything)
  await page.goto("http://localhost:3002/auth/signin", { waitUntil: "networkidle" });

  // Landing first
  await capture(page, "01-landing-hero",  "/", { wait: 2000 });
  await capture(page, "02-landing-roi",   "/", { scrollTo: 3600, wait: 1200 });
  await capture(page, "03-landing-compare","/", { scrollTo: 2800, wait: 1200 });

  // Auth
  await capture(page, "04-signin", "/auth/signin", { wait: 1200 });

  // Dashboard — fill creds and submit
  await page.goto("http://localhost:3002/auth/signin", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "demo@darkmile.io");
  await page.fill('input[type="password"]', "demo1234");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
  await page.waitForTimeout(2500); // let live ticker spin up

  // Dismiss any welcome toast for cleaner shots
  try { await page.locator('.toast button').first().click({ timeout: 500 }); } catch {}

  await capture(page, "05-dashboard-home",        "/dashboard",                 { wait: 2000 });
  await capture(page, "06-dashboard-opportunities","/dashboard/opportunities", { wait: 1500 });
  await capture(page, "07-dashboard-deals",        "/dashboard/deals",         { wait: 1500 });
  await capture(page, "08-dashboard-map",          "/dashboard/map",           { wait: 2000 });
  await capture(page, "09-dashboard-briefing",     "/dashboard/briefing",      { wait: 1500 });
  await capture(page, "10-dashboard-analytics",    "/dashboard/analytics",     { wait: 2000 });

  // Command palette: navigate to dashboard, then press Cmd+K
  await page.goto("http://localhost:3002/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Control+K");
  await page.waitForSelector(".cmdk-panel", { timeout: 5000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS_DIR, "11-command-palette.png") });

  // AI co-pilot
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.keyboard.press("Control+J");
  await page.waitForSelector(".copilot-panel", { timeout: 5000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS_DIR, "12-ai-copilot.png") });

  // Notifications
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.keyboard.press("Control+I");
  await page.waitForSelector(".panel-side", { timeout: 5000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS_DIR, "13-notifications.png") });

  await browser.close();
  console.log("✓ all screenshots saved");
})().catch((e) => { console.error(e); process.exit(1); });
