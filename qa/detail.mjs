import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4311";
const OUT = "qa/detail";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(BASE + "/content-status", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// claim ledger table — clip to the first plate
const plates = page.locator("table");
console.log("plates:", await plates.count());
await page.locator("table").nth(0).scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/claim-ledger.png` });
await page.locator("table").nth(1).scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/asset-manifest.png` });

await page.goto(BASE + "/robots/zugbee-x1", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/zugbee-hero.png` });

await page.goto(BASE + "/resources", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/resources.png` });

await page.goto(BASE + "/join", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/join.png` });

await page.goto(BASE + "/collaborate", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/collaborate.png` });

await page.goto(BASE + "/journey", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/journey.png`, fullPage: true });

await page.goto(BASE + "/research/mobility-over-rubble", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/research-theme.png`, fullPage: true });

await browser.close();
console.log("done");
