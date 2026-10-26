import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:4311";
const OUT = "qa/final";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(1500);

// find the section that mentions subsystems
const heading = page.locator("h2", { hasText: /subsystems are documented/i }).first();
if (await heading.count()) {
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/home-machine.png` });
  console.log("captured home-machine");
} else {
  console.log("heading not found");
}

// also grab the hero at 2x
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/home-hero.png` });

// aegis page full at 2x for the record
await page.goto(BASE + "/robots/aegis", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.locator("canvas").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/aegis-explorer.png` });

await browser.close();
console.log("done");
